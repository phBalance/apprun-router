import app, { ROUTER_EVENT, ROUTER_404_EVENT } from "apprun";

// A router that handles hash based links. It provides no more functionality than the
// default AppRun router.
function hashLinkRouter(url: string): void {
    const [name, ...rest] = url.split('/');
    app.run(name, ...rest) || app.run(ROUTER_404_EVENT, name, ...rest);
    app.run(ROUTER_EVENT, name, ...rest);
}

const hashLinkRouterPopstateHandler = (_event: Event) => {
	app["route"](location.hash);
};

document.addEventListener("DOMContentLoaded", () => {
	window.onpopstate = hashLinkRouterPopstateHandler;
	hashLinkRouter(location.hash);
});

// Overwrite AppRun's default router.
app["route"] = hashLinkRouter;
