import React, { useEffect, useState, useRef, useCallback, createContext, useContext } from 'react';
import { debounce } from 'lodash';

import { format } from 'date-fns';
import { fetchMovies, fetchGenres, createGuestSession, rateMovie } from '../api/api';
import MovieGenres from '../movie-genre/movie-genre';
import MovieRating from '../movie-rating/movie-rating';
import MovieDescription from '../movie-text/movie-text';
import { Card, Row, Col, Spin, Alert, Input, Pagination, Tabs, Rate } from 'antd';
import './movie-list.css';

const GenresContext = createContext();
export const useGenres = () => useContext(GenresContext);

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('return');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [activeTab, setActiveTab] = useState('1');
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [genres, setGenres] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  
  const pageSize = 6;

  useEffect(() => {
    const initialize = async () => {
      const session = await createGuestSession();
      setGuestSessionId(session);
      const genresData = await fetchGenres();
      setGenres(genresData);
    };
    initialize();
  }, []);

  const loadMovies = useCallback(async (query, page) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (activeTab === '1') {
        response = await fetchMovies(query, page);
      } else {
        response = { results: ratedMovies }; 
      }
      setMovies(response.results || []);
      setTotalResults(response.total_results || ratedMovies.length);
    } catch (err) {
      setError('Ошибка загрузки фильмов. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, ratedMovies]);

  useEffect(() => {
    if (guestSessionId) {
      loadMovies(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage, activeTab, guestSessionId, loadMovies]);

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500)
  ).current;

  const handleSearch = useCallback((e) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleRate = async (movieId, value) => {
    await rateMovie(movieId, value, guestSessionId);
    const movie = movies.find((m) => m.id === movieId);
  
    if (movie) {
      const updatedMovie = { ...movie, user_rating: value };
      setRatedMovies((prev) => {
        const updatedRatedMovies = prev.filter((m) => m.id !== movieId);
        return [...updatedRatedMovies, updatedMovie]; 
      });
    }
  };

  return (
    <GenresContext.Provider value={genres}>
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <Tabs.TabPane tab="Search" key="1" />
        <Tabs.TabPane tab="Rated" key="2" />
      </Tabs>
      {activeTab === '1' && <Input className='movie-input' placeholder="Type to search..." onChange={handleSearch} style={{ marginBottom: 20 }} />}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <>
        <div className='movie'>
            <Row gutter={[16, 16]}>
              {movies.map((movie) => (
                <Col className='movie_content' key={movie.id} span={12}>
                  <Card hoverable className='movie_container'>
                    <div className='movie_container-list'>
                      <img className='movie_img' alt={movie.title} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                      <div className='movie_list-info'>
                        <div className="movie_list-header">
                          <h3 className='movie_title'>{movie.title}</h3>
                          <MovieRating rating={Number(movie.vote_average) || 0} />
                        </div>
                        <p>{movie.release_date ? format(new Date(movie.release_date), 'MMMM d, yyyy') : 'Дата неизвестна'}</p>
                        <MovieGenres genreIds={movie.genre_ids || []} />
                        <div className='movie_text'>
                          <MovieDescription overview={movie.overview} />
                        </div>
                        <Rate count={10} value={movie.user_rating || 0} onChange={(value) => handleRate(movie.id, value)} />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          <Pagination
            current={currentPage}
            total={totalResults}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </>
      )}
    </GenresContext.Provider>
  );
};

export default MovieList;
