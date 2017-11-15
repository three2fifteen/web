loader.addModule('page',
'auth', 'request', 'config', 'B', 'utils',
(auth, request, config, B, utils) => {
	function _loginResponseHandler(statusCode, body, dest_url) {
		if (statusCode == 200) {
			auth.setToken(JSON.parse(body).access_token);
			utils.goToUrl(dest_url);
		}
		else {
			B.$id("form-message").innerHTML = JSON.parse(body).message;
		}
	}

	return {
		'needsLoggedIn': () => {
			return false;
		},
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
					(statusCode, body) => {
						_loginResponseHandler(statusCode, body, to);
					}
				);
			});
		}
	};
});
