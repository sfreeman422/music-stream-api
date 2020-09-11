import * as fs from 'fs';
import * as readline from 'readline';
import { google } from 'googleapis';
import { Credentials, OAuth2Client } from 'google-auth-library';

const OAuth2 = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const TOKEN_DIR = process.env.TOKEN_DIR;
const TOKEN_PATH = process.env.TOKEN_PATH;
export class YouTubeService {
  public async searchYoutube(searchTerm: string) {
    // This function should kick off the google BS behind the scenes. This should be the only public function.
    return await this.search(searchTerm);
  }

  private search(searchTerm: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(TOKEN_PATH as string, async (err, content) => {
        if (err) {
          reject(err);
        } else {
          return await this.authorize(JSON.parse(content.toString()), this.makeYouTubeCall, searchTerm)
            .then(result => resolve(result))
            .catch(e => reject(e));
        }
      });
    });
  }

  private async authorize(credentials: any, callback: (client: OAuth2Client, term: string) => any, searchTerm: string) {
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    return new Promise((resolve, _reject) => {
      fs.readFile(TOKEN_PATH as string, async (err, token) => {
        if (err) {
          resolve(await this.getNewToken(oauth2Client, callback, searchTerm));
        } else {
          oauth2Client.credentials = JSON.parse(token.toString());
          resolve(await callback(oauth2Client, searchTerm));
        }
      });
    });
  }

  private async getNewToken(
    oauth2Client: OAuth2Client,
    callback: (client: any, term: string) => any,
    searchTerm: string,
  ) {
    return new Promise((resolve, reject) => {
      const authUrl = oauth2Client.generateAuthUrl({
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url: ', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', code => {
        rl.close();
        oauth2Client.getToken(code, async (err, token) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            reject(err);
            return;
          }
          oauth2Client.credentials = token as Credentials;
          await this.storeToken(token as Credentials);
          resolve(await callback(oauth2Client, searchTerm));
        });
      });
    });
  }

  private storeToken(token: Credentials) {
    return new Promise((resolve, reject) => {
      try {
        fs.mkdirSync(TOKEN_DIR as string);
      } catch (err) {
        if (err.code != 'EEXIST') {
          reject(err);
        }
      }
      fs.writeFile(TOKEN_PATH as string, JSON.stringify(token), err => {
        if (err) reject(err);
        console.log('Token stored to ' + TOKEN_PATH);
        resolve();
      });
    });
  }

  private makeYouTubeCall(auth: OAuth2Client, searchTerm: string) {
    return new Promise((resolve, reject) => {
      const service = google.youtube('v3');
      service.search.list(
        {
          auth,
          part: ['snippet'],
          maxResults: 25,
          q: searchTerm,
          key: process.env.YOUTUBE_API_KEY,
        },
        (err, response) => {
          if (err) reject(err);
          if (response) {
            console.log(response);
            resolve(response.data);
          }
        },
      );
    });
  }
}
