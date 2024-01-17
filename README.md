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

- [Express](https://expressjs.com/) - Web application framework.
- [Axios](https://github.com/axios/axios) - For making HTTP requests to the Spotify and MusicBrainz APIs.
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
