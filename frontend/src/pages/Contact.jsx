import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    objet: '',
    message: '',
    RGPD: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const toggleCheckbox = () => {
    setFormData((prevData) => ({
      ...prevData,
      RGPD: !prevData.RGPD,
    }));
  };

  return (
    <main id="contact">
      <section id="contact" className="contact">
        <div className="wrapper">
          <div className="contact__form">
            <h1 className="contact__title">Me contacter</h1>

            <form onSubmit={handleSubmit}>
              <div className="field-container">
                <div className="field">
                  <label htmlFor="nom">
                    Nom <abbr title="Champ obligatoire">*</abbr>
                  </label>
                  <input type="text" name="nom" id="nom" value={formData.nom} onChange={handleChange} />
                </div>

                <div className="field">
                  <label htmlFor="prenom">
                    Prénom <abbr title="Champ obligatoire">*</abbr>
                  </label>
                  <input type="text" name="prenom" id="prenom" value={formData.prenom} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">
                  E-mail <abbr title="Champ obligatoire">*</abbr>
                </label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="telephone">
                  Téléphone <abbr title="Champ obligatoire">*</abbr>
                </label>
                <input type="tel" name="telephone" id="telephone" value={formData.telephone} onChange={handleChange} />
              </div>

              <div className="field">
                <p>
                  Votre demande concerne <abbr title="Champ obligatoire">*</abbr>
                </p>

                <div className="radio-container">
                  <div className="radio">
                    <input type="radio" id="suggestion" name="objet" value="Une suggestion" checked={formData.objet === 'Une suggestion'} onChange={handleChange} />
                    <label htmlFor="suggestion">Une suggestion</label>
                  </div>

                  <div className="radio">
                    <input type="radio" id="bug" name="objet" value="Un bug" checked={formData.objet === 'Un bug'} onChange={handleChange} />
                    <label htmlFor="bug">Un bug</label>
                  </div>

                  <div className="radio">
                    <input type="radio" id="contact" name="objet" value="Une prise de contact" checked={formData.objet === 'Une prise de contact'} onChange={handleChange} />
                    <label htmlFor="contact">Une prise de contact</label>
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">
                  Votre demande <abbr title="Champ obligatoire">*</abbr>
                </label>
                <textarea name="message" id="message" rows="10" value={formData.message} onChange={handleChange}></textarea>
              </div>

              <div className="RGPD-container">
                <div>
                  <input className="RGPD-input" id="RGPD" type="checkbox" name="RGPD" checked={formData.RGPD} onChange={handleChange} />
                  <span className="RGPD-checkbox" onClick={toggleCheckbox}></span>
                </div>

                <label className="RGPD-label" htmlFor="RGPD">
                  En soumettant ce formulaire, j'accepte que mes données personnelles soient stockées, traitées et utilisées dans le cadre de la communication qui peut en découler.{' '}
                  <abbr title="Champ obligatoire">*</abbr>
                </label>
              </div>

              <p className="field txt-right">
                <button id="contact-submit" type="submit" name="form-contact">
                  Envoyer ma demande
                </button>
              </p>

              <div
                id="recaptcha-container"
                className="g-recaptcha"
                data-sitekey="6LdN6msqAAAAAMDra2Vyk01RbGQ4Ui6TSsg014Tw"
                data-callback="onReCAPTCHASuccess"
                data-expired-callback="onReCAPTCHAExpired"
              ></div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactForm;
