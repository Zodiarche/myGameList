/**
 * Active les éléments Swiper en ajoutant les classes actives et en supprimant les classes inactives.
 * @param {Element} swiperElement - L'élément Swiper à activer.
 */
export const activateSwiperElements = (swiperElement) => {
  if (!swiperElement) return;

  const swiperWrapper = swiperElement.querySelector('.swiper-wrapper-inactive');
  const swiperSlides = swiperElement.querySelectorAll('.swiper-slide-inactive');
  const swiperPagination = swiperElement.querySelector('.swiper-pagination-inactive');

  swiperElement.classList.add('swiper');
  swiperElement.classList.remove('swiper-inactive');

  swiperWrapper?.classList.add('swiper-wrapper');
  swiperWrapper?.classList.remove('swiper-wrapper-inactive');

  swiperSlides.forEach((slide) => {
    slide?.classList.add('swiper-slide');
    slide?.classList.remove('swiper-slide-inactive');
  });

  swiperPagination?.classList.add('swiper-pagination');
  swiperPagination?.classList.remove('swiper-pagination-inactive');
};

/**
 * Désactive les éléments Swiper en supprimant les classes actives et en ajoutant les classes inactives.
 * @param {Element} swiperElement - L'élément Swiper à désactiver.
 */
export const desactivateSwiperElements = (swiperElement) => {
  if (!swiperElement) return;

  const swiperWrapper = swiperElement.querySelector('.swiper-wrapper');
  const swiperSlides = swiperElement.querySelectorAll('.swiper-slide');
  const swiperPagination = swiperElement.querySelector('.swiper-pagination');

  swiperElement.classList.add('swiper-inactive');
  swiperElement.classList.remove('swiper');

  swiperWrapper?.classList.add('swiper-wrapper-inactive');
  swiperWrapper?.classList.remove('swiper-wrapper');

  swiperSlides.forEach((slide) => {
    slide?.classList.add('swiper-slide-inactive');
    slide?.classList.remove('swiper-slide');
  });

  swiperPagination?.classList.add('swiper-pagination-inactive');
  swiperPagination?.classList.remove('swiper-pagination');
};
