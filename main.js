const fetch = require('node-fetch')
const client_id = (process.env.CLIENT_ID) ? process.env.CLIENT_ID : undefined
const client_secret = (process.env.CLIENT_SECRET) ? process.env.CLIENT_SECRET : undefined
const spotify_user_endpoint = (process.env.SPOTIFY_USER_ENDPOINT) ? process.env.SPOTIFY_USER_ENDPOINT : undefined

if (!process.env.CLIENT_ID | !process.env.CLIENT_SECRET | !process.env.SPOTIFY_USER_ENDPOINT) {
  process.exit(1)
}

console.log(`CLIENT_ID: ${client_id}`);
console.log(`CLIENT_SECRET: ${client_secret}`);
console.log(`SPOTIFY_USER_ENDPOINT: ${spotify_user_endpoint}`);

// run script
(async () => {
  await main(client_id, client_secret, spotify_user_endpoint)
})();

async function main(client_id, client_secret, spotify_user_url) {
  let token = await getAccessToken(client_id, client_secret)
  let user = await getUser(token, spotify_user_url)
  await getFollowerTotal({
    access_token: token,
    url: spotify_user_url,
    user, user
  })
}

async function getAccessToken(client_id, client_secret) {
  let data = await fetch("https://accounts.spotify.com/api/token?grant_type=client_credentials", {
    method: 'POST',
    headers: {
      'Authorization' : 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    }
  })
  return (await data.json()).access_token
}

async function getData(access_token, url) {
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization' : 'Bearer ' + access_token
    }
  })
}

async function getUser(access_token, url) {
  let resp = await getData(access_token, url)
  let data = {...(await resp.json())}
  return data
}

async function getFollowerTotal(x) {
  let latest = await getUser(x.access_token, x.url)
  console.log(`INFO: refreshing... highest: ${x.user.followers.total}, current: ${latest.followers.total}`)

  if (latest.followers.total <= x.user.followers.total) {
    await getFollowerTotal(x)
  } else {
    console.log(`ADDED: new follower total: ${latest.followers.total}`)
    x.user = latest
    await getFollowerTotal(x)
  }
}
