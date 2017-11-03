from flask import Blueprint, render_template


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
