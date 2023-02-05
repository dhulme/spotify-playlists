import SpotifyWebApi from "spotify-web-api-js";

const stateKey = "spotify_auth_state";
const expiresKey = "spotify_auth_expires";
const accessTokenKey = "spotify_auth_access_token";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  const hashParams: any = {};
  let e: any = {};
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export const spotifyApi = new SpotifyWebApi();

function logIn() {
  const clientId = "3c23979b56a64f6f85b522bf9151edd4";
  const redirectUri = location.origin + location.pathname;

  const state = generateRandomString(16);

  localStorage.setItem(stateKey, state);
  const scope =
    "user-read-private user-read-email playlist-modify-private playlist-modify-public playlist-read-private";

  let url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += `&client_id=${encodeURIComponent(clientId)}`;
  url += `&scope=${encodeURIComponent(scope)}`;
  url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  url += `&state=${encodeURIComponent(state)}`;

  window.location.href = url;
}

export function logOut() {
  localStorage.clear();
}

export async function initToken() {
  const params = getHashParams();

  if (params.state && localStorage.getItem(stateKey) !== params.state) {
    throw new Error("State key check failed");
  }

  const accessToken = localStorage.getItem(accessTokenKey);
  const expires = Number(localStorage.getItem(expiresKey));

  // If new token fetched
  if (params.access_token) {
    history.pushState(null, "", location.pathname);
    localStorage.setItem(accessTokenKey, params.access_token);
    spotifyApi.setAccessToken(params.access_token);
    localStorage.setItem(
      expiresKey,
      String((params.expires_in as number) * 1000 + Date.now())
    );
    return;
  }

  if (!accessToken || Date.now() > expires) {
    logIn();
  }

  spotifyApi.setAccessToken(accessToken);
}

export type PlaylistTrack = {
  is_local: boolean;
  track: {
    name: string;
    id: string;
    album: {
      name: string;
      images: {
        url: string;
      }[];
      artists: {
        name: string;
      }[]
    };
    artists: {
      name: string;
      id: string;
    }[];
    external_urls: {
      spotify: string;
    };
    uri: string;
    is_playable: boolean;
  };
  added_at: string;
  position: number;
};

export type Playlist = {
  tracks: {
    total: number;
  };
  id: string;
  name: string;
}