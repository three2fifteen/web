class ConfigController(object):
    def __init__(self, config):
        self.config = config

    def get(self):
        return {
            'api_host': self.config['API_HOST'],
            'api_login': self.config['API_LOGIN'],
            'api_signup': self.config['API_SIGNUP']
        }
