loader.addModule('utils', () => {
	return {
		goToUrl: (to) => {
			window.location.replace(to);
		}
	};
});
