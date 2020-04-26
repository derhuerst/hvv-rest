# Hamburg Public Transport API

This API returns data in the [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md). The public endpoint is [`v5.hvv.transport.rest`](https://v5.hvv.transport.rest/).

## all routes

- [`GET /stops/nearby`](#get-stopsnearby)
- [`GET /stops/:id`](#get-stopsid)
- [`GET /stations/:id/departures`](#get-stationssiddepartures)
- [`GET /journeys`](#get-journeys)
- [`GET /journeys/:ref`](#get-journeysref)
- [`GET /trips/:id`](#get-tripsid)
- [`GET /locations`](#get-locations)
- [`GET /radar`](#get-radar)

## `GET /stops/nearby`

- `latitude`: **Required.**
- `longitude`: **Required.**
- `results`: How many stops/stations shall be shown? Default: `8`.
- `distance`: Maximum distance in meters. Default: `null`.
- `stops`: Show stops/stations around. Default: `true`.
- `poi`: Show points of interest around. Default: `false`.
- `linesOfStops`: Parse & expose lines of each stop/station? Default: `false`.
- `language`: Language of the results. Default: `en`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://v5.hvv.transport.rest/stops/nearby?latitude=53.55118&longitude=9.99468'
```


## `GET /stops/:id`

`Content-Type`: `application/json`

- `linesOfStops`: Parse & expose lines of the stop/station? Default: `false`.
- `language`: Language of the results. Default: `en`.

### examples

```shell
curl 'https://v5.hvv.transport.rest/stops/163'
```


## `GET /stations/:id/departures`

Returns departures at a stop/station.

*Note:* As stated in the [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md), the returned `departure` and `arrival` times include the current delay.

`Content-Type`: `application/json`

- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `direction`: Filter departures by direction. Default: `null`.
- `duration`: Show departures for the next `n` minutes. Default: `10`.
- `linesOfStops`: Parse & expose lines of each stop/station? Default: `false`.
- `remarks`: Parse & expose hints & warnings? Default: `true`.
- `includeRelatedStations`: Fetch departures at related stations, e.g. those that belong together on the metro map? Default: `true`.
- `language`: Language of the results. Default: `en`.

### examples

```shell
# at Dammtor (Messe/CCH), in direction Universität/Staatsbibliothek
curl 'https://v5.hvv.transport.rest/stations/163/departures?direction=8868&duration=10'
# at Dammtor (Messe/CCH), without direction
curl 'https://v5.hvv.transport.rest/stations/163/departures?when=tomorrow%206pm'
```


## `GET /journeys`

Output from [`hafas.journeys(…)`](https://github.com/public-transport/hafas-client/blob/4/docs/journeys.md). Start location and end location must be either in [stop format](#stop-format), [POI format](#poi-format) or [address format](#address-format) (you can mix them).

*Note:* As stated in the [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md), the returned `departure` and `arrival` times include the current delay.

## stop format

- `from`: **Required.** stop/station ID (e.g. `900000023201`).
- `to`: **Required.** stop/station ID (e.g. `900000023201`).

## POI format

- `from.latitude`/`to.latitude`: **Required.** Latitude (e.g. `52.543333`).
- `from.longitude`/`to.longitude`: **Required.** Longitude (e.g. `13.351686`).
- `from.name`/`to.name`: Name of the locality (e.g. `Atze Musiktheater`).
- `from.id`/`to.id`: **Required.** POI ID (e.g. `9980720`).

## address format

- `from.latitude`/`to.latitude`: **Required.** Latitude (e.g. `52.543333`).
- `from.longitude`/`to.longitude`: **Required.** Longitude (e.g. `13.351686`).
- `from.address`/`to.address`: **Required.** Address (e.g. `Voltastr. 17`).

## other parameters

- `departure` or `arrival`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `results`: Maximum number of results. Default: `5`.
- `via`: stop/station ID. Default: `null`.
- `stopovers`: Return stops/stations on the way? Default: `false`.
- `transfers`: Maximum number of transfers. Default: `null`.
- `transferTime`: Minimum time in minutes for a single transfer. Default: `0`.
- `accessibility`: Possible values: `partial`, `complete`. Default: `none`.
- `bike`: Return only bike-friendly journeys. Default: `false`.
- `tickets`: Return information about available tickets. Default: `false`.
- `polylines`: Return shape of each journey leg? Default: `false`.
- `remarks`: Parse & expose hints & warnings? Default: `true`.
- `startWithWalking`: Consider walking to nearby stations at the beginning of a journey? Default: `true`.
- `language`: Language of the results. Default: `en`.

todo: products

`Content-Type`: `application/json`

### examples

```shell
curl 'https://v5.hvv.transport.rest/journeys?from=163&to=111'
curl 'https://v5.hvv.transport.rest/journeys?from=163&to.id=980001822&to.name=Hamburger%20Kunsthalle&to.latitude=53.55525&to.longitude=10.003052'
curl 'https://v5.hvv.transport.rest/journeys?from=…&to=…&results=3&bus=false&tickets=true'
```


## `GET /journeys/:ref`

Output from [`hafas.refreshJourney(…)`](https://github.com/public-transport/hafas-client/blob/4/docs/refresh-journey.md).

- `stopovers`: Return stations on the way? Default: `true`.
- `polylines`: Return shape of each journey leg? Default: `false`.
- `remarks`: Parse & expose hints & warnings? Default: `true`.
- `language`: Language of the results. Default: `en`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://v5.hvv.transport.rest/journeys/T%24A%3D1%40O%3DDammtor%20(Messe%2FCCH)%40L%3D20501%40a%3D128%40%24A%3D1%40O%3DSternschanze%20(Messe)%40L%3D20677%40a%3D128%40%24201911011725%24201911011727%24%20%20%20%20%20S11%24%243%24%C2%A7W%24A%3D1%40O%3DSternschanze%20(Messe)%40L%3D20677%40a%3D128%40%24A%3D1%40O%3DSternschanze%20(Messe)%40L%3D16444%40a%3D128%40%24201911011742%24201911011745%24%24%241%24%C2%A7T%24A%3D1%40O%3DSternschanze%20(Messe)%40L%3D16444%40a%3D128%40%24A%3D1%40O%3DFeldstra%C3%9Fe%20(Heiligengeistfeld)%40L%3D16311%40a%3D128%40%24201911011746%24201911011748%24%20%20%20%20%20%20U3%24%241%24'
```


## `GET /trips/:id`

Output from [`hafas.trip(…)`](https://github.com/public-transport/hafas-client/blob/4/docs/trip.md).

- `lineName`: **Required.** Line name of the part's mode of transport, e.g. `RE7`.
- `stopovers`: Return stations on the way? Default: `true`.
- `remarks`: Parse & expose hints & warnings? Default: `true`.
- `polyline`: Return a shape for the trip? Default: `false`.
- `language`: Language of the results. Default: `en`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://v5.hvv.transport.rest/trips/1|34306|0|80|1112019?lineName=S31'
```


## `GET /locations`

Output from [`hafas.locations(…)`](https://github.com/public-transport/hafas-client/blob/4/docs/locations.md).

- `query`: **Required.** (e.g. `Alexanderplatz`)
- `fuzzy`: Find only exact matches? Default: `true`.
- `results`: How many stations shall be shown? Default: `10`.
- `stations`: Show stations? Default: `true`.
- `poi`: Show points of interest? Default: `true`.
- `addresses`: Show addresses? Default: `true`.
- `linesOfStops`: Parse & expose lines of each station? Default: `false`.
- `language`: Language of the results. Default: `en`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://v5.hvv.transport.rest/locations?query=Dammtor'
curl 'https://v5.hvv.transport.rest/locations?query=Hermannstra%C3%9Fe%2016%2C%20Hamburg&poi=false&stations=false'
```


## `GET /radar`

- `north`: **Required.** Northern latitude.
- `west`: **Required.** Western longtidue.
- `south`: **Required.** Southern latitude.
- `east`: **Required.** Eastern longtidue.
- `results`: How many vehicles shall be shown? Default: `256`.
- `duration`: Compute frames for how many seconds? Default: `30`.
- `frames`: Number of frames to compute. Default: `3`.
- `polylines`: Return shape of movement? Default: `false`.
- `language`: Language of the results. Default: `en`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://v5.hvv.transport.rest/radar?north=53.555&west=9.989&south=53.55&east=10.001'
```
