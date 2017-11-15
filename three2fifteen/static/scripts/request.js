loader.addModule('request', () => {
	function _request(method, url, data, doneCallback) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = (e) => {
			if (e.target.readyState == 4) {
				doneCallback(e.target.status, e.target.response)
			}
		};
		xhr.send(data);
	}

	return {
		post: (url, data, doneCallback) => {
			_request("POST", url, data, doneCallback);
		}
	};
});
