'use strict'

const createHafas = require('hafas-client')
const hvvProfile = require('hafas-client/p/hvv')
const {createClient: createRedis} = require('redis')
const withCache = require('cached-hafas-client')
const redisStore = require('cached-hafas-client/stores/redis')
const createHealthCheck = require('hafas-client-health-check')
const createApi = require('hafas-rest-api')
const pkg = require('./package.json')

const hamburgHarburg = '3204'

const hafas = createHafas(hvvProfile, 'hvv-rest')
const checkHafas = createHealthCheck(hafas, hamburgHarburg)

const redis = createRedis()
const checkRedis = () => new Promise((resolve, reject) => {
	setTimeout(reject, 1000, new Error('didn\'t receive a PONG'))
	redis.ping((err, res) => {
		if (err) reject(err)
		else resolve(res === 'PONG')
	})
})

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
	healthCheck: async () => (
		(await checkHafas()) === true &&
		(await checkRedis()) === true
	),
}

const client = withCache(hafas, redisStore(redis))
const api = createApi(client, config, () => {})

redis.on('error', (err) => {
	api.locals.logger.error(err)
})

api.listen(config.port, (err) => {
	const {logger} = api.locals
	if (err) {
		logger.error(err)
		process.exit(1)
	}
	logger.info(`Listening on ${config.hostname}:${config.port}.`)
})
