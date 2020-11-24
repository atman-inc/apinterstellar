import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'
import * as crypto from 'crypto'

const getHash = (value) => {
  const md5 = crypto.createHash('md5')
  md5.update(value)
  return md5.digest('hex')
}

type Fixture = {
  path: string
  status: number
  body: any
  originalHash: string
}

export class Proxy {
  constructor(
    private fixtureDir: string,
    private proxyRes: express.Response,
    private proxyResData: any,
    private userReq: express.Request
  ) {
  }

  private get fixturePath() {
    const method = this.userReq.method
    const url = this.userReq.url.replace(/\//g, '_')
    return path.join(this.fixtureDir, `${method}${url}.json`)
  }

  public get originalResponse() {
    return this.proxyResData.toString()
  }

  public readFixture(): Fixture {
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

  public createFixture() {
    fs.writeFileSync(
      this.fixturePath,
      JSON.stringify(
        {
          status: this.proxyRes.statusCode,
          body: JSON.parse(this.originalResponse),
          original_hash: getHash(this.originalResponse)
        },
        null,
        4
      )
    )
    console.log(`store fixture to ${this.fixturePath}`)
  }
}
