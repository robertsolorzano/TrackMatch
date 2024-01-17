# Track Match <img src="https://www.trackmatch.net/assets/images/FullLogo_Transparent_NoBuffer.png" width="25" alt="Track Match Icon">

Track-Match is a dynamic web application built with Node.js and Express, designed to enhance music discovery. It integrates with the Spotify API and MusicBrainz API, offering users a comprehensive music search experience. Hosted on Heroku, it provides a reliable and scalable platform for music enthusiasts.

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

Visit [Track Match](https://www.trackmatch.net/) for more information and to experience the application.

<img src="https://previews.dropbox.com/p/thumb/ACJZcrl8KX8_m4kpkLxtMed-vnlt903Xx1LKmFpgJUDhah409XqENwXGdpakaj3AZxHMTSaldopnMLBeOQfEArrQpr2vBP6Vjk958XIRbgv2idEOw8XjdfAiuvfCXhXXOqeoGXrk5bQ6iapNFDlEnCm-152PEDXlFCTAEdYUNQDfG_g7mt4mI1667glwBZYvcWwdVdTR2VlC7-7YXbmwBxRg993neASdoM9JoQjChSYvDm8yKnDrY2ANYCsbUmm3466fdwQ-equucQ7hc5TfI79EHVU-sx8va2XsHMldSVcMFJRXsf_w2H4Q0Ew5gfsaiyXzWsDEplsXgjsVwkHFmX0mX481uWPXjtyE9fZBE9CpDNmgibhkRUUh3qFmUMSVdp5nZlpGXLtSQkogroM8Msl0dXpN1MhinUAcDBaUITEhdj84d4OxDGvdF835nqT_L5dl7hxoFfu1-QX9chf9LE-pw_oOlPxdTQW-fOAt3GuSCRftIIjcntlnC6XbhQj_r_c_i1mNXJ1rgBbUMNeSwPxEFsU93Kzq9t6JK2GpJUDK-mq7EVcdrZ5W17RI_o0iabwROMNx8mW9hkQdTPceOgnTOUp7T8E5okjCboKQtXCLyj_qHM-TYpFM48sJDaFAcSxrvYcmZtYTM31ooaA8Lc_oYnoObqYFxcS6yXpbObJk4NrzUtmTOCGt8IJ3jhlAPJ0s__fFkm-KuyYJbntl1TlpaFQZilnw0j-wb1D5ObtRdM2q2pKV4ujdjLiHdSWP36V37F2srH2gGIiNncCzWkEVRGJ9ySWpjUfGpsI4_Cbv1N3qzuhXwXAOkLpuP41ulW64lumqT-FV0X0_3kvhECcBYEroX3FgUCqa_mqcmWWLRwR9AKBFQOmR2VI8NRsH6_ba-ESGkF6L85or4ijpAcH_2iOfXQkBMgr8JzgxbGmx1sfJUxRb9d1PDV4FJh4WNM6HesU8zoCayQ-dXKsx8Ae-DTeoWs7p9_VbzVYPgFjz0W_RWGiqZQfZI9geFhhD_QGkPkbMcrpN2mNnzjk1X9zllImz5oQgD9wPa_aJm-hIviNS3oNBixI1Hv94FLL2Cch1z7q3mIOcUmtcWaix_f_M9SXk6aFLjqzyTYb62WWfQR0S0ZyRyI536vhK6wKqACBq1trNOjcJ_ZzVQL6MHU6yleM5MsNzRy_PMyY8KXCLM2WCRPr8oIpsAmBUt0fH-kmFZdUZuR2vbBGdc8LGXutZWfdIoBcpDoSCS23UpHTNe8LEEVe-axvwCTA5Fr0YOMttCLpuAqRYp7yAtPFWSxECNS1X3E6pAP3DmWofjlVtdnlN-0efkkQw5ZDNrT5tbl8YHy13rOxM9NQRLpIHjUDahc4wAQIJODadXuGFHpG1y6u6EqRNKgkmXMxZcEzE5d9T5QZ6gUQnp_heyJ8ml1O1/p.gif">


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
