loader.executeModule('main', 'page', 'auth', function (page, auth) {
	if (page.needsLoggedIn() && !auth.isLoggedIn()) {
		window.location.replace('/login');
		return;
	}

	page.action();
});
