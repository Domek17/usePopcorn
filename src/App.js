import { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Logo from "./Components/Navbar/Logo/Logo";
import Search from "./Components/Navbar/Search/Search";
import NumResults from "./Components/Navbar/NumResults/NumResults";
import Main from "./Components/Main/Main";
import MoviesBox from "./Components/Main/MoviesBox/MoviesBox";
import MoviesList from "./Components/Main/MoviesBox/MoviesList/MoviesList";
import WatchedSummary from "./Components/Main/MoviesBox/WatchedSummary/WatchedSummary";
import WatchedMoviesList from "./Components/Main/MoviesBox/WatchedMoviesList/WatchedMoviesList";
import Loader from "./Components/Loader/Loader";
import ErrorMessage from "./Components/ErrorMessage/ErrorMessage";
import MovieDetails from "./Components/Main/MoviesBox/WatchedMoviesList/MovieDetails/MovieDetails";
import { useMovies } from "./customHooks/useMovies";
import { useLocalStorageState } from "./customHooks/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watchedMovies");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <MoviesBox>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </MoviesBox>

        <MoviesBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </MoviesBox>
      </Main>
    </>
  );
}
