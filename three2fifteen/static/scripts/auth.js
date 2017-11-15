loader.addModule('auth',
() => {
	const TOKEN_KEY = 'JWT';
	return {
		'setToken': (token) => {
			window.localStorage.setItem(TOKEN_KEY, token);
		},
		'isLoggedIn': () => {
			return window.localStorage.getItem(TOKEN_KEY) != null;
		}
	};
});
