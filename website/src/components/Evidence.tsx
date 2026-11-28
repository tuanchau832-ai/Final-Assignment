import { Link } from 'react-router';
import type { DecisionMatrixData, FigureData, Reference, TableData } from '../content/types';

export function Pending({ children }: { children: string }) {
  return <p className="pending">[FILL: {children}]</p>;
}

export function Citation({ reference, references }: { reference?: Reference; references?: readonly Reference[] }) {
  const cited = references ?? (reference ? [reference] : []);
  const ordered = [...cited].sort((first, second) =>
    (first.citationAuthor ?? first.author).localeCompare(second.citationAuthor ?? second.author, 'en')
    || Number(!first.year.startsWith('n.d.')) - Number(!second.year.startsWith('n.d.'))
    || first.year.localeCompare(second.year));

  const groups: Reference[][] = [];
  for (const item of ordered) {
    const previous = groups.at(-1);
    if (previous && (previous[0].citationAuthor ?? previous[0].author) === (item.citationAuthor ?? item.author)) {
      if (!previous.some(({ id }) => id === item.id)) previous.push(item);
    } else groups.push([item]);
  }

  return <>(
    {groups.map((group, index) => (
      <span key={group[0].id}>
        {index > 0 && '; '}{group.map((item, itemIndex) => (
          <span key={item.id}>
            {itemIndex > 0 && ', '}<Link to={`/pages/references#${item.id}`}>
              {itemIndex === 0 ? `${item.citationAuthor ?? item.author}, ${item.year}` : item.year}
            </Link>
          </span>
        ))}
      </span>
    ))}
  )</>;
}

export function Bibliography({ references }: { references: readonly Reference[] }) {
  return (
    <ul className="bibliography">
      {references.map((reference) => (
        <li key={reference.id} id={reference.id} tabIndex={-1}>
          {reference.title ? (
            <>
              {reference.author}. ({reference.date ?? reference.year}). {reference.italicTitle === false
                ? reference.title : <cite>{reference.title}</cite>}{reference.description && <> {reference.description}</>}.
              {reference.siteName && reference.siteName !== reference.author && <> {reference.siteName}.</>}
              {reference.retrievedDate && <> Retrieved {reference.retrievedDate}, from</>}
              {reference.url && <> <a href={reference.url}>{reference.url}</a></>}
            </>
          ) : (
            <>{reference.entry}{reference.url && <> <a href={reference.url}>{reference.url}</a></>}</>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ReportFigure({ id, caption, image, source, pending }: FigureData) {
  return (
    <figure id={id}>
      {image && <img src={image.src} alt={image.alt} loading="lazy" />}
      <figcaption>{caption}{source && <> <Citation reference={source} /></>}</figcaption>
      {pending && <Pending>{pending}</Pending>}
    </figure>
  );
}

export function ReportTable({ id, caption, columns, rows, wide, scrollHint, pending }: TableData) {
  return (
    <figure>
      <figcaption id={`${id}-caption`}>{caption}</figcaption>
      {scrollHint && <p className="table-scroll-hint" id={`${id}-hint`}>{scrollHint}</p>}
      <div id={id} className={wide ? 'table-scroll table-scroll-wide' : 'table-scroll'} role="region"
        aria-labelledby={`${id}-caption`} aria-describedby={scrollHint ? `${id}-hint` : undefined} tabIndex={0}>
        <table aria-labelledby={`${id}-caption`}>
          <thead><tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>
            {rows.map(([label, ...cells]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {cells.map((cell, index) => <td key={columns[index + 1]}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pending && <Pending>{pending}</Pending>}
    </figure>
  );
}

export function DecisionMatrix({ id, caption, options, criteria, explanation, pending }: DecisionMatrixData) {
  const weights = criteria.reduce((total, criterion) => total + criterion.weight, 0);
  const complete = criteria.length > 0
    && Math.abs(weights - 100) < 0.000001
    && criteria.every(({ weight, scores }) => Number.isFinite(weight) && weight >= 0
      && scores.length === options.length && scores.every(Number.isFinite));
  const rows = criteria.map(({ name, weight, scores }) => [
    name, `${weight}%`, ...options.map((_, index) => scores[index]?.toString() ?? 'Pending'),
  ]);
  if (complete) {
    rows.push(['Weighted total', '100%', ...options.map((_, index) =>
      criteria.reduce((total, criterion) => total + criterion.weight * criterion.scores[index] / 100, 0).toFixed(2),
    )]);
  }

  return (
    <>
      <ReportTable id={id} caption={caption} columns={['Criterion', 'Weight', ...options]} rows={rows} pending={pending} />
      <p>{explanation}</p>
      {criteria.length > 0 && !complete && <p>Weighted totals require complete scores and nonnegative weights that add up to 100%.</p>}
    </>
  );
}
