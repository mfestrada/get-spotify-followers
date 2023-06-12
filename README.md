# get-spotify-followers

Script monitors a Spotify user endpoint for follower updates, while logging updates to the console.

*Update 05/03/2023:* It looks like the Spotify API has updated so that `followers.total` is now cached, so this needs to be reworked a little for better results. This cached value is displayed after each interval, instead of the current follower total. You can verify this by comparing the value reported by Spotify mobile clients to the one from the REST call made in the script.

## Environment Variables

The following environment variables are required for the script to run:

```javascript
process.env.CLIENT_ID
process.env.CLIENT_SECRET
process.env.SPOTIFY_USER_ENDPOINT
```

## Installation

To install with `npm`, run the following from the repo root: 

```shell
npm i
```

## Usage

To run the node script directly, ensure environment variables are defined in the current shell:

```shell
CLIENT_ID=<value> CLIENT_SECRET=<value> SPOTIFY_USER_ENDPOINT=<value> node main.js
```

