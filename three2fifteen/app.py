import three2fifteen.factory


def start_app():
    three2fifteen.factory.create_app().run(port=5003)


def main():
    start_app()


if __name__ == '__main__':
    start_app()
