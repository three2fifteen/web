from flask import Blueprint, render_template


bp = Blueprint('three2fifteen', __name__)


@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def web(path):
    print(path)
    return render_template('index.phtml')
