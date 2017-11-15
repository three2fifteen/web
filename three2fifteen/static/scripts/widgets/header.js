loader.executeModule('headerWidget',
'page', 'B', 'auth', 'utils',
(page, B, auth, utils) => {
	B.$id('logout-button').addEventListener('click', (e) => {
		e.preventDefault();
		auth.unsetToken();
		utils.goToUrl('/login');
	});
});
