import React from "react";

import './movie-rating.css';

const getRatingColor = (rating) => {
    rating = Number(rating) || 0;

    if (rating <= 3) return '#E90000';
    if (rating <= 5) return '#E97E00';
    if (rating <= 7) return '#E9D100';
    return '#66E900';
};

const MovieRating = ({ rating }) => {
    const safeRating = Number(rating) || 0;

    return (
        <div className="movie_rating" style={{borderColor: getRatingColor(safeRating)}}>
            {safeRating.toFixed(1)}
        </div>
    );
};

export default MovieRating;