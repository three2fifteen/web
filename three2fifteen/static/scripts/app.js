loader.addModule('app',
'auth', 'request', 'utils', 'config',
function (auth, request, utils, config) {
	function setPageData(module, dataKey, data) {
		if (!module.data) {
			module.data = {};
		}

		module.data[dataKey] = JSON.parse(data);
	}

	function handleError(error) {
		if (error == 401) {
			utils.goToUrl('/login');
		}
		else if (error == 404) {
			utils.goToUrl('/404');
		}
		else {
			console.log(error);
		}
	}

	function getModuleData(module, urls, action, endpoints = null) {
		new Promise(function(resolve, reject) {
			if (!auth.isLoggedIn()) {
				reject(401);
			}

			const url = urls.shift();
			if (endpoints && !endpoints.has(url.name)) {
				resolve(module, action);
				return;
			}

			request.get(
				config.api_host + url.url,
				auth.getHeader(),
				(response_status, response) => {
					if (response_status != 200) {
						reject(response_status);
						return;
					}

					setPageData(module, url.name, response);
					if (urls.length) {
						resolve(module, urls, action);
					}
					else {
						action();
					}
				}
			);
		})
		.then(getModuleData)
		.catch(handleError);
	}

	let modules = [];

	return {
		addModule: (module) => {
			modules.push(module);
		},
		run: () => {
			modules.forEach((module) => {
				if (module.dataUrls) {
					getModuleData(module, module.dataUrls.slice(), module.action);
				}
				else {
					module.action();
				}
			});
		}
	};
});
