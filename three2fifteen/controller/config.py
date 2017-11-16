class ConfigController(object):
    def __init__(self, config):
        self.config = config

    def get(self):
        return {
            'api_host': self.config['API_HOST'],
            'api_login': self.config['API_LOGIN'],
            'api_signup': self.config['API_SIGNUP'],
            'api_get_games': self.config['API_GET_GAMES'],
            'api_create_game': self.config['API_CREATE_GAME']
        }
