/**
 * Initialise une instance de Swiper avec les paramètres spécifiés.
 * @param {string} selector - Le sélecteur CSS de l'élément Swiper.
 * @param {Object.<string, string|boolean|number>} params - Un objet contenant tous les paramètres du Swiper.
 * @returns {Swiper} - L'instance de Swiper créée.
 */
export const initializeSwiper = (selector, params) => {
  return new Swiper(selector, createSwiperConfig(params));
};

/**
 * Crée une configuration de base pour Swiper.
 * @param {Object.<string, string|boolean|number>} params - Un objet contenant tous les paramètres du Swiper.
 * @returns {Object.<string, string|boolean|number>} - La configuration de Swiper.
 */
const createSwiperConfig = (params) => {
  const config = {
    centeredSlides: params.centeredSlides || false,
    slidesPerView: params.slidesPerView || 1,
    autoHeight: params.autoHeight || false,
    spaceBetween: params.spaceBetween || 0,
    loop: params.loop || false,
    speed: params.speed || 300,
  };

  if (params.pagination) config.pagination = swiperPagination(params.pagination);
  if (params.navigation) config.navigation = swiperNavigation(params.navigation);
  if (params.autoplay) config.autoplay = swiperAutoplay(params.autoplay);
  if (params.scrollbar) config.scrollbar = swiperScrollBar(params.scrollbar);
  if (params.breakpoints) config.breakpoints = swiperBreakpoints(params.breakpoints);
  if (params.on) config.on = swiperOn(params.on);

  return config;
};

/**
 * Crée une configuration pour la pagination du Swiper.
 * @param {Object.<string, string|boolean|number>} pagination - Un objet contenant les paramètres de pagination du Swiper.
 * @returns {Object.<string, string|boolean|number>} - La configuration de pagination de Swiper.
 */
const swiperPagination = (pagination) => {
  return {
    el: pagination.el || null,
    clickable: pagination.clickable || false,
  };
};

/**
 * Crée une configuration pour la navigation du Swiper.
 * @param {Object.<string, string|boolean|number>} navigation - Un objet contenant les paramètres de navigation du Swiper.
 * @returns {Object.<string, string|boolean|number>} - La configuration de navigation de Swiper.
 */
const swiperNavigation = (navigation) => {
  return {
    nextEl: navigation.nextEl || null,
    prevEl: navigation.prevEl || null,
  };
};

/**
 * Crée une configuration pour l'autoplay du Swiper.
 * @param {Object.<string, string|boolean|number>} autoplay - Un objet contenant les paramètres d'autoplay du Swiper.
 * @returns {Object.<string, string|boolean|number>} - La configuration d'autoplay de Swiper.
 */
const swiperAutoplay = (autoplay) => {
  return {
    delay: autoplay.delay || 3000,
    disableOnInteraction: autoplay.disableOnInteraction || true,
  };
};

/**
 * Crée une configuration pour la barre de défilement du Swiper.
 * @param {Object.<string, string|boolean|number>} scrollbar - Un objet contenant les paramètres de la barre de défilement du Swiper.
 * @returns {Object.<string, string|boolean|number>} - La configuration de la barre de défilement de Swiper.
 */
const swiperScrollBar = (scrollbar) => {
  return {
    el: scrollbar.el || null,
  };
};

/**
 * Crée une configuration pour les points de rupture du Swiper.
 * @param {Object.<string, string|boolean|number>} breakpoints - Un objet contenant les paramètres des points de rupture du Swiper.
 * @returns {Object.<string, string|boolean|number>} - La configuration des points de rupture de  Swiper.
 */
const swiperBreakpoints = (breakpoints) => {
  const config = {};

  Object.keys(breakpoints).forEach((breakpoint) => {
    let breakpointConfig = {
      slidesPerView: breakpoints[breakpoint].slidesPerView || 1,
    };

    breakpointConfig = updateAutoplayConfig(breakpointConfig, breakpoints, breakpoint);
    breakpointConfig = updateNavigationConfig(breakpointConfig, breakpoints, breakpoint);

    config[breakpoint] = breakpointConfig;
  });

  return config;
};

/**
 * Crée une configuration pour les évènements du Swiper.
 * @param {Object.<string, Function>} handlers - Un objet contenant les fonctions des évènements du Swiper
 * @returns {Object.<string, Function>} - La configuration des évènements du Swiper
 */
const swiperOn = (handlers) => {
  return {
    slideChangeTransitionEnd: handlers.slideChangeTransitionEnd || function () {},
  };
};

/**
 * Met à jour la configuration avec les paramètres d'autoplay pour un breakpoint donné.
 * @param {Object.<string, string|boolean|number>} config - La configuration actuelle du Swiper.
 * @param {Object.<string, string|boolean|number>} breakpoints - Les paramètres des points de rupture du Swiper.
 * @param {string} breakpoint - Le point de rupture actuel.
 * @returns {Object.<string, string|boolean|number>} - La configuration mise à jour du Swiper.
 */
const updateAutoplayConfig = (config, breakpoints, breakpoint) => {
  if (breakpoints[breakpoint].autoplay === undefined) {
    return config;
  }

  return {
    ...config,
    autoplay: breakpoints[breakpoint].autoplay,
  };
};

/**
 * Met à jour la configuration avec les paramètres de navigation pour un breakpoint donné.
 * @param {Object.<string, string|boolean|number>} config - La configuration actuelle du Swiper.
 * @param {Object.<string, string|boolean|number>} breakpoints - Les paramètres des points de rupture du Swiper.
 * @param {string} breakpoint - Le point de rupture actuel.
 * @returns {Object.<string, string|boolean|number>} - La configuration mise à jour du Swiper.
 */
const updateNavigationConfig = (config, breakpoints, breakpoint) => {
  if (breakpoints[breakpoint].navigation === undefined) {
    return config;
  }

  return {
    ...config,
    navigation: {
      nextEl: breakpoints[breakpoint].navigation?.nextEl || '.swiper-button-next',
      prevEl: breakpoints[breakpoint].navigation?.prevEl || '.swiper-button-prev',
    },
  };
};
