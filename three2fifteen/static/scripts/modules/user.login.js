loader.executeModule('loginModule',
'auth', 'request', 'config', 'B', 'utils', 'app',
(auth, request, config, B, utils, app) => {
	app.addModule({
		'action': () => {
			let form = B.$id('login-form');
			const to = form.to.value == '/login' && '/' || form.to.value;
			auth.isLoggedIn() && utils.goToUrl(to);

			form.addEventListener('submit', (e) => {
				B.$id("form-message").innerHTML = "";
				e.preventDefault();
				request.post(
					config.api_host + config.api_login,
					JSON.stringify({
						'username': form.username.value,
						'password': form.password.value
					}),
					{},
					(statusCode, body) => {
						utils.apiResponseHandler(statusCode, body, to, (body) => {
							auth.setToken(body.access_token);
						});
					}
				);
			});
		}
	});
});
