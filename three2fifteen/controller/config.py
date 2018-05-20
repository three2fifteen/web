class ConfigController(object):
    def __init__(self, config):
        self.config = config

    def get(self):
        return {
            'api_host': self.config['API_HOST'],
            'api_login': self.config['API_LOGIN'],
            'api_signup': self.config['API_SIGNUP'],
            'api_get_games': self.config['API_GET_GAMES'],
            'api_get_game': self.config['API_GET_GAME'],
            'api_create_game': self.config['API_CREATE_GAME'],
            'api_join_game': self.config['API_JOIN_GAME'],
            'api_get_board': self.config['API_GET_BOARD'],
            'api_get_game_content': self.config['API_GET_GAME_CONTENT'],
            'api_get_hand': self.config['API_GET_HAND'],
            'api_turn_check': self.config['API_TURN_CHECK'],
            'api_turn': self.config['API_TURN'],
            'api_skip_turn': self.config['API_SKIP_TURN'],
            'api_get_player_names': self.config['API_GET_PLAYER_NAMES']
        }
