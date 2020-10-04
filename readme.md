# hvv-rest

***hvv-rest* is a public transport REST API**, a clean alternative to the [HVV HAFAS API](https://github.com/public-transport/hafas-client/blob/e02a20b1de59bda3cd380445b6105e4c46036636/p/hvv/readme.md). It is deployed at [`v5.hvv.transport.rest`](https://v5.hvv.transport.rest/).

[**API documentation**](docs/readme.md)

![hvv-rest architecture diagram](architecture.svg)

[![API status](https://badgen.net/uptime-robot/status/m784879519-27e5d1cc383d9159da575595)](https://stats.uptimerobot.com/57wNLs39M/784879519)
[![Docker build status](https://img.shields.io/docker/build/derhuerst/hvv-rest.svg)](https://hub.docker.com/r/derhuerst/hvv-rest/)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hvv-rest.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## installing & running

`hvv-rest` expects a [Redis](https://redis.io/) server running on `127.0.0.1:6379` (default port), but you can set the `REDIS_URL` environment variable to change this.

### via Docker

A Docker image [is available as `derhuerst/hvv-rest:5`](https://hub.docker.com/r/derhuerst/hvv-rest).

```shell
docker run -d -p 3000:3000 derhuerst/hvv-rest:5
```

*Note:* The Docker image does not contain the Redis server.

### manually

```shell
git clone https://github.com/derhuerst/hvv-rest.git
cd hvv-rest
git checkout 5
npm install --production

redis-server &
npm start
```

To keep the API running permanently, use tools like [`forever`](https://github.com/foreverjs/forever#forever), [`pm2`](http://pm2.keymetrics.io) or [`systemd`](https://wiki.debian.org/systemd).


## Related Projects

- [`db-rest`](https://github.com/derhuerst/db-rest) – A clean REST API wrapping around the Deutsche Bahn API.
- [`vbb-rest`](https://github.com/derhuerst/vbb-rest) – A clean REST API wrapping around the VBB API.
- [`bvg-rest`](https://github.com/derhuerst/bvg-rest) – A clean REST API wrapping around the BVG API.
- [`hafas-rest-api`](https://github.com/public-transport/hafas-rest-api) – Expose a HAFAS client via an HTTP REST API.
- [`hafas-client`](https://github.com/public-transport/hafas-client) – JavaScript client for HAFAS public transport APIs.


## Contributing

If you have a question or need support using `hvv-rest`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hvv-rest/issues).
