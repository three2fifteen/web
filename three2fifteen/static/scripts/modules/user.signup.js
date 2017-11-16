loader.executeModule('signupModule',
'auth', 'request', 'config', 'B', 'utils', 'app',
(auth, request, config, B, utils, app) => {
	function _signupResponseHandler(statusCode, body) {
		if (statusCode == 200) {
			utils.goToUrl('/login');
		}
		else {
			B.$id("form-message").innerHTML = JSON.parse(body).message;
		}
	}

	app.addModule({
		'action': () => {
			let form = B.$id('signup-form');
			auth.isLoggedIn() && utils.goToUrl('/');

			form.addEventListener('submit', (e) => {
				B.$id("form-message").innerHTML = "";
				e.preventDefault();
				request.post(
					config.api_host + config.api_signup,
					JSON.stringify({
						'username': form.username.value,
						'password': form.password.value
					}),
					{},
					(statusCode, body) => {
						_signupResponseHandler(statusCode, body);
					}
				);
			});
		}
	});
});
