# Track Match <img src="https://www.trackmatch.net/assets/images/FullLogo_Transparent_NoBuffer.png" width="25" alt="Track Match Icon">

Track-Match is a dynamic web application built with Node.js and Express, designed to enhance music discovery. It integrates with the Spotify API and MusicBrainz API, offering users a comprehensive music search experience. Hosted on Heroku, it provides a reliable and scalable platform for music enthusiasts.

![Preview](/public/assets/images/preview.png)

## Features

- **Song Search**: Users can search for songs by entering both the artist and song name.
- **Spotify Integration**: Displays search results directly from Spotify.
- **MusicBrainz Integration**: Utilizes MusicBrainz API for extended music data.
- **User Feedback**: Provides clear feedback during the search process, including error handling.
- **Dynamic Content Management**: Automatically hides the 'My Saved Songs' section during searches and clears previous results for new searches.

## How to Use

1. **Start a Search**: Enter the artist and song name in the search bar.
2. **Initiate Search**: Click the 'Search' button.
3. **View Results**: The application displays search results or an error message if the search fails.

## Getting Started

### Prerequisites

- **Node.js**: Required as the runtime environment.
- **Express.js**: Used as the web application framework.
- **Spotify Developer Account**: Necessary for API access.
- **MusicBrainz API**: For accessing additional music data.

### Installation

1. **Clone the Repository**: `git clone [repository-url]`
2. **Install Dependencies**: Run `npm install` in the project directory.
3. **Environment Variables**: Set up `.env` with your Spotify API credentials (`SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`).
4. **Start the Application**: Execute `npm start` to run the server.

## Website

Visit [Track Match](https://www.trackmatch.net/) <img src="https://www.trackmatch.net/assets/images/FullLogo_Transparent_NoBuffer.png" width="12" alt="Track Match Icon"> for more information and to experience the application.

- Deployed on [Heroku](https://www.heroku.com/), ensuring efficient management and scalability.

## Dependencies

- [Express](https://expressjs.com/) <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEX////q6uqgoaEZGhtzc3SSk5Ourq5hYmLHx8f09PVOTk+7u7vf39+DhITT09M3ODgiPZ4kAAAAxElEQVR4Ac2OMQgBARSGv6sDQfbSKaWsHsgV6vZS9lK3F9lL2ctsvcmm7GWfyF5XNhvTbef+yT7x1ft7/f3/6/HHOC3r1gnmQLhGamYjDj5U7ALk7UbD4tp4T2EA4EnDFeGMxQygdQWqEwp+OQsBkXrlAU76nAA4Y2mlB2drotVMDMHN5mtMwbMYVeQjNsEKkaJcm3wv10fcl4Dr8zgSnQB2L/RYKdrKA3LW0etun6yFCMwsyTK6qzrFu733xbQOeAk/4gMf6S1GJRc9sQAAAABJRU5ErkJggg==" width="12" alt="Track Match Icon">  - Web application framework.
- [Axios](https://github.com/axios/axios)<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABIElEQVR4Ae2XAUcEQRiGB3B/JQH0CxJgAYIqEAg5BBApAkEciCCIiMISEhKCIKSqqLrNce3oLtVqttknRosssLu+gX34ALyPmRm+V+UACgiAENDUjwbCvwz1D6AF7CKGy2rl4aoQLifhBAL8ESggxB+hquPBZRaebwwl0IqKDGLL6uwr22sDylBZ4OI0YWokkhc42vmge2fkBVKTsbX85kIfr4QFhrFlZabvAsUFHi4NC+M9FyYuYC2cHX5xsv/pZmmyLylQZKOtG4FGoBEoCLQneqzPx272OkOsFRbIp7Oo+U4y+ROYHo042HyHzMMVzI29cH6c+HkDT9eG7q0B8COQIy3gvt1PSmVKLaXRfUpNaO9rufdi4rua+S+n3uv5LxoSNklgIWvnAAAAAElFTkSuQmCC" width="12" alt="Track Match Icon"> - For making HTTP requests to the Spotify and MusicBrainz APIs.
- [dotenv](https://www.npmjs.com/package/dotenv) - To manage environment variables.

## Contributing

We encourage community contributions to Track-Match. Please fork the repository, make your changes, and create a pull request for review.

## Credits

- Thanks to [Essentia.js](https://essentia.upf.edu/documentation/essentiajs.html) for providing open source code utilized in this project.
- Utilizes the [Spotify API](https://developer.spotify.com/documentation/web-api/) and [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API) for music data.

## License

This project is licensed under the MIT License

## Acknowledgments

- Thanks to the Spotify API for enabling music data access.
- Appreciation to all users of the application.
