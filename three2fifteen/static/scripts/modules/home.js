loader.addModule('page', () => {
	return {
		'needsLoggedIn': () => {
			return true;
		},
		'action': () => {
			console.log("home");
		}
	};
});
