# hvv-rest

***hvv-rest* is a public transport REST API**, a clean alternative to the [HVV HAFAS API](https://github.com/public-transport/hafas-client/tree/df943252b69e07a9739600ef409a65e2941cd1c9/p/hvv/readme.md).

[API Documentation](docs/index.md) | [Why?](docs/why.md)

![hvv-rest architecture diagram](architecture.svg)

[![Docker build status](https://img.shields.io/docker/build/derhuerst/hvv-rest.svg)](https://hub.docker.com/r/derhuerst/hvv-rest/)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hvv-rest.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## installing & running

### via Docker

A Docker image [is available as `derhuerst/hvv-rest`](https://hub.docker.com/r/derhuerst/hvv-rest).

```shell
docker run -d -p 3000:3000 derhuerst/hvv-rest
```

### manually

```shell
git clone https://github.com/derhuerst/hvv-rest.git
cd hvv-rest
git checkout 2
npm install --production
npm start
```

To keep the API running permanently, use tools like [`forever`](https://github.com/foreverjs/forever#forever), [`pm2`](http://pm2.keymetrics.io) or [`systemd`](https://wiki.debian.org/systemd).


## Related Projects

- [`db-rest`](https://github.com/derhuerst/db-rest) – A clean REST API wrapping around the Deutsche Bahn API.
- [`vbb-rest`](https://github.com/derhuerst/vbb-rest) – A clean REST API wrapping around the VBB API.
- [`bvg-rest`](https://github.com/derhuerst/bvg-rest) – A clean REST API wrapping around the BVG API.


## Contributing

If you have a question or need support using `hvv-rest`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hvv-rest/issues).
