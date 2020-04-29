'use strict'

const createHafas = require('hafas-client')
const hvvProfile = require('hafas-client/p/hvv')
const createHealthCheck = require('hafas-client-health-check')
const {createClient: createRedis} = require('redis')
const withCache = require('cached-hafas-client')
const redisStore = require('cached-hafas-client/stores/redis')
const createApi = require('hafas-rest-api')
const pkg = require('./package.json')

const hamburgHarburg = '3204'

let hafas = createHafas(hvvProfile, 'hvv-rest')
let healthCheck = createHealthCheck(hafas, hamburgHarburg)

if (process.env.REDIS_URL) {
	const redis = createRedis({
		url: process.env.REDIS_URL,
	})
	redis.on('error', (err) => {
		api.locals.logger.error(err)
	})
	hafas = withCache(hafas, redisStore(redis))

	const checkHafas = healthCheck
	const checkRedis = () => new Promise((resolve, reject) => {
		setTimeout(reject, 1000, new Error('didn\'t receive a PONG'))
		redis.ping((err, res) => {
			if (err) reject(err)
			else resolve(res === 'PONG')
		})
	})
	healthCheck = async () => (
		(await checkHafas()) === true &&
		(await checkRedis()) === true
	)
}

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/hvv-rest/blob/5/docs/readme.md',
	logging: true,
	aboutPage: true,
	etags: 'strong',
	healthCheck,
}

const api = createApi(hafas, config, () => {})

module.exports = {
	config,
	api,
}
