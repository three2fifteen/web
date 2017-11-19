from flask import Blueprint, request, render_template, Response, current_app
from three2fifteen.controller.config import ConfigController


bp = Blueprint('three2fifteen', __name__)


@bp.route('/')
def index():
    return render_template('index.phtml')


@bp.route('/login')
def login():
    to = request.args.get('to')
    to = to if to is not None else '/'
    return render_template('login.phtml', to=to)


@bp.route('/sign-up')
def signup():
    return render_template('signup.phtml')


@bp.route('/config.js')
def config():
    controller = ConfigController(current_app.config)
    return Response(render_template('config.js', data=controller.get()),
                    mimetype='application/javascript')


@bp.route('/game/create')
def game_creation():
    return render_template('game-creation.phtml')
