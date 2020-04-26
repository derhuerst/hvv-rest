# Why use this API?

The public transport agency [*Hamburger Verkehrsverbund* (HVV) itself provides an API called *HAFAS*](https://github.com/public-transport/hafas-client/blob/e02a20b1de59bda3cd380445b6105e4c46036636/p/hvv/readme.md), this API wraps it. Why use this one? (And what could HVV do better?)

## No API Key

The underlying HAFAS API has been designed to be *private*: It has only 1 static API key, which is valid for an unlimited time, and which can't easily be revoked/renewed. **This API doesn't require a key.**

## CORS

If you want to use transport information on a web site/app, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) must be enabled. Otherwise, you would have to send all requests through your own proxy server. **This API has CORS enabled**, the underyling HAFAS API does not.

## Readable Markup

Compare the underlying HAFAS API:

```js
{
	common: {
		locL: [{
			lid: 'A=1@O=Gänsemarkt (Oper)@X=9986458@Y=53555609@U=80@L=16309@',
			type: 'S',
			name: 'Gänsemarkt (Oper)',
			icoX: 2,
			extId: '16309',
			state: 'F',
			crd: {
				x: 9986036,
				y: 53555600,
				type: 'WGS84',
				layerX: 0,
				crdSysX: 0
			},
			pCls: 385,
			pRefL: [
				1,
				2,
				3
			],
			entry: true,
			mMastLocX: 1
		}, {
			lid: 'A=1@O=Gänsemarkt (Oper)@X=9986036@Y=53555600@U=80@L=158@',
			type: 'S',
			name: 'Gänsemarkt (Oper)',
			icoX: 2,
			extId: '158',
			state: 'F',
			crd: {
				x: 9986036,
				y: 53555600,
				type: 'WGS84',
				layerX: 0,
				crdSysX: 0
			},
			pCls: 385,
			pRefL: [
				1,
				2,
				3
			]
		}],
		prodL: [{
			pid: 'L::0::U-Bahn::B3568271370::HHA-U#U2::*',
			name: 'U2',
			nameS: 'U2',
			number: 'U2',
			icoX: 0,
			cls: 1,
			oprX: 0,
			prodCtx: {
				name: '      U2',
				num: '97296',
				line: 'U2',
				lineId: 'HHA-U#U2',
				matchId: 'U2',
				catOut: 'U-Bahn  ',
				catOutS: 'U',
				catOutL: 'U-Bahn',
				catIn: 'U',
				catCode: '0',
				admin: 'HHA-U_'
			}
		}],
		opL: [{
			name: 'HOCHBAHN - U-Bahn',
			icoX: 1,
			id: '1HHA-U'
		}]
	},
	type: 'DEP',
	jnyL: [{
		jid: '1|27069|25|80|1112019',
		date: '20191101',
		prodX: 0,
		dirTxt: 'Mümmelmannsberg',
		status: 'P',
		isRchbl: true,
		stbStop: {
			locX: 0,
			idx: 12,
			dProdX: 0,
			dInR: true,
			dTimeS: '175100',
			dTimeR: '175100',
			dProgType: 'PROGNOSED',
			type: 'N'
		}
	}]
}
```

to this one:

```js
{
	tripId: '1|27069|25|80|1112019',
	line: {
		type: 'line',
		id: 'hha-u-u2',
		fahrtNr: '97296',
		name: 'U2',
		public: true,
		mode: 'train',
		product: 'subway',
		operator: {
			type: 'operator',
			id: 'hochbahn-u-bahn',
			name: 'HOCHBAHN - U-Bahn'
		}
	},
	stop: {
		type: 'stop',
		id: '16309',
		name: 'Gänsemarkt (Oper)',
		location: {
			type: 'location',
			id: '16309',
			latitude: 53.5556,
			longitude: 9.986036
		},
		products: {
			subway: true,
			suburban: false,
			// …
		},
		station: {
			type: 'station',
			id: '158',
			name: 'Gänsemarkt (Oper)',
			location: { /* … */ }
		}
	},
	when: '2019-11-01T17:51:00+01:00',
	delay: 0,
	direction: 'Mümmelmannsberg',
	platform: null
}
```

## Caching-friendly

This API sends [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) & [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) headers, allowing clients to refresh their state efficiently.

## HTTP/2

[HTTP/2](https://http2.github.io/) allows multiple requests at a time, efficiently pipelines sequential requests and compresses headers. See [Cloudflare's HTTP/2 page](https://blog.cloudflare.com/http-2-for-web-developers/).

## Proper HTTP, Proper REST

This wrapper API follows [REST-ful design principles](https://restfulapi.net), it uses `GET`, and proper paths & headers.
