const { createServer } = require('http')
const { parse } = require('url')
const { randomUUID } = require('crypto')
const next = require('next')

const CORRELATION_ID_HEADER = 'x-correlation-id'

const { config } = require('./.next/required-server-files.json')
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config)

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3001;
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const incomingCorrelationHeader = req.headers[CORRELATION_ID_HEADER]
    const incomingCorrelationId = Array.isArray(incomingCorrelationHeader)
      ? incomingCorrelationHeader[0]
      : incomingCorrelationHeader
    const correlationId = incomingCorrelationId || randomUUID()

    req.headers[CORRELATION_ID_HEADER] = correlationId
    res.setHeader(CORRELATION_ID_HEADER, correlationId)

    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})