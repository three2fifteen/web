from flask import Blueprint, render_template, Response, current_app
from three2fifteen.controller.config import ConfigController


bp = Blueprint('three2fifteen', __name__)


@bp.route('/')
def index():
    return render_template('index.phtml')


@bp.route('/login')
def login():
    return render_template('login.phtml')


@bp.route('/signup')
def signup():
    return render_template('signup.phtml')


@bp.route('/config.js')
def config():
    controller = ConfigController(current_app.config)
    return Response(render_template('config.js', data=controller.get()),
                    mimetype='application/javascript')
