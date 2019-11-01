# Why use this API?

The public transport agency *Hamburger Verkehrsverbund* (HVV) itself provides an API (this API wraps around it). Why use this one? (And what could HVV do better?)

## No API Key

Especially on web sites/apps, it isn't feasable to the send API keys to the client. Also, you have to obtain these keys manually and cannot automatically revoke them. **This API doesn't require a key.**

## CORS

If you want to use transport information on a web site/app, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) must be enabled. Otherwise, you would have to send all requests through your own proxy server. **This API has CORS enabled.**

## Sane Markup

Compare the official API:

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

## HTTP/2

[HTTP/2](https://http2.github.io/) allows multiple requests at a time, efficiently pipelines sequential requests and compresses headers. See [Cloudflare's HTTP/2 page](https://blog.cloudflare.com/http-2-for-web-developers/).

## Proper HTTP, Proper REST

All methods in this API comply with the [REST principles](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) and use proper [HTTP methods](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html).
