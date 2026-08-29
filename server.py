#!/usr/bin/env python3
"""Serveur de démonstration pour cavalière futée.

Sert les fichiers statiques du site et expose deux routes API :
  - POST /api/compare : appelle l'API Anthropic (Claude) pour générer une
    recommandation d'équipement personnalisée à partir du profil du cheval.
  - POST /api/contact : enregistre les messages du formulaire de contact
    dans un fichier local (pas d'envoi d'email réel dans cette démo).

Aucune dépendance externe : uniquement la bibliothèque standard Python.
Lance-le avec : python3 server.py
"""

import json
import os
import re
import urllib.error
import urllib.request
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, '.env')
CONTACT_LOG = os.path.join(BASE_DIR, 'contact_messages.log')

ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages'
ANTHROPIC_VERSION = '2023-06-01'
DEFAULT_MODEL = 'claude-sonnet-5'

CATEGORY_LABELS = {
    'selle': 'une selle',
    'filet-mors': 'un filet ou un mors',
    'casque': "un casque d'équitation",
    'pantalon': "un pantalon d'équitation",
    'guetres': 'des guêtres',
    'airbag': "un gilet airbag",
    'masque': 'un masque anti-mouches',
    'complements': 'un complément alimentaire',
}


def humanize_value(value):
    text = str(value).replace('-', ' ')
    text = text.replace('<', 'moins de ')
    text = text.replace('+', ' ou plus')
    return text.strip()


def load_env_file(path):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, _, value = line.partition('=')
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def extract_json(text):
    """Extrait un objet JSON depuis la réponse texte du modèle (gère les blocs ```json)."""
    fenced = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if fenced:
        text = fenced.group(1)
    else:
        start, end = text.find('{'), text.rfind('}')
        if start != -1 and end != -1 and end > start:
            text = text[start:end + 1]
    return json.loads(text)


def build_prompt(request_data):
    category = request_data.get('category') or ''
    category_label = CATEGORY_LABELS.get(category, category or "un équipement d'équitation")
    answers = request_data.get('answers') or {}
    precisions = (request_data.get('precisions') or '').strip()[:500]

    lines = [f"Recherche : {category_label}"]
    for key, value in answers.items():
        if not value:
            continue
        lines.append(f"- {key} : {humanize_value(value)}")
    if precisions:
        lines.append(f"- Précisions de la cavalière : {precisions}")

    prompt = "\n".join(lines)
    prompt += (
        f"\n\nPropose une recommandation de {category_label} adaptée à ce profil "
        "(et si pertinent un ou deux accessoires complémentaires). "
        "Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, "
        "au format exact suivant :\n"
        '{"summary": "un court paragraphe expliquant le raisonnement, ton chaleureux et expert",'
        ' "recommendations": [{"name": "nom du type de produit recommandé", '
        '"price_range": "fourchette de prix cohérente avec le budget", '
        '"why": "pourquoi ce choix convient à ce profil"}]}\n'
        "Limite-toi à 2 ou 3 recommandations maximum."
    )
    return prompt


def call_anthropic(request_data):
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        return {'ok': False, 'reason': 'missing_api_key'}

    model = os.environ.get('ANTHROPIC_MODEL', DEFAULT_MODEL)
    body = json.dumps({
        'model': model,
        'max_tokens': 1024,
        'system': (
            "Tu es l'experte équestre du site cavalière futée. Tu conseilles du matériel "
            "d'équitation avec honnêteté, en priorisant toujours le bien-être du cheval. "
            "Tu réponds strictement en JSON, sans aucun texte hors du JSON."
        ),
        'messages': [{'role': 'user', 'content': build_prompt(request_data)}],
    }).encode('utf-8')

    req = urllib.request.Request(
        ANTHROPIC_MESSAGES_URL,
        data=body,
        method='POST',
        headers={
            'x-api-key': api_key,
            'anthropic-version': ANTHROPIC_VERSION,
            'content-type': 'application/json',
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        detail = e.read().decode('utf-8', errors='ignore')
        print(f'[Anthropic API] HTTPError {e.code}: {detail[:300]}')
        return {'ok': False, 'reason': 'api_http_error'}
    except urllib.error.URLError as e:
        print(f'[Anthropic API] URLError: {e}')
        return {'ok': False, 'reason': 'api_unreachable'}

    try:
        text = payload['content'][0]['text']
        parsed = extract_json(text)
        recommendations = parsed.get('recommendations', [])[:3]
        clean_recs = []
        for r in recommendations:
            if not isinstance(r, dict) or not r.get('name'):
                continue
            clean_recs.append({
                'name': str(r.get('name', ''))[:200],
                'price_range': str(r.get('price_range', ''))[:60],
                'why': str(r.get('why', ''))[:500],
            })
        return {'ok': True, 'summary': str(parsed.get('summary', ''))[:800], 'recommendations': clean_recs}
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        print(f'[Anthropic API] Réponse inattendue: {e}')
        return {'ok': False, 'reason': 'bad_model_response'}


def save_contact_message(data):
    entry = {
        'nom': str(data.get('nom', ''))[:200],
        'email': str(data.get('email', ''))[:200],
        'sujet': str(data.get('sujet', ''))[:100],
        'message': str(data.get('message', ''))[:5000],
    }
    with open(CONTACT_LOG, 'a', encoding='utf-8') as f:
        f.write(json.dumps(entry, ensure_ascii=False) + '\n')


class CFHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

    def _send_json(self, status, obj):
        payload = json.dumps(obj).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _read_json_body(self):
        length = int(self.headers.get('Content-Length', 0))
        raw = self.rfile.read(length) if length else b'{}'
        return json.loads(raw.decode('utf-8') or '{}')

    def do_POST(self):
        if self.path == '/api/compare':
            try:
                request_data = self._read_json_body()
            except json.JSONDecodeError:
                self._send_json(400, {'ok': False, 'reason': 'invalid_json'})
                return
            result = call_anthropic(request_data)
            self._send_json(200, result)
        elif self.path == '/api/contact':
            try:
                data = self._read_json_body()
            except json.JSONDecodeError:
                self._send_json(400, {'ok': False, 'reason': 'invalid_json'})
                return
            if not data.get('nom') or not data.get('email') or not data.get('message'):
                self._send_json(400, {'ok': False, 'reason': 'missing_fields'})
                return
            save_contact_message(data)
            self._send_json(200, {'ok': True})
        else:
            self._send_json(404, {'ok': False, 'reason': 'not_found'})

    def log_message(self, fmt, *args):
        print('[server]', fmt % args)


def main():
    load_env_file(ENV_PATH)
    port = int(os.environ.get('PORT', 8000))
    handler = partial(CFHandler, directory=BASE_DIR)
    httpd = ThreadingHTTPServer(('0.0.0.0', port), handler)

    key_status = 'détectée ✅' if os.environ.get('ANTHROPIC_API_KEY') else 'absente ⚠️  (le comparateur utilisera le repli local)'
    print(f'cavalière futée — serveur lancé sur http://localhost:{port}')
    print(f'Clé ANTHROPIC_API_KEY : {key_status}')
    httpd.serve_forever()


if __name__ == '__main__':
    main()
