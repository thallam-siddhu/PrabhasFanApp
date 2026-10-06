const movieDetails = document.getElementById("movieDetails");

const params = new URLSearchParams(window.location.search);

const movieId = params.get("id");

const movie = movies.find((item) => item.id === movieId);


// Movie not found
if (!movie) {

    movieDetails.innerHTML = `
        <h1>Movie not found</h1>

        <a class="back-button" href="movies.html">
            ← Back to Movies
        </a>
    `;

} else {

    movieDetails.innerHTML = `

        <a class="back-button" href="movies.html">
            ← Back to Movies
        </a>

        <div class="details-wrapper">

            <div class="details-poster">

                <img
                    src="${movie.poster}"
                    alt="${movie.title}"
                >

            </div>


            <div class="details-content">

                <h1>${movie.title}</h1>

                <div class="year">
                    ${movie.year}
                </div>

                <div class="character">
                    Prabhas as ${movie.character}
                </div>

                <button
                    class="watch-button"
                    onclick="watchMovie()"
                >
                    ▶ Watch
                </button>

            </div>

        </div>

        <div id="playerContainer"></div>
    `;
}


// Watch movie
function watchMovie() {

    if (!movie || !movie.youtubeLink) {

        showMessage("No video is available for this movie.");

        return;
    }


    const videoId = getYouTubeVideoId(movie.youtubeLink);


    if (!videoId) {

        showMessage("Invalid video link.");

        return;
    }


    const playerContainer =
        document.getElementById("playerContainer");


    playerContainer.innerHTML = `

        <div class="video-section">

            <h2>▶ Now Playing</h2>

            <div class="video-player">

                <iframe
                    src="https://www.youtube.com/embed/${videoId}"
                    title="${movie.title}"
                    frameborder="0"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>

            </div>

        </div>

    `;


    playerContainer.scrollIntoView({
        behavior: "smooth"
    });
}


// Show message
function showMessage(message) {

    const playerContainer =
        document.getElementById("playerContainer");


    playerContainer.innerHTML = `

        <div class="video-section">

            <h2>Video unavailable</h2>

            <p>${message}</p>

        </div>

    `;


    playerContainer.scrollIntoView({
        behavior: "smooth"
    });
}


// Get YouTube Video ID
function getYouTubeVideoId(url) {

    try {

        const parsedUrl = new URL(url);


        // Example:
        // https://youtu.be/JqFzhcWo3EU

        if (parsedUrl.hostname === "youtu.be") {

            return parsedUrl.pathname
                .substring(1)
                .split("/")[0];

        }


        // Example:
        // https://www.youtube.com/watch?v=JqFzhcWo3EU

        if (
            parsedUrl.hostname.includes("youtube.com") &&
            parsedUrl.searchParams.get("v")
        ) {

            return parsedUrl.searchParams.get("v");

        }


        // Example:
        // https://www.youtube.com/embed/JqFzhcWo3EU

        if (
            parsedUrl.hostname.includes("youtube.com") &&
            parsedUrl.pathname.startsWith("/embed/")
        ) {

            return parsedUrl.pathname
                .replace("/embed/", "")
                .split("/")[0];

        }


        return null;

    } catch (error) {

        return null;
    }
}