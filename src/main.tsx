import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ConsentDocs from './pages/ConsentDocs.tsx';
import Blog from './pages/Blog.tsx';
import AdsShowcase from './pages/AdsShowcase.tsx';
import { Layout } from './components/Layout';
import './index.css';

function Main() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    let lastRoute = window.location.hash;
    const handleHashChange = () => {
      const newRoute = window.location.hash;
      setRoute(newRoute);
      
      const PAGE_ROUTES = ['#gtm-consent-template', '#blog', '#ads-showcase'];
      const wasPage = PAGE_ROUTES.includes(lastRoute);
      const isPage = PAGE_ROUTES.includes(newRoute);
      
      // Only reset scroll to top if we are transitioning to/from a separate page route
      if (wasPage || isPage) {
        window.scrollTo(0, 0);
      }
      
      lastRoute = newRoute;
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let content;
  if (route === '#gtm-consent-template') {
    content = <ConsentDocs />;
  } else if (route === '#blog') {
    content = <Blog />;
  } else if (route === '#ads-showcase') {
    content = <AdsShowcase />;
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
