import React, {useCallback, useEffect, useState} from 'react';
import axiosApi from '../../axiosApi';
import {ApiQuotes, Post} from '../../types';
import {Link, NavLink} from 'react-router-dom';
import {enqueueSnackbar} from 'notistack';

const Quotes = () => {
  const [quotes, setQuotes] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosApi.get<ApiQuotes | null>('/quotes.json');

      const QuotesResponse = response.data;
      if (QuotesResponse !== null) {
        const quotes: Post[] = Object.keys(QuotesResponse).map((id: string) => ({
          ...QuotesResponse[id],
          id,
        }));
        setQuotes(quotes);
      } else {
        setQuotes([]);
      }
    } catch (error) {
      enqueueSnackbar('failed fetch post', {variant: 'error'});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQuotes();
  }, [fetchQuotes]);

  return (
    <>
      {isLoading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primaryr" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {quotes.length === 0 && (
        <h2 className="text-center mt-5">Sorry, there are no quotes available</h2>
      )}
      <div className="d-flex gap-5 justify-content-center">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/" className="nav-link" aria-current="page">All</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/category/star-wars" className="nav-link">Star Wars</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/category/famous-people" className="nav-link">Famous People</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/category/saying" className="nav-link">Saying</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/category/humour" className="nav-link">Humour</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/category/motivational" className="nav-link">Motivational</NavLink>
          </li>
        </ul>
        <div className="d-flex flex-column">
          {quotes.map(post => (
            <div className="card mb-3" key={post.id}>
              <div className="card-header">
                {post.author}
              </div>
              <div className="card-body">
                <h5 className="card-title">{post.text}</h5>
                <Link to={`/quotes/${post.id}/edit`} className="btn btn-primary me-2">Edit</Link>
                <Link to={`/posts/${post.id}`} className="btn btn-primary">Delete</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Quotes;