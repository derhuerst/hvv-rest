'use strict'

const generateApiDocs = require('hafas-rest-api/tools/generate-docs')
const {api} = require('./api')

const HEAD = `\
# \`v5.hvv.transport.rest\` API documentation

[\`v5.hvv.transport.rest\`](https://v5.hvv.transport.rest/) is a [REST API](https://restfulapi.net). Data is being returned as [JSON](https://www.json.org/).

You can just use the API without authentication. There's a [rate limit](https://apisyouwonthate.com/blog/what-is-api-rate-limiting-all-about) of 100 request/minute (burst 200 requests/minute) set up.

[OpenAPI playground](https://petstore.swagger.io/?url=https%3A%2F%2Fv5.hvv.transport.rest%2F.well-known%2Fservice-desc%0A)

*Note:* For [URL-encoding](https://de.wikipedia.org/wiki/URL-Encoding), this documentation uses the \`url-encode\` tool of the [\`url-decode-encode-cli\` package](https://www.npmjs.com/package/url-decode-encode-cli).
`

const order = [
	'/locations',
	'/stops/nearby',
	'/stops/reachable-from',
	'/stops/:id',
	'/stops/:id/departures',
	'/stops/:id/arrivals',
	'/journeys',
	'/journeys/:ref',
	'/trips/:id',
	'/radar',
]

const descriptions = {
	'/locations': `\
Uses [\`hafasClient.locations()\`](https://github.com/public-transport/hafas-client/blob/5/docs/locations.md) to **find stops/stations, POIs and addresses matching \`query\`**.
`,
	'/stops/nearby': `\
Uses [\`hafasClient.nearby()\`](https://github.com/public-transport/hafas-client/blob/5/docs/nearby.md) to **find stops/stations close to the given geolocation**.
`,
	'/stops/reachable-from': `\
Uses [\`hafasClient.reachableFrom()\`](https://github.com/public-transport/hafas-client/blob/5/docs/reachable-from.md) to **find stops/stations reachable within a certain time from an address**.
`,
	'/stops/:id': `\
Uses [\`hafasClient.stop()\`](https://github.com/public-transport/hafas-client/blob/5/docs/stop.md) to **find a stop/station by ID**.
`,
	'/stops/:id/departures': `\
Uses [\`hafasClient.departures()\`](https://github.com/public-transport/hafas-client/blob/5/docs/departures.md) to **get departures at a stop/station**.
`,
	'/stops/:id/arrivals': `\
Works like [\`/stops/:id/departures\`](#get-stopsiddepartures), except that it uses [\`hafasClient.arrivals()\`](https://github.com/public-transport/hafas-client/blob/5/docs/arrivals.md) to **arrivals at a stop/station**.
`,
	'/journeys': `\
Uses [\`hafasClient.journeys()\`](https://github.com/public-transport/hafas-client/blob/5/docs/journeys.md) to **find journeys from A (\`from\`) to B (\`to\`)**.

\`from\` (A), \`to\` (B), and the optional \`via\` must each have one of these formats:

- as stop/station ID (e.g. \`from=163\` for *Dammtor (Messe/CCH)*)
- as a POI (e.g. \`from.id=980001141&from.latitude=53.5415&from.longitude=9.98576\` for *Elbphilharmonie Besucherzentrum*)
- as an address (e.g. \`from.latitude=53.57422&from.longitude=10.01248&from.address=Hamburg,+Karlstraße+26\` for *Karlstr. 26*)

### Pagination

Given a response, you can also fetch more journeys matching the same criteria. Instead of \`from*\`, \`to*\` & \`departure\`/\`arrival\`, pass \`earlierRef\` from the first response as \`earlierThan\` to get journeys "before", or \`laterRef\` as \`laterThan\` to get journeys "after".

Check the [\`hafasClient.journeys()\` docs](https://github.com/public-transport/hafas-client/blob/5/docs/journeys.md) for more details.
`,
	'/journeys/:ref': `\
Uses [\`hafasClient.refreshJourney()\`](https://github.com/public-transport/hafas-client/blob/5/docs/refresh-journey.md) to **"refresh" a journey, using its \`refreshToken\`**.

The journey will be the same (equal \`from\`, \`to\`, \`via\`, date/time & vehicles used), but you can get up-to-date realtime data, like delays & cancellations.
`,
	'/trips/:id': `\
Uses [\`hafasClient.trip()\`](https://github.com/public-transport/hafas-client/blob/5/docs/trip.md) to **fetch a trip by ID**.

A trip is a specific vehicle, stopping at a series of stops at specific points in time. Departures, arrivals & journey legs reference trips by their ID.
`,
	'/radar': `\
Uses [\`hafasClient.radar()\`](https://github.com/public-transport/hafas-client/blob/5/docs/radar.md) to **find all vehicles currently in an area**, as well as their movements.
`,
}

const examples = {
	'/locations': `\
### Example

\`\`\`shell
curl 'https://v5.hvv.transport.rest/locations?query=dammtor&results=1' -s | jq
\`\`\`

\`\`\`js
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
\`\`\`
`,
	'/stops/nearby': `\
### Example

\`\`\`shell
curl 'https://v5.hvv.transport.rest/stops/nearby?latitude=53.5711&longitude=10.0015' -s | jq
\`\`\`

\`\`\`js
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
\`\`\`
`,
	'/stops/reachable-from': `\
### Example

\`\`\`shell
curl 'https://v5.hvv.transport.rest/stops/reachable-from?latitude=53.553766&longitude=9.977514&address=Hamburg,+Holstenwall+9' -s | jq
\`\`\`

\`\`\`js
[
	{
		"duration": 1,
		"stations": [
			{
				"type": "stop",
				"id": "102",
				"name": "Handwerkskammer",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			// …
		]
	},
	// …
	{
		"duration": 5,
		"stations": [
			{
				"type": "stop",
				"id": "108",
				"name": "Sievekingplatz",
				"location": { /* … */ },
				"products": { /* … */ }
			},
			// …
		]
	},
	// …
]
\`\`\`
`,
	'/stops/:id': `\
### Example

\`\`\`shell
curl 'https://v5.hvv.transport.rest/stops/163' -s | jq
\`\`\`

\`\`\`js
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
\`\`\`
`,
	'/stops/:id/departures': `\
### Example

\`\`\`shell
# at Dammtor (Messe/CCH), in direction Universität/Staatsbibliothek, 10 minutes
curl 'https://v5.hvv.transport.rest/stops/163/departures?direction=8868&duration=10' -s | jq
\`\`\`

\`\`\`js
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
\`\`\`
`,
	'/stops/:id/arrivals': `\
### Example

\`\`\`shell
# at Dammtor (Messe/CCH), 10 minutes
curl 'https://v5.hvv.transport.rest/stops/163/arrivals?duration=10' -s | jq
\`\`\`
`,
	'/journeys': `\
### Examples

\`\`\`shell
# stop/station to POI
curl 'https://v5.hvv.transport.rest/journeys?from=163&to.id=980001822&to.latitude=53.55525&to.longitude=10.00305' -s | jq
# without buses, with ticket info
curl 'https://v5.hvv.transport.rest/journeys?from=…&to=…&bus=false&tickets=true' -s | jq
\`\`\`
`,
	'/journeys/:ref': `\
### Example

\`\`\`shell
# get the refreshToken of a journey
journey=$(curl 'https://v5.hvv.transport.rest/journeys?from=…&to=…&results=1' -s | jq '.journeys[0]')
refresh_token=$(echo $journey | jq -r '.refreshToken')

# refresh the journey
curl "https://v5.hvv.transport.rest/journeys/$(echo $refresh_token | url-encode)" -s | jq
\`\`\`
`,
	'/trips/:id': `\
### Example

\`\`\`shell
# get the trip ID of a journey leg
journey=$(curl 'https://v5.hvv.transport.rest/journeys?from=…&to=…&results=1' -s | jq '.journeys[0]')
journey_leg=$(echo $journey | jq -r '.legs[0]')
trip_id=$(echo $journey_leg | jq -r '.tripId')

# fetch the trip
curl "https://v5.hvv.transport.rest/trips/$(echo $trip_id | url-encode)" -s | jq
\`\`\`
`,
	'/radar': `\
### Example

\`\`\`shell
bbox='north=53.555&west=9.989&south=53.55&east=10.001'
curl "https://v5.hvv.transport.rest/radar?$bbox&results=10" -s | jq
\`\`\`
`,
}

const {
	listOfRoutes,
	routes,
	tail,
} = generateApiDocs(api.routes)

const sortedRoutes = Object.entries(routes)
.sort(([routeA], [routeB]) => {
	const iA = order.indexOf(routeA)
	const iB = order.indexOf(routeB)
	if (iA >= 0 && iB >= 0) return iA - iB
	if (iA < 0 && iB >= 0) return 1
	if (iB < 0 && iA >= 0) return -1
	return 0
})

const write = process.stdout.write.bind(process.stdout)

write(HEAD)
write(`\n\n`)

write(listOfRoutes)
write(`\n\n`)

for (const [route, params] of sortedRoutes) {
	write(`## \`GET ${route}\`\n\n`)
	write(descriptions[route] || '')
	write(`
### Query Parameters
`)
	write(params)
	if (examples[route]) {
		write('\n' + examples[route])
	}
	write(`\n\n`)
}
// todo
write(tail)
