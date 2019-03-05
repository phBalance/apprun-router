# Routers for AppRun
A collection of simple router functionality (hash links, pretty links, and html5 history) that replace the basic router that is available in the lightweight library [AppRun](https://github.com/yysun/apprun).

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

Providing this import after apprun will overwrite apprun's default router with the pretty link router. The only thing that now remains is to ensure that when the links are clicked on that they don't cause a server GET request. This is typically done by adding an click handler to the <a> tag.

#### Hash Links

There is nothing to do as the apprun package comes with a hash based router. If you'd like to use the one included in this package, simply:
```
import "apprun-router/hash";
```

### Reporting Issues

TBD