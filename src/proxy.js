const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const getHash = (value) => {
  const md5 = crypto.createHash('md5')
  md5.update(value)
  return md5.digest('hex')
}

class Proxy {
  constructor(
    fixtureDir,
    proxyRes,
    proxyResData,
    userReq
  ) {
    this.fixtureDir = fixtureDir
    this.proxyRes = proxyRes
    this.proxyResData = proxyResData
    this.userReq = userReq
  }

  get fixturePath() {
    const method = this.userReq.method
    const url = this.userReq.url.replace(/\//g, '_')
    return path.join(this.fixtureDir, `${method}${url}.json`)
  }

  get originalResponse() {
    return this.proxyResData.toString()
  }

  readFixture() {
    const data = fs.readFileSync(this.fixturePath, 'utf8')
    const fixture = JSON.parse(data)
    const originalHash = getHash(this.originalResponse)

    if (fixture.original_hash !== originalHash) {
      throw new Error('mismatch response hash. try to recreate fixture')
    }

    return {
      path: this.fixturePath,
      status: fixture.status,
      body: fixture.body,
      originalHash: originalHash
    }
  }

  createFixture() {
    let body = ''
    try {
      body = JSON.parse(this.originalResponse)
    } catch(e) {
      // NOP
    }
    fs.writeFileSync(
      this.fixturePath,
      JSON.stringify(
        {
          status: this.proxyRes.statusCode,
          body: body,
          original_hash: getHash(this.originalResponse)
        },
        null,
        4
      )
    )
    console.log(`store fixture to ${this.fixturePath}`)
  }
}

module.exports = Proxy