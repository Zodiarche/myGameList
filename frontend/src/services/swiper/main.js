import * as utils from './utils.js';
import { swiperTopGamesConfiguration } from './constants.js';

export let swiperTopGames = null;

/**
 * @module SwiperJS/Main
 */

/**
 * Gère l'initialisation, la destruction et les changements d'état d'une instance de Swiper.
 * @param {Swiper} swiperInstance - Référence à l'instance Swiper actuelle.
 * @param {string} selector - Le sélecteur CSS de l'élément Swiper.
 * @param {Object.<string, string|boolean|number>} params - Un objet permettant contenant tous les paramètres du Swiper.
 * @returns {Swiper|null}
 */
const handleSwiperInstance = (swiperInstance, selector, params = {}) => {
  const selectorElement = document.querySelector(selector);
  console.log('handleSwiperInstance :', selectorElement);
  const isSwiperActive = utils.isSwiperActive(selectorElement);

  utils.updateSwiperClasses(selector, isSwiperActive);

  if (isSwiperActive && !swiperInstance) {
    return utils.activateSwiper(selector, params);
  } else if (!isSwiperActive && swiperInstance) {
    return utils.destroySwiper(swiperInstance);
  } else if (!isSwiperActive && !swiperInstance) {
    return null;
  } else {
    return swiperInstance;
  }
};

/**
 * Gère l'activation ou la désactivation des instances Swiper en fonction de la largeur de la fenêtre.
 */
export const initializeSwiperJS = () => {
  swiperTopGames = handleSwiperInstance(
    swiperTopGames,
    '#swiperTopGames',
    swiperTopGamesConfiguration
  );
};
