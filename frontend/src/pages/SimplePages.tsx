import { useEffect } from 'react';
import { Link } from 'react-router';
import { notFound } from '../content/copy';
import { Faq } from '../sections/Faq';

export function FaqPage() {
  useEffect(() => {
    document.title = 'FAQ | Shari Kotha';
  }, []);
  return (
    <div className="faq-page">
      <Faq headingLevel={1} />
    </div>
  );
}

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Not found | Shari Kotha';
  }, []);
  return (
    <div className="wrap page-message">
      <p className="bn-display page-mark" lang="bn" aria-hidden="true">
        ৪০৪
      </p>
      <h1>{notFound.title}</h1>
      <p>{notFound.body}</p>
      <Link to="/shop" className="btn">
        {notFound.cta}
      </Link>
    </div>
  );
}
