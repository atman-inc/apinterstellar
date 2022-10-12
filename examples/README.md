# APInterstellar example

Example for APInterstellar with [stoplightio/prism](https://github.com/stoplightio/prism).

## local node.js env

SEE: `package.json`

### requirement

- Node.js: >= 16.x
- [atman-inc/apinterstellar](https://github.com/atman-inc/apinterstellar)
  - `npm install atman-inc/apinterstellar`
  - or `yarn add atman-inc/apinterstellar`
- [stoplightio/prism](https://github.com/stoplightio/prism)
- OpenAPI Schema
  - ex. `openapi/petstore.yaml`

### Usage

```sh
# Start prism & APInterstellar
$ yarn run run-local

# Request some api
$ curl http://127.0.0.1:8001/pets

# Edit response
# ex. SEE fixtures/GET_pets.json
$ vim fixtures/GET_pets.json # edit some response body
# the response body modified with edited contents in next time
```
