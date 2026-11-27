import { useEffect } from 'react';
import pageHtml from './content';
import { initSite } from './scripts/site';
import { initUx } from './scripts/ux';

/**
 * The report is one long hash-routed page (Home, Design, Solution, ...). The markup lives in content/;
 * behaviour (menu, reveals, live demo, canvases) is wired up by initSite() after the first render.
 * Do not wrap this in StrictMode: initSite() must run exactly once.
 */
export default function App() {
  useEffect(() => {
    initSite();
    initUx();
  }, []);
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
