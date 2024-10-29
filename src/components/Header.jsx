import { Link } from 'react-router-dom';
import { useEvent } from 'react-use';

import MenuButton from './MenuButton';
import { HeaderNavigation } from './Navigation';

/**
 * Gère le clic sur le bouton de menu pour ouvrir ou fermer la navigation.
 * @param {Event} event - L'événement de clic.
 */
const handleMenuButtonClick = (event) => {
  event.preventDefault();

  const navigation = document.getElementById('header-nav');
  const menuButton = event.currentTarget;

  if (!navigation) {
    console.error('Navigation introuvable.');
    return;
  }

  if (!menuButton) {
    console.error('MenuButton introuvable.');
    return;
  }

  const pressed = menuButton.getAttribute('aria-pressed') === 'true';

  menuButton.setAttribute('aria-pressed', String(!pressed));
  document.body.classList.toggle('active');
  menuButton.classList.toggle('active');
  navigation.classList.toggle('active');
};

/**
 * Gère les clics sur le document pour fermer le menu lorsque l'utilisateur clique en dehors du menu ou sur un lien.
 * @param {Event} event - L'événement de clic.
 */
const handleDocumentClick = (event) => {
  const menuButton = document.getElementById('menu-button');
  const navigation = document.getElementById('header-nav');
  const tarteaucitron = document.getElementById('tarteaucitronRoot');
  const links = document.querySelectorAll('.header__navigation-menu-item a');

  if (!menuButton || !navigation) {
    console.error('MenuButton ou navigation introuvables.');
    return;
  }

  const clickedOutsideMenu =
    !menuButton.contains(event.target) &&
    !navigation.contains(event.target) &&
    (!tarteaucitron || !tarteaucitron.contains(event.target));

  const clickedOnLink = Array.from(links).some((link) => link.contains(event.target));

  if (!clickedOutsideMenu && !clickedOnLink) return;

  closeMenu();
};

/**
 * Gère le redimensionnement de la fenêtre pour fermer le menu si la largeur dépasse une certaine valeur.
 */
const handleWindowResize = () => {
  if (window.innerWidth < 1280) return;

  closeMenu();
};

/**
 * Ferme le menu et réinitialise les attributs associés.
 */
const closeMenu = () => {
  const menuButton = document.getElementById('menu-button');
  const navigation = document.getElementById('header-nav');

  if (!menuButton) {
    console.error('MenuButton introuvable lors de la tentative de fermeture.');
    return;
  }

  if (!navigation) {
    console.error('Navigation introuvable lors de la tentative de fermeture.');
    return;
  }

  menuButton.setAttribute('aria-pressed', 'false');
  document.body.classList.remove('active');
  menuButton.classList.remove('active');
  navigation.classList.remove('active');
};

/**
 * Composant Header pour l'en-tête du site.
 * @returns {JSX.Element}
 */
const Header = () => {
  useEvent('click', handleDocumentClick, document);
  useEvent('resize', handleWindowResize, window);

  return (
    <header id="header" className="header">
      <div className="wrapper">
        <div className="header__cols">
          <div className="header__cols--left">
            <div className="header__site-title">
              <Link to="/" title="Retour à l'accueil">
                MyGameList - Votre bibliothèque de jeux !
              </Link>
            </div>
          </div>

          <div className="header__cols--right">
            <HeaderNavigation />
            <MenuButton onClick={handleMenuButtonClick} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
