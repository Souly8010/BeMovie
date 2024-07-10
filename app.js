import * as apiFunctions from "./js/apiFunctions.js";

// Liste des genres et leurs identifiants
const genresList = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchMovieBtn");
  const searchInput = document.getElementById("searchMovieInput");
  const resultsWrapper = document.getElementById("wrapper-result");
  const latestWrapper = document.getElementById("wrapper-latest-release");
  const genreButtons = document.querySelectorAll(".genreBtn");
  const genreWrapper = document.getElementById("wrapper-movies-by-genre");
  const genreTitle = document.getElementById("genre-title");
  const resultsTitle = document.getElementById("title-results"); // Nouvel élément pour le titre des résultats

  // Vérifiez que les éléments existent
  if (searchButton && searchInput && resultsWrapper) {
    searchButton.addEventListener("click", async (e) => {
      e.preventDefault();
      searchButton.disabled = true;

      try {
        const query = searchInput.value;

        const movies = await apiFunctions.movie(query);

        // Afficher les résultats des films
        displayMovies(movies, resultsWrapper, ".swiper-result");
        document.querySelector(".result-container").style.display = "block";
        resultsTitle.textContent = `Results for "${query}"`;
      } catch (error) {
        console.error("Erreur lors de la recherche de films :", error);
        alert(
          "Une erreur s'est produite lors de la recherche. Veuillez réessayer."
        );
      } finally {
        searchButton.disabled = false;
      }
    });
  } else {
    console.error(
      "Un ou plusieurs éléments DOM sont manquants : searchButton, searchInput ou resultsWrapper."
    );
  }

  async function displayMovieModal(movie) {
    document.getElementById(
      "poster-modal-img"
    ).src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    document.getElementById("title-modal").innerText = movie.title;
    document.getElementById("date-modal").innerText = movie.release_date
      ? movie.release_date.split("-")[0]
      : "N/A";
    document.getElementById("rate-modal").innerText =
      movie.vote_average.toFixed(1);

    const genreNames = movie.genre_ids
      ? movie.genre_ids
          .slice(0, 3)
          .map((id) => genresList[id] || "Unknown")
          .join(" / ")
      : "Unknown";

    document.getElementById("genres-modal").innerText = genreNames;
    document.getElementById("overview-modal").innerText = movie.overview;

    let casting = await apiFunctions.getCastingFromMovie(movie);
    casting = casting.slice(0, 5).join(", ");
    document.getElementById(
      "cast-modal"
    ).innerHTML = `<span>Cast:</span> ${casting}`;

    movieModal.style.display = "block";
    document.body.classList.add("no-scroll");

    movieModal.querySelector(".close").addEventListener("click", () => {
      movieModal.style.display = "none";
      document.body.classList.remove("no-scroll");
    });
  }

  genreButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const genre = button.id;
      console.log(genre);
      genreTitle.textContent = genre;
      const movies = await apiFunctions.getMovieByGenre(genre);
      displayMovies(movies, genreWrapper, ".swiper-movies-by-genre");
      setActiveGenreButton(button);
    });
  });

  function setActiveGenreButton(activeButton) {
    genreButtons.forEach((button) => {
      button.classList.remove("active");
    });
    activeButton.classList.add("active");
  }

  async function loadDefaultGenreMovies() {
    const defaultGenre = "Comedy";
    genreTitle.textContent = defaultGenre;
    const movies = await apiFunctions.getMovieByGenre(defaultGenre);
    displayMovies(movies, genreWrapper, ".swiper-movies-by-genre");
    const defaultButton = document.getElementById(defaultGenre);
    setActiveGenreButton(defaultButton);
  }

  async function loadLatestMovies() {
    const latestMovies = await apiFunctions.movieLatestDateRelease();
    displayMovies(latestMovies, latestWrapper, ".swiper-latest-releases");
  }

  function displayMovies(movies, wrapper, swiperClass) {
    wrapper.innerHTML = "";
    movies.forEach((movie) => {
      const genreNames = movie.genre_ids
        ? movie.genre_ids
            .slice(0, 3)
            .map((id) => genresList[id] || "Unknown")
            .join(" / ")
        : "Unknown";
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      // movie.vote_average.toFixed(1)
      slide.innerHTML = `
        <div class="card-movie">
          <h2>${movie.title}</h2>
          <p class="date">${
            movie.release_date ? movie.release_date.split("-")[0] : "N/A"
          }</p>
          <p class="genres">${genreNames}</p>
          <div class="star"><img src="./img/star.svg" alt="star"></div>
          <p class="rate">${movie.vote_average.toFixed(1)}</p> 
          <div class="poster">
            ${
              movie.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`
                : "<p>Image not available</p>"
            }
          </div>
        </div>`;

      slide.addEventListener("click", async () => {
        await displayMovieModal(movie);
      });

      wrapper.appendChild(slide);
    });

    new Swiper(swiperClass, {
      navigation: {
        nextEl: `${swiperClass} .swiper-button-next`,
        prevEl: `${swiperClass} .swiper-button-prev`,
      },
      slidesPerView: 4,
      spaceBetween: 10,
    });
  }

  loadLatestMovies();
  loadDefaultGenreMovies();
});

const movieModal = document.getElementById("movieModal");
const displayMovieModal = async (movie) => {
  document.getElementById(
    "poster-modal-img"
  ).src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  document.getElementById("title-modal").innerText = movie.title;
  document.getElementById("date-modal").innerText = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";
  document.getElementById("rate-modal").innerText =
    movie.vote_average.toFixed(1);
  const genreNames = movie.genre_ids
    ? movie.genre_ids
        .slice(0, 3)
        .map((id) => genresList[id] || "Unknown")
        .join(" / ")
    : "Unknown";
  document.getElementById("genres-modal").innerText = genreNames;
  document.getElementById("overview-modal").innerText = movie.overview;
  let casting = await apiFunctions.getCastingFromMovie(movie);
  casting = casting.slice(0, 5).join(", ");
  document.getElementById(
    "cast-modal"
  ).innerHTML = `<span>Cast:</span> ${casting}`;

  // !! refaire le scss / styling
  // les fenêtres sont trop grandes pour que j'ajoute le display none lorsqu'on clique en dehors
  // ajouter une class no-scroll pour éviter le défilement à l'arrière

  movieModal.style.display = "block";
  movieModal.querySelector(".close").addEventListener("click", () => {
    movieModal.style.display = "none";
  });
};
