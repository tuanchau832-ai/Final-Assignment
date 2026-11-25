import { useEffect } from 'react';
import pageHtml from './page.html?raw';
import { initSite } from './site';

/**
 * The report is one long hash-routed page (Home, Design, Solution, ...). The markup lives in page.html;
 * behaviour (menu, reveals, live demo, river canvases) is wired up by initSite() after the first render.
 * Do not wrap this in StrictMode: initSite() must run exactly once.
 */
export default function App() {
  useEffect(() => initSite(), []);
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
