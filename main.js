const fetch = require('node-fetch')
const client_id = (process.env.CLIENT_ID) ? process.env.CLIENT_ID : undefined
const client_secret = (process.env.CLIENT_SECRET) ? process.env.CLIENT_SECRET : undefined
const spotify_user_endpoint = (process.env.SPOTIFY_USER_ENDPOINT) ? process.env.SPOTIFY_USER_ENDPOINT : undefined

if (!process.env.CLIENT_ID | !process.env.CLIENT_SECRET | !process.env.SPOTIFY_USER_ENDPOINT) {
  console.error("ERROR! $CLIENT_ID, $CLIENT_SECRET and $SPOTIFY_USER_ENDPOINT are not set!")
  process.exit(2)
}

console.log(`CLIENT_ID: ${client_id}`);
console.log(`CLIENT_SECRET: ${client_secret}`);
console.log(`SPOTIFY_USER_ENDPOINT: ${spotify_user_endpoint}`);

// run script
(async () => {
  try {
    await main(spotify_user_endpoint)
  } catch (e) {
    console.error(e)
    process.exit(99)
  }
})();

async function main(spotify_user_url) {
  setInterval(async () => {
    let token = await getAccessToken(client_id, client_secret)
    let user = await getUser(token, spotify_user_url)
    await getFollowerTotal({
      access_token: token,
      url: spotify_user_url,
      user: user
    })
  }, 30000)
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
  let user = await getUser(x.access_token, x.url)
  console.log(`INFO: follower total: ${x.user.followers.total}`);
}
