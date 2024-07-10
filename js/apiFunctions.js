const apiKey = "e3458d85b215647ec57637c022734527";
const option = {
  method: "GET",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMzQ1OGQ4NWIyMTU2NDdlYzU3NjM3YzAyMjczNDUyNyIsInN1YiI6IjY2NmZlNGM4Mzk1NThhODcwOWQ1M2RmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UbM2yqBmxdk7gC6SQCmsqTwaTVMBx2fjfohtgwOHnpk",
    accept: "application/json",
  },
};

async function movie(query) {
  let urlApi = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;

  try {
    const reponse = await fetch(urlApi, option);
    const data = await reponse.json();
    return data.results;
  } catch (error) {
    return error;
  }
}

const list = {
  Comedy: 35,
  Action: 28,
  Drama: 18,
  Romance: 10749,
  Fantasy: 14,
  Animation: 16,
};

async function getGenreMovie(name) {
  let genreId = list[name];
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}&api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des films par genre");
    }

    const data = await response.json();
    const movies = data.results;
    console.log(movies);
    // Récupérer les genres de chaque film
    const genres = movies.map((movie) => {
      return {
        title: movie.title,
        genres: movie.genre_ids, // Les genre_ids sont utilisés pour récupérer les IDs de genre
      };
    });

    return genres;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

async function getMovieByGenre(name) {
  let genreId = list[name];
  console.log(genreId);
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}&api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des films par genre");
    }

    const data = await response.json();
    const movies = data.results;
    return movies;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

async function fetchAndDisplayMovieDate(query) {
  try {
    const results = await movie(query);
    const firstMovie = results[0];

    if (!firstMovie) {
      console.log("Aucun film trouvé");
    }
    const year = getMovieDate(firstMovie);
    console.log(year);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function getMovieDate(movie) {
  const releaseDate = movie.release_date;
  const year = releaseDate.split("-")[0];
  return year;
}

function getMovieNote(movie) {
  let note = movie.vote_average.toFixed(1);
  return note;
}

async function fetchAndDisplayMovieNote(query) {
  try {
    const results = await movie(query); // Utilise la fonction movie existante pour obtenir les résultats
    results.forEach((movie, index) => {
      const note = getMovieNote(movie); // Utilise getMovieNote pour récupérer la note du film
      console.log(`Note du film ${index + 1}: ${note}`);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des notes de films:", error);
    return error;
  }
}

async function getMovieOverviews(query) {
  try {
    const results = await movie(query);
    const overviews = results.map((movie) => movie.overview);
    return overviews;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des résumés de films:",
      error
    );
    throw error;
  }
}

async function movieLatestDateRelease() {
  const result = await fetch(
    "https://api.themoviedb.org/3/trending/movie/week?language=en-US",
    option
  );

  try {
    if (result.ok) {
      const data = await result.json();
      return data.results;
    }
  } catch (error) {
    console.error("error: ", error);
  }
}

const getGenresListID = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      option
    );
    if (response.ok) {
      const JSONresponse = await response.json();
      return JSONresponse.genres;
    }
    console.log("Network error");
  } catch (err) {
    console.log(err);
  }
};

const getCastingFromMovie = async (movie) => {
  const url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US&append_to_response=credits`;
  try {
    const response = await fetch(url, option);
    if (response.ok) {
      const JSONresponse = await response.json();
      const casting = JSONresponse.credits.cast.map((person) => person.name);
      return casting;
    }
    console.log("Network error");
  } catch (err) {
    console.log(err.message);
  }
};

export {
  movie,
  getGenreMovie,
  getMovieDate,
  getMovieOverviews,
  getMovieNote,
  fetchAndDisplayMovieDate,
  fetchAndDisplayMovieNote,
  movieLatestDateRelease,
  getMovieByGenre,
  getGenresListID,
  getCastingFromMovie,
};