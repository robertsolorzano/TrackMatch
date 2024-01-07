const express = require('express');
const path = require('path');
const axios = require('axios');
const Bottleneck = require('bottleneck');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();


// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(bodyParser.json()); // Use body-parser to parse JSON bodies

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let globalAccessToken;
let tokenExpirationTime;
let totalSpotifyRequests = 0; // Counter for total Spotify API requests

// Initialize data storage
const createDataStorage = () => {
    let lastAnalysisData = null;
    let lastRelativeData = null;
    let lastAnalysisDataNewTempo = null;
    let lastRelativeDataNewTempo = null;

// Function to update analysis data
const updateData = (analysis, relative, analysisModTempo, relativeModTempo) => {

    lastAnalysisData = {
        bpm: parseFloat(analysis.bpm),
        key: parseInt(analysis.key),
        scale: parseInt(analysis.scale)
    };
    lastRelativeData = {
        bpm: parseFloat(relative.bpm),
        key: parseInt(relative.key),
        scale: parseInt(relative.scale)
    };
    lastAnalysisDataNewTempo = {
        bpm: parseFloat(analysisModTempo.bpm),
        key: parseInt(analysisModTempo.key),
        scale: parseInt(analysisModTempo.scale)
    };
    lastRelativeDataNewTempo = {
        bpm: parseFloat(relativeModTempo.bpm),
        key: parseInt(relativeModTempo.key),
        scale: parseInt(relativeModTempo.scale)
    };

    console.log('Updated data with lastAnalysisData:', lastAnalysisData);
    console.log('Updated data with lastRelativeData:', lastRelativeData);
    console.log('Updated data with lastAnalysisDataModTempo:', lastAnalysisDataNewTempo);
    console.log('Updated data with lastRelativeDataModTempo:', lastRelativeDataNewTempo);
};


    // Function to get analysis data
    const getData = () => {
        return {
            analysis: lastAnalysisData,
            relative: lastRelativeData,
            analysisModTempo: lastAnalysisDataNewTempo,
            relativeModTempo: lastRelativeDataNewTempo
        };
    };

    return { updateData, getData };
};


const dataStorage = createDataStorage(); // Create an instance to manage data

async function getAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID; // use environment variable
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // use environment variable

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            grant_type: 'client_credentials'
        }
    };

    try {
        const response = await axios(authOptions);
        totalSpotifyRequests++;
        globalAccessToken = response.data.access_token;
        tokenExpirationTime = Date.now() + (response.data.expires_in - 120) * 1000;
        console.log('Access Token:', globalAccessToken);
        console.log('Token Expiry Time:', new Date(tokenExpirationTime).toLocaleString());
    } catch (error) {
        console.error('Error fetching access token:', error.message);
    }
}

async function getRecommendedTracks(seedTracks) {
    const queryOptions = {
        url: 'https://api.spotify.com/v1/recommendations',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + globalAccessToken
        },
        params: {
            seed_tracks: seedTracks.join(','),
            limit: 100,
            min_energy: 0.1,
            min_popularity: 10
        }
    };

    try {
        const response = await axios(queryOptions);
        console.log('Initial Seed Recommendation Count:', response.data.tracks.length);
        totalSpotifyRequests++;
        return response.data.tracks;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            const retryAfter = parseInt(error.response.headers['retry-after'], 10);
            console.log(`Rate limit exceeded, retrying after ${retryAfter} seconds.`);
            await new Promise(resolve => setTimeout(resolve, (retryAfter + 1) * 1000));
            // After waiting, call the function again to retry
            return getRecommendedTracks(seedTracks);
        } else {
            console.error('Error querying Spotify API for recommended tracks:', error.message);
            throw error;
        }
    }
}

// Create a rate limiter instance with the desired settings (1 request per second)
const limiter = new Bottleneck({
    maxConcurrent: 1,               // Maximum number of concurrent requests
    minTime: 300,                   // Minimum time (in milliseconds) between requests
    highWater: 100,                 // Maximum number of queued requests
    strategy: Bottleneck.strategy.LEAK, // Strategy for handling excess requests
});


app.get('/get-songs', async function (req, res) {
    console.log('GET /get-songs endpoint hit'); // Log endpoint hit
    if (!globalAccessToken || Date.now() > tokenExpirationTime) {
        await getAccessToken();
        if (!globalAccessToken) {
            res.status(500).send({ error: 'Unable to obtain access token' });
            return;
        }
    }

    const songName = req.query.songName;
    const artist = req.query.artist;
    
    const searchQuery = `${songName} artist:${artist}`;
    console.log('Search Query:', searchQuery); // Log search query
    
    const searchOptions = {
        url: `https://api.spotify.com/v1/search`,
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + globalAccessToken
        },
        params: {
            q: searchQuery,
            type: 'track',
            limit: 1
        }
    };
    
    try {
        const searchResponse = await axios(searchOptions);
        totalSpotifyRequests++; // Increment the total requests counter
        const trackItems = searchResponse.data.tracks.items;
    
        if (trackItems.length === 0) {
            res.status(404).send({ error: 'No tracks found for the given search criteria.' });
            return;
        }
    
        let initialSeedTrack = trackItems[0].id; // Initialize with the first search result as the seed track
        
        // Fetch initial recommendations to determine new seed tracks
        const initialRecommendations = await getRecommendedTracks([initialSeedTrack]);
        console.log(`Initial recommendation count: ${initialRecommendations.length}`);

        let allRecommendedTracks = []; // Store all fetched tracks here
        let seedTracks = initialRecommendations.slice(0, 1).map(track => track.id); // Take the first 1 tracks IDs from initial recommendations
        allRecommendedTracks.push(...initialRecommendations); 

        // Loop for each seed track to get more recommendations
        for (let seed of seedTracks) {
            console.log(`Fetching recommendations for seed: ${seed}`);
            const newRecommendedTracks = await getRecommendedTracks([seed]);
            console.log(`Fetched ${newRecommendedTracks.length} new tracks using seed ${seed}`);
            allRecommendedTracks.push(...newRecommendedTracks); // Store the fetched tracks

            console.log('Applying 7-second delay to prevent rate limiting...');
            await new Promise(resolve => setTimeout(resolve, 8000)); // 8-second delay
        }

        // Log the total number of recommended tracks before filtering
        console.log('Total recommended tracks (before filtering):', allRecommendedTracks.length);

        // Fetching audio features in batches to avoid '414 URI Too Long' error
        const BATCH_SIZE = 20; // Adjust batch size as needed
        let allAudioFeatures = [];
        for (let i = 0; i < allRecommendedTracks.length; i += BATCH_SIZE) {
            const batchIds = allRecommendedTracks.slice(i, i + BATCH_SIZE).map(track => track.id);
            try {
                const audioFeaturesResponse = await limiter.schedule(async () => {
                    const audioFeaturesOptions = {
                        url: `https://api.spotify.com/v1/audio-features`,
                        method: 'get',
                        headers: {
                            'Authorization': 'Bearer ' + globalAccessToken
                        },
                        params: {
                            ids: batchIds.join(',')
                        }
                    };
                    return await axios(audioFeaturesOptions);
                });
                allAudioFeatures.push(...audioFeaturesResponse.data.audio_features);
            } catch (err) {
                console.error(`Error fetching audio features for batch:`, err.message);
            }
        }


        // Retrieve the analysis and relative data from dataStorage
        const { analysis, relative, analysisModTempo, relativeModTempo } = dataStorage.getData();

        // Filter based on analysis data
        const filteredTracksAnalysis = allAudioFeatures.filter(track => {
            const analysisKey = analysis.key;
            const analysisScale = analysis.scale;
            const analysisBpm = parseFloat(analysis.bpm);
            
            return (
                track.key === analysisKey &&
                track.mode === analysisScale &&
                Math.abs(track.tempo - analysisBpm) / analysisBpm <= 0.28
            );
        });

        console.log('Filtered Tracks based on Analysis Data:', filteredTracksAnalysis.length);

        // Filter based on relative data
        const filteredTracksRelative = allAudioFeatures.filter(track => {
            const relativeKey = relative.key;
            const relativeScale = relative.scale;
            const relativeBpm = parseFloat(relative.bpm);
            
            return (
                track.key === relativeKey &&
                track.mode === relativeScale &&
                Math.abs(track.tempo - relativeBpm) / relativeBpm <= 0.28
            );
        });

        console.log('Filtered Tracks based on Relative Data:', filteredTracksRelative.length);

        // Filter based on analysis data with modified tempo
        const filteredTracksAnalysisNewTempo = allAudioFeatures.filter(track => {
            const analysisModTempoKey = analysisModTempo.key;
            const analysisModTempoScale = analysisModTempo.scale;
            const analysisModTempoBpm = parseFloat(analysisModTempo.bpm);
            
            return (
                track.key === analysisModTempoKey &&
                track.mode === analysisModTempoScale &&
                Math.abs(track.tempo - analysisModTempoBpm) / analysisModTempoBpm <= 0.28
            );
        });

        console.log('Filtered Tracks based on Analysis Data with Modified Tempo:', filteredTracksAnalysisNewTempo.length);

        // Filter based on relative data with modified tempo
        const filteredTracksRelativeNewTempo = allAudioFeatures.filter(track => {
            const relativeModTempoKey = relativeModTempo.key;
            const relativeModTempoScale = relativeModTempo.scale;
            const relativeModTempoBpm = parseFloat(relativeModTempo.bpm);
            
            return (
                track.key === relativeModTempoKey &&
                track.mode === relativeModTempoScale &&
                Math.abs(track.tempo - relativeModTempoBpm) / relativeModTempoBpm <= 0.28
            );
        });

        console.log('Filtered Tracks based on Relative Data with Modified Tempo:', filteredTracksRelativeNewTempo.length);




    // Calculate the total number of filtered tracks based on audio features
    const totalFilteredTracks = filteredTracksAnalysis.length + filteredTracksRelative.length +
        filteredTracksAnalysisNewTempo.length + filteredTracksRelativeNewTempo.length;

    console.log('Total Filtered Tracks:', totalFilteredTracks); // Log the total count

    // Merge the filtered tracks from all filters directly into the response
    const response = {
        analysisSongs: filteredTracksAnalysis,
        relativeSongs: filteredTracksRelative,
        analysisNewTempoSongs: filteredTracksAnalysisNewTempo,
        relativeNewTempoSongs: filteredTracksRelativeNewTempo,
        tracks: allRecommendedTracks,
    };

    // Send Response Object to Client
    res.send(response);

    } catch (error) {
        if (error.response && error.response.status === 429) {
            // If rate limit is exceeded, parse the Retry-After header
            const retryAfter = parseInt(error.response.headers['retry-after'], 10);
            console.log(`Rate limit exceeded, retrying after ${retryAfter} seconds.`);
            // Send a response to the client to try again later
            return res.status(429).send({ error: 'Rate limit exceeded', retryAfter: retryAfter });
        } else {
            console.error('Error querying Spotify API:', error.message);
            return res.status(error.response ? error.response.status : 500).send({ error: error.message });
        }
    }
});



app.post('/analyze-song', async (req, res) => {
    const { analysis, relative, analysisModTempo, relativeModTempo } = req.body;

    console.log('Received POST request with data:', JSON.stringify(req.body, null, 2));
    
    dataStorage.updateData(analysis, relative, analysisModTempo, relativeModTempo);

    res.json({
        message: 'Analysis data received',
        data: dataStorage.getData()
    });
});


//New code for search 
app.post('/search', async (req, res) => {
    const { searchTerm } = req.body;
    console.log("Search Term Received:", searchTerm);

    // Ensure you have a valid access token
    if (!globalAccessToken || Date.now() > tokenExpirationTime) {
        await getAccessToken();
        if (!globalAccessToken) {
            return res.status(500).send({ error: 'Unable to obtain access token' });
        }
    }

    try {
        // Step 1: Search for the song and get its audio features
        const track = await searchTrack(searchTerm);
        if (!track) {
            return res.status(404).send({ message: "Track not found" });
        }
        const audioFeatures = await getAudioFeatures(track.id);

        // Step 2: Create a new object with desired features from audio features
        // Original audio features object
        const originalFeatures = {
            key: audioFeatures.key,
            mode: audioFeatures.mode,
            tempo: audioFeatures.tempo
        };

        // Creating related major/minor object
        const relativeFeatures = {
            key: getRelativeKey(audioFeatures.key, audioFeatures.mode),
            mode: getRelativeScale(audioFeatures.mode),
            tempo: audioFeatures.tempo // same tempo as original
        };

        // Creating modified tempo object
        const modifiedTempoFeatures = {
            key: audioFeatures.key, // same key as original
            mode: audioFeatures.mode, // same mode as original
            tempo: modifyTempo(audioFeatures.tempo)
        };

        // Creating related major/minor with modified tempo object
        const relativeModifiedTempoFeatures = {
            key: getRelativeKey(audioFeatures.key, audioFeatures.mode),
            mode: getRelativeScale(audioFeatures.mode),
            tempo: modifyTempo(audioFeatures.tempo)
        };

        console.log('Track originalFeatures Object: ', originalFeatures)
        console.log('Track relativeFeatures Object: ', relativeFeatures)
        console.log('Track modifiedTempoFeatures Object: ', modifiedTempoFeatures)
        console.log('Track relativeModifiedTempoFeatures Object: ', relativeModifiedTempoFeatures)


        // Step 3: Get recommendations based on the searched song
        const initialRecommendations = await getRecommendedTracks([track.id]);

        // Step 4: Fetch audio features for all recommendations
        const BATCH_SIZE = 20; // Adjust batch size as needed
        let allAudioFeatures = [];
        for (let i = 0; i < initialRecommendations.length; i += BATCH_SIZE) {
            const batchIds = initialRecommendations.slice(i, i + BATCH_SIZE).map(track => track.id);
            try {
                const batchFeatures = await getAudioFeaturesBatch(batchIds);
                allAudioFeatures.push(...batchFeatures);
            } catch (err) {
                console.error(`Error fetching audio features for batch:`, err.message);
            }
        }

        // Step 5: Filter recommendations based on the new object criteria
        const filteredOriginalRecommendations = allAudioFeatures.filter(feature => {
            return feature.key === originalFeatures.key &&
                feature.mode === originalFeatures.mode &&
                Math.abs(feature.tempo - originalFeatures.tempo) / originalFeatures.tempo <= 0.28;
        });

        const filteredRelativeRecommendations = allAudioFeatures.filter(feature => {
            return feature.key === relativeFeatures.key &&
                feature.mode === relativeFeatures.mode &&
                Math.abs(feature.tempo - relativeFeatures.tempo) / relativeFeatures.tempo <= 0.28;
        });

        const filteredModifiedTempoRecommendations = allAudioFeatures.filter(feature => {
            return feature.key === modifiedTempoFeatures.key &&
                feature.mode === modifiedTempoFeatures.mode &&
                Math.abs(feature.tempo - modifiedTempoFeatures.tempo) / modifiedTempoFeatures.tempo <= 0.28;
        });

        const filteredRelativeModifiedTempoRecommendations = allAudioFeatures.filter(feature => {
            return feature.key === relativeModifiedTempoFeatures.key &&
                feature.mode === relativeModifiedTempoFeatures.mode &&
                Math.abs(feature.tempo - relativeModifiedTempoFeatures.tempo) / relativeModifiedTempoFeatures.tempo <= 0.28;
        });

        console.log('Filtered Tracks - Original: ', filteredOriginalRecommendations.length);
        console.log('Filtered Tracks - Relative: ', filteredRelativeRecommendations.length);
        console.log('Filtered Tracks - Modified Tempo: ', filteredModifiedTempoRecommendations.length);
        console.log('Filtered Tracks - Relative Modified Tempo: ', filteredRelativeModifiedTempoRecommendations.length);

        // Calculate the total of all filtered recommendations
        const totalFilteredRecommendations = (
            filteredOriginalRecommendations.length +
            filteredRelativeRecommendations.length +
            filteredModifiedTempoRecommendations.length +
            filteredRelativeModifiedTempoRecommendations.length
        );

        // Log the total of all filtered recommendations
        console.log('Total Filtered Tracks - All: ', totalFilteredRecommendations);

        const response = {
            analysisSongs: filteredOriginalRecommendations,
            relativeSongs: filteredRelativeRecommendations,
            analysisNewTempoSongs: filteredModifiedTempoRecommendations,
            relativeNewTempoSongs: filteredRelativeModifiedTempoRecommendations,
            tracks: initialRecommendations,
            original: audioFeatures,
            originalTrack: track
        }
        // Step 6: Send the final lists to the client
        res.send(response);

    } catch (error) {
        // Check for a rate limiting error response (HTTP 429)
        if (error.response && error.response.status === 429) {
            const retryAfter = parseInt(error.response.headers['retry-after'], 10);
            console.log(`Rate limit exceeded, retrying after ${retryAfter} seconds.`);
            return res.status(429).send({ error: 'Rate limit exceeded', retryAfter: retryAfter });
        } else {
            console.error('Error in /search endpoint:', error.message);
            return res.status(error.response ? error.response.status : 500).send({ error: error.message });
        }
    }
});


//Search track
async function searchTrack(searchTerm) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=1`;
    const headers = {
        'Authorization': `Bearer ${globalAccessToken}`
    };

    try {
        const response = await axios.get(url, { headers: headers });
        const tracks = response.data.tracks.items;
        return tracks[0]; // returning the first track found
    }  catch (error) {
        // Check for a rate limiting error response (HTTP 429)
        if (error.response && error.response.status === 429) {
            // Parse the Retry-After header (if present)
            const retryAfter = error.response.headers['retry-after']
                ? parseInt(error.response.headers['retry-after'], 10)
                : 30; // Default to 30 seconds if header is not present
            console.error(`Rate limit exceeded, retrying after ${retryAfter} seconds.`);
            
            // Simply log the error and rethrow it to be handled by the caller
            throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
        } else {
            // Handle other kinds of errors
            console.error('Error searching for track:', error.message);
            throw error; // Rethrow the error for the calling function to handle
        }
    }
}


//Audio Features
async function getAudioFeatures(trackId) {
    const headers = {
        'Authorization': `Bearer ${globalAccessToken}`
    };

    try {
        const audioFeaturesResponse = await limiter.schedule(() => axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers: headers }));

        return audioFeaturesResponse.data; // This will return the audio features object
    } catch (error) {
        // Check for a rate limiting error response (HTTP 429)
        if (error.response && error.response.status === 429) {
            // Parse the Retry-After header (if present)
            const retryAfter = error.response.headers['retry-after']
                ? parseInt(error.response.headers['retry-after'], 10)
                : 30; // Default to 30 seconds if header is not present
            console.error(`Rate limit exceeded, retrying after ${retryAfter} seconds.`);
            
            // Log the error and rethrow it to be handled by the caller
            throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
        } else {
            // Handle other kinds of errors
            console.error('Error fetching audio features:', error.message);
            throw error; // Rethrow the error for the calling function to handle
        }
    }
}


async function getAudioFeaturesBatch(trackIds) {
    const headers = {
        'Authorization': `Bearer ${globalAccessToken}`
    };
    const params = {
        ids: trackIds.join(',') // Join multiple track IDs into a comma-separated string
    };

    try {
        const audioFeaturesResponse = await limiter.schedule(() => axios.get(`https://api.spotify.com/v1/audio-features`, { headers: headers, params: params }));

        return audioFeaturesResponse.data.audio_features; // This will return the array of audio features objects
    }  catch (error) {
        // Check for a rate limiting error response (HTTP 429)
        if (error.response && error.response.status === 429) {
            // Parse the Retry-After header (if present)
            const retryAfter = error.response.headers['retry-after']
                ? parseInt(error.response.headers['retry-after'], 10)
                : 30; // Default to 30 seconds if header is not present
            console.error(`Rate limit exceeded, retrying after ${retryAfter} seconds.`);
            
            // Log the error and rethrow it to be handled by the caller
            throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
        } else {
            // Handle other kinds of errors
            console.error('Error fetching audio features:', error.message);
            throw error; // Rethrow the error for the calling function to handle
        }
    }
}



function getRelativeKey(key, mode) {
    const majorToMinorShift = -3; // Relative minor is 3 semitones down
    const minorToMajorShift = 3; // Relative major is 3 semitones up
    const totalNotes = 12; // Total semitones in an octave

    let keyNumber = key; // Assuming key is already a number

    if (mode === 1) { // Assuming major is represented as 1 and minor as 0
        keyNumber = (keyNumber + majorToMinorShift + totalNotes) % totalNotes;
    } else if (mode === 0) { // Minor
        keyNumber = (keyNumber + minorToMajorShift) % totalNotes;
    }

    return keyNumber; // Returns the relative key as a number
}

function getRelativeScale(mode) {
    return mode === 1 ? 0 : 1; // Assuming major is 1 and minor is 0, switches them
}

function modifyTempo(initialTempo) {
    let modifiedTempo;
  
    if (initialTempo >= 100) {
        modifiedTempo = initialTempo / 2;
    } else {
        modifiedTempo = initialTempo * 2;
    }
    return modifiedTempo;
  }
  



  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
  });
  