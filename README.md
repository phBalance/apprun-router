# Routers for AppRun
A collection of simple router functionality (hash links, pretty links, and html5 history) that replace the basic router that is available in the lightweight library [AppRun](https://github.com/yysun/apprun). It is implemented in TypeScript.

## Getting Started

### Compatibility

* apprun 1.17.0+ (TBD)

### Installation
```
npm install --save apprun-router
```

### Common Use Cases

#### Pretty Links and HTML5 History

```
import "apprun";
import "apprun-router/pretty";
```

Providing this import after [AppRun](https://github.com/yysun/apprun) will overwrite AppRun's default router with this package's pretty link router. The only thing that now remains is to ensure that when the pretty links are clicked on they don't cause a server GET request but rather get routed to the pretty router. This is done by adding an click handler to the tag that has the link behaviour.

This router provides 2 ways to implement this functionality:

1. Add directly to the HTML for each of your links that you want to call the pretty router:
```
<a href="/foo" onclick="e => (app as any).route.linkClick(e)">
```

2. Once all the links are created in your DOM you can provide a description of the elements (c.f. [Locating DOM elements using selectors](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors).
```
import { addPrettyLinkHandlers } from "apprun-router/pretty";

...

// Decorarte all DOM elements described by the selector "nav li a".
addPrettyLinkHandlers("nav li a");
```

#### Hash Links

There is nothing to do as the [AppRun](https://github.com/yysun/apprun) package comes with a hash based router. However, if you'd like to use the one included in this package, simply, as in the pretty link router case, import apprun and then the hash router:
```
import "apprun";
import "apprun-router/hash";
```

### Reporting Issues

You can report [bugs here](https://github.com/phBalance/apprun-router/issues).