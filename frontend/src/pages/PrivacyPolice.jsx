import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <main id="additional-pages">
      <section>
        <div className="wrapper">
          <h1>Politique de confidentialité</h1>

          <h2>Qui sommes-nous ?</h2>
          <p>
            Notre site web est : <Link to="/">myGameList</Link>
          </p>

          <h2>Utilisation des données personnelles collectées</h2>

          <h3>Google Analytics</h3>
          <p>
            Nous utilisons Google Analytics pour mesurer l'audience de notre site web. Google Analytics est un outil d'analyse web fourni par Google Inc. qui utilise des cookies pour aider le site à
            analyser comment les utilisateurs l'utilisent. Les données générées par les cookies concernant votre utilisation du site (y compris votre adresse IP) seront anonymisées puis transmises et
            stockées par Google sur des serveurs aux États-Unis.
          </p>

          <h3>Formulaire de contact</h3>
          <p>
            Si vous utilisez notre formulaire de contact, nous collectons les données suivantes : nom, prénom, adresse e-mail, numéro de téléphone, l'objet et le contenu de votre message. Ces données
            sont nécessaires pour nous permettre de répondre à vos demandes.
          </p>
          <p>Ces informations sont utilisées pour gérer nos contacts, répondre à vos requêtes et pour des besoins de suivi commercial, si cela est en accord avec vos préférences.</p>

          <h3>Comment nous protégeons vos données</h3>
          <p>
            Nous avons mis en place des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre la perte, le vol, l'accès non autorisé, la divulgation, la
            copie, l'utilisation ou la modification non autorisées.
          </p>

          <h3>Vos droits concernant vos données</h3>
          <p>
            Conformément au RGPD, vous avez le droit d'accéder à vos données personnelles, de les rectifier, de demander leur effacement, de limiter leur traitement ou de s'opposer à leur traitement,
            ainsi que le droit à la portabilité des données. Vous avez également le droit de retirer votre consentement à tout moment. Pour exercer ces droits, veuillez nous contacter aux coordonnées
            fournies sur notre site.
          </p>

          <h3>Consentement</h3>
          <p>En utilisant notre site web, vous consentez à notre Politique de Confidentialité.</p>

          <h3>Modification de notre politique de confidentialité</h3>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entreront en vigueur dès leur publication sur notre site web. Nous vous
            encourageons à consulter régulièrement cette page.
          </p>

          <h3>Contact</h3>
          <p>
            Pour toute question relative à cette politique de confidentialité ou si vous souhaitez exercer vos droits relatifs à vos données personnelles, veuillez nous contacter à
            <a href="mailto:digital@agencebuzz.com">digital@agencebuzz.com</a>
            ou via notre formulaire de contact disponible sur le site.
          </p>

          <p>&nbsp;</p>
          <p>&nbsp;</p>

          <p>
            <em>Date de dernière mise à jour : 23/10/2024</em>
          </p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
