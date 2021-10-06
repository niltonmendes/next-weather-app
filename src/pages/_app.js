import React, { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

import '../styles/main.scss';

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    const start = () => NProgress.start();
    const end = () => NProgress.done();

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    }
  }, [])
  return <Component {...pageProps} />
}

export default MyApp;
