# Routers for AppRun
[![npm](https://img.shields.io/npm/v/apprun-router.svg)](https://www.npmjs.com/package/apprun-router)
[![License](https://img.shields.io/:license-mit-blue.svg)](LICENSE)

A collection of simple router functionality (hash links, pretty links, and HTML5 history) to replace the basic router that is available in the lightweight library [AppRun](https://github.com/yysun/apprun). It is written using [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Compatibility

* apprun (version >= 1.18.0 or >= 2.18.0) is a peer dependency and has to be installed separately.

### Installation
```
npm install --save apprun-router

npm install --save apprun # peer dependency
```
### Pretty Links

As of 0.4.0, this router supports arbitrary depth path segments, dynamic path segments, and query strings along with HTML5 History.

#### Pretty Links and HTML5 History

```
import "apprun";
import "apprun-router/pretty";
```

Providing this import after AppRun will overwrite AppRun's default router with this package's pretty link router. 

The only thing that now remains is to ensure that when the pretty links are clicked they don't cause a server GET request but rather get routed to the pretty router. This is done by adding an `onclick` handler to the tag that has the link behaviour. The pretty router provides 2 ways to implement this functionality:

1. Since AppRun creates the global variable app, we can add an onclick event attribute to the HTML for each link that you want to call the pretty router:
```
import { IPrettyRoute } from "apprun-router/pretty";

...

<a href="/foo" onclick="e => (app.route as IPrettyRoute).linkClick(e)">
```

2. Alternatively, as of version 0.3.0, you can use this more compact form (note that there is no need to import in each tsx/jsx file that you're using):
```
<a href="/foo" $prettylink>
```

#### Query strings

Query strings (the part of the URI after a ?) are supported, generally, with no extra effort. By default the separator is a `&`, but this can be changed using the `setPrettyLinkQuerySeparator` method. This change affects all routes.

```
import {setPrettyLinkQuerySeparator} from "apprun-router/pretty";

...

// This is the default separator for query fields and doesn't need to be set.
setPrettyLinkQuerySeparator("&");

// You could choose the query field separator to be a `;`. This applies to all routes.
setPrettyLinkQuerySeparator(";");
```

The query string is provided to component update methods via the 3rd parameter:
```
import app, { Component } from "apprun";
import { IPrettyRouteDynamicSegments, IPrettyRouteQueries } from "apprun-router/pretty";

class YourComponent extends Component {
    ...

    update = {
        "EVENT_NAME": (state: any, dynamicSegments: IPrettyRouteDynamicSegments | undefined, queries: IPrettyRouteQueries | undefined) => state
    };

    ....
}

```

#### Dynamic segments

Dynamic segments (generic path segments) are supported. Unsurprisingly, they require a small amount of configuration.

```
import app, { Component } from "apprun";
import { addDynamicRoute, IPrettyRouteDynamicSegments, IPrettyRouteQueries, setPrettyLinkQuerySeparator } from "apprun-router/pretty";

const URL_FOO = "/test-url/:a/foobar/:b/foobaz/:c";

/* Given the above dynamic segments definition: 
const URL_EXAMPLE = "/test-url/dynamic1/foobar/dynamic2/foobaz/dynamic3?field1=value1&field2=value2&field3=value3";
const URL_DYNAMICS = {a: "dynamic1", b: "dynamic2", c: "dynamic3"};
const URL_QUERIES = {field1: "value1", field2: "value2", field3: "value3"};
*/

class YourComponent extends Component {
    state: any = {};

    update = {
        [addDynamicRoute(URL_FOO)]: (state: any, dynamicSegments: IPrettyRouteDynamicSegments | undefined, queries: IPrettyRouteQueries | undefined) => {
            return {
                dynamicSegments: dynamicSegments,
                queries: queries,
            };
        },
    };

    view = (state: any) => {
        return <>
            <p>Dynamic segements: {JSON.stringify(state.dynamicSegments)} queries: {JSON.stringify(state.queries)}</p>
        </>;
    };
}
```

In this example there are a few points to recognize:
1. To support dynamic segements you have to specify them. This is done when setting the router event in `YourComponent.update`. The `addDynamicRoute` method will turn `URL_FOO` into 2 parts: the static portion that the router will route against and the dynamic portion which is 1 or more segments that are segment names and start with a `:`. For instance, in the case of `URL_FOO` in the example above we have 3 dynamic segments, `a`, `b`, and `c`.

2. When the router calls an event, both the dynamic segements and the queries are provided. If the URL has none, this is undefined, otherwise they're a mapping. If the URL were `URL_EXAMPLE` then the `dynamicSegments` would have a value of `{a: "dynamic1", b: "dynamic2", c: "dynamic3"}` and the `queries` would have a value of `{field1: "value1", field2: "value2", field3: "value3"}`.

3. If for some reason you no longer need a dynamic route, you will have to remove it using the `removeDynamicRoute` method. In the case of the example above it would be `removeDynamicRoute(URL_FOO)`.


##### Downside of the dynamic segments implementation

The support is very straight forward and can cause surprising behaviour if steps aren't taken. A dynamic route of `/foo/:bar/:baz` will call your component's update method if the URL is `/foo` (with dynamic of undefined), `/foo/crazy` (with dynamic of {bar: "crazy"}), as well as what you were probably expecting `/foo/crazy/dude` (with dynamic of {bar: "crazy", baz: "dude"}). This means that some of the error detection is passed to the user's update method.

#### Pretty Links and Server Side Rendering/Rehydration

If all the link elements have been created in your DOM without an onclick handler, say if you have used server side rendering and you want to rehydrate them on the client, you can provide a description of the elements (c.f. [Locating DOM elements using selectors](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors)) and this will add onclick handler to each matching link.
```
import { addPrettyLinkHandlers } from "apprun-router/pretty";

...

// Add an onclick event handler to all DOM elements described by the selector "nav li a".
addPrettyLinkHandlers("nav li a");
```

### Hash Links

If you only want hash based links, there is nothing to do as the AppRun package comes with this functionality by default. However, if you'd like to use the one included in this package, simply, as in the pretty link router case, import apprun and then the hash router. There is no special onclick event handler required to support hash links.
```
import "apprun";
import "apprun-router/hash";
```

### Reporting Issues

You can report [bugs here](https://github.com/phBalance/apprun-router/issues).