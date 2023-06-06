import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="text-center">
      <img className="img-fluid h-25" src="/img/notFoundPage.svg" alt="страница не найдена" />
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p className="text-muted">
        Но вы можете перейти <a href="/">на главную страницу</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
