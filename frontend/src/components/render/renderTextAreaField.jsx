/**
 * Composant de champ de zone de texte.
 *
 * @param {string} label - Label du champ.
 * @param {string} name - Nom de l'attribut du champ.
 * @param {string} value - Valeur actuelle du champ.
 * @param {Function} onChange - Fonction pour gérer le changement de valeur.
 * @returns {JSX.Element} Composant de champ de zone de texte.
 */
const renderTextAreaField = (label, name, value, onChange) => (
  <div className="modal__field">
    <label className="modal__label">{label} :</label>
    <textarea className="modal__textarea" name={name} rows="4" value={value} onChange={onChange} />
  </div>
);

export default renderTextAreaField;
