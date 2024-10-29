import React, { useState } from 'react';
import { useForm } from '@formspree/react';
import toast, { Toaster } from 'react-hot-toast';

const ContactForm = () => {
  const [state, handleSubmit] = useForm('manynzew');
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    email: '',
    phone: '',
    object: '',
    message: '',
    RGPD: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const toggleCheckbox = () => {
    setFormData((previousData) => ({
      ...previousData,
      RGPD: !previousData.RGPD,
    }));
  };

  const validateForm = () => {
    const { name, firstname, email, phone, object, message, RGPD } = formData;

    if (!name || !firstname || !email || !phone || !object || !message) {
      toast.error('Tous les champs doivent être remplis.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("L'adresse e-mail n'est pas valide.");
      return false;
    }

    const phoneRegex = /^\+?\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Le numéro de téléphone doit être un format valide (10 à 15 chiffres).');
      return false;
    }

    if (name.length < 2 || firstname.length < 2) {
      toast.error('Le nom et le prénom doivent contenir au moins 2 caractères.');
      return false;
    }

    if (message.length < 10) {
      toast.error('Le message doit contenir au moins 10 caractères.');
      return false;
    }

    if (!RGPD) {
      toast.error('Veuillez accepter les termes de la RGPD.');
      return false;
    }

    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      await handleSubmit(event);
      if (state.succeeded) {
        toast.success('Message envoyé avec succès !');
        setFormData({
          name: '',
          firstname: '',
          email: '',
          phone: '',
          object: '',
          message: '',
          RGPD: false,
        });
      } else if (state.errors) {
        toast.error('Une erreur est survenue, veuillez réessayer.');
      }
    } catch (error) {
      toast.error('Erreur inattendue, réessayez plus tard.');
    }
  };

  return (
    <main id="contact">
      <Toaster position="top-right" />
      <section id="contact" className="contact">
        <div className="wrapper">
          <div className="contact__form">
            <h1 className="contact__title">Me contacter</h1>

            <form onSubmit={onSubmit}>
              <div className="field-container">
                <div className="field">
                  <label htmlFor="name">
                    Nom <abbr title="Champ obligatoire">*</abbr>
                  </label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                </div>

                <div className="field">
                  <label htmlFor="firstname">
                    Prénom <abbr title="Champ obligatoire">*</abbr>
                  </label>
                  <input type="text" name="firstname" id="firstname" value={formData.firstname} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">
                  E-mail <abbr title="Champ obligatoire">*</abbr>
                </label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="phone">
                  Téléphone <abbr title="Champ obligatoire">*</abbr>
                </label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="field">
                <p>
                  Votre demande concerne <abbr title="Champ obligatoire">*</abbr>
                </p>
                <div className="radio-container">
                  <div className="radio">
                    <input type="radio" id="suggestion" name="object" value="Une suggestion" checked={formData.object === 'Une suggestion'} onChange={handleChange} />
                    <label htmlFor="suggestion">Une suggestion</label>
                  </div>
                  <div className="radio">
                    <input type="radio" id="bug" name="object" value="Un bug" checked={formData.object === 'Un bug'} onChange={handleChange} />
                    <label htmlFor="bug">Un bug</label>
                  </div>
                  <div className="radio">
                    <input type="radio" id="contact" name="object" value="Une prise de contact" checked={formData.object === 'Une prise de contact'} onChange={handleChange} />
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
                  En soumettant ce formulaire, j'accepte que mes données personnelles soient stockées, traitées et utilisées dans le cadre de la communication qui peut en découler.
                  <abbr title="Champ obligatoire">*</abbr>
                </label>
              </div>

              <p className="field txt-right">
                <button id="contact-submit" className="contact__submit" type="submit" disabled={state.submitting}>
                  Envoyer ma demande
                </button>
              </p>

              <div
                id="recaptcha-container"
                className="g-recaptcha"
                data-sitekey="6Ley9m4qAAAAALIdkf-K8PqFtM24PgbENVP9SOvB"
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
