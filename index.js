const path = require('path')
const commander = require('commander')
const package = require('./package.json')
require('ts-node').register()

const pm = commander.version(package.version)

pm.command('start')
  .option('-p, --port <port>', 'port for using by proxy app', '8001')
  .option('-h, --host <host>', 'host for using by proxy app ', '0.0.0.0')
  .option('-t, --target <target_host>', 'host for request target')
  .option('-f, --fixture_dir <fixture_dir>', 'fixture dump dir', './fixtures')
  .action((cmd) => {
    const fd = path.resolve(cmd.fixture_dir)
    require('./src/index.ts').default(
        cmd.host,
        parseInt(cmd.port),
        cmd.target,
        fd
    )
  })

pm.parse(process.argv)
