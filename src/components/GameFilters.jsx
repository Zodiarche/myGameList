import React from 'react';

const GameFilters = ({ filters, availableFilters, handleFilterChange }) => {
  const { platforms = [], tags = [], stores = [], esrbRatings = [], releaseYears = [], userRatings = [], metacriticRatings = [], playtimeRanges = [] } = availableFilters;

  return (
    <div className="filters">
      {/* Filtre par plateforme */}
      <div className="filters__group filters__group--platform">
        <label className="filters__label">Plateforme:</label>
        <select className="filters__select" name="platform" value={filters.platform} onChange={handleFilterChange}>
          <option value="">Toutes</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par tag */}
      <div className="filters__group filters__group--tag">
        <label className="filters__label">Tag:</label>
        <select className="filters__select" name="tag" value={filters.tag} onChange={handleFilterChange}>
          <option value="">Tous</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par magasin */}
      <div className="filters__group filters__group--store">
        <label className="filters__label">Magasin:</label>
        <select className="filters__select" name="store" value={filters.store} onChange={handleFilterChange}>
          <option value="">Tous</option>
          {stores.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par évaluation ESRB */}
      <div className="filters__group filters__group--esrbRating">
        <label className="filters__label">Évaluation ESRB:</label>
        <select className="filters__select" name="esrbRating" value={filters.esrbRating} onChange={handleFilterChange}>
          <option value="">Toutes</option>
          {esrbRatings.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par année de sortie */}
      <div className="filters__group filters__group--releaseYear">
        <label className="filters__label">Année de sortie:</label>
        <select className="filters__select" name="releaseYear" value={filters.releaseYear} onChange={handleFilterChange}>
          <option value="">Toutes</option>
          {releaseYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par évaluation des utilisateurs */}
      <div className="filters__group filters__group--userRating">
        <label className="filters__label">Évaluation utilisateurs:</label>
        <select className="filters__select" name="userRating" value={filters.userRating} onChange={handleFilterChange}>
          <option value="">Toutes</option>
          {userRatings.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par évaluation Metacritic */}
      <div className="filters__group filters__group--metacriticRating">
        <label className="filters__label">Évaluation Metacritic:</label>
        <select className="filters__select" name="metacriticRating" value={filters.metacriticRating} onChange={handleFilterChange}>
          <option value="">Toutes</option>
          {metacriticRatings.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par durée de jeu */}
      <div className="filters__group filters__group--playtime">
        <label className="filters__label">Durée de jeu:</label>
        <select className="filters__select" name="playtime" value={filters.playtime} onChange={handleFilterChange}>
          <option value="">Toutes</option>
          {playtimeRanges.map((range) => (
            <option key={range} value={range}>
              {range} heures
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GameFilters;
