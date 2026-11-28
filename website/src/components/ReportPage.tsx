import { useEffect } from 'react';
import { Link } from 'react-router';
import { reportRoutes } from '../reportRoutes';
import { Bibliography, Citation, DecisionMatrix, Pending, ReportFigure, ReportTable } from './Evidence';

export function ReportPage({ index }: { index: number }) {
  const { section } = reportRoutes[index];
  const previous = reportRoutes[index - 1];
  const next = reportRoutes[index + 1];
  const isOverview = index === 0;

  useEffect(() => {
    document.title = isOverview ? 'Hanoi Water Watch | CITP Task 3' : `${section.title} | Hanoi Water Watch`;
  }, [isOverview, section.title]);

  return (
    <article>
      <header className="page-intro">
        <p className="draft-status">DRAFT — content pending verification</p>
        {isOverview && <p className="project-label">Project introduction and design report</p>}
        <h1>{section.title}</h1>
        <p className="intro-copy">{section.summary}</p>
      </header>
      {section.topics.map(({ id, title, pending, paragraphs, figure, table, matrix, bibliography, documents }) => (
        <section className="report-topic" key={id} aria-labelledby={id}>
          <h2 id={id} tabIndex={-1}>{title}</h2>
          {paragraphs?.map(({ text, citations }) => (
            <p key={text}>
              {citations && (section.label === 'Cost analysis' || id.startsWith('cost-'))
                ? <>{text.replace(/\.$/, '')} <Citation references={citations} />.</>
                : <>{text}{citations && <> <Citation references={citations} /></>}</>}
            </p>
          ))}
          {pending && <Pending>{pending}</Pending>}
          {figure && <ReportFigure {...figure} />}
          {table && <ReportTable {...table} />}
          {matrix && <DecisionMatrix {...matrix} />}
          {bibliography && bibliography.length > 0 && <Bibliography references={bibliography} />}
          {documents && documents.length > 0 && (
            <ul>
              {documents.map(({ title, url }) => <li key={url}><a href={url}>{title}</a></li>)}
            </ul>
          )}
        </section>
      ))}
      <nav className="page-sequence" aria-label="Report reading order">
        {previous && <Link to={previous.path}><span>Previous</span>{previous.section.label}</Link>}
        {next && <Link className="next" to={next.path}><span>Next</span>{next.section.label}</Link>}
      </nav>
    </article>
  );
}
