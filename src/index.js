const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')
const Proxy = require('./proxy')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true, credentials: true }))

module.exports = function serve(
    host,
    port,
    targetHost,
    fixturesDir
) {
  const apiProxy = proxy(targetHost, {
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      const logic = new Proxy(fixturesDir, proxyRes, proxyResData, userReq)

      try {
        const fixture = logic.readFixture()
        if (fixture) {
          console.log(`fixture found: ${fixture.path}`)
          userRes.statusCode = fixture.status
          return fixture.body
        }
      } catch (e) {
        console.error(`cannot load fixture: ${e}. try request to proxy target.`)
      }

      if (proxyRes.statusCode < 300) {
        logic.createFixture()
      }

      return logic.originalResponse
    }
  })

  app.use(apiProxy)

  app.listen(port, host, () => {
    console.log(`APInterstellar listening on ${host}:${port}`)
  })
}
