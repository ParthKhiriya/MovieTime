import React from 'react'

const MovieCard = ({ movie }) => {

  const title = movie?.titleText?.text || 'Untitled';
  const vote_avg = movie?.ratingsSummary?.aggregateRating ?? 'N/A';
  const poster_path = movie?.primaryImage?.url || '/no-movie.png';
  const release_date = movie?.releaseDate?.year || 'N/A';

  return (
    <div className='movie-card'>
        <img src={poster_path ? poster_path : '/no-movie.png'} alt={title} />
        <div className='mt-4'>
            <h3>{title}</h3>
            <div className='content'>
                <div className='rating'>
                    {/* <img src="star.svg" alt="Star Icon" /> */}
                    {/* <p>{vote_avg ? vote_avg : 'N/A'}</p> */}
                    {vote_avg !== 'N/A' && (
                      <div className='rating'>
                      <img src="star.svg" alt="Star Icon" />
                      <p>{vote_avg}</p>
                    </div>
                    )}
                </div>
                {/* <span>•</span>
                <p className='lang'>{originalLanguage}</p> */}
                <span>•</span>
                <p className='year'>{release_date ? release_date : 'N/A'}</p>
            </div>
        </div>
    </div>
  )
}

export default MovieCard