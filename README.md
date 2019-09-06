# Routers for AppRun
A collection of simple router functionality (hash links, pretty links, and HTML5 history) that replace the basic router that is available in the lightweight library [AppRun](https://github.com/yysun/apprun). It is implemented in [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Compatibility

* apprun (version >= 1.18.0 or >= 2.18.0) is a peer dependency and has to be installed separately.

### Installation
```
npm install --save apprun-router

npm install --save apprun # peer dependency
```

### Common Use Cases

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

Alternatively, as of version 0.3.0, you can use this terser form (note that there is no need to import in each tsx/jsx file that you're using):
```
<a href="/foo" $prettylink>
```

2. If all the link elements have been created in your DOM without an onclick handler, say if you have used server side rendering and you want to rehydrate them on the client, you can provide a description of the elements (c.f. [Locating DOM elements using selectors](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors)) and this will add onclick handler to each matching link.
```
import { addPrettyLinkHandlers } from "apprun-router/pretty";

...

// Add an onclick event handler to all DOM elements described by the selector "nav li a".
addPrettyLinkHandlers("nav li a");
```

#### Hash Links

If you only want hash based links, there is nothing to do as the AppRun package comes with this functionality by default. However, if you'd like to use the one included in this package, simply, as in the pretty link router case, import apprun and then the hash router. There is no special onclick event handler required to support hash links.
```
import "apprun";
import "apprun-router/hash";
```

### Reporting Issues

You can report [bugs here](https://github.com/phBalance/apprun-router/issues).