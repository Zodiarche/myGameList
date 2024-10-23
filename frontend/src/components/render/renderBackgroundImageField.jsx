/**
 * Composant de champ d'image de fond.
 *
 * @param {string} url - URL de l'image de fond.
 * @param {Function} onChange - Fonction pour gérer le changement de l'URL.
 * @param {Function} onAdd - Fonction pour ajouter l'image de fond.
 * @param {string} backgroundImage - URL de l'image de fond actuelle.
 * @returns {JSX.Element} Composant de champ d'image de fond.
 */
export const renderBackgroundImageField = (url, onChange, onAdd, backgroundImage) => (
  <div className="modal__field">
    <label className="modal__label">Image de fond :</label>
    <div className="modal__multi-input">
      <input className="modal__input" type="text" placeholder="URL de l'image de fond" value={url} onChange={onChange} />
      <button type="button" className="modal__add" onClick={onAdd} disabled={!url.trim()}>
        Ajouter
      </button>
    </div>

    {backgroundImage && (
      <>
        <div>&nbsp;</div>
        <div className="modal__results">
          <div className="modal__game-item">
            <img src={backgroundImage} alt="Background" />
          </div>
        </div>
      </>
    )}
  </div>
);
