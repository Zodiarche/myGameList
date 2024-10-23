/**
 * Composant de champ de saisie.
 *
 * @param {string} label - Label du champ.
 * @param {string} name - Nom de l'attribut du champ.
 * @param {string} value - Valeur actuelle du champ.
 * @param {Function} onChange - Fonction pour gérer le changement de valeur.
 * @param {string} [type='text'] - Type de champ (par défaut : 'text').
 * @returns {JSX.Element} Composant de champ de saisie.
 */
export const renderInputField = (label, name, value, onChange, type = 'text') => (
  <div className="modal__field">
    <label className="modal__label">{label} :</label>
    <input className="modal__input" type={type} name={name} value={value} onChange={onChange} />
  </div>
);
