# `v5.hvv.transport.rest` documentation

[`v5.hvv.transport.rest`](https://v5.hvv.transport.rest/) is a [REST API](https://restfulapi.net) for the [Hamburg](https://en.wikipedia.org/wiki/Hamburg) public transportation system, [HVV](https://en.wikipedia.org/wiki/Hamburger_Verkehrsverbund).

[![API status](https://badgen.net/uptime-robot/status/m784879519-27e5d1cc383d9159da575595)](https://stats.uptimerobot.com/57wNLs39M/784879519)

Because it wraps [an API](https://github.com/public-transport/hafas-client/blob/master/readme.md#background) of HVV, it **includes all local traffic, as well as some long-distance trains running in the area**. Essentially, it returns whatever data the [HVV app](https://www.hvv.de/en/service/hvv-apps) shows, **including realtime delays and disruptions**.

- [Getting Started](getting-started.md)
- [API documentation](api.md)
- [OpenAPI playground](https://petstore.swagger.io/?url=https%3A%2F%2Fv5.hvv.transport.rest%2F.well-known%2Fservice-desc%0A)

## Why use this API?

### Realtime Data

This API returns realtime data whenever its upstream, the [API for DB's mobile app](https://github.com/public-transport/hafas-client/blob/33d7d30acf235c54887c6459a15fe581982c6a19/p/hvv/readme.md), provides it.

### No API Key

You can just use the API without authentication. There's a [rate limit](https://apisyouwonthate.com/blog/what-is-api-rate-limiting-all-about) of 100 requests/minute (burst 150 requests/minute) set up.

### CORS

This API has [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) enabled, so you can query it from any webpage.

### Caching-friendly

This API sends [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) & [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) headers, allowing clients cache responses properly.
