import { app, Route, ROUTER_404_EVENT, ROUTER_EVENT } from "apprun";

export interface IPrettyRoute extends Route {
	linkClick: (event: MouseEvent) => void;
}

export interface IPrettyRouteDynamicSegments {
	[route: string]: string;
}

export interface IPrettyRouteQueries {
	[field: string]: string;
}

const dynamicRoutes: IPrettyRouteDynamicSegments = {};

function decomposeDynamicRoute(route: string): {staticSegment: string, dynamicSegment: string } {
	let pos = route.search(/[:\?]/);
	if(pos === -1) {
		pos = route.length;
	} else if(route[pos] === ":") {
		// Need to capture the "/"" before the ":". It must exist to be a well formed path element.
		pos = pos - 1;
	}

	return {
		dynamicSegment: route.substring(pos),
		staticSegment: route.substring(0, pos),
	};
}

export function addDynamicRoute(route: string): string {
	const {staticSegment, dynamicSegment} = decomposeDynamicRoute(route);

	// Just in case someone passes in a static route - ignore it.
	if(dynamicSegment) {
		dynamicRoutes[staticSegment] = dynamicSegment;
	}

	return staticSegment;
}

export function removeDynamicRoute(route: string): string | undefined {
	const {staticSegment, dynamicSegment} = decomposeDynamicRoute(route);

	const old = dynamicRoutes[staticSegment];

	if(old) {
		delete dynamicRoutes[staticSegment];
		return staticSegment;
	}

	return undefined;
}

let prettyLinkQuerySeparator = "&";
export function setPrettyLinkQuerySeparator(newSeparator: string): string {
	const old = prettyLinkQuerySeparator;
	prettyLinkQuerySeparator = newSeparator;
	return old;
}

// Handle automatically setting the pretty link onclick handler
// via the $prettylink directive
const prettyClickDirective: string = "$prettylink";
app.on("$", ({key, props}) => {
		if (key === prettyClickDirective) {
			if(typeof props[key] === "boolean") {
				props.onclick = linkClick;
			}
		}
	});

// A router function that handles "pretty links" (i.e. non hash based urls)
// dynamic segements, query strings, and html5 history.
function prettyLinkRouter(url: string, popstate: boolean = false): void {
	// Adjust url in case there is a dynamic portion such as a query or
	// dynamic segment.
	const origUrl = url;

	// Any queries?
	let queries: IPrettyRouteQueries = {};

	const queryPos = url.search(/\?/);
	if(queryPos >= 0) {
		const queryStr = url.substring(queryPos + 1);
		const queryStrings = queryStr.split(prettyLinkQuerySeparator);

		for(const query of queryStrings) {
			const [field, value] = query.split("=");
			queries[field] = value;
		}

		url = url.substring(0, queryPos);
	}

	// Any dynamic segements?
	let dynamic: IPrettyRouteDynamicSegments = {};
	const matchingDynamicRoute = Object.keys(dynamicRoutes).find((route) => {
		return url.startsWith(route + "/");
	});
	if(matchingDynamicRoute) {
		const urlDynamicParams = url.substring(matchingDynamicRoute.length).split("/");
		const dynamicParams = dynamicRoutes[matchingDynamicRoute].split("/");

		console.assert(dynamicParams.length === urlDynamicParams.length, `expected dynamic and actual dynamic length don't match ${dynamicParams.length} vs. ${urlDynamicParams.length}`);

		// First param will always be a "", so ignore it.
		for(let i = 1; i < dynamicParams.length; ++i) {
			// Is this parameter in the dynamic section actually dynamic?
			if(dynamicParams[i][0] === ":") {
				dynamic[dynamicParams[i].substring(1)] = urlDynamicParams[i];
			}
		}

		url = matchingDynamicRoute;
	}

	app.run(url, dynamic, queries) || app.run(ROUTER_404_EVENT, url, dynamic, queries);
	app.run(ROUTER_EVENT, url, dynamic, queries);

	if(!popstate) history.pushState({}, "", origUrl);
}

const prettyLinkRouterPopstateHandler = (_event: PopStateEvent) => {
	// app.route cannot be undefined/null as it is assigned at the end of this module.
	app.route!(location.href.replace(location.origin, ""), true);
};

document.addEventListener("DOMContentLoaded", () => {
	window.onpopstate = prettyLinkRouterPopstateHandler;

	prettyLinkRouter(location.href.replace(location.origin, ""));
});

// linkClick method to be used as an onclick event handler.
const linkClick = (event: MouseEvent) => {
	event.preventDefault();

	const currentTarget: HTMLBaseElement = event.currentTarget as HTMLBaseElement;
	const href: string = currentTarget.href;

	if(!href) console.error("linkClick invoked on target with no href!", event.currentTarget);
	else app.run("route", href.replace(location.origin, ""));
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
app.route = prettyLinkRouter;
