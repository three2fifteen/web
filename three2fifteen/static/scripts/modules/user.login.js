loader.addModule('page',
'auth', 'request', 'config', 'B',
(auth, request, config, B) => {
	function _loginResponseHandler(statusCode, statusReason, body, dest_url) {
		if (statusCode == 200) {
			auth.login(JSON.parse(body).access_token);
			_goToUrl(dest_url);
		}
		else {
			B.$id("form-message").innerHTML = JSON.parse(body).message;
		}
	}

	function _goToUrl(to) {
		window.location.replace(to == '/login' && '/' || to);
	}

	return {
		'needsLoggedIn': () => {
			return false;
		},
		'action': () => {
			let form = B.$id('login-form');
			const to = form.to.value;
			auth.isLoggedIn() && _goToUrl(to);

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
