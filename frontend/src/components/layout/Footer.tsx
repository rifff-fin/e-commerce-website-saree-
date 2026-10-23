import { useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { brand, footer } from '../../content/copy';
import { getMotionPref, setMotionPref, subscribeMotion, type MotionPref } from '../../lib/motion';
import { LogoMark } from './Logo';

function MotionSwitch() {
  const pref = useSyncExternalStore(subscribeMotion, getMotionPref);
  return (
    <fieldset className="motion-switch">
      <legend>{footer.motion}</legend>
      {(Object.keys(footer.motionOptions) as MotionPref[]).map((option) => (
        <label key={option}>
          <input
            type="radio"
            name="motion"
            value={option}
            checked={pref === option}
            onChange={() => setMotionPref(option)}
          />
          <span>{footer.motionOptions[option]}</span>
        </label>
      ))}
    </fieldset>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <p className="footer-name">
            <LogoMark size={30} />
            <span>{brand.name}</span>
            <span lang="bn" className="bn-display">
              {brand.nameBn}
            </span>
          </p>
          <p className="footer-tagline">{brand.tagline}</p>
          <p className="footer-about">{footer.about}</p>
        </div>

        <nav aria-label={footer.shop}>
          <h2 className="footer-title">{footer.shop}</h2>
          <ul>
            <li>
              <Link to="/shop">{footer.links.all}</Link>
            </li>
            <li>
              <Link to="/shop?sort=new">{footer.links.newIn}</Link>
            </li>
            <li>
              <Link to="/shop?type=jamdani">{footer.links.jamdani}</Link>
            </li>
            <li>
              <Link to="/shop?occasion=Wedding">{footer.links.wedding}</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={footer.help}>
          <h2 className="footer-title">{footer.help}</h2>
          <ul>
            <li>
              <Link to="/track">{footer.links.track}</Link>
            </li>
            <li>
              <Link to="/faq">{footer.links.faq}</Link>
            </li>
            <li>
              <Link to="/wishlist">{footer.links.wishlist}</Link>
            </li>
            <li>
              <Link to="/credits">{footer.links.credits}</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="footer-title">{footer.contact}</h2>
          <address>
            <p>{brand.address}</p>
            <p>{brand.hours}</p>
            {brand.phone ? (
              <p>
                <a href={`tel:${brand.phone}`}>{brand.phone}</a>
              </p>
            ) : (
              <p className="footer-muted">{footer.contactSoon}</p>
            )}
          </address>
          <MotionSwitch />
        </div>
      </div>
      <div className="wrap footer-base">
        <p>{footer.rights(year)}</p>
        <p>
          <Link to="/credits">{footer.links.credits}</Link>
        </p>
      </div>
    </footer>
  );
}
