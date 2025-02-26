import React from 'react';

import { Layout } from 'antd';
import MovieList from './components/movie-list/movie-list.js';
import './index.css';

const { Content } = Layout;

function App() {
  return (
    <Layout>
      <Content className='content'>
        <MovieList />
      </Content>
    </Layout>
  );
}

export default App;