# get-spotify-followers

Script monitors a Spotify user endpoint for follower updates, while logging updates to the console.

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

