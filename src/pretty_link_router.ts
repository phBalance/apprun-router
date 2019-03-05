import app, { ROUTER_EVENT, ROUTER_404_EVENT } from "apprun";

// A router function that handles "pretty links" (i.e. non hash based urls)
// and html5 history.

function prettyLinkRouter(url: string, popstate: boolean = false): void {
	const [_, name, ...rest] = url.split("/");
	app.run("/" + name, ...rest) || app.run(ROUTER_404_EVENT, "/" + name, ...rest);
	app.run(ROUTER_EVENT, "/" + name, ...rest);

	if(!popstate) history.pushState({}, '', url);
}

const prettyLinkRouterPopstateHandler = (_event: Event) => {
	app["route"](location.pathname, true);
};

document.addEventListener("DOMContentLoaded", () => {
	window.onpopstate = prettyLinkRouterPopstateHandler;
	prettyLinkRouter(location.pathname);
});

// Overwrite apprun's default router which only supports hash links.
app["route"] = prettyLinkRouter;