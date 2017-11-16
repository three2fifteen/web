loader.addModule('app',
'auth', 'request', 'utils', 'config',
function (auth, request, utils, config) {
	function setPageData(module, dataKey, data) {
		if (!module.data) {
			module.data = {};
		}

		module.data[dataKey] = data;
	}

	function handleError(error) {
		if (error == 401) {
			utils.goToUrl('/login');
		}
		else if (typeof(error) == 'number') {
			utils.goToUrl('/404');
		}
		else {
			console.log(error);
		}
	}

	function getModuleData(module) {
		let urls = module.dataUrls;

		new Promise(function(resolve, reject) {
			if (!auth.isLoggedIn()) {
				reject(401);
			}

			const url = urls.shift();
			request.get(
				config.api_host + url.url,
				{'X-Token': auth.getToken()},
				(response_status, response) => {
					if (response_status != 200) {
						reject(response_status);
						return;
					}

					setPageData(module, url.name, response);
					if (urls.length) {
						resolve(urls);
					}
					else {
						module.action();
					}
			});
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
					getModuleData(module);
				}
				else {
					module.action();
				}
			});
		}
	};
});
