loader.executeModule('homeModule',
'config', 'app', 'B', 'Game',
(config, app, B, Game) => {
	let module = {
		'dataUrls': [
			{'url': config.api_get_games, 'name': 'games'}
		],
		'action': () => {
			B.Template.init({
				game: {html: B.$id('game-instance').innerHTML},
				game_link: {html: B.$id('game-link').innerHTML},
				game_invite_link: {html: B.$id('game-invite-link').innerHTML},
				game_creator: {html: B.$id('template-game-creator').innerHTML},
				game_finished: {html: B.$id('game-finished').innerHTML},
				player_score: {html: B.$id('template-player-score').innerHTML},
				player_turn: {html: B.$id('template-player-turn').innerHTML}
			});
			Game.setPlayerNames(module.data.games).then((players) => {
				const _processGame = (game) => {
					Game.analyseGame(game);
					game.host = window.location.protocol + '//' + window.location.host;
					const gameHTML = B.Template.compile(
						'game',
						{game: game}
					);
					B.$id(game.category + '-games').innerHTML += gameHTML;
				};
				module.data.games.forEach((game) => {
					_processGame(game);
				});
			});
			B.$id("pending-games").addEventListener('click', (e) => {
				if (B.hasClass(e.target, 'copy-link-btn')) {
					e.preventDefault();
					let field = B.$id(e.target.getAttribute('rel'));
					B.removeClass(field, "hidden");
					field.select();
					document.execCommand("Copy");
				}
			});
		}
	};
	app.addModule(module);
});
