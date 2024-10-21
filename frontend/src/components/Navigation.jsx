import { Link } from 'react-router-dom';

/**
 * Composant de navigation pour l'en-tête du site.
 *
 * @returns {JSX.Element}
 */
export const HeaderNavigation = () => {
  return (
    <nav id="header-nav" className="header__navigation">
      <ul className="header__navigation-menu">
        <li className="header__navigation-menu-item">
          <Link to="/">Accueil</Link>
        </li>

        <li className="header__navigation-menu-item">
          <Link to="/games">Jeux</Link>
        </li>

        <li className="header__navigation-menu-item">
          <Link to="/login">Profil</Link>
        </li>

        <li className="header__navigation-menu-item">
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

/**
 * Composant de navigation pour le pied de page bas du site.
 *
 * @returns {JSX.Element}
 */
export const FooterNavigation = () => {
  return (
    <nav className="footer__navigation">
      <ul className="footer__navigation-menu">
        <li className="footer__navigation-menu-item">
          <Link to="https://github.com/Zodiarche">&copy; Benjamin GUILLEMIN 2024</Link>
        </li>

        <li className="footer__navigation-menu-item">
          <Link to="/legal-notice">Mentions légales</Link>
        </li>

        <li className="footer__navigation-menu-item">
          <Link to="/privacy-policy">Politique de confidentialités</Link>
        </li>

        <li className="footer__navigation-menu-item">
          <Link to="/sitemap">Plan du site</Link>
        </li>
      </ul>
    </nav>
  );
};
