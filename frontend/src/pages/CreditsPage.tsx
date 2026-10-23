import { useEffect } from 'react';
import { brand, credits as copy } from '../content/copy';
import images from '../../../content/images.json';
import { thumbOf } from '../lib/images';

interface PhotoRecord {
  file: string;
  sareeType: string;
  description: string;
  source: string;
  sourceTitle?: string;
  author: string;
  license: string;
  licenseUrl: string;
  inStore: boolean;
  clientPhoto?: boolean;
}

/** Every licensed photo used in the store, with author, source and licence. */
export function CreditsPage() {
  useEffect(() => {
    document.title = `Photo credits | ${brand.name}`;
  }, []);
  // Third-party photos need a credit; the brand's own photos do not
  const records = (images as PhotoRecord[]).filter(
    (record) => record.inStore && !record.clientPhoto && record.licenseUrl,
  );

  return (
    <div className="wrap credits">
      <h1>{copy.title}</h1>
      {records.length === 0 ? (
        <p className="section-intro">{copy.own}</p>
      ) : (
        <>
          <p className="section-intro">{copy.intro}</p>
          <p className="section-intro">{copy.sa}</p>
        </>
      )}
      <ul className="credits-list">
        {records.map((record) => (
          <li key={record.file}>
            <img
              src={thumbOf(`/products/${record.file}`)}
              alt=""
              width={120}
              height={160}
              loading="lazy"
            />
            <div>
              <p className="credits-desc">{record.description}</p>
              <p>
                <a href={record.source} target="_blank" rel="noopener" className="link">
                  “{record.sourceTitle}”
                </a>{' '}
                {copy.by} {record.author}
              </p>
              <p>
                {copy.licence}:{' '}
                <a href={record.licenseUrl} target="_blank" rel="noopener license" className="link">
                  {record.license}
                </a>
                {' · '}
                {copy.shownAs}: {record.sareeType}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
