from flask import Flask
from werkzeug.utils import find_modules, import_string
import http.client as http_client

import logging


def register_blueprints(app):
    """Register all blueprint modules

    Reference: Armin Ronacher, "Flask for Fun and for Profit" PyBay 2016.
    """
    for name in find_modules('three2fifteen.blueprints'):
        mod = import_string(name)
        if hasattr(mod, 'bp'):
            app.register_blueprint(mod.bp)
    return None


def register_logger():
    http_client.HTTPConnection.debuglevel = 1
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    requests_log = logging.getLogger("requests.packages.urllib3")
    requests_log.setLevel(logging.DEBUG)
    requests_log.propagate = True


app = Flask('three2fifteen')
application = app  # our hosting requires application in passenger_wsgi

app.config.update({})
app.config.from_envvar('THREE2FIFTEEN_WEB_SETTINGS', silent=True)

logger = logging.getLogger("{} logger".format(app.name))
logger.setLevel(logging.DEBUG)
logging.info("starting server")

register_blueprints(app)
register_logger()


if __name__ == "__main__":
    app.run()
