'use strict'

const {readFileSync} = require('fs')
const {join} = require('path')
const createHafas = require('hafas-client')
const hvvProfile = require('hafas-client/p/hvv')
const createApi = require('hafas-rest-api')
const createHealthCheck = require('hafas-client-health-check')
const pkg = require('./package.json')

const hamburgHarburg = '3204'

const docsAsMarkdown = readFileSync(join(__dirname, 'docs', 'index.md'), {encoding: 'utf8'})

const hafas = createHafas(hvvProfile, 'hvv-rest')

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: '/docs',
	logging: true,
	aboutPage: true,
	docsAsMarkdown,
	healthCheck: createHealthCheck(hafas, hamburgHarburg)
}

const api = createApi(hafas, config, () => {})

api.listen(config.port, (err) => {
	const {logger} = api.locals
	if (err) {
		logger.error(err)
		process.exit(1)
	}
	logger.info(`Listening on ${config.hostname}:${config.port}.`)
})
