// Be cheeky and allow a few gross exceptions to linting
// tslint:disable max-classes-per-file max-line-length

import app, { Component, ROUTER_404_EVENT, ROUTER_EVENT } from "apprun";

import { addDynamicRoute, addPrettyLinkHandlers, IPrettyRoute,
	IPrettyRouteDynamicSegments, IPrettyRouteQueries,
	removeDynamicRoute, setPrettyLinkQuerySeparator } from "../src/pretty";

// Work around JSX definitions not being available in AppRun.
declare global {
	namespace JSX {
		// tslint:disable-next-line: interface-name
		interface IntrinsicElements { a: any; div: any; }
	}
}

const pretty: IPrettyRoute = (app.route as IPrettyRoute);

const urlStatic = "/basic";

const urlStaticWithQuery = "/foo";
const urlStaticWithQueryStatic = "/foo";
const urlStaticWithQueryExample = "/foo?bar=7";
const urlStaticWithQueryExampleDynamicArgs: IPrettyRouteDynamicSegments = {};
const urlStaticWithQueryExampleQueryArgs: IPrettyRouteQueries = {bar: "7"};

const urlStaticWithSlashWithQuery = "/foo/";
const urlStaticWithSlashWithQueryStatic = "/foo/";
const urlStaticWithSlashWithQueryExample = "/foo/?bar=9";
const urlStaticWithSlashWithQueryExampleDynamicArgs: IPrettyRouteDynamicSegments = {};
const urlStaticWithSlashWithQueryExampleQueryArgs: IPrettyRouteQueries = {bar: "9"};

const urlStaticWithMultipleQuery = "/foo";
const urlStaticWithMultipleQueryStatic = "/foo";
const urlStaticWithMultipleQueryExample = "/foo?name=fred&age=88";
const urlStaticWithMultipleQueryExampleDynamicArgs: IPrettyRouteDynamicSegments = {};
const urlStaticWithMultipleQueryExampleQueryArgs: IPrettyRouteQueries = {name: "fred", age: "88"};

const urlStaticWithMultipleQueryUnusualSeparation = "/foo";
const urlStaticWithMultipleQueryUnusualSeparationStatic = "/foo";
const urlStaticWithMultipleQueryUnusualSeparationExample = "/foo?name=bob;age=99";
const urlStaticWithMultipleQueryUnusualSeparationExampleDynamicArgs: IPrettyRouteDynamicSegments = {};
const urlStaticWithMultipleQueryUnusualSeparationExampleQueryArgs: IPrettyRouteQueries = {name: "bob", age: "99"};

const urlOneDynamicSegments = "/foo/:bar";
const urlOneDynamicSegmentsStatic = "/foo";
const urlOneDynamicSegmentsExample = "/foo/fred";
const urlOneDynamicSegmentsExampleDynamicArgs: IPrettyRouteDynamicSegments = {bar: "fred"};
const urlOneDynamicSegmentsExampleQueryArgs: IPrettyRouteQueries = {};

const urlStaticSimilarToOneDynamicSegments = "/foobar";
const urlStaticSimilarToOneDynamicSegmentsStatic = "/foobar";
const urlStaticSimilarToOneDynamicSegmentsExample = "/foobar";
const urlStaticSimilarToOneDynamicSegmentsExampleDynamicArgs: IPrettyRouteDynamicSegments = {};
const urlStaticSimilarToOneDynamicSegmentsExampleQueryArgs: IPrettyRouteQueries = {};

const urlTwoDynamicSegments = "/foo/:bar/:baz";
const urlTwoDynamicSegmentsStatic = "/foo";
const urlTwoDynamicSegmentsExample = "/foo/fred/barney";
const urlTwoDynamicSegmentsExampleDynamicArgs: IPrettyRouteDynamicSegments = {bar: "fred", baz: "barney"};
const urlTwoDynamicSegmentsExampleQueryArgs: IPrettyRouteQueries = {};

const urlTwoDynamicSegmentsAndQuery = "/foo/:bar/:baz";
const urlTwoDynamicSegmentsAndQueryStatic = "/foo";
const urlTwoDynamicSegmentsAndQueryStaticExample = "/foo/seg1/seg2?boo=8";
const urlTwoDynamicSegmentsAndQueryStaticExampleDynamicArgs: IPrettyRouteDynamicSegments = {bar: "seg1", baz: "seg2"};
const urlTwoDynamicSegmentsAndQueryStaticExampleQueryArgs: IPrettyRouteQueries = {boo: "8"};

const urlTwoDynamicSegmentsWithStaticAndQuery = "/foo/:bar/foo2/:baz";
const urlTwoDynamicSegmentsWithStaticAndQueryStatic = "/foo";
const urlTwoDynamicSegmentsWithStaticAndQueryStaticExample = "/foo/crazy/foo2/food?planet=earth&kingdom=bacteria";
const urlTwoDynamicSegmentsWithStaticAndQueryStaticExampleDynamicArgs: IPrettyRouteDynamicSegments = {bar: "crazy", baz: "food"};
const urlTwoDynamicSegmentsWithStaticAndQueryStaticExampleQueryArgs: IPrettyRouteQueries = {planet: "earth", kingdom: "bacteria"};

describe("pretty router", () => {
	it("should overwrite the default router simply by importing", () => {
		expect(app).toBeTruthy();
		expect(pretty).toBeTruthy();
		expect(typeof pretty.linkClick === "function").toBe(true);
	});
});

describe("pretty router - static routing", () => {
	it("should support a basic static pretty route", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");
		app.on(urlStatic, routerRouteFn);

		app.run("route", urlStatic);

		expect(routerEventFn).toHaveBeenCalled();
		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalled();

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlStatic, routerRouteFn);
	});

	it("should support an unregistered static pretty route with a query", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");
		app.on(urlStaticWithQueryStatic, routerRouteFn);

		app.run("route", urlStaticWithQueryExample);

		expect(routerEventFn).toHaveBeenCalled();
		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalled();

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlStaticWithQueryStatic, routerRouteFn);
	});

	it("should support an unregistered static pretty route with a query and provide the queries", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");
		app.on(urlStaticWithQueryStatic, routerRouteFn);

		app.run("route", urlStaticWithQueryExample);

		expect(routerEventFn).toHaveBeenCalled();
		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalledWith(urlStaticWithQueryExampleDynamicArgs, urlStaticWithQueryExampleQueryArgs);

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlStaticWithQueryStatic, routerRouteFn);
	});

	it("should support an unregistered static pretty route with multiple queries", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");
		app.on(urlStaticWithMultipleQuery, routerRouteFn);

		app.run("route", urlStaticWithMultipleQueryExample);

		expect(routerEventFn).toHaveBeenCalled();
		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalledWith(urlStaticWithMultipleQueryExampleDynamicArgs, urlStaticWithMultipleQueryExampleQueryArgs);

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlStaticWithMultipleQuery, routerRouteFn);
	});

	it("should support an unregistered static pretty route with multiple queries and non ampersand separator", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");
		app.on(urlStaticWithMultipleQueryUnusualSeparation, routerRouteFn);

		setPrettyLinkQuerySeparator(";");

		app.run("route", urlStaticWithMultipleQueryUnusualSeparationExample);

		setPrettyLinkQuerySeparator("&");

		expect(routerEventFn).toHaveBeenCalled();
		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalledWith(urlStaticWithMultipleQueryUnusualSeparationExampleDynamicArgs, urlStaticWithMultipleQueryUnusualSeparationExampleQueryArgs);

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlStaticWithMultipleQueryUnusualSeparation, routerRouteFn);
	});
});

describe("query field separator", () => {
	it("should allow setting the query field separator", () => {
		const old = setPrettyLinkQuerySeparator("x");
		expect(old).toEqual("&");

		const old2 = setPrettyLinkQuerySeparator("&");
		expect(old2).toEqual("x");
	});
});

describe("pretty router - directive", () => {
	it("should be registered", () => {
		// create link with the $prettylink and then examine to make sure an .onclick is set.
		class TestComponent extends Component {
			public view = () => {
				return <div>
					<a id="test-pretty-link" href="/bob" $prettylink>blah</a>
				</div>;
			}
		}

		const component = new TestComponent();
		const div = document.createElement("div");
		const test = component.start(div);

		const link = div.querySelector("a#test-pretty-link");
		expect(link).toBeTruthy();
		expect(typeof (link as HTMLElement).onclick === "function").toEqual(true);

		test.unmount();
	});

	it("should be not work the property has a value", () => {
		// create link with the $prettylink="somevalue" and then examine to make sure an .onclick is not set.
		class TestComponent extends Component {
			public view = () => {
				return <div>
					<a id="test-pretty-link" $prettylink="fred">blah</a>
				</div>;
			}
		}

		const component = new TestComponent();
		const div = document.createElement("div");
		const test = component.start(div);

		const link = div.querySelector("a#test-pretty-link");
		expect(link).toBeTruthy();
		expect((link as HTMLElement).onclick).toBeFalsy();

		test.unmount();
	});
});

describe("pretty router - link clicking", () => {
	it("should invoke app.run for static URL when clicked", (done) => {
		const URL_FOO = "/test-url-static";

		class TestComponent extends Component {
			public update = {
				[URL_FOO]: (_: any, dynamicSegments: IPrettyRouteDynamicSegments, queries: IPrettyRouteQueries) => {
					expect(dynamicSegments).toEqual({});
					expect(queries).toEqual({});

					test.unmount();
					div.remove();

					done();
				},
			};

			public view = () => {
				return <div>
					<a id="test-pretty-link-async1" href={URL_FOO} $prettylink>blah</a>
				</div>;
			}
		}

		const component = new TestComponent();
		const div = document.createElement("div");
		const test = component.start(div);

		const link = div.querySelector("a#test-pretty-link-async1");
		expect(link).toBeTruthy();
		expect((link as HTMLElement).onclick).toBeTruthy();

		(link as HTMLElement).click();
	});

	it("should pass dynamic and query URL elements when clicked", (done) => {
		const URL_FOO = "/test-url/:a/foobar/:b/foobaz/:c";
		const URL_EXAMPLE = "/test-url/dynamic1/foobar/dynamic2/foobaz/dynamic3?field1=value1&field2=value2&field3=value3";
		const URL_DYNAMICS = {a: "dynamic1", b: "dynamic2", c: "dynamic3"};
		const URL_QUERIES = {field1: "value1", field2: "value2", field3: "value3"};

		class TestComponent extends Component {
			public update = {
				[addDynamicRoute(URL_FOO)]: (_: any, dynamicSegments: IPrettyRouteDynamicSegments, queries: IPrettyRouteQueries) => {
					expect(dynamicSegments).toEqual(URL_DYNAMICS);
					expect(queries).toEqual(URL_QUERIES);

					removeDynamicRoute(URL_FOO);

					test.unmount();
					div.remove();

					done();
				},
			};

			public view = () => {
				return <div>
					<a id="test-pretty-link-async2" href={URL_EXAMPLE} $prettylink>blah</a>
				</div>;
			}
		}

		const component = new TestComponent();
		const div = document.createElement("div");
		const test = component.start(div);

		const link = div.querySelector("a#test-pretty-link-async2");
		expect(link).toBeTruthy();
		expect((link as HTMLElement).onclick).toBeTruthy();

		(link as HTMLElement).click();
	});

	it("should pass dynamic and query URL elements to ROUTER_404_EVENT", () => {
		const url404 = urlTwoDynamicSegmentsWithStaticAndQueryStaticExample.substring(0, urlTwoDynamicSegmentsWithStaticAndQueryStaticExample.indexOf("?"));

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		app.run("route", urlTwoDynamicSegmentsWithStaticAndQueryStaticExample);

		expect(router404EventFn).toHaveBeenCalledWith(url404, {}, urlTwoDynamicSegmentsWithStaticAndQueryStaticExampleQueryArgs);

		app.off(ROUTER_404_EVENT, router404EventFn);
	});
});

describe("pretty router - dynamic segments", () => {
	it("should return a string", () => {
		expect(typeof addDynamicRoute(urlStaticWithQuery) === "string").toBe(true);
	});

	it("should handle adding a static route", () => {
		const staticRoute = addDynamicRoute(urlStaticWithQuery);
		expect(staticRoute).toBe(urlStaticWithQueryStatic);

		removeDynamicRoute(urlStaticWithQuery);
	});

	it("should remove the query part of the URL from the fixed portion of the route", () => {
		const route = addDynamicRoute(urlStaticWithQuery);
		const routeSlash = addDynamicRoute(urlStaticWithSlashWithQuery);

		expect(route).toEqual(urlStaticWithQueryStatic);
		expect(routeSlash).toEqual(urlStaticWithSlashWithQueryStatic);

		removeDynamicRoute(urlStaticWithQuery);
		removeDynamicRoute(urlStaticWithSlashWithQuery);
	});

	it("should remove a registered dynamic segment", () => {
		const routeAdd = addDynamicRoute(urlOneDynamicSegments);
		const routeRemove = removeDynamicRoute(urlOneDynamicSegments);

		expect(routeAdd).toEqual(urlOneDynamicSegmentsStatic);
		expect(routeRemove).toEqual(urlOneDynamicSegmentsStatic);

		// Confirm it has been removed
		const routeRemoveAgain = removeDynamicRoute(urlOneDynamicSegments);
		expect(routeRemoveAgain).toBeUndefined();
	});

	it("should properly fail to remove an unregistered dynamic segment", () => {
		const route = removeDynamicRoute(urlOneDynamicSegments);

		expect(route).toBeUndefined();
	});

	it("should remove multiple dynamic segments", () => {
		const routeAdd = addDynamicRoute(urlTwoDynamicSegments);
		const routeRemove = removeDynamicRoute(urlOneDynamicSegments);

		expect(routeAdd).toEqual(urlTwoDynamicSegmentsStatic);
		expect(routeRemove).toEqual(urlTwoDynamicSegmentsStatic);

		// Confirm it has been removed
		const routeRemoveAgain = removeDynamicRoute(urlTwoDynamicSegmentsStatic);
		expect(routeRemoveAgain).toBeUndefined();
	});

	it("should not support an unregistered dynamic pretty route", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");
		app.on(urlTwoDynamicSegments, routerRouteFn);

		app.run("route", urlTwoDynamicSegmentsExample);

		expect(routerEventFn).toHaveBeenCalled();
		expect(router404EventFn).toHaveBeenCalledWith(urlTwoDynamicSegmentsExample, {}, {});
		expect(routerRouteFn).not.toHaveBeenCalled();

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlTwoDynamicSegments, routerRouteFn);
	});

	it("should support a dynamic pretty route with segments", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");

		app.on(addDynamicRoute(urlTwoDynamicSegments), routerRouteFn);

		app.run("route", urlTwoDynamicSegmentsExample);

		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalledWith(urlTwoDynamicSegmentsExampleDynamicArgs, urlTwoDynamicSegmentsExampleQueryArgs);
		expect(routerEventFn).toHaveBeenCalledWith(urlTwoDynamicSegmentsStatic, urlTwoDynamicSegmentsExampleDynamicArgs, urlTwoDynamicSegmentsExampleQueryArgs);

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlTwoDynamicSegmentsStatic, routerRouteFn);

		removeDynamicRoute(urlTwoDynamicSegments);
	});

	it("should support a static pretty route similar to a dynamic with segments", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteSimilarFn = jasmine.createSpy("routerRouteFn");
		app.on(addDynamicRoute(urlOneDynamicSegments), routerRouteSimilarFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");
		app.on(addDynamicRoute(urlStaticSimilarToOneDynamicSegments), routerRouteFn);

		app.run("route", urlStaticSimilarToOneDynamicSegmentsExample);

		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteSimilarFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalledWith(urlStaticSimilarToOneDynamicSegmentsExampleDynamicArgs, urlStaticSimilarToOneDynamicSegmentsExampleQueryArgs);
		expect(routerEventFn).toHaveBeenCalledWith(urlStaticSimilarToOneDynamicSegmentsStatic, urlStaticSimilarToOneDynamicSegmentsExampleDynamicArgs, urlStaticSimilarToOneDynamicSegmentsExampleQueryArgs);

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlOneDynamicSegmentsStatic, routerRouteSimilarFn);

		removeDynamicRoute(urlTwoDynamicSegments);
	});

	it("should support a dynamic pretty route with segments and a query", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");
		app.on(addDynamicRoute(urlTwoDynamicSegmentsAndQuery), routerRouteFn);

		app.run("route", urlTwoDynamicSegmentsAndQueryStaticExample);

		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalledWith(urlTwoDynamicSegmentsAndQueryStaticExampleDynamicArgs, urlTwoDynamicSegmentsAndQueryStaticExampleQueryArgs);
		expect(routerEventFn).toHaveBeenCalledWith(urlTwoDynamicSegmentsAndQueryStatic, urlTwoDynamicSegmentsAndQueryStaticExampleDynamicArgs, urlTwoDynamicSegmentsAndQueryStaticExampleQueryArgs);

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlTwoDynamicSegmentsAndQueryStatic, routerRouteFn);

		removeDynamicRoute(urlTwoDynamicSegmentsAndQuery);
	});

	it("should support a dynamic pretty route with dynamic segments mixed with static segments and a query", () => {
		const routerEventFn = jasmine.createSpy("routerEventFn");
		app.on(ROUTER_EVENT, routerEventFn);

		const router404EventFn = jasmine.createSpy("router404EventFn");
		app.on(ROUTER_404_EVENT, router404EventFn);

		const routerRouteFn = jasmine.createSpy("routerRouteFn");

		const route = addDynamicRoute(urlTwoDynamicSegmentsWithStaticAndQuery);
		expect(route).toEqual(urlTwoDynamicSegmentsWithStaticAndQueryStatic);

		app.on(route, routerRouteFn);

		app.run("route", urlTwoDynamicSegmentsWithStaticAndQueryStaticExample);

		expect(router404EventFn).not.toHaveBeenCalled();
		expect(routerRouteFn).toHaveBeenCalledWith(urlTwoDynamicSegmentsWithStaticAndQueryStaticExampleDynamicArgs, urlTwoDynamicSegmentsWithStaticAndQueryStaticExampleQueryArgs);
		expect(routerEventFn).toHaveBeenCalledWith(urlTwoDynamicSegmentsWithStaticAndQueryStatic, urlTwoDynamicSegmentsWithStaticAndQueryStaticExampleDynamicArgs, urlTwoDynamicSegmentsWithStaticAndQueryStaticExampleQueryArgs);

		app.off(ROUTER_EVENT, routerEventFn);
		app.off(ROUTER_404_EVENT, router404EventFn);
		app.off(urlTwoDynamicSegmentsWithStaticAndQueryStatic, routerRouteFn);

		removeDynamicRoute(urlTwoDynamicSegmentsWithStaticAndQuery);
	});

	it("should be possible to reregister a route", () => {
		const reg1 = addDynamicRoute(urlTwoDynamicSegments);
		const reg2 = addDynamicRoute(urlTwoDynamicSegments);

		expect(reg1).toEqual(urlTwoDynamicSegmentsStatic);
		expect(reg2).toEqual(urlTwoDynamicSegmentsStatic);

		const unreg = removeDynamicRoute(urlTwoDynamicSegments);
		expect(unreg).toEqual(urlTwoDynamicSegmentsStatic);
	});
});

describe("pretty router - HTML5 history", () => {
	it("should play nicely with pop", (done) => {
		// Basically just check that history length is increasing - assume it has valid URL values.
		const URL1 = "/url1";
		const URL2 = "/url2";
		const URL3 = "/url3";
		const LINK_ID = "the-link";
		const DELAY = 10;

		let historyLength: number = window.history.length;
		let updateExpectedUrl: string = window.location.pathname;

		const getLink = (): HTMLElement => {
			const link: HTMLElement = div.querySelector(`a#${LINK_ID}`) as HTMLElement;
			expect(link).toBeTruthy();
			expect(typeof link.onclick === "function").toEqual(true);
			return link;
		};

		class TestComponent extends Component {
			public state: string = URL1;

			public update = {
				[URL1]: (url: string): string => {
					expect(window.location.pathname).toEqual(updateExpectedUrl);
					expect(window.history.length).toEqual(historyLength);
					updateExpectedUrl = URL1;

					// With a small delay, check the URL has been updated and
					// use a click to trigger the next.
					setTimeout(() => {
						expect(window.location.pathname).toEqual(updateExpectedUrl);
						expect(window.history.length).toEqual(historyLength + 1);
						const link = getLink();
						link.click();
					}, DELAY);

					return URL2;
				},
				[URL2]: (url: string): string => {
					expect(window.location.pathname).toEqual(updateExpectedUrl);
					expect(window.history.length).toEqual(historyLength + 1);

					test.unmount();
					div.remove();

					done();

					return URL1;
				},
			};

			public view = (state: string) => {
				return <div>
					<a id={LINK_ID} href={state} $prettylink>{state}</a>
				</div>;
			}
		}

		const component = new TestComponent();
		const div = document.createElement("div");
		const test = component.start(div);

		// Add a place for us to come back to.
		history.pushState({}, "", URL3);
		expect(window.history.length).toEqual(historyLength + 1);
		expect(window.location.pathname).toEqual(URL3);
		updateExpectedUrl = URL3;
		historyLength = window.history.length;

		const theLink: HTMLElement = getLink();
		theLink.click();
	});
});

describe("pretty router - link hydration", () => {
	it("should add links as required", () => {
		const LINK_CLASS = "link-me";
		const DONT_LINK_CLASS = "dont-link-me";

		class TestComponent extends Component {
			public view = () => {
				return <div>
					<a id="link1" class={LINK_CLASS} href="blah">link1</a>
					<a id="link2" class={DONT_LINK_CLASS} href="blah">link1</a>
					<a id="link3" class={LINK_CLASS} href="blah">link1</a>
					<a id="link4" class={DONT_LINK_CLASS} href="blah">link1</a>
				</div>;
			}
		}

		const component = new TestComponent();
		const div = document.createElement("div");
		document.body.appendChild(div);
		const test = component.start(div);

		addPrettyLinkHandlers(`a.${LINK_CLASS}`);

		[1, 2, 3, 4].forEach((linkNum) => {
			const linkId = `link${linkNum}`;

			const a = div.querySelector(`#${linkId}`);
			if(linkNum % 2) {
				expect(typeof (a as HTMLElement).onclick === "function").toEqual(true);
			} else {
				expect(typeof (a as HTMLElement).onclick === "function").toEqual(false);
			}
		});

		test.unmount();
		div.remove();
	});
});
