from flask import Blueprint

bp = Blueprint('api_v1_0_rmon', __name__)

from app.api.v1.routes.rmon import routes
