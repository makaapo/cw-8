import React, {useCallback, useEffect, useState} from 'react';
import axiosApi from '../../axiosApi';
import {ApiQuotes, Quote} from '../../types';
import {Link, useParams} from 'react-router-dom';
import {enqueueSnackbar} from 'notistack';
import categories from '../../contants';
import QuotesBar from '../../components/NavBar/QuotesBar';

const Quotes = () => {
  const {idCategory} = useParams();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = '/quotes.json';

      if (idCategory) {
        url += `?orderBy="category"&equalTo="${idCategory}"`;
      }

      const response = await axiosApi.get<ApiQuotes | null>(url);

      const QuotesResponse = response.data;
      if (QuotesResponse !== null) {
        const quotes: Quote[] = Object.keys(QuotesResponse).map((id: string) => ({
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
  }, [idCategory]);

  useEffect(() => {
    void fetchQuotes();
  }, [fetchQuotes]);

  const onDelete = async(id: string) => {
    try {
      setIsLoading(true);
      await axiosApi.delete(`/quotes/${id}.json`);
      enqueueSnackbar('Quote deleted', {variant: 'success'})
      void fetchQuotes()
    } catch (error) {
      enqueueSnackbar('failed to delete', {variant: 'error'})
    } finally {
      setIsLoading(false);
    }
  }

  const categoryTitle = idCategory ? categories.find(
    category => category.id === idCategory)?.title || 'All' : 'All';

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
      <div className="d-flex gap-5 justify-content-between">
        <QuotesBar />
        <div className="d-flex flex-column col-8">
          <h3 className="text-center">{categoryTitle}</h3>
          {quotes.map(quote => (
            <div className="card mb-3" key={quote.id}>
              <div className="card-header">
                {quote.author}
              </div>
              <div className="card-body d-flex align-items-center justify-content-between">
                <h5 className="card-title col-10">{quote.text}</h5>
                <div className="col-2">
                  <Link to={`/quotes/${quote.id}/edit`} className="btn me-4">
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                  <button onClick={() => onDelete(quote.id)} className="btn">
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Quotes;