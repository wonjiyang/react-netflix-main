import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.style.css';

function NotFoundPage() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link to="/" className="notfound-button">
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default NotFoundPage;
