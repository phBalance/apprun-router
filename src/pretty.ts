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

const linkClick = (event: Event) => {
	event.preventDefault();
	app.run("route", event.currentTarget["href"].replace(location.origin,""));
};
prettyLinkRouter.linkClick = linkClick;

// selectors is a standard DOMString so you can select multiple selectors separated by
// commas to come up with any scheme to list all your links.
export function addPrettyLinkHandlers(selectors: string) {
	document.querySelectorAll(selectors)
		.forEach((link: HTMLElement) => {
			link.onclick = linkClick;
		});
}

// Overwrite AppRun's default router which only supports hash links.
app["route"] = prettyLinkRouter;