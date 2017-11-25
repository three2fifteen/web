loader.executeModule('homeModule',
'config', 'app', 'B',
(config, app, B) => {
	let module = {
		'dataUrls': [
			{'url': config.api_get_games, 'name': 'games'}
		],
		'action': () => {
			B.Template.init({
				game: {html: B.$id('game-instance').innerHTML},
				game_player: {html: B.$id('game-player').innerHTML},
				game_link: {html: B.$id('game-link').innerHTML},
				game_invite_link: {html: B.$id('game-invite-link').innerHTML}
			});
			module.data.games.forEach((game) => {
				game.current_players_count = game.game_players.length;
				game.ongoing = game.date_started && !game.date_finished;
				game.open = game.current_players_count < game.number_players;
				const gameHTML = B.Template.compile('game', {game: game});
				B.$id('list-games').innerHTML += gameHTML;
			});
		}
	};
	app.addModule(module);
});
