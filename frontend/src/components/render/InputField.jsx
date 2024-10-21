export const renderInputField = (label, name, value, onChange, type = 'text') => (
  <div className="modal__field">
    <label className="modal__label">{label} :</label>
    <input className="modal__input" type={type} name={name} value={value} onChange={onChange} />
  </div>
);
