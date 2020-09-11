import log from '@fraserdarwent/javascript-logger'
import { pathToRegexp } from 'path-to-regexp'
import methods from './methods.js'

if (env.LOG_LEVEL) {
  log.setLevel(log.levels[env.LOG_LEVEL])
}

const apis = {
  health: pathToRegexp('/health'),
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': env.CORS,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': '*',
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

/**
 * @param {Request} request
 * @returns {Response}
 */
async function handleRequest(request) {
  try {
    const url = new URL(request.url)
    const path = url.pathname

    log.debug(`${path}`)

    switch (true) {
      case apis.health.test(path):
        return health(request)
      default:
        return json({ errors: [{ message: 'Page not found' }] }, 404)
    }
  } catch (error) {
    log.error(error)
    return json({ errors: [{ message: 'Internal server error' }] }, 500)
  }
}

/**
 * Construct a Response object from a JSON object and a status code
 * @param {Object} body
 * @param {Number} status
 * @returns {Response}
 */
function json(body = {}, status = 200) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: headers,
  })
}

/**
 * @param {Request} request
 * @returns {Response}
 */
function health(request) {
  switch (request.method) {
    case methods.get:
      return json({ status: 'pass' })
    case methods.options:
      return options()
    default:
      return json({ errors: [{ message: 'Method not allowed' }] }, 405)
  }
}
