// Wrapper around fetch(); source: https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

export async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  const config = {
    method: 'POST',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers
    }
  }

  config.body = JSON.stringify(body)

  let data
  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if ( response.ok ) {
      return data
    }
    console.error(response.statusText)
  } catch ( err ) {
    return Promise.reject(err.message ? err.message : data)
  }
}

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}