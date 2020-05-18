import os


class ConfigController(object):
    def get(self):
        return {
            'api_host': os.environ['API_HOST'],
            'api_login': os.environ['API_LOGIN'],
            'api_signup': os.environ['API_SIGNUP'],
            'api_get_games': os.environ['API_GET_GAMES'],
            'api_get_game': os.environ['API_GET_GAME'],
            'api_create_game': os.environ['API_CREATE_GAME'],
            'api_join_game': os.environ['API_JOIN_GAME'],
            'api_get_board': os.environ['API_GET_BOARD'],
            'api_get_game_content': os.environ['API_GET_GAME_CONTENT'],
            'api_get_hand': os.environ['API_GET_HAND'],
            'api_turn_check': os.environ['API_TURN_CHECK'],
            'api_turn': os.environ['API_TURN'],
            'api_get_player_names': os.environ['API_GET_PLAYER_NAMES']
        }
