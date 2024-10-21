export const renderTextAreaField = (label, name, value, onChange) => (
  <div className="modal__field">
    <label className="modal__label">{label} :</label>
    <textarea className="modal__textarea" name={name} rows="4" value={value} onChange={onChange} />
  </div>
);
