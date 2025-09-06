from flask import Blueprint, request, jsonify
from src.models.supabase_models import Auth

user_bp = Blueprint("user", __name__)

@user_bp.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400
    
    try:
        auth = Auth()
        user = auth.sign_up(email, password)
        return jsonify(user.model_dump()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@user_bp.route("/auth/signin", methods=["POST"])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400
    
    try:
        auth = Auth()
        user = auth.sign_in(email, password)
        return jsonify(user.model_dump()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@user_bp.route("/auth/signout", methods=["POST"])
def signout():
    try:
        auth = Auth()
        auth.sign_out()
        return jsonify({"message": "Logout realizado com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@user_bp.route("/auth/user", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Token de autenticação ausente"}), 401
    
    token = auth_header.split(" ")[1]
    try:
        auth = Auth()
        user = auth.get_user(token)
        return jsonify(user.model_dump()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

