export const initializeTarteAuCitron = () => {
  tarteaucitron.init({
    privacyUrl: '',
    hashtag: '#tarteaucitron',
    cookieName: 'tarteaucitron',
    orientation: 'bottom',
    showAlertSmall: false,
    cookieslist: true,
    adblocker: false,
    AcceptAllCta: true,
    highPrivacy: true,
    handleBrowserDNTRequest: false,
    removeCredit: true,
  });

  // Ajouter reCAPTCHA au job de TarteAuCitron
  tarteaucitron.job = tarteaucitron.job || [];
  tarteaucitron.job.push('recaptcha');

  /**
   * Hook lorsque la bannière de TAC est chargée
   */
  const onTACLoaded = () => {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    const recaptchaContent = document.querySelector('.tac_float');
    const submitButton = document.getElementById('contact-submit');
    if (!recaptchaContainer && !recaptchaContent && !submitButton) return;

    submitButton.disabled = true;

    const recaptchaText = recaptchaContent?.childNodes[0];
    const recaptchaButton = recaptchaContent?.childNodes[1];
    if (!recaptchaText && !recaptchaButton) return;

    recaptchaText.textContent = 'Afin de soumettre de pouvoir soumettre votre formulaire, veuillez accepter les cookies en rapport à reCAPTCHA.';
    recaptchaButton.textContent = 'Autoriser reCAPTCHA';
  };

  /**
   * Vérifie si la bannière de TAC est chargée
   * @returns {boolean} - Retourne true si la bannière est chargée, sinon false
   */
  const checkTACLoaded = () => {
    const banner = document.querySelector('#tarteaucitronRoot');
    if (!banner) return false;

    onTACLoaded();

    return true;
  };

  /**
   * MutationObserver pour surveiller les changements dans le DOM
   */
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length <= 0) return;
      if (!checkTACLoaded()) return;

      observer.disconnect();
    });
  });

  observer.observe(document.body, { childList: true });
};
