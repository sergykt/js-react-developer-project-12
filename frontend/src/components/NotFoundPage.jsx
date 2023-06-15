import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img className="img-fluid h-25" src="/img/notFoundPage.svg" alt={t('not-found-page.not-found')} />
      <h1 className="h4 text-muted">{t('not-found-page.not-found')}</h1>
      <p className="text-muted">
        {t('not-found-page.you-can')}
        <a href="/">{t('not-found-page.main-page')}</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
