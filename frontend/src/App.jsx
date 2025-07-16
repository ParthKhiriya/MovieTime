import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import reactLogo from './assets/react.svg'
import './App.css'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

const API_BASE_URL = 'https://imdb8.p.rapidapi.com'
const API_KEY = import.meta.env.VITE_IMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'f5705037b3mshbfd27164f898f94p1b57c0jsn27ac8306af1b',
    'x-rapidapi-host': 'imdb8.p.rapidapi.com'
  }
};

const App = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
      ? `${API_BASE_URL}/v2/search?searchTerm=${encodeURIComponent(query)}&type=TITLE&first=20&country=US&language=en-US'`
      : `${API_BASE_URL}/title/v2/get-popular?first=20&country=US&language=en-US`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new error ("Failed to fetch movies.");
      }

      const data = await response.json();
      console.log(data);
      
      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch Movies.');
        setMovieList([]);
        return;
      }

      let movies = [];

      if (!query) {
        // 🎬 Popular movies
        const edges = data?.data?.movies?.edges || [];
        movies = edges.map(edge => edge.node);
      } else {
        // 🔎 Title search — filter for only "Title" results
        const edges = data?.data?.mainSearch?.edges || [];
        movies = edges
          .map(edge => edge?.node?.entity)
          .filter(entity => entity?.__typename === "Title");
      }

      setMovieList(movies);

      if(query && movies.length > 0) {
        await updateSearchCount(query, movies[0]);
      }

    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.")
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => {
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              })}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2 className='mt-[20px]'>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
