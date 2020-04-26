# Getting Started with `v5.hvv.transport.rest`

Let's walk through the **requests that are necessary to implement a typical basic transit app**.

*Note:* To properly & securely handle user input containing URL-unsafe characters, always [URL-encode](https://en.wikipedia.org/wiki/Percent-encoding) your query parameters!

The following code snippets use [`curl`](https://curl.haxx.se) (a versatile command line HTTP tool) and [`jq`](https://stedolan.github.io/jq/) (the command line swiss army knife for processing JSON).

### 1. search for stops

The `/locations?query=…` route allows you to query stops, points of interest (POIs) & addresses. We're only interested in stops though, so we filter using `poi=false&addresses=false`:

```shell
curl 'https://v5.hvv.transport.rest/locations?poi=false&addresses=false&query=Dammtor' -s | jq
```

```js
[
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
		"products": {
			"subway": false,
			"suburban": true,
			"akn": false,
			// …
		}
	},
	{
		"type": "stop",
		"id": "116",
		"name": "Bf. Dammtor",
		"location": {
			"type": "location",
			"id": "116",
			"latitude": 53.561048,
			"longitude": 9.990315
		},
		"products": {
			// …
		}
	}
	// …
]
```

### 2. fetch departures at a stop

Let's fetch 5 of the next departures at *Dammtor (Messe/CCH)* (which has the ID `163`):

```shell
curl 'https://v5.hvv.transport.rest/stops/163/departures?results=5' -s | jq
```

```js
[
	{
		"tripId": "1|34983|7|80|26042020",
		"direction": "Hauptbahnhof/ZOB",
		"line": {
			"type": "line",
			"id": "hha-b-19",
			"name": "19",
			"mode": "bus",
			"product": "bus",
			// …
		},

		"when": "2020-04-26T19:16:00+02:00",
		"plannedWhen": "2020-04-26T19:16:00+02:00",
		"delay": 0, // seconds
		"platform": null,
		"plannedPlatform": null,

		"stop": {
			"type": "stop",
			"id": "8863",
			"name": "Bf. Dammtor",
			"location": { /* … */ },
			"products": { /* … */ },
			"station": {
				"type": "station",
				"id": "163",
				"name": "Dammtor (Messe/CCH)",
				"location": { /* … */ },
				"products": { /* … */ },
			},
		},

		"remarks": [
			{
				"id": "HIM_ADAPTER_FREETEXT_260413528",
				"type": "warning",
				"summary": "Maskenpflicht im HVV",
				"text": "Ab Montag gilt in allen Verkehrsmitteln des HVV und auf den Haltestellen die Maskenpflicht.\n\nBitte helfen Sie mit und tragen Sie Ihre schon jetzt!",
				// …
			},
		],
	},
	{
		"tripId": "1|8795|7|80|26042020",
		"direction": "Hauptbahnhof/ZOB",
		"line": {
			"type": "line",
			"id": "hha-b-5",
			"name": "5",
			"mode": "bus",
			"product": "bus",
			// …
		},

		"when": "2020-04-26T19:20:00+02:00",
		"plannedWhen": "2020-04-26T19:19:00+02:00",
		"delay": 60, // seconds
		"platform": null,
		"plannedPlatform": null,

		"stop": { /* … */ },
		"remarks": [ /* … */ ],
	},
	// …
]
```

### 3. fetch journeys from A to B

We call a connection from A to B – at a specific date & time, made up of sections on specific *trips* – `journey`.

Let's fetch 2 journeys from `163` (*Dammtor (Messe/CCH)*) to `6246` (*Landungsbrücken*), departing tomorrow at 2pm (at the time of writing this).

```shell
curl 'https://v5.hvv.transport.rest/journeys?from=163&to=6246&departure=tomorrow+2pm&results=2' -s | jq
```

```js
{
	"journeys": [{
		// 1st journey
		"type": "journey",
		"legs": [{
			// 1st leg
			"tripId": "1|38014|10|80|27042020",
			"direction": "Elbgaustraße",
			"line": {
				"type": "line",
				"id": "sbahns-s21-s21",
				"name": "S21",
				"mode": "train",
				"product": "suburban",
				// …
			},

			"origin": {
				"type": "stop",
				"id": "107530",
				"name": "Dammtor (Messe/CCH)",
				"location": { /* … */ },
				"products": { /* … */ },
				"station": {
					"type": "station",
					"id": "163",
					"name": "Dammtor (Messe/CCH)",
					"location": { /* … */ },
					"products": { /* … */ },
				},
			},
			"departure": "2020-04-27T14:01:00+02:00",
			"plannedDeparture": "2020-04-27T14:01:00+02:00",
			"departureDelay": null,
			"departurePlatform": "1",
			"plannedDeparturePlatform": "1",

			"destination": {
				"type": "stop",
				"id": "107624",
				"name": "Sternschanze (Messe)",
				"location": { /* … */ },
				"products": { /* … */ },
				"station": { /* … */ },
			},
			"arrival": "2020-04-27T14:03:00+02:00",
			"plannedArrival": "2020-04-27T14:03:00+02:00",
			"arrivalDelay": null,
			"arrivalPlatform": "1 (S-Bahn)",
			"plannedArrivalPlatform": "1 (S-Bahn)",

			"cycle": {"min": 120, "max": 480, "nr": 25},
			"alternatives": [
				{
					"tripId": "1|38192|24|80|27042020",
					"direction": "Altona",
					"line": { /* … */ },
					"when": "2020-04-27T14:03:00+02:00",
					"plannedWhen": "2020-04-27T14:03:00+02:00",
					"delay": null,
				},
				// …
			],
		}, {
			// 2nd leg
			"walking": true,
			"distance": 179,
			// …

			"origin": {
				"type": "stop",
				"id": "107624",
				"name": "Sternschanze (Messe)",
				// …
			},
			"departure": "2020-04-27T14:03:00+02:00",
			"plannedDeparture": "2020-04-27T14:03:00+02:00",
			"departureDelay": null,

			"destination": {
				"type": "stop",
				"id": "16444",
				"name": "Sternschanze (Messe)",
				// …
			},
			"arrival": "2020-04-27T14:06:00+02:00",
			"plannedArrival": "2020-04-27T14:06:00+02:00",
			"arrivalDelay": null,
		}, {
			// 3rd leg
			"tripId": "1|32226|47|80|27042020",
			"direction": "Hauptbahnhof Süd - Wandsbek-Gartenstadt",
			"line": {
				"type": "line",
				"id": "hha-u-u3",
				"name": "U3",
				"mode": "train",
				"product": "subway",
				// …
			},

			"origin": {
				"type": "stop",
				"id": "16444",
				"name": "Sternschanze (Messe)",
				// …
			},
			"departure": "2020-04-27T14:06:00+02:00",
			"plannedDeparture": "2020-04-27T14:06:00+02:00",
			"departureDelay": null,
			"departurePlatform": "1",
			"plannedDeparturePlatform": "1",

			"destination": {
				"type": "stop",
				"id": "16428",
				"name": "Landungsbrücken",
				// …
			},
			"arrival": "2020-04-27T14:11:00+02:00",
			"plannedArrival": "2020-04-27T14:11:00+02:00",
			"arrivalDelay": null,
			"arrivalPlatform": "1",
			"plannedArrivalPlatform": "1",
			// …
		}],
		// …
	}, {
		// 2nd journey
		"type": "journey",
		"legs": [ /* … */ ],
		// …
	}],

	// …
}
```

### 4. more features

These are the basics. Check the full [API docs](api.md) for all features!
