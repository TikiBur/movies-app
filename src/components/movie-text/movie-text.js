import React from "react";

const MovieDescription = ({ overview, maxLength = 120 }) => {
  if (!overview) {
    return <p className="movie_list-info-text">Нет описания</p>;
  }

  const truncateText = (text, length) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  return <p className="movie_list-info-text">{truncateText(overview, maxLength)}</p>;
};

export default MovieDescription;