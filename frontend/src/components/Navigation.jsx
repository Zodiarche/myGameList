import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant de navigation pour l'en-tête du site.
 *
 * @returns {JSX.Element}
 */
const Navigation = () => {
  return (
    <nav id="header-nav" className="header__navigation">
      <ul className="header__navigation-menu">
        <li className="header__navigation-menu-item">
          <Link to="/">Accueil</Link>
        </li>

        <li className="header__navigation-menu-item">
          <Link to="/about">À propos de moi</Link>
        </li>

        <li className="header__navigation-menu-item">
          <Link to="/games">Mes jeux</Link>
        </li>

        <li className="header__navigation-menu-item">
          <Link to="/profile">Profil</Link>
        </li>

        <li className="header__navigation-menu-item">
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
