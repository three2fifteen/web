loader.addModule("Game", () => {
	return {
		analyseGame: (game) => {
			game.current_players_count = game.game_players.length;
			game.ongoing = game.date_started && !game.date_finished;
			game.open = game.current_players_count < game.number_players;
		}
	};
});
