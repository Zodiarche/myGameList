import { initializeSwiper } from './initialize.js';
import { activateSwiperElements, desactivateSwiperElements } from './toggle-classes.js';

/**
 * @module SwiperJS/Utils
 */

/**
 * Met à jour les classes des éléments Swiper en fonction de la largeur d'écran.
 * @param {string} selector - Le sélecteur CSS de l'élément Swiper.
 * @param {boolean} isSwiperActive - Indique si Swiper doit être actif.
 */
export const updateSwiperClasses = (selector, isSwiperActive) => {
  const swiperElement = document.querySelector(selector);

  isSwiperActive ? activateSwiperElements(swiperElement) : desactivateSwiperElements(swiperElement);
};

/**
 * Gère l'activation d'une instance de Swiper.
 * @param {string} selector - Le sélecteur CSS de l'élément Swiper.
 * @param {Object.<string, string|boolean|number>} params - Un objet permettant de spécifier des sélecteurs pour différents types de Swiper.
 * @returns {Swiper|null}
 */
export const activateSwiper = (selector, params) => {
  return initializeSwiper(selector, params);
};

/**
 * Gère la destruction d'une instance de Swiper
 * @param {Swiper} swiperInstance  - Référence à l'instance de Swiper actuelle
 * @returns {null}
 */
export const destroySwiper = (swiperInstance) => {
  swiperInstance.destroy();

  return null;
};

/**
 * Vérifie si l'instance de Swiper doit être active en fonction des attributs de l'élément et de la largeur de la fenêtre.
 * @param {Element} selectorElement - L'élément contenant la classe de Swiper.
 * @returns {boolean} - Retourne `true` si Swiper doit être actif, sinon `false`.
 */
export const isSwiperActive = (selectorElement) => {
  console.log('isSwiperActive :', selectorElement);

  if (!selectorElement) return;

  const activationValue = selectorElement.getAttribute('data-swiper-activation');
  const windowWidth = window.innerWidth;

  if (activationValue === 'both' || activationValue === null) return true;
  if (activationValue === 'desktop' && windowWidth >= 992) return true;
  if (activationValue === 'mobile' && windowWidth < 992) return true;

  return false;
};
