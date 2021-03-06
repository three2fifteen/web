import os
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


@bp.route('/rules')
def rules():
    return render_template('rules.phtml')


@bp.route('/config.js')
def config():
    controller = ConfigController()
    return Response(render_template('config.js', data=controller.get()),
                    mimetype='application/javascript')


@bp.route('/game/create')
def game_creation():
    return render_template('game-creation.phtml')


@bp.route('/game/<int:game_id>')
def game_page(game_id):
    return render_template('game-page.phtml',
                           data=[{'key': 'current_game_id', 'value': game_id}])


@bp.route('/game/join/<string:game_public_id>')
def game_join(game_public_id):
    return render_template('game-join.phtml',
                           data=[{'key': 'game_public_id',
                                  'value': game_public_id}])
