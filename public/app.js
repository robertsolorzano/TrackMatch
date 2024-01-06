document.addEventListener("DOMContentLoaded", function() {
  const fileDropZone = document.querySelector('.file-drop-zone');
  const fileInput = document.querySelector('.file-input');
  const feedbackMessage = document.querySelector(".feedback-message");
    
    //Initial message
    feedbackMessage.textContent = "";

    fileDropZone.addEventListener('click', function() {
        fileInput.click();
        feedbackMessage.textContent = "Selecting file...";
    });

    fileDropZone.addEventListener("dragover", function(event) {
        feedbackMessage.textContent = "Drop to upload!";
    });

    fileDropZone.addEventListener("dragleave", function(event) {
        feedbackMessage.textContent = "Selecting file...";
    });
            document.querySelector('.audio-progress').style.display = 'none';

    fileInput.addEventListener('change', async function() {
        try {
        if (fileInput.files.length > 0) {
            simulateProgress();

            feedbackMessage.textContent = "Analyzing...";

            // Place the code here to display the audio progress and reset its value
            document.querySelector('.audio-progress').style.display = 'block';
            document.querySelector('.audio-progress').value = 0;


        const audioFile = fileInput.files[0];
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await fileToArrayBuffer(audioFile).then(data => audioContext.decodeAudioData(data));

        // Pass the audioFile variable as an argument to analyzeTrack
        analyzeTrack(audioBuffer, audioFile);

        feedbackMessage.textContent = "File uploaded!";
        }
    } catch (error) {
        console.error('Error:', error);
        feedbackMessage.textContent = "An error occurred. Please try again.";
    }
  });

document.addEventListener('click', function(event) {
    if (event.target.matches('.bxs-bookmark')) {
        // This is an unsaved song; clicking will save it.
        // Retrieve song details from data attributes and save it
        const song = {
          id: event.target.dataset.songId,
          name: event.target.dataset.songName,
          albumArt: event.target.dataset.albumArt,
          artist: event.target.dataset.artist,
          key: event.target.dataset.key,
          bpm: event.target.dataset.bpm,
          timeSignature: event.target.dataset.timeSignature,
          duration: event.target.dataset.duration,
          spotifyLink: event.target.dataset.spotifyLink,
          previewUrl: event.target.dataset.previewUrl
      };
        
        // Call your function to save the song to local storage
        saveSongToLocalStorage(song);
        
        // Change icon to indicate song is saved
        event.target.classList.remove('bx-bookmark');
        event.target.classList.add('bxs-bookmark');
        
    } else if (event.target.matches('.bx-bookmark')) {
        // This is a saved song; clicking will unsave it.
        // Retrieve the song ID from data attributes
        const songId = event.target.dataset.songId;

        // Call your function to remove the song from local storage
        unsaveSongFromLocalStorage(songId);
  
        // Change icon to indicate song is unsaved
        event.target.classList.remove('bxs-bookmark');
        event.target.classList.add('bx-bookmark');
  
        // Provide feedback to the user
        console.log(`Removed ${event.target.dataset.songName} from local storage.`);
    }
});


    let displayingSavedSongs = false;  // false indicates search results are being displayed
    //Evenet listneer for My SOngs click
    document.getElementById('mySongs').addEventListener('click', function(e) {
      e.preventDefault();  // Prevent the default anchor behavior

      setTimeout(scrollToTop, 0);
  
      const savedSongsDiv = document.getElementById('mySavedSongs');
      const resultsContainer = document.getElementById('spotResultMain');
      const spotResultsDiv = document.getElementById('spotresults');
  
      if (displayingSavedSongs) {
          // Switching from saved songs to search results
          savedSongsDiv.style.display = 'none'; // Hide saved songs
          resultsContainer.style.display = 'grid'; // Show search result
          spotResultsDiv.style.display = 'grid'; // Show all search results
          displayingSavedSongs = false; // Update state
      } else {
          // Switching from search results to saved songs
          const savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];
          displaySavedSongs(savedSongs);
          resultsContainer.style.display = 'none'; // Hide detailed search result
          spotResultsDiv.style.display = 'none'; // Hide all search results
          displayingSavedSongs = true; // Update state
      }
  });

});


//LOCAL STORAGE FUCNTION
function saveSongToLocalStorage(song) {
  // Retrieve the current array of saved songs from local storage, or initialize it to an empty array if none exists
  let savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];

  // Check if the song is already saved to prevent duplicates
  const isSongSaved = savedSongs.some(savedSong => savedSong.id === song.id);
  if (!isSongSaved) {
      // Add the new song to the array
      savedSongs.push(song);

      // Save the updated array back to local storage
      localStorage.setItem('savedSongs', JSON.stringify(savedSongs));

      // Log a confirmation that the song has been saved
      console.log(`Saved ${song.name} to local storage.`);
  } else {
      console.log(`${song.name} is already saved.`);
  }
}


// Function to remove a song from local storage
function unsaveSongFromLocalStorage(songId) {
  let savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];
  savedSongs = savedSongs.filter(song => song.id !== songId); // Remove the song with the matching id
  localStorage.setItem('savedSongs', JSON.stringify(savedSongs)); // Update local storage
}



//SAVED SONGS FUNCTION
function displaySavedSongs(savedSongs) {
  const mySavedSongsDiv = document.getElementById('mySavedSongs');

  mySavedSongsDiv.innerHTML = ''; // Clear out any previous content

  if (savedSongs.length > 0) {
      savedSongs.forEach((song) => {
          const trackElement = createTrackElementFromSaved(song);
          mySavedSongsDiv.appendChild(trackElement);
      });
  } else {
    const emptyTrackCard = createEmptyTrackElement();
    mySavedSongsDiv.appendChild(emptyTrackCard);
  }
  // Only adjust display of saved songs container
  mySavedSongsDiv.style.display = 'grid';
}


//SAVED SONGS DISPLAY FUNCTION
function createTrackElementFromSaved(song) {
  // Create the main div for the track
  const trackDiv = document.createElement('div');
  trackDiv.classList.add('track');

  // Album Cover
  const albumCover = document.createElement('img');
  albumCover.src = song.albumArt;
  albumCover.alt = `Album cover for ${song.name}`;
  trackDiv.appendChild(albumCover);

  // Other details (Artist, BPM, etc.)
  const detailsDiv = document.createElement('div');
    // Track Info
    const trackInfo = document.createElement('p');
    trackInfo.innerHTML = `Track: ${song.name}`;
    trackInfo.classList.add('track-title');
    detailsDiv.appendChild(trackInfo);
  
    // Wait for the next frame so the DOM updates, then check the width
    requestAnimationFrame(() => {
      if (trackInfo.scrollWidth > trackInfo.clientWidth) {
        trackInfo.classList.add('marquee');
      }
    });
  

  // Add artist
  const artistP = document.createElement('p');
  artistP.textContent = `Artist: ${song.artist}`;
  detailsDiv.appendChild(artistP);

  // Add BPM
  const bpmP = document.createElement('p');
  bpmP.textContent = `BPM: ${song.bpm}`;
  detailsDiv.appendChild(bpmP);

  // Add key
  const keyP = document.createElement('p');
  keyP.textContent = `Key: ${song.key}`;
  detailsDiv.appendChild(keyP);

  // Time Signature Info
  const timeSignatureInfo = document.createElement('p');
  timeSignatureInfo.innerHTML = `Time Signature: ${song.timeSignature}`;
  detailsDiv.appendChild(timeSignatureInfo);

  // Add duration
  const durationP = document.createElement('p');
  durationP.textContent = `Duration: ${song.duration}`;
  detailsDiv.appendChild(durationP);

  // Append the details div to the main track div
  trackDiv.appendChild(detailsDiv);

  // Spotify Link
  const spotifyLink = document.createElement('a');
  spotifyLink.href = song.spotifyLink;
  spotifyLink.textContent = 'Listen on Spotify';
  spotifyLink.target = '_blank';
  trackDiv.appendChild(spotifyLink);


    // Audio Player
    const audioPlayer = document.createElement('audio');
    const audioSource = document.createElement('source');
    audioSource.src = song.previewUrl;
    audioSource.type = 'audio/mpeg';
    audioPlayer.appendChild(audioSource);
    trackDiv.appendChild(audioPlayer);
  
    // Play Icon
    const playIcon = document.createElement('div');
    playIcon.classList.add('play-icon');
    playIcon.style.backgroundImage = 'url("assets/images/play-icon.png")'; // Correct path in the JS
    playIcon.addEventListener('click', () => {
      togglePlayPause(audioPlayer, playIcon);
    });
    trackDiv.appendChild(playIcon);

    // Use a filled star or filled bookmark to signify the song is saved
    const savedIcon = document.createElement('i');
    savedIcon.classList.add('bx', 'bxs-heart'); // or 'bxs-bookmark' for filled bookmark
    savedIcon.style.position = 'absolute';
    savedIcon.style.top = '22px';
    savedIcon.style.right = '22px';
    savedIcon.style.fontSize = '38px';
    savedIcon.style.color = '#FF0000'; // Gold color or choose any color you prefer
    savedIcon.style.cursor = 'pointer';

    // Maybe add some functionality or tooltip on hover to show it's a saved song
    savedIcon.title = "Saved Song";

// Add event listener to unsave the song on click
    savedIcon.addEventListener('click', () => {
      if (savedIcon.classList.contains('bxs-heart')) {
          // Remove the song from local storage
          unsaveSongFromLocalStorage(song.id);

          // Toggle the heart icon to indicate the song is unsaved
          savedIcon.classList.remove('bxs-heart');
          savedIcon.classList.add('bx-heart');

          // Update the display of saved songs
          const updatedSavedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];
          displaySavedSongs(updatedSavedSongs);

          // Provide feedback to the user
          console.log(`Removed ${song.name} from saved songs.`);
      }
    });

    // Append the savedIcon to trackDiv (which has relative positioning)
    trackDiv.appendChild(savedIcon);


  // Return the complete track element
  return trackDiv;
}

// Function to create an empty track card element
function createEmptyTrackElement() {
  const trackDiv = document.createElement('div');
  trackDiv.classList.add('empty-track');

  // Placeholder for Album Cover
  const albumCover = document.createElement('div');
  albumCover.classList.add('album-cover-placeholder');

  // Overlay Text "No Songs Saved"
  const noSongsText = document.createElement('div');
  noSongsText.classList.add('no-songs-overlay-text');
  noSongsText.textContent = 'No Songs Saved';
  albumCover.appendChild(noSongsText); // Add the overlay text as a child of albumCover

  trackDiv.appendChild(albumCover); // Add albumCover, now containing the overlay text, to trackDiv

  // Placeholder details (Artist, BPM, etc.)
  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add('track-details-placeholder');
  
  // Placeholder texts
  ['Artist', 'BPM', 'Key', 'Duration'].forEach(detail => {
    const detailP = document.createElement('p');
    detailP.textContent = detail; // You could replace this with something like '---' or 'Not available'
    detailsDiv.appendChild(detailP);
  });
  
  // Append the details div to the main track div
  trackDiv.appendChild(detailsDiv);

  // Placeholder Spotify Link
  const spotifyLink = document.createElement('div');
  spotifyLink.classList.add('spotify-link-placeholder');
  spotifyLink.textContent = 'Listen on Spotify';
  trackDiv.appendChild(spotifyLink);

  return trackDiv;
}



//ESSENTIA
let essentia;
EssentiaWASM().then(function(EssentiaWasm) {
  essentia = new Essentia(EssentiaWasm);
  console.log(essentia.version);
  //console.log(essentia.algorithmNames); //Add to see all parameters to analyze 
});

function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
  });
}

async function analyzeTrack(buffer, audioFile) {
    // Set the initial message when starting analysis
    document.getElementById('searchStatus2').innerHTML = 'Searching songs from <span id="spotifyWord">Spotify</span>...';
    try {
        // Convert audio buffer to an array of audio samples
        const audioSignal = Array.from(buffer.getChannelData(0));
        
        // Convert the audio samples to an Essentia vector
        const inputSignalVector = essentia.arrayToVector(audioSignal);

        // Initialize rhythm here (assuming it holds the BPM)
        const rhythm = essentia.RhythmExtractor2013(inputSignalVector);

        // Extract key and scale using the KeyExtractor algorithm from Essentia
        const keyAndScale = essentia.KeyExtractor(inputSignalVector);

        // Directly use keyAndScale.scale for both functions
        const relativeKey = getRelativeKey(keyAndScale.key, keyAndScale.scale);
        const relativeScale = getRelativeScale(keyAndScale.scale);

        // Convert relative key and scale to Spotify's numerical format
        const relativeKeyForSpotify = keyLetterToNumber(relativeKey); // Convert key letter to Spotify's key number
        const relativeScaleForSpotify = musicalKeyToModeNumber(relativeScale); // Convert scale text to Spotify's mode number

        const modifiedTempo = modifyTempo(rhythm.bpm);

        // Display BPM, key, and scale information in the console
        console.log("BPM:", rhythm.bpm);
        console.log("Key:", keyAndScale.key);
        console.log("Scale:", keyAndScale.scale);
        console.log("Relative Key:", relativeKey);
        console.log("Relative Scale:", relativeScale);
        console.log("Relative Key Number:", relativeKeyForSpotify);
        console.log("Relative Scale Number:", relativeScaleForSpotify);
        console.log('Modified Tempo:', modifiedTempo);

        // Extract additional song data based on the uploaded audio file's name
        // For example, fetching artist and song name
        const songData = await getSongData(audioFile.name.split('.')[0]);

        // Update the content of existing HTML elements with the obtained information
        document.getElementById('title').textContent = audioFile.name;
        document.getElementById('artist').textContent = songData.artist;
        document.getElementById('bpm').textContent = rhythm.bpm.toFixed(2);
        document.getElementById('key').textContent = keyAndScale.key + ' ' + keyAndScale.scale;

        // Show the results section with a smooth transition
        const resultsDiv = document.getElementById('results');
        resultsDiv.style.display = 'block';
        setTimeout(() => {
            resultsDiv.style.transform = 'translateY(0)';
            resultsDiv.style.opacity = '1';
        }, 50);
      
        // Convert key and scale using your conversion functions
        const spotifyKey = keyLetterToNumber(keyAndScale.key);
        const spotifyMode = musicalKeyToModeNumber(keyAndScale.scale);

        // Original analysis data
        const analysisData = {
            bpm: rhythm.bpm.toFixed(2),
            key: spotifyKey,       
            scale: spotifyMode       
        };

        // Relative analysis data
        const relativeData = {
            bpm: analysisData.bpm,   
            key: relativeKeyForSpotify,   
            scale: relativeScaleForSpotify 
        };

        const analysisDataNewTempo = {
          bpm: modifiedTempo.toFixed(2),
          key: spotifyKey,
          scale: spotifyMode
        };

        const relativeDataNewTempo = {
          bpm: modifiedTempo.toFixed(2),
          key: relativeKeyForSpotify,
          scale: relativeScaleForSpotify
        };

      console.log('Sending analysisData, relativeData, analysisDataNewTempo, relativeDataNewTempo to server:', analysisData, relativeData, analysisDataNewTempo, relativeDataNewTempo);

        // Sending both pieces of data within a single parent object
        const dataToSend = {
            analysis: analysisData,
            relative: relativeData,
            analysisModTempo: analysisDataNewTempo,
            relativeModTempo: relativeDataNewTempo

        };

        // Send the analysis data to the server and wait for the response
        const response = await fetch('/analyze-song', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
      });

      // Process the response from the server
      const data = await response.json();
      console.log('Server response:', data);

        // Fetch matched songs based on song name, artist, key, and BPM, if needed
        if (songData) {
            await fetchMatchedSongs(songData.songName, songData.artist, keyAndScale.key, rhythm.bpm);
        }

        // Clear the status message after receiving the data
        document.getElementById('searchStatus2').textContent = "";

      } catch (error) {
        console.error('Error:', error);
        // Update the status message to reflect the error
        document.getElementById('searchStatus2').textContent = "An error occurred during analysis.";
    }
}

//Fucntion for Progress Bar
function simulateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2; // Increment by a smaller value (e.g., 2) every 20ms for smoother progress

        // Ensure progress doesn't exceed 100%
        if (progress > 100) {
            progress = 100;
        }

        document.querySelector('.audio-progress').value = progress;

        if (progress === 100) {
            clearInterval(interval);
            document.querySelector('.audio-progress').style.display = 'none'; // Hide the progress bar once simulation is complete
        }
    }, 20); // Decreased interval duration for smoother progress
}


function keyLetterToNumber(keyLetter) {
    const keyMap = {
        'C': 0,
        'C#': 1, 'Db': 1,
        'D': 2,
        'D#': 3, 'Eb': 3,
        'E': 4, 'Fb': 4,
        'F': 5, 'E#': 5,
        'F#': 6, 'Gb': 6,
        'G': 7,
        'G#': 8, 'Ab': 8,
        'A': 9,
        'A#': 10, 'Bb': 10,
        'B': 11, 'Cb': 11
    };
    return keyMap[keyLetter];
  }
  

function musicalKeyToModeNumber(musicalKey) {
    const modeMap = {
        'minor': 0,
        'major': 1
    };
    return modeMap[musicalKey];
}

function getRelativeKey(key, mode) {
    const majorToMinorShift = -3; // Relative minor is 3 semitones down
    const minorToMajorShift = 3; // Relative major is 3 semitones up
    const totalNotes = 12; // Total semitones in an octave

    // Convert key to a number if it's a letter
    let keyNumber = isNaN(key) ? keyLetterToNumber(key) : key;

    // Calculate the relative key
    if (mode === "major") {
        keyNumber = (keyNumber + majorToMinorShift + totalNotes) % totalNotes;
    } else if (mode === "minor") {
        keyNumber = (keyNumber + minorToMajorShift) % totalNotes;
    }

    // Convert back to letter notation for consistency
    return keyNumberToLetter(keyNumber);
}

function getRelativeScale(mode) {
    // The relative scale of a major key is minor and vice versa
    return mode === "major" ? "minor" : "major";
}

function modifyTempo(initialTempo) {
  console.log('Initial Tempo:', initialTempo);
  let modifiedTempo;

  if (initialTempo >= 100) {
      modifiedTempo = initialTempo / 2;
  } else {
      modifiedTempo = initialTempo * 2;
  }
  return modifiedTempo;
}



//New function to fetch matched songs based on song name, artist, key, and bpm
async function fetchMatchedSongs(songName, artist, key, bpm) {
  const keyNumber = keyLetterToNumber(key);
  const tempo = bpm;
  const url = `/get-songs?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}&key=${keyNumber}&tempo=${tempo}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('fetchMatchedSongs response data:', data);

if (
    (data.analysisSongs && data.analysisSongs.length > 0) ||
    (data.relativeSongs && data.relativeSongs.length > 0) ||
    (data.analysisNewTempoSongs && data.analysisNewTempoSongs.length > 0) ||
    (data.relativeNewTempoSongs && data.relativeNewTempoSongs.length > 0)
) {
          const song = data.analysisSongs[0];
          const track = data.tracks[0];

          console.log('Calling displayTrackInfo with data:', data);
          displayTrackInfo(data);  

          const resultsSection = document.getElementById('results-section');
          resultsSection.style.top = "0";  // Reset the position to show the section
          
          
      } else {
        console.error('No matched songs found');
      }
  } catch (error) {
    console.error('Error fetching matched songs:', error);
  }
}


//Function to Query MusicBrainz from User Audio
async function searchMusicBrainzByTitle(title) {
  const endpoint = `https://musicbrainz.org/ws/2/recording?query=${title}&fmt=json`;
  const response = await fetch(endpoint);
  return response.json();
}

async function getSongData(title) {
  const data = await searchMusicBrainzByTitle(title);

  if (data.recordings && data.recordings.length > 0) {
      const firstRecording = data.recordings[0];
      const artist = firstRecording['artist-credit'][0].name;
      const songName = firstRecording.title;

      return {
          artist: artist,
          songName: songName
      };
  }

  return null;
}



//Function for Spotify's Audio Features Musical Map
function keyNumberToLetter(keyNumber) {
    const numberMap = {
        0: 'C',
        1: 'C#',
        2: 'D',
        3: 'D#',
        4: 'E',
        5: 'F',
        6: 'F#',
        7: 'G',
        8: 'G#',
        9: 'A',
        10: 'A#',
        11: 'B'
    };
    return numberMap[keyNumber];
}

function timeNumberToFraction(timeNumber) {
    const numberTimeMap = {
        3: '3/4',
        4: '4/4',
        5: '5/4',
        6: '6/4',
        7: '7/4',
    };
    return numberTimeMap[timeNumber];
}


function modeNumberToMusicalKey(modeNumber) {
    const numberModeMap = {
        0: 'Minor',
        1: 'Major',
    };
    return numberModeMap[modeNumber];
}

//Set variable of current audio player to null
let currentlyPlayingAudio = null;


// Function to create a track element
function createTrackElement(track, song, isRelative, detailClass = '') {
  const trackDiv = document.createElement('div');
  trackDiv.classList.add('track');
  // Add 'relative-track' class if the song is from a relative array
  if (isRelative) {
    trackDiv.classList.add('relative-track');
  }

  // Album Cover
  const albumCover = document.createElement('img');
  albumCover.src = track.album.images[0].url;
  albumCover.alt = `Album cover for ${track.name}`;
  albumCover.classList.add('album-cover');
  trackDiv.appendChild(albumCover);

  // Create a container for the track details
  const trackDetails = document.createElement('div');
  trackDetails.classList.add('track-details');

  // Track Info
  const trackInfo = document.createElement('p');
  trackInfo.innerHTML = `Track: <span class="${detailClass}">${track.name}</span>`;
  trackInfo.classList.add('track-title');
  trackDetails.appendChild(trackInfo);

  // Wait for the next frame so the DOM updates, then check the width
  requestAnimationFrame(() => {
    if (trackInfo.scrollWidth > trackInfo.clientWidth) {
      trackInfo.classList.add('marquee');
    }
  });

  // Artist Info
  const artistInfo = document.createElement('p');
  artistInfo.innerHTML = `Artist: <span class="${detailClass}">${track.artists[0].name}</span>`;
  trackDetails.appendChild(artistInfo);

  // Key Info
  const keyLabelClass = isRelative ? "relative-key-label" : "key-label"; // Assign different classes based on whether the track is relative
  const keyText = isRelative ? "Relative Key" : "Key"; // Determine the label based on whether the track is relative
  const keyInfo = document.createElement('p');
  keyInfo.innerHTML = `<span class="${keyLabelClass}">${keyText}</span>: <span class="${detailClass}">${keyNumberToLetter(song.key)} ${modeNumberToMusicalKey(song.mode)}</span>`;
  trackDetails.appendChild(keyInfo);

  // BPM Info
  const bpmInfo = document.createElement('p');
  bpmInfo.innerHTML = `BPM: <span class="${detailClass}">${song.tempo.toFixed(2)}</span>`;
  trackDetails.appendChild(bpmInfo);

  // Time Signature Info
  const timeSignatureInfo = document.createElement('p');
  timeSignatureInfo.innerHTML = `Time Signature: <span class="${detailClass}">${timeNumberToFraction(song.time_signature)}</span>`;
  trackDetails.appendChild(timeSignatureInfo);

  // Duration Info
  const durationInfo = document.createElement('p');
  durationInfo.innerHTML = `Duration: <span class="${detailClass}">${msToTime(song.duration_ms)}</span>`;
  trackDetails.appendChild(durationInfo);

  // Append trackDetails to trackDiv
  trackDiv.appendChild(trackDetails);

  // Spotify Link
  const spotifyLink = document.createElement('a');
  spotifyLink.href = track.external_urls.spotify;
  spotifyLink.textContent = 'Listen on Spotify';
  spotifyLink.target = '_blank';
  trackDiv.appendChild(spotifyLink);

  // Audio Player
  const audioPlayer = document.createElement('audio');
  const audioSource = document.createElement('source');
  audioSource.src = track.preview_url;
  audioSource.type = 'audio/mpeg';
  audioPlayer.appendChild(audioSource);
  trackDiv.appendChild(audioPlayer);

  // Play Icon
  const playIcon = document.createElement('div');
  playIcon.classList.add('play-icon');
  playIcon.style.backgroundImage = 'url("assets/images/play-icon.png")'; // Correct path in the JS
  playIcon.addEventListener('click', () => {
    togglePlayPause(audioPlayer, playIcon);
  });
  trackDiv.appendChild(playIcon);

  // Create the Boxicon element for saving
  const saveIcon = document.createElement('i');
  saveIcon.classList.add('bx', 'bx-bookmark'); // Using Boxicon's bookmark icon
  saveIcon.dataset.songId = track.id;
  saveIcon.dataset.songName = track.name;
  saveIcon.dataset.albumArt = track.album.images[0].url;
  saveIcon.dataset.artist = track.artists.map(artist => artist.name).join(", ");
  saveIcon.dataset.key = keyNumberToLetter(song.key) + ' ' + modeNumberToMusicalKey(song.mode);
  saveIcon.dataset.bpm = song.tempo.toFixed(2);
  saveIcon.dataset.timeSignature = timeNumberToFraction(song.time_signature);
  saveIcon.dataset.duration = msToTime(song.duration_ms);
  saveIcon.dataset.spotifyLink = track.external_urls.spotify;
  saveIcon.dataset.previewUrl = track.preview_url;
  saveIcon.style.position = 'absolute';
  saveIcon.style.top = '22px';
  saveIcon.style.right = '22px';
  saveIcon.style.fontSize = '38px'; // Size of the icon
  saveIcon.style.color = '#FFD700'; // Color of the icon
  saveIcon.style.cursor = 'pointer';

  // Add event listener to toggle class on click
  saveIcon.addEventListener('click', () => {
    // Toggle between 'bx-bookmark' and 'bxs-bookmark'
    if (saveIcon.classList.contains('bx-bookmark')) {
      saveIcon.classList.remove('bx-bookmark');
      saveIcon.classList.add('bxs-bookmark');
    } else {
      saveIcon.classList.remove('bxs-bookmark');
      saveIcon.classList.add('bx-bookmark');
    }
  });


  // Append the Boxicon to trackDiv (which has relative positioning)
  trackDiv.appendChild(saveIcon);

  return trackDiv;
}

function displayTrackInfo(data, mainTrackId) {
  const { tracks, analysisSongs, relativeSongs, analysisNewTempoSongs, relativeNewTempoSongs } = data;
  const resultsContainer = document.getElementById('spotresults');
  resultsContainer.innerHTML = ''; // Clear previous results

  // Map audio feature arrays by track ID for easy lookup
  const audioFeaturesMap = new Map();

  // Create a set of all relative song IDs for easy lookup
  const relativeSongIds = new Set([...relativeSongs, ...relativeNewTempoSongs].map(song => song.id));

  // Insert all audio feature objects into the map with their track ID as the key
  [analysisSongs, relativeSongs, analysisNewTempoSongs, relativeNewTempoSongs].forEach((featureArray) => {
    featureArray.forEach((feature) => {
      if (feature && feature.id) {
        audioFeaturesMap.set(feature.id, feature);
      }
    });
  });

  // Iterate through each track in the 'tracks' array
  tracks.forEach((track) => {
    if (track && track.id) {
      // Skip adding the track if it's the same as the main result
      if (track.id === mainTrackId) {
        console.log("Duplicate found and removed: ", track.id);
        return;
      }

      const audioFeatures = audioFeaturesMap.get(track.id);
      if (audioFeatures) {
        // Determine if the audio feature is from a relative array
        const isRelative = relativeSongIds.has(audioFeatures.id);
        // Create track element with the matched audio features and relative status
        const trackElement = createTrackElement(track, audioFeatures, isRelative);
        resultsContainer.appendChild(trackElement);
      }
    }
  });
}

// Helper function to toggle play/pause
function togglePlayPause(audioPlayer, playIcon) {
    if (currentlyPlayingAudio && currentlyPlayingAudio !== audioPlayer) {
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio.parentNode.querySelector('.play-icon').style.backgroundImage = 'url("assets/images/play-icon.png")';
    }
    if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.style.backgroundImage = 'url("assets/images/pause-icon.png")';
    } else {
        audioPlayer.pause();
        playIcon.style.backgroundImage = 'url("assets/images/play-icon.png")';
    }
    currentlyPlayingAudio = audioPlayer.paused ? null : audioPlayer;
}

// Helper function to convert milliseconds to "m:ss" format
function msToTime(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scrolling animation
  });
}


// JavaScript code to toggle visibility
// Get references to the checkboxes and containers
// JavaScript code to toggle visibility
// Get references to the checkboxes and containers
const toggleSearchCheckbox = document.getElementById("toggleSearchCheckbox");
const toggleFileUploadCheckbox = document.getElementById("toggleFileUploadCheckbox");
const searchContainer = document.getElementById("searchContainer");
const fileDropZone = document.getElementById("fileDropZone");

// Add event listeners to the checkboxes
toggleSearchCheckbox.addEventListener("change", () => {
if (toggleSearchCheckbox.checked) {
  searchContainer.style.display = "block";
  fileDropZone.style.display = "none";
  toggleFileUploadCheckbox.checked = false; // Uncheck the file upload checkbox
} else {
  searchContainer.style.display = "none";
}
});

toggleFileUploadCheckbox.addEventListener("change", () => {
if (toggleFileUploadCheckbox.checked) {
  fileDropZone.style.display = "block";
  searchContainer.style.display = "none";
  toggleSearchCheckbox.checked = false; // Uncheck the search checkbox
} else {
  fileDropZone.style.display = "none";
}
});

// Function to update the labels when the page loads
function updateLabelsOnLoad() {
if (toggleSearchCheckbox.checked) {
  document.querySelector('label[for="toggleSearchCheckbox"]').classList.add('active-label');
}
if (toggleFileUploadCheckbox.checked) {
  document.querySelector('label[for="toggleFileUploadCheckbox"]').classList.add('active-label');
}
}

// Add event listener to update labels when the page loads
window.addEventListener('load', updateLabelsOnLoad);


  // Adding search functionality
  const form = document.getElementById('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    console.log("Form submitted");
    const searchTerm = document.getElementById('query').value;
    console.log("Search Term:", searchTerm);
    searchSong(searchTerm);
});


//Code to search button
const searchButton = document.getElementById('searchButton');

function searchSong(searchTerm) {
  if (!searchTerm.trim()) {
    alert("Please enter both artist and song name!");
    return;
  }
  document.getElementById('searchStatus').innerHTML = 'Searching songs from <span id="spotifyWord">Spotify</span>...'; // Set the status message

  // Disable the button as soon as the search starts
  searchButton.disabled = true;
  console.log("Searching for:", searchTerm);

  // Hide the 'My Saved Songs' section
  const mySavedSongsDiv = document.getElementById('mySavedSongs');
  mySavedSongsDiv.style.display = 'none'; 

  // Clear the previous search results from 'Spot Results' and 'Spot Result Main'
  const spotResultsDiv = document.getElementById('spotresults');
  spotResultsDiv.innerHTML = ''; 

  const spotResultMainDiv = document.getElementById('spotResultMain');
  spotResultMainDiv.innerHTML = ''; // Clear the 'Spot Result Main' div

  // Assuming you have an endpoint /search at your server
  fetch('/search', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ searchTerm: searchTerm })
  })
  .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Data received from server:", data);  // Log the received data
    document.getElementById('searchStatus').textContent = "";  // Clear or update the status message

    // Display search results
    displaySearchResults(data.original, data.originalTrack);
    displayTrackInfo(data);

    // Clear the search input
    document.getElementById('query').value = '';  // Clear the search bar
    
    // Re-enable the button
    searchButton.disabled = false;
  })
  .catch((error) => {
    console.error('Error:', error);
    document.getElementById('searchStatus').textContent = "Failed to fetch songs. Please try again.";  // Update the status message on error
    searchButton.disabled = false;  // Re-enable the button
  });
}


let displayingSavedSongs = false; // Update state to reflect that search results are being displayed

function displaySearchResults(originalFeatures, originalTrack) {
  if (!originalTrack) {
      console.error("No original track data available.");
      return;
  }

  const mainResultsContainer = document.getElementById('spotResultMain');
  mainResultsContainer.innerHTML = ''; // Clear previous main result

  // Create and append the main result to 'spotResultMain'
  const mainTrackElement = createTrackElement(originalTrack, originalFeatures, false, 'original-detail-value');
  mainResultsContainer.appendChild(mainTrackElement);

  // Ensure the container for main search result is displayed
  mainResultsContainer.style.display = 'grid';

  // Now handle the 'spotresults' container for additional results if any
  const additionalResultsContainer = document.getElementById('spotresults');
  // Ensure it's visible (you might need additional logic here to handle visibility depending on your design)
  additionalResultsContainer.style.display = 'grid';
}
