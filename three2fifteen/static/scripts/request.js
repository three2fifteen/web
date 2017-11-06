loader.addModule('request', () => {
	return {
		post: (url, data, doneCallback) => {
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.onreadystatechange = (e) => {
				if (e.target.readyState == 4) {
					doneCallback(e.target.status, e.target.statusText, e.target.response)
				}
			};
			xhr.send(data);
		}
	};
});
