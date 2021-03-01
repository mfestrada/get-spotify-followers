const fetch = require('node-fetch')
const chalk = require('chalk')
const client_id = (process.env.CLIENT_ID) ? process.env.CLIENT_ID : undefined
const client_secret = (process.env.CLIENT_SECRET) ? process.env.CLIENT_SECRET : undefined
const spotify_user_endpoint = (process.env.SPOTIFY_USER_ENDPOINT) ? process.env.SPOTIFY_USER_ENDPOINT : undefined
let TOKEN, USER

if (!process.env.CLIENT_ID | !process.env.CLIENT_SECRET | !process.env.SPOTIFY_USER_ENDPOINT) {
  console.error(chalk.redBright('ERROR! CLIENT_ID, CLIENT_SECRET or SPOTIFY_USER_ENDPOINT are not set!'));
  process.exit(2);
}

console.log(chalk.cyan(`CLIENT_ID: ${client_id}\nCLIENT_SECRET: ${client_secret}\nSPOTIFY_USER_ENDPOINT: ${spotify_user_endpoint}`));

// run script
(async () => {
  try {
    await main(spotify_user_endpoint);
  } catch (e) {
    console.error(e);
    process.exit(99);
  }
})()

async function main(spotify_user_url) {
  TOKEN = await getAccessToken();
  USER = await getUser(TOKEN, spotify_user_url);
  console.info(chalk.grey(`INFO : ${new Date(new Date().getTime())} : session start total: ${USER.followers.total}`));

  setInterval(async () => {
    TOKEN = await getAccessToken();
    await getFollowerTotal({
      access_token: TOKEN,
      url: spotify_user_url
    });
  }, 30000);
}

async function getAccessToken() {
  let data = await fetch("https://accounts.spotify.com/api/token?grant_type=client_credentials", {
    method: 'POST',
    headers: {
      'Authorization' : 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    }
  });
  return (await data.json()).access_token;
}

async function getData(access_token, url) {
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization' : 'Bearer ' + access_token
    }
  });
}

async function getUser(access_token, url) {
  let resp = await getData(access_token, url);
  let data = {...(await resp.json())};
  return data;
}

async function getFollowerTotal(x) {
  let latest = await getUser(x.access_token, x.url);
  if (USER.followers.total < latest.followers.total) {
    USER = latest;
    console.log(chalk.green(`ADDED : ${getLogString()}`));
  }
  if (USER.followers.total > latest.followers.total) {
    USER = latest;
    console.log(chalk.red(`REMOVED : ${getLogString()}`));
  }
}

function getLogString() {
  return `${new Date(new Date().getTime())} : ${USER.followers.total}`;
}
