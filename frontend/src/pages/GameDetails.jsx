import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import SwiperNavigationButton from '../components/swiperNavigationButton';
import { ModalAddNote, ModalEditUserGame } from '../components';

import { createGameUser, fetchGameById, fetchGameUserById, fetchProfile } from '../services/api';
import { initializeSwiperJS } from '../services/swiper/main.js';

const GameDetails = () => {
  const { id } = useParams();
  const [showMoreTags, setShowMoreTags] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const TAGS_LIMIT = 5;

  const {
    data: game,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['game', id],
    queryFn: () => fetchGameById(id),
  });

  const { data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
    retry: false,
  });

  const { data: gameUser } = useQuery({
    queryKey: ['gameUser', id],
    queryFn: () => {
      return fetchGameUserById(id, user._id);
    },
    enabled: !!user,
  });

  // Initialisation du Swiper
  useEffect(() => {
    if (!game) return;

    const swiperElement = document.getElementById('swiperScreenshots');
    if (!swiperElement) return;

    initializeSwiperJS();
  }, [game]);

  // Mutation pour ajouter un jeu à la collection de l'utilisateur
  const mutation = useMutation({
    mutationFn: createGameUser,
    onSuccess: () => {
      alert('Jeu ajouté à votre bibliothèque !');
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du jeu", error);
    },
  });

  const handleSubmit = ({ note, etat, commentaire }) => {
    const hour = new Date().getTime();

    mutation.mutate({
      idGameBD: id,
      note,
      etat,
      commentaire,
      heure: hour,
      idUser: user._id,
    });
  };

  // Fonction pour afficher plus ou moins de tags
  const displayedTags = showMoreTags ? game?.tags : game?.tags.slice(0, TAGS_LIMIT);

  // Fonction pour gérer le clic sur le bouton
  const handleAddToCollectionClick = (event) => {
    event.preventDefault();
    if (!user) {
      setShowError(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <main id="game-details">
      <section id="game-details" className="game-details">
        <div className="game-details__wrapper">
          {isLoading && <p className="states__highlight">Le chargement du jeu est en cours.</p>}
          {isError && <p className="states__error">Une erreur est survenue durant la récupération du jeu.</p>}

          {!isLoading && !isError && (
            <>
              <h1 className="game-details__title">{game.name}</h1>
              <p>{game.description}</p>

              <div className="game-details__cols">
                <div className="game-details__col game-details__col--left">
                  <ul className="game-details__list game-details__list--overview">
                    <li className="game-details__item">Année de sortie: {new Date(game.released).getFullYear()}</li>
                    <li className="game-details__item">Note: {game.rating} / 5</li>
                    <li className="game-details__item">Nombre de votes: {game.ratings_count}</li>
                    <li className="game-details__item">Temps de jeu: {game.playtime} heures</li>
                    <li className="game-details__item">Metacritic: {game.metacritic}</li>
                    <li>
                      <a href="#" className={`game-details__button ${!user ? 'disabled' : ''}`} onClick={user ? handleAddToCollectionClick : (event) => event.preventDefault()}>
                        {gameUser ? 'Modifier dans ma bibliothèque' : 'Ajouter à ma bibliothèque'}
                      </a>
                      {!user && <p className="states__error">Veuillez vous connecter pour ajouter des jeux à votre bibliothèque.</p>}
                    </li>
                  </ul>
                </div>

                <div className="game-details__col game-details__col--right">
                  <img src={game.background_image} alt={game.name} />
                </div>
              </div>

              {game.platforms.length > 0 && (
                <>
                  <h2 className="game-details__subtitle">Plateformes</h2>
                  <ul className="game-details__list">
                    {game.platforms.map((platform, index) => (
                      <li className="game-details__item" key={index}>
                        {platform}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {game.stores.length > 0 && (
                <>
                  <h2 className="game-details__subtitle">Magasins</h2>
                  <ul className="game-details__list">
                    {game.stores.map((store, index) => (
                      <li className="game-details__item" key={index}>
                        {store}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {game.tags.length > 0 && (
                <>
                  <h2 className="game-details__subtitle">Tags</h2>
                  <ul className="game-details__list">
                    {displayedTags.map((tag, index) => (
                      <li className="game-details__item" key={index}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  {game.tags.length > TAGS_LIMIT && (
                    <button className="game-details__read-more" onClick={() => setShowMoreTags(!showMoreTags)}>
                      {showMoreTags ? 'Voir moins' : 'Voir plus'}
                    </button>
                  )}
                </>
              )}

              {game.ratings.length > 0 && (
                <>
                  <h2 className="game-details__subtitle">Évaluations détaillées</h2>
                  <ul className="game-details__list">
                    {game.ratings.map((rating) => (
                      <li className="game-details__item" key={rating.id}>
                        {rating.title} : {rating.count} votes ({rating.percent}%)
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {game.added_by_status && (
                <>
                  <h2 className="game-details__subtitle">Statut d'ajout par les utilisateurs</h2>
                  <ul className="game-details__list">
                    {game.added_by_status.owned > 0 && <li className="game-details__item">Possédé : {game.added_by_status.owned}</li>}
                    {game.added_by_status.beaten > 0 && <li className="game-details__item">Terminé : {game.added_by_status.beaten}</li>}
                    {game.added_by_status.toplay > 0 && <li className="game-details__item">À jouer : {game.added_by_status.toplay}</li>}
                    {game.added_by_status.dropped > 0 && <li className="game-details__item">Abandonné : {game.added_by_status.dropped}</li>}
                    {game.added_by_status.playing > 0 && <li className="game-details__item">En cours : {game.added_by_status.playing}</li>}
                  </ul>
                </>
              )}

              {game.esrb_rating && (
                <>
                  <h2 className="game-details__subtitle">Classification ESRB</h2>
                  <div className="game-details__list">
                    <p className="game-details__item">{game.esrb_rating.name}</p>
                  </div>
                </>
              )}

              {game.short_screenshots.length > 0 && (
                <>
                  <h2 className="game-details__subtitle">Captures d'écran</h2>
                  <div className="swiper" id="swiperScreenshots">
                    <div className="swiper-wrapper">
                      {game.short_screenshots.map((screenshot, index) => (
                        <div className="swiper-slide" key={index}>
                          <img src={screenshot} alt={`Screenshot ${index}`} />
                        </div>
                      ))}
                    </div>

                    <div className="swiper-button-next">
                      <SwiperNavigationButton />
                    </div>

                    <div className="swiper-button-prev">
                      <SwiperNavigationButton />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {gameUser ? (
        <ModalEditUserGame show={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} game={gameUser} />
      ) : (
        <ModalAddNote show={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
      )}
    </main>
  );
};

export default GameDetails;
