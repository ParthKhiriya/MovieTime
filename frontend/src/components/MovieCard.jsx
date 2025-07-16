import React from 'react'

const MovieCard = ({ movie }) => {

  const {
    titleText: { text: title },
    ratingsSummary: { aggregateRating: vote_avg } = {},
    primaryImage: { url: poster_path } = {},
    releaseDate: { year: release_date } = {},
    originalLanguage = 'english'
  } = movie;

  return (
    <div className='movie-card'>
        <img src={poster_path ? poster_path : '/no-movie.png'} alt={title} />
        <div className='mt-4'>
            <h3>{title}</h3>
            <div className='content'>
                <div className='rating'>
                    <img src="star.svg" alt="Star Icon" />
                    <p>{vote_avg ? vote_avg : 'N/A'}</p>
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