import { app, ROUTER_404_EVENT, ROUTER_EVENT } from "apprun";

// A router that handles hash based links. It provides no more functionality than the
// default AppRun router.
function hashLinkRouter(url: string): void {
	const [name, ...rest] = url.split("/");
	app.run(name, ...rest) || app.run(ROUTER_404_EVENT, name, ...rest);
	app.run(ROUTER_EVENT, name, ...rest);
}

const hashLinkRouterPopstateHandler = (_event: Event) => {
	// app.route cannot be undefined/null as it is assigned at the end of this module.
	app.route!(location.hash);
};

document.addEventListener("DOMContentLoaded", () => {
	window.onpopstate = hashLinkRouterPopstateHandler;
	hashLinkRouter(location.hash);
});

// Overwrite AppRun's default router.
app.route = hashLinkRouter;
