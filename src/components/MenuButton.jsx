/**
 * Composant MenuButton.
 *
 * @param {Object} props - Les propriétés passées au composant.
 * @param {function} props.onClick - Fonction appelée lors du clic sur le bouton.
 *
 * @returns {JSX.Element}
 */
const MenuButton = ({ onClick }) => {
  return (
    <button
      className="header__btn"
      aria-pressed="false"
      type="button"
      id="menu-button"
      tabIndex="1"
      onClick={onClick}
    >
      <span className="header__btn__burger"></span>
      <span className="header__btn__menu-title">Afficher le menu</span>
    </button>
  );
};

export default MenuButton;
