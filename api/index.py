import os
import sys
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS

# Adicionar o diretório raiz ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from user import user_bp
from financial_routes import financial_bp
from seed_data import seed_bp
from supabase_config import get_supabase_admin

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(financial_bp, url_prefix='/api')
app.register_blueprint(seed_bp, url_prefix='/api')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Para o Vercel, exportamos a app
def handler(request):
    return app(request.environ, lambda status, headers: None)

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)