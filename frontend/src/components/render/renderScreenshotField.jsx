/**
 * Composant de champ de capture d'écran.
 *
 * @param {string} url - URL de la capture d'écran.
 * @param {Function} onChange - Fonction pour gérer le changement de l'URL.
 * @param {Function} onAdd - Fonction pour ajouter la capture d'écran.
 * @param {Array<string>} screenshots - Liste des captures d'écran existantes.
 * @param {Function} onRemove - Fonction pour supprimer une capture d'écran.
 * @returns {JSX.Element} Composant de champ de capture d'écran.
 */
export const renderScreenshotField = (url, onChange, onAdd, screenshots, onRemove) => (
  <div className="modal__field">
    <label className="modal__label">Captures d'écran :</label>
    <div className="modal__multi-input">
      <input className="modal__input" type="text" placeholder="URL de la capture d'écran" value={url} onChange={onChange} />
      <button type="button" className="modal__add" onClick={onAdd} disabled={!url.trim()}>
        Ajouter
      </button>
    </div>

    {screenshots.length > 0 && (
      <>
        <div>&nbsp;</div>
        <div className="modal__results">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="modal__game-item" onClick={() => onRemove(screenshot)}>
              <img src={screenshot} alt={`Screenshot ${index + 1}`} />
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);
