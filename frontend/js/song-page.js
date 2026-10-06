const songContainer = document.getElementById("songContainer");
const songPlayer = document.getElementById("songPlayer");

let currentSongIndex = -1;
let audio = null;


// Display songs
function displaySongs() {

    songContainer.innerHTML = "";

    songs.forEach((song, index) => {

        const songCard = document.createElement("div");

        songCard.className = "song-card";

        songCard.innerHTML = `
            <div class="song-number">
                ${index + 1}
            </div>

            <div class="song-info">
                <h3>${song.title}</h3>
                <p>${song.movie}</p>
            </div>

            <button onclick="playSong(${index})">
                ▶ Play
            </button>
        `;

        songContainer.appendChild(songCard);
    });
}


// Play song
function playSong(index) {

    if (index < 0 || index >= songs.length) {
        return;
    }

    currentSongIndex = index;

    const song = songs[index];

    songPlayer.innerHTML = `
        <div class="custom-player">

            <h2>🎵 ${song.title}</h2>

            <p>${song.movie}</p>

            <audio
                id="audioPlayer"
                src="${song.audio}"
                preload="metadata">
            </audio>

            <div class="progress-area">

                <span id="currentTime">
                    0:00
                </span>

                <input
                    type="range"
                    id="progressBar"
                    min="0"
                    max="100"
                    value="0">

                <span id="duration">
                    0:00
                </span>

            </div>

            <div class="player-controls">

                <button onclick="previousSong()">
                    ⏮
                </button>

                <button
                    id="playPauseButton"
                    onclick="togglePlayPause()">
                    ▶
                </button>

                <button onclick="nextSong()">
                    ⏭
                </button>

            </div>

            <div class="volume-control">

                🔊

                <input
                    type="range"
                    id="volumeBar"
                    min="0"
                    max="1"
                    step="0.01"
                    value="1">

            </div>

        </div>
    `;

    audio = document.getElementById("audioPlayer");

    setupAudioEvents();

    audio.play()
        .then(() => {
            updatePlayButton();
        })
        .catch((error) => {

            console.log("Audio could not start:", error);

        });

    songPlayer.scrollIntoView({
        behavior: "smooth"
    });
}


// Audio events
function setupAudioEvents() {

    const progressBar =
        document.getElementById("progressBar");

    const volumeBar =
        document.getElementById("volumeBar");


    audio.addEventListener("loadedmetadata", () => {

        document.getElementById("duration").textContent =
            formatTime(audio.duration);

    });


    audio.addEventListener("timeupdate", () => {

        if (!audio.duration) {
            return;
        }

        const progress =
            (audio.currentTime / audio.duration) * 100;

        progressBar.value = progress;

        document.getElementById("currentTime").textContent =
            formatTime(audio.currentTime);

    });


    audio.addEventListener("play", () => {

        updatePlayButton();

    });


    audio.addEventListener("pause", () => {

        updatePlayButton();

    });


    audio.addEventListener("ended", () => {

        if (currentSongIndex < songs.length - 1) {

            nextSong();

        }

    });


    progressBar.addEventListener("input", () => {

        if (!audio.duration) {
            return;
        }

        audio.currentTime =
            (progressBar.value / 100) * audio.duration;

    });


    volumeBar.addEventListener("input", () => {

        audio.volume = volumeBar.value;

    });

}


// Play / Pause
function togglePlayPause() {

    if (!audio) {
        return;
    }

    if (audio.paused) {

        audio.play();

    } else {

        audio.pause();

    }

}


// Previous
function previousSong() {

    if (currentSongIndex > 0) {

        playSong(currentSongIndex - 1);

    }

}


// Next
function nextSong() {

    if (currentSongIndex < songs.length - 1) {

        playSong(currentSongIndex + 1);

    }

}


// Update button
function updatePlayButton() {

    const button =
        document.getElementById("playPauseButton");

    if (!button || !audio) {
        return;
    }

    button.textContent =
        audio.paused ? "▶" : "⏸";

}


// Format time
function formatTime(seconds) {

    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}


// Start
displaySongs();