loader.addModule('auth',
() => {
	return {
		'isLoggedIn': () => {
			return false;
		}
	};
});
