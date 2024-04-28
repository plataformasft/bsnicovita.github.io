//TODO (developer)
//const CLIENT_ID = '499567408107-o9sl47bigh8gh4qvh7t24ka3f5o5aa0m.apps.googleusercontent.com';
//const API_KEY = 'AIzaSyDRrFn-hHWBLyus2_K5WIk7n1AVh-gbdIo';

const CLIENT_ID = '499567408107-j8lpv48alc13dbnhp0m78uu40r5v0plg.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDRrFn-hHWBLyus2_K5WIk7n1AVh-gbdIo';


// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 
'https://sheets.googleapis.com/$discovery/rest?version=v4';
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//permiso que pide la aplicación para entrar a Google, spreadsheets permite comunicarnos con google sheets, permisos de la aplicación
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
//flags que comunica si gapi y gis ya arrancaron
let tokenClient;
let gapiInited = false;
let gisInited = false;

//Sin parentesis las funciones gapiLoaded y gisLoaded
document.getElementById("gapi").addEventListener("load", gapiLoaded);
document.getElementById("gis").addEventListener("load", gisLoaded);

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.display = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById('signout_button').style.display = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await getTurnos();
    actualizarTarjetas();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}



