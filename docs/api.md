# `v5.hvv.transport.rest` API documentation

[`v5.hvv.transport.rest`](https://v5.hvv.transport.rest/) is a [REST API](https://restfulapi.net). Data is being returned as [JSON](https://www.json.org/).

You can just use the API without authentication. In the future, we may [rate-limit](https://apisyouwonthate.com/blog/what-is-api-rate-limiting-all-about) your IP address if you make too many requests.

*Note:* For [URL-encoding](https://de.wikipedia.org/wiki/URL-Encoding), this documentation uses the `url-encode` tool of the [`url-decode-encode-cli` package](https://www.npmjs.com/package/url-decode-encode-cli).

## Routes

*Note:* These routes only wrap [`hafas-client@5` methods](https://github.com/public-transport/hafas-client/blob/5/docs/readme.md), check their docs for more details.

- [`GET /locations`](#get-locations)
- [`GET /stops/nearby`](#get-stopsnearby)
- [`GET /stops/reachable-from`](#get-stopsreachable-from)
- [`GET /stops/:id`](#get-stopsid)
- [`GET /stops/:id/departures`](#get-stopsiddepartures)
- [`GET /stops/:id/arrivals`](#get-stopsidarrivals)
- [`GET /journeys`](#get-journeys)
- [`GET /journeys/:ref`](#get-journeysref)
- [`GET /trips/:id`](#get-tripsid)
- [`GET /radar`](#get-radar)
- [date/time parameters](#datetime-parameters)
- [product parameters](#product-parameters)


## `GET /locations`

Uses [`hafasClient.locations()`](https://github.com/public-transport/hafas-client/blob/5/docs/locations.md) to **find stops/stations, POIs and addresses matching `query`**.

name | description | type | default value
-----|-------------|------|--------------
`query` | **Required.** | string | –
`fuzzy` | Find only exact matches? | boolean | `true`
`results` | How many stations shall be shown? | boolean | `10`
`stops` | Show stops/stations? | boolean | `true`
`poi` | Show points of interest? | boolean | `true`
`addresses` | Show addresses? | boolean | `true`
`linesOfStops` | Parse & return lines of each stop/station? | boolean | `false`
`language` | Language of the results. | string | `en`

### Example

```shell
curl 'https://v5.hvv.transport.rest/locations?query=dammtor&results=1' -s | jq
```

```js
[
	{
		"type": "stop",
		"id": "163",
		"name": "Dammtor (Messe/CCH)",
		"location": {
			"type": "location",
			"latitude": 53.560949,
			"longitude": 9.989721
		},
		"products": {
			"subway": false,
			"suburban": true,
			"akn": false,
			// …
		}
	}
]
```


## `GET /stops/nearby`

Uses [`hafasClient.nearby()`](https://github.com/public-transport/hafas-client/blob/5/docs/nearby.md) to **find stops/stations close to the given geolocation**.

name | description | type | default value
-----|-------------|------|--------------
`latitude` | **Required.** | number | –
`longitude` | **Required.** | number | –
`results` | maximum number of results | number | `8`
`distance` | maximum walking distance in meters | number | –
`poi` | return points of interest? | boolean | `false`
`stops` | return stops/stations? | boolean | `true`
`linesOfStops` | parse & expose lines at each stop/station? | boolean | `false`
`language` | language to get results in | string | `en`

### Example

```shell
curl 'https://v5.hvv.transport.rest/stops/nearby?latitude=53.5711&longitude=10.0015' -s | jq
```

```js
[
	{
		"type": "stop",
		"id": "118",
		"name": "Böttgerstraße",
		"location": {
			"type": "location",
			"latitude": 53.568356,
			"longitude": 9.995528
		},
		"products": { /* … */ },
		"distance": 498
	},
	// …
	{
		"type": "stop",
		"id": "4673",
		"name": "Gertigstraße",
		"location": { /* … */ },
		"products": { /* … */ },
		"distance": 1305
	},
	// …
]
```


## `GET /stops/reachable-from`

Uses [`hafasClient.reachableFrom()`](https://github.com/public-transport/hafas-client/blob/5/docs/reachable-from.md) to **find stops/stations reachable within a certain time from an address**.

name | description | type | default value
-----|-------------|------|--------------
`latitude` | **Required.** | number | –
`longitude` | **Required.** | number | –
`address` | **Required.** | string | –
`when` | Date & time to compute the reachability for. See [date/time parameters](#datetime-parameters). | | *now*
`maxTransfers` | Maximum number of transfers. | number | `5`
`maxDuration` | Maximum travel duration, in minutes. | number | *infinite*
[product parameters](#product-parameters) | Compute time to reach a stop/station only using certain products. | booleans | *all products*
`language` | language to get results in | string | `en`

### Example

```shell
curl 'https://v5.hvv.transport.rest/stops/reachable-from?latitude=53.553766&longitude=9.977514&address=Hamburg,+Holstenwall+9' -s | jq
```

```js
[
	{
		"type": "stop",
		"id": "102",
		"name": "Handwerkskammer",
		"location": {
			"type": "location",
			"id": "102",
			"latitude": 53.553371,
			"longitude": 9.976723
		},
		"products": { /* … */ },
		"distance": 68
	},
	// …
	{
		"type": "stop",
		"id": "6255",
		"name": "Altona (Fischmarkt)",
		"location": { /* … */ },
		"products": { /* … */ },
		"distance": 1996
	},
	// …
]
```


## `GET /stops/:id`

Uses [`hafasClient.stop()`](https://github.com/public-transport/hafas-client/blob/5/docs/stop.md) to **find a stop/station by ID**.

name | description | type | default value
-----|-------------|------|--------------
`linesOfStops` | parse & expose lines at each stop/station? | boolean | `false`
`language` | language to get results in | string | `en`

### Example

```shell
curl 'https://v5.hvv.transport.rest/stops/163' -s | jq
```

```js
{
	"type": "stop",
	"id": "163",
	"name": "Dammtor (Messe/CCH)",
	"location": {
		"type": "location",
		"id": "163",
		"latitude": 53.560949,
		"longitude": 9.989721
	},
	"products": { /* … */ },
}
```


## `GET /stops/:id/departures`

Uses [`hafasClient.departures()`](https://github.com/public-transport/hafas-client/blob/5/docs/departures.md) to **get departures at a stop/station**.

name | description | type | default value
-----|-------------|------|--------------
`when` | Date & time to get departures for. See [date/time parameters](#datetime-parameters). | | *now*
`direction` | Filter departures by direction. | string | –
`duration` | Show departures for how many minutes? | number | `10`
`results` | Max. number of departures. | number | *whatever HAFAS wants*
`linesOfStops` | Parse & return lines of each stop/station? | boolean | `false`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`stopovers` | Fetch & parse next stopovers of each departure? | boolean | `false`
`includeRelatedStations` | Fetch departures at related stops, e.g. those that belong together on the metro map? | boolean | `true`
`language` | Language of the results. | string | `en`

### Example

```shell
# at Dammtor (Messe/CCH), in direction Universität/Staatsbibliothek, 10 minutes
curl 'https://v5.hvv.transport.rest/stops/163/departures?direction=8868&duration=10' -s | jq
```

```js
[
	{
		"tripId": "1|8729|0|80|26042020",
		"direction": "U Niendorf Markt",
		"line": {
			"type": "line",
			"id": "hha-b-5",
			"name": "5",
			"mode": "bus",
			"product": "bus",
			// …
		},

		"when": "2020-04-26T23:03:00+02:00",
		"plannedWhen": "2020-04-26T23:03:00+02:00",
		"delay": 0,
		"platform": null,
		"plannedPlatform": null,

		"stop": {
			"type": "stop",
			"id": "8862",
			"name": "Bf. Dammtor",
			"location": { /* … */ },
			"products": { /* … */ },
			// …
		},

		"remarks": [ /* … */ ],
	},
	// …
]
```


## `GET /stops/:id/arrivals`

Works like [`/stops/:id/departures`](#get-stopsiddepartures), except that it uses [`hafasClient.arrivals()`](https://github.com/public-transport/hafas-client/blob/5/docs/arrivals.md) to **arrivals at a stop/station**.

### Example

```shell
# at Dammtor (Messe/CCH), 10 minutes
curl 'https://v5.hvv.transport.rest/stops/163/arrivals?duration=10' -s | jq
```


## `GET /journeys`

Uses [`hafasClient.journeys()`](https://github.com/public-transport/hafas-client/blob/5/docs/journeys.md) to **find journeys from A (`from`) to B (`to`)**.

`from` (A), `to` (B), and the optional `via` must each have one of these formats:

- as stop/station ID (e.g. `from=163` for *Dammtor (Messe/CCH)*)
- as a POI (e.g. `from.id=980001141&from.latitude=53.5415&from.longitude=9.98576` for *Elbphilharmonie Besucherzentrum*)
- as an address (e.g. `from.latitude=53.57422&from.longitude=10.01248&from.address=Hamburg,+Karlstraße+26` for *Karlstr. 26*)

Other parameters:

name | description | type | default value
-----|-------------|------|--------------
`departure`/`arrival` | Compute journeys departing/arriving at this date/time. Mutually exclusive. See [date/time parameters](#datetime-parameters). | | *now*
`results` | Max. number of journeys. | number | `3`
`stopovers` | Fetch & parse stopovers on the way? | boolean | `false`
`transfers` | Maximum number of transfers. | number | *let HAFAS decide*
`transferTime` | Minimum time in minutes for a single transfer. | number | `0`
`accessibility` | `partial` or `complete`. | string | *not accessible*
`bike` | Compute only bike-friendly journeys? | boolean | `false`
`startWithWalking` | Consider walking to nearby stations at the beginning of a journey? | boolean | `true`
`walkingSpeed` | `slow`, `normal` or `fast`. | string | `normal`
[product parameters](#product-parameters) | Compute journeys using only certain products. | booleans | *all products*
`tickets` | Return information about available tickets? | boolean | `false`
`polylines` | Fetch & parse a shape for each journey leg? | boolean |  `false`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`scheduledDays` | Parse & return dates each journey is valid on? | boolean | `false`
`language` | Language of the results. | string | `en`

### Pagination

Given a response, you can also fetch more journeys matching the same criteria. Instead of `from*`, `to*` & `departure`/`arrival`, pass `earlierRef` from the first response as `earlierThan` to get journeys "before", or `laterRef` as `laterThan` to get journeys "after".

Check the [`hafasClient.journeys()` docs](https://github.com/public-transport/hafas-client/blob/5/docs/journeys.md) for more details.

### Examples

```shell
# stop/station to POI
curl 'https://v5.hvv.transport.rest/journeys?from=163&to.id=980001822&to.latitude=53.55525&to.longitude=10.00305' -s | jq
# without buses, with ticket info
curl 'https://v5.hvv.transport.rest/journeys?from=…&to=…&bus=false&tickets=true' -s | jq
```


## `GET /journeys/:ref`

Uses [`hafasClient.refreshJourney()`](https://github.com/public-transport/hafas-client/blob/5/docs/refresh-journey.md) to **"refresh" a journey, using its `refreshToken`**.

The journey will be the same (equal `from`, `to`, `via`, date/time & vehicles used), but you can get up-to-date realtime data, like delays & cancellations.

name | description | type | default value
-----|-------------|------|--------------
`stopovers` | Fetch & parse stopovers on the way? | boolean | `false`
`polylines` | Fetch & parse a shape for each journey leg? | boolean |  `false`
`tickets` | Return information about available tickets? | boolean | `false`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`language` | Language of the results. | string | `en`

### Example

```shell
# get the refreshToken of a journey
journey=$(curl 'https://v5.hvv.transport.rest/journeys?from=…&to=…&results=1' -s | jq '.journeys[0]')
refresh_token=$(echo $journey | jq -r '.refreshToken')

# refresh the journey
curl "https://v5.hvv.transport.rest/journeys/$(echo $refresh_token | url-encode)" -s | jq
```


## `GET /trips/:id`

Uses [`hafasClient.trip()`](https://github.com/public-transport/hafas-client/blob/5/docs/trip.md) to **fetch a trip by ID**.

A trip is a specific vehicle, stopping at a series of stops at specific points in time. Departures, arrivals & journey legs reference trips by their ID.

name | description | type | default value
-----|-------------|------|--------------
`lineName` | **Required.** Line name of the part's mode of transport, e.g. `RE7`. | string | –
`stopovers` | Fetch & parse stopovers on the way? | boolean | `true`
`polyline` | Fetch & parse the geographic shape of the trip? | boolean |  `false`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`language` | Language of the results. | string | `en`

### Example

```shell
# get the trip ID of a journey leg
journey=$(curl 'https://v5.hvv.transport.rest/journeys?from=…&to=…&results=1' -s | jq '.journeys[0]')
journey_leg=$(echo $journey | jq -r '.legs[0]')
trip_id=$(echo $journey_leg | jq -r '.tripId')

# fetch the trip
curl "https://v5.hvv.transport.rest/trips/$(echo $trip_id | url-encode)" -s | jq
```


## `GET /radar`

Uses [`hafasClient.radar()`](https://github.com/public-transport/hafas-client/blob/5/docs/radar.md) to **find all vehicles currently in an area**, as well as their movements.

name | description | type | default value
-----|-------------|------|--------------
`north` | **Required.** Northern latitude. | number | –
`west` | **Required.** Western longtidue. | number | –
`south` | **Required.** Southern latitude. | number | –
`east` | **Required.** Eastern longtidue. | number | –
`results` | Max. number of vehicles. | number | `256`
`duration` | Compute frames for the next `n` seconds. | number | `30`
`frames` | Number of frames to compute. | number | `3`
`polylines` | Fetch & parse a geographic shape for the movement of each vehicle? | boolean |  `true`
`language` | Language of the results. | string | `en`

### Example

```shell
bbox='north=53.555&west=9.989&south=53.55&east=10.001'
curl "https://v5.hvv.transport.rest/radar?$bbox&results=10" -s | jq
```


## Date/Time Parameters

Possible formats:

- anything that [`parse-human-relative-time`](https://npmjs.com/package/parse-human-relative-time) can parse (e.g. `tomorrow 2pm`)
- [ISO 8601 date/time string](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) (e.g. `2020-04-26T22:43+02:00`)
- [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) (e.g. `1587933780`)


## Product Parameters

Some routes allow you to filter by [product](https://github.com/public-transport/hafas-client/blob/e02a20b1de59bda3cd380445b6105e4c46036636/docs/writing-a-profile.md#3-products):

name | description | type | default value
-----|-------------|------|--------------
`subway` | U-Bahn (U) | boolean | `true`
`suburban` | S-Bahn (S) | boolean | `true`
`akn` | AKN (A) | boolean | `true`
`regional-express-train` | RegionalExpress (RE) | boolean | `true`
`regional-train` | Regionalbahn (RB) | boolean | `true`
`ferry` | Fähre (F) | boolean | `true`
`bus` | Bus (Bus) | boolean | `true`
`express-bus` | Schnellbus (Schnellbus) | boolean | `true`
`anruf-sammel-taxi` | Anruf-Sammel-Taxi (AST) | boolean | `true`
`long-distance-train` | Fernzug (ICE/IC/EC/EN) | boolean | `false`
`long-distance-bus` | Fernbus (Fernbus) | boolean | `false`
