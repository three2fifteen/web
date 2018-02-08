import json
import logging
from tornado.websocket import WebSocketHandler


def _join_game(socket, data):
    logger = logging.getLogger(__name__)
    logger.info("Try join game, %s", data)
    try:
        game_id = data['game_id']
    except KeyError:
        return

    try:
        room = WebSocket._game_rooms[data['game_id']]
    except KeyError:
        room = []

    socket.game_id = data['game_id']
    room.append(socket)
    logger.info("Socket joined %s", socket.game_id)
    logger.info("Number clients in room: %s", len(room))
    WebSocket._game_rooms[data['game_id']] = room


def _leave_game(socket):
    WebSocket._game_rooms[socket.game_id].remove(socket)


class WebSocket(WebSocketHandler):
    _game_rooms = {}

    _actions_mapping = {
        "join": _join_game
    }

    def open(self):
        self._logger = logging.getLogger(__name__)
        self._logger.info("Socket opened")

    def on_message(self, message):
        """
        message is a string containing a json dump. The json is expected to
        contain a "type" key telling which type of message is received, and
        potentially other keys, depending on the type
        """
        try:
            data = json.loads(message)
            message_type = data['type']
        except json.JSONDecodeError:
            self._logger.error("Invalid message received: {}".format(message))
            return
        except KeyError:
            self._logger.error(
                "Invalid message format received, type missing: {}".format(
                    message
                )
            )
            return

        try:
            action = self._actions_mapping[message_type]
        except KeyError:
            self._logger.error(
                "Invalid message type: {}".format(message_type)
            )
            return

        action(self, data)

    def on_close(self):
        self._logger.info("Socket closed")
        _leave_game(self)
