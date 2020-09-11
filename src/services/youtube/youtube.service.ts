import * as ytsearch from 'youtube-search';

export class YouTubeService {
  public async searchYouTube(searchTerm: string) {
    const options: ytsearch.YouTubeSearchOptions = {
      maxResults: 25,
      key: process.env.YOUTUBE_API_KEY,
    };
    return await new Promise((resolve, reject) => {
      ytsearch.default(searchTerm, options, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  //   public async searchYoutube(searchTerm: string) {
  //     // Load client secrets from a local file.
  //     const content = await readFileContent(TOKEN_PATH as string).then(result => result.toString());
  //     return await this.authorize(JSON.parse(content), this.searchListByKeyword, searchTerm);
  //   }

  //   private searchListByKeyword(auth: any) {
  //     const service = google.youtube('v3');
  //     return new Promise((resolve, reject) => {
  //       service.search.list(
  //         {
  //           auth,
  //           part: ['snippet'],
  //           type: ['video'],
  //         },
  //         (err: any, response: any) => {
  //           if (err) {
  //             console.log(`The API returned an error: ${err}`);
  //             reject(err);
  //           } else {
  //             resolve(response.items);
  //           }
  //         },
  //       );
  //     });
  //   }
}
