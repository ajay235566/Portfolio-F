import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ConsentDocs from './pages/ConsentDocs.tsx';
import Blog from './pages/Blog.tsx';
import { Layout } from './components/Layout';
import './index.css';

function Main() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0); // Reset scroll on route change
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let content;
  if (route === '#gtm-consent-template') {
    content = <ConsentDocs />;
  } else if (route === '#blog') {
    content = <Blog />;
  } else {
    content = <App />;
  }

  return (
    <Layout>
      {content}
    </Layout>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
);
