const LandingPage = () => {
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
            <a href="#" className="landing-page__button">
              Rechercher un jeu
            </a>

            <p>&nbsp;</p>

            <a href="#top-games" className="scroll">
              <svg xmlns="http://www.w3.org/2000/svg" width="61" height="107" viewBox="0 0 61 107">
                <g transform="translate(-320 -932)">
                  <g transform="translate(320 932)">
                    <text className="a1" transform="translate(30 25)">
                      <tspan x="-20.242" y="16">
                        Scroll
                      </tspan>
                    </text>
                    <g className="b1">
                      <path
                        className="e1"
                        d="M30.5,0h.984A29.516,29.516,0,0,1,61,29.516V76.5A30.5,30.5,0,0,1,30.5,107h0A30.5,30.5,0,0,1,0,76.5v-46A30.5,30.5,0,0,1,30.5,0Z"
                      />
                      <path
                        className="f1"
                        d="M30.5,1h.983A28.517,28.517,0,0,1,60,29.517V76.5A29.5,29.5,0,0,1,30.5,106h0A29.5,29.5,0,0,1,1,76.5v-46A29.5,29.5,0,0,1,30.5,1Z"
                      />
                    </g>
                    <path
                      className="c1"
                      d="M18,20.679l8.93-8.937a1.681,1.681,0,0,1,2.384,0,1.7,1.7,0,0,1,0,2.391L19.2,24.258a1.685,1.685,0,0,1-2.327.049L6.68,14.14a1.688,1.688,0,0,1,2.384-2.391Z"
                      transform="translate(12.504 64.502)"
                    />
                    <path
                      className="d1"
                      d="M18,20.679l8.93-8.937a1.681,1.681,0,0,1,2.384,0,1.7,1.7,0,0,1,0,2.391L19.2,24.258a1.685,1.685,0,0,1-2.327.049L6.68,14.14a1.688,1.688,0,0,1,2.384-2.391Z"
                      transform="translate(12.504 50.999)"
                    />
                  </g>
                </g>
              </svg>
            </a>
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
      </div>
    </section>
  );
};

export default LandingPage;
