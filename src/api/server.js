import { Server } from 'miragejs'

new Server({
  routes() {
    this.post('/api/check_length', (schema, request) => {
      const { code } = JSON.parse(request.requestBody)
      return { status: code.length < 1024 ? 'ok' : 'Error! The code is greater than 1024 bytes' }
    })
  }
})
