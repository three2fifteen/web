loader.addModule('app',
'page', 'auth', 'request', 'utils', 'config',
function (page, auth, request, utils, config) {
	function setPageData(page, dataKey, data) {
		if (!page.data) {
			page.data = {};
		}

		page.data[dataKey] = data;
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

	function getPageData(urls) {
		var funcToRun;

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

					setPageData(page, url.name, response);
					if (urls.length) {
						resolve(urls);
					}
					else {
						page.action();
					}
			});
		})
		.then(getPageData)
		.catch(handleError);
	}

	return {
		run: () => {
			if (page.dataUrls) {
				getModuleData(page.dataUrls);
			}
			else {
				page.action();
			}
		}
	};
});
