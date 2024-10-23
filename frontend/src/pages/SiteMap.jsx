const SiteMap = () => {
  return (
    <main id="additional-pages">
      <section>
        <div class="wrapper">
          <h1 class="animation" data-animation="moveToDown">
            Plan du site
          </h1>

          <ul class="animation" data-animation="moveToUp">
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/games">Jeux</Link>
            </li>
            <li>
              <Link to="/login">Profil</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <a href="formulaire-de-contact.php">Contact</a>
            </li>
            <li>
              <a href="mentions-legales.php">Mentions légales</a>
            </li>
            <li>
              <a href="politique-de-confidentialite.php">Politique de confidentialité</a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default SiteMap;
