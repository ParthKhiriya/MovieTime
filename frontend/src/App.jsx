import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'

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

  const fetchMovies = async () => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/title/v2/get-popular?first=20&country=US&language=en-US`;
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

      setMovieList(data?.data?.movies?.edges || []);

    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.")
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
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

        <section className='all-movies'>
          <h2 className='mt-[20px]'>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((edge) => (
                <MovieCard key={edge.node.id} movie={edge.node} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
