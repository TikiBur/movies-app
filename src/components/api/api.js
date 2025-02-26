import axios from 'axios';

const API_KEY = '088a923352dbe20f065b12743de8ccd2';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getRatedMovies = async (guestSessionId, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/guest_session/${guestSessionId}/rated/movies`, {
      params: {
        api_key: API_KEY,
        page: page,
      },
    });

    return response.data; 
  } catch (error) {
    console.error('Error fetching rated movies:', error);
    return { results: [], total_results: 0 }; 
  }
};

export const createGuestSession = async () => {
  const response = await axios.get(`${BASE_URL}/authentication/guest_session/new`, {
    params: { api_key: API_KEY },
  });
  return response.data.guest_session_id;
};

export const fetchGenres = async () => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: { api_key: API_KEY },
  });
  return response.data.genres;
};

export const fetchMovies = async (query, page = 1) => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: { api_key: API_KEY, query, page },
  });
  return response.data;
};

export const rateMovie = async (movieId, rating, guestSessionId) => {
  await axios.post(
    `${BASE_URL}/movie/${movieId}/rating`,
    { value: rating },
    {
      params: { api_key: API_KEY, guest_session_id: guestSessionId },
      headers: { 'Content-Type': 'application/json' },
    }
  );
};