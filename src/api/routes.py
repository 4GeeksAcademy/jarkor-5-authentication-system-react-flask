from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_cors import CORS  # Importa el módulo Flask-CORS

api = Blueprint('api', __name__)
CORS(api)  # Habilita CORS para el Blueprint 'api'

# pipenv install flask-jwt-extended

# Resto del código...

# Thanks to the @jwt_required() decorator, only people with token can access
@api.route("/hello", methods=["GET"])
@jwt_required()
def get_hello():
    email = get_jwt_identity()
    dictionary = {
        "message": " " + email
    }
    return jsonify(dictionary)


# GET ALL USERS:
@api.route('/user', methods=['GET'])
def get_users():
    users = User.query.all()

    if not users:
        return jsonify(message="No users found"), 404

    all_users = list(map(lambda x: x.serialize(), users))
    return jsonify(message="Users", users=all_users), 200


