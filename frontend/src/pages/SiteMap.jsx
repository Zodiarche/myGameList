import { Link } from 'react-router-dom';

const SiteMap = () => {
  return (
    <main id="additional-pages">
      <section>
        <div className="wrapper">
          <h1>Plan du site</h1>

          <ul>
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
              <Link to="/legal-notice">Mentions légales</Link>
            </li>
            <li>
              <Link to="/privacy-police">Politique de confidentialités</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default SiteMap;
