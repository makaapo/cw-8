import React from 'react';
import {NavLink} from 'react-router-dom';
import categories from '../../contants';

const QuotesBar = () => {
  return (
    <ul className="nav flex-column col-3 fs-5">
      <li className="nav-item mb-2">
        <NavLink to="/" className="nav-link" aria-current="page">- All</NavLink>
      </li>
      {categories.map((cat) => (
        <li className="nav-item mb-2"  key={cat.id}>
          <NavLink to={`/quotes/${cat.id}`} className="nav-link">- {cat.title}</NavLink>
        </li>
      ))}
    </ul>
  );
};

export default QuotesBar;