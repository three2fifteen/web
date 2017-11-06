loader.addModule('page', 'request', 'config', 'B', (request, config, B) => {
	function _loginResponseHandler(statusCode, statusReason, body) {
		if (statusCode != 200) {
			B.$id("form-message").innerHTML = JSON.parse(body).message;
		}
	}

	return {
		'needsLoggedIn': () => {
			return false;
		},
		'action': () => {
			let form = B.$id('login-form');
			form.addEventListener('submit', (e) => {
				B.$id("form-message").innerHTML = "";
				e.preventDefault();
				request.post(
					config.api_host + config.api_login,
					JSON.stringify({
						'username': form.username.value,
						'password': form.password.value
					}),
					_loginResponseHandler
				);
			});
		}
	};
});
