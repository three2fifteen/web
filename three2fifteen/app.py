from flask import Flask, render_template
from tornado.wsgi import WSGIContainer
from tornado.web import Application, FallbackHandler
from tornado.ioloop import IOLoop

import three2fifteen.factory
from three2fifteen import socket


def main():
    app = three2fifteen.factory.create_app()
    container = WSGIContainer(app)
    server = Application(
        [
            (r'/websocket/', socket.WebSocket),
            (r'.*', FallbackHandler, dict(fallback=container))
        ],
        autoreload=True
    )
    server.listen(5003)
    IOLoop.instance().start()

if __name__ == "__main__":
    main()
