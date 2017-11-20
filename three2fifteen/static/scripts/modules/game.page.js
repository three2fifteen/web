loader.executeModule('gamePageModule',
'config', 'app', 'B',
(config, app, B) => {
	let module = {
		'action': () => {
		}
	};
	app.addModule(module);
});
