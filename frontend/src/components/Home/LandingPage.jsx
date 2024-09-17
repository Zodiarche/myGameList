import { useState } from 'react';
import Modal from '../Modal';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section id="landing-page" className="landing-page">
      <div className="landing-page__wrapper">
        <div className="landing-page__cols">
          <div className="landing-page__col landing-page__col--left">
            <h1 className="landing-page__title">myGameList, créer votre bibliothèque de jeux !</h1>
            <p className="landing-page__description">
              Rassemblez votre collection de jeux et votre classement personnel en un seul endroit
              et partagez-la !
            </p>
            <ul className="landing-page__list">
              <li className="landing-page__item">Trouvez et notez des jeux facilement</li>
              <li className="landing-page__item">
                Organisez vos jeux par statut (À faire, En cours, Terminé, etc.)
              </li>
              <li className="landing-page__item">
                Partagez vos listes avec vos amis et la communauté
              </li>
            </ul>
            <a href="#" className="landing-page__button" onClick={() => setShowModal(true)}>
              Rechercher un jeu
            </a>

            <p>&nbsp;</p>
          </div>

          <div className="landing-page__col landing-page__col--right">
            <img
              src="../../../public/home-landing-page.png"
              alt=""
              loading="lazy"
              className="landing-page__image"
            />
          </div>
        </div>

        {/* Utilisation du composant Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)} />
      </div>
    </section>
  );
};

export default LandingPage;
