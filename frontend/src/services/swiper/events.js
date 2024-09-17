import { toggleBtn } from "../read-more.js";

/**
 * @module SwiperJS/Events
 */

/**
 * Réinitialise les boutons "Lire la suite" dans les diapositives d'un carrousel Swiper.
 * @param {Swiper} swiperInstance - L'instance de Swiper.
 */
export const resetReadMoreButtons = (swiperInstance) => {
  const slidesElement = swiperInstance.slides;

  slidesElement.forEach((slideElement) => {
    const btn = slideElement.querySelector(".swiper-slide__read-more-button");
    if (!btn) return;

    const isPressed = btn.getAttribute("aria-pressed") === "true";
    const isSlideActive = slideElement.classList.contains(
      "swiper-slide-active"
    );

    if (isPressed && !isSlideActive) return toggleBtn(btn);
  });
};
