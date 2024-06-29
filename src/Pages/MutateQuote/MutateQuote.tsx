import React, {useCallback, useEffect, useState} from 'react';
import {ApiQuote, QuoteMutation} from '../../types';
import {useNavigate, useParams} from 'react-router-dom';
import axiosApi from '../../axiosApi';
import {enqueueSnackbar} from 'notistack';
import categories from '../../contants';

const initialState = {
  author: '',
  category: '',
  text: '',
};

const MutateQuote = () => {
  const [quoteMutation, setQuoteMutation] = useState<QuoteMutation>(initialState);
  const navigate = useNavigate();
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const fetchOnePost = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosApi.get<ApiQuote | null>(`quotes/${id}.json`);
      if (response.data) {
        setQuoteMutation({...response.data});
      }
    } catch (error) {
      enqueueSnackbar('Error fetching post', {variant: 'error'});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      void fetchOnePost(id);
    } else {
      setQuoteMutation(initialState);
    }
  }, [id, fetchOnePost]);

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setQuoteMutation(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const quoteData = {
        ...quoteMutation,
      };
      if (id) {
        await axiosApi.put(`/quotes/${id}.json`, quoteData);
      } else {
        await axiosApi.post('/quotes.json', quoteData);
      }
      enqueueSnackbar(id ? 'Quote edited': 'Quote added', {variant: 'success'});
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Something went wrong', {variant: 'error'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primaryr" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <form className="row flex-column align-items-center text-center g-3 needs-validation mt-5"
            onSubmit={onFormSubmit}>
        <h4>{id ? 'Edit quote' : 'Submit new quote'}</h4>
        <div className="col-md-4 position-relative d-flex flex-column align-items-center text-center">
          <label className="form-label">Category</label>
          <div className="input-group">
            <select
              className="form-select"
              name="category"
              value={quoteMutation.category}
              onChange={onFieldChange}
              required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="text-center"
                >
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
          <label className="form-label">Author</label>
          <div className="input-group">
            <span className="input-group-text">Author</span>
            <input
              type="text"
              className="form-control"
              name="author"
              required
              value={quoteMutation.author}
              onChange={onFieldChange}
            />
          </div>
        </div>
        <div className="col-md-6 position-relative">
          <label className="form-label">Quote Text</label>
          <textarea
            className="form-control"
            name="text"
            required
            value={quoteMutation.text}
            onChange={onFieldChange}
          />
        </div>
        <div className="col-12">
          <button className="btn btn-info text-white" type="submit">Save</button>
        </div>
      </form>
    </>
  );
};

export default MutateQuote;