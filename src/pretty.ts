import { app, ROUTER_EVENT, ROUTER_404_EVENT } from "apprun";

// A router function that handles "pretty links" (i.e. non hash based urls)
// and html5 history.
function prettyLinkRouter(url: string, popstate: boolean = false): void {
	const [_, name, ...rest] = url.split("/");

	app.run("/" + name, ...rest) || app.run(ROUTER_404_EVENT, "/" + name, ...rest);
	app.run(ROUTER_EVENT, "/" + name, ...rest);

	if(!popstate) history.pushState({}, '', url);
}

const prettyLinkRouterPopstateHandler = (_event: PopStateEvent) => {
	(app as any).route(location.pathname, true);
};

document.addEventListener("DOMContentLoaded", () => {
	window.onpopstate = prettyLinkRouterPopstateHandler;

	prettyLinkRouter(location.pathname);
});

// linkClick method to be used as an onclick event handler. 
const linkClick = (event: MouseEvent) => {
	event.preventDefault();

	const currentTarget: HTMLBaseElement = event.currentTarget as HTMLBaseElement;
	const href: string = currentTarget.href;

	if(!href) console.error("linkClick invoked on target with no href!", event.currentTarget);
	else app.run("route", href.replace(location.origin,""));
};
prettyLinkRouter.linkClick = linkClick;

// selectors is a standard DOMString so you can select multiple selectors separated by
// commas to come up with any scheme to identify all your links.
export function addPrettyLinkHandlers(selectors: string): void {
	document.querySelectorAll(selectors)
		.forEach((link: Element) => {
			(link as HTMLElement).onclick = linkClick;
		});
}

// Overwrite AppRun's default router which only supports hash links.
(app as any).route = prettyLinkRouter;