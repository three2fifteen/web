loader.addModule('page', () => {
	return {
		'needsLoggedIn': () => {
			return false;
		},
		'action': () => {
			console.log("login");
		}
	};
});
