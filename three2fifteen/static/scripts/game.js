loader.addModule("Game", () => {
	let _tokenToPlay = null;
	return {
		analyseGame: (game) => {
			game.current_players_count = game.game_players.length;
			game.ongoing = game.date_started && !game.date_finished;
			game.open = !game.date_finished && game.current_players_count < game.number_players;
		},
		prepareToken: (val) => {
			_tokenToPlay = val;
		}
	};
});
