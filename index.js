
const key = '48aa722f';
var searchInput = document.getElementById('Input');
var displaySearchList = document.getElementsByClassName('fav-container');
fetch('http://www.omdbapi.com/?i=tt3896198&apikey=48aa722f')
    .then(res => res.json())
    .then(data => console.log(data));

searchInput.addEventListener('input', findMovies);


async function singleMovie() {
 
    var urlQueryParams = new URLSearchParams(window.location.search);
    var id = urlQueryParams.get('id');
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);

    // // Fetch YouTube trailer
    // const trailerUrl = await getTrailerUrl(data.Title);
    var output = `
    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
        
        <!-- YouTube Trailer Section -->
        <div class="movie-trailer">
            <h3>Watch Trailer</h3>
            <iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </div> 
    `;
    document.querySelector('.movie-container').innerHTML = output;
}

// Function to get trailer URL from YouTube
// async function getTrailerUrl(movieTitle) {
//     const query = `${movieTitle} trailer`; // Searching for the trailer of the movie
//     const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApiKey}`;

//     const response = await fetch(youtubeUrl);
//     const data = await response.json();

//     // Check if we have results and return the first trailer
//     if (data.items && data.items.length > 0) {
//         const videoId = data.items[0].id.videoId;
//         return `https://www.youtube.com/embed/${videoId}`;
//     } else {
//         return ''; // Return an empty string if no trailer is found
//     }
// }

async function addTofavorites(id) {
    console.log("fav-item", id);
    localStorage.setItem(Math.random().toString(36).slice(2, 7), id); // Using math.random for unique key and value pair
    alert('Movie Added to Watchlist!');
}


async function removeFromfavorites(id) {
    console.log(id);
    for (i in localStorage) {
        if (localStorage[i] == id) {
            localStorage.removeItem(i);
            break;
        }
    }
  
    alert('Movie Removed from Watchlist');
    window.location.replace('favorite.html');
}
async function displayMovieList(movies) {
    var output = '';

    for (i of movies) {
        var img = (i.Poster != 'N/A') ? i.Poster : 'img/blank-poster.webp';
        var id = i.imdbID;
        output += `
        <div class="fav-item">
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div>
                        <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    document.querySelector('.fav-container').innerHTML = output;
    console.log("Here is movie list..", movies);
}
async function findMovies() {
    const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Search) {
        displayMovieList(data.Search);
    }
}
async function favoritesMovieLoader() {
    var output = '';

    for (i in localStorage) {
        var id = localStorage.getItem(i);
        if (id != null) {
          
            const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`;
            const res = await fetch(url);
            const data = await res.json();
            console.log(data);
            var img = (data.Poster) ? data.Poster : data.Title;
            var Id = data.imdbID;
            output += `
            <div class="fav-item">
                <div class="fav-poster">
                    <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
                </div>
                <div class="fav-details">
                    <div class="fav-details-box">
                        <div>
                            <p class="fav-movie-name">${data.Title}</p>
                            <p class="fav-movie-rating">${data.Year} &middot; <span
                                    style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                        </div>
                        <div style="color: maroon">
                            <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }
    document.querySelector('.fav-container').innerHTML = output;
}
