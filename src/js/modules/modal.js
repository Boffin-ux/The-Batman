import { disableScroll, enableScroll } from "./blockScrolled.js";
import trailers from "./trailers.js";

const modal = (trailerId, selector) => {
   const getModal = document.querySelector('.modal');
   const buttonPlay = document.querySelector('.main__button-play');
   let modalIframe = '';

   const openModal = e => {
      e.preventDefault();
      const modalInner = getModal.querySelector('.modal__inner');
      modalInner.innerHTML = `
         <iframe width="100%" height="100%" src="" title="YouTube video player" frameborder="0"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowfullscreen></iframe>
      `;

      modalIframe = modalInner.querySelector('iframe');
      trailerId ? modalIframe.src = trailers(trailerId) : modalIframe.src = trailers('id01');

      getModal.classList.add('modal--active');

      getModal.addEventListener('click', closeModal);
      disableScroll();
   };

   const closeModal = e => {
      if (!e.target.closest('.modal__inner')) {
         getModal.classList.remove('modal--active');
         modalIframe.src = '';
         if (selector) {
            selector.removeEventListener('click', openModal);
         }
      }
      enableScroll();
   };
   if (selector) {
      selector.addEventListener('click', openModal);
   } else {
      buttonPlay.addEventListener('click', openModal);
   }
};

export default modal;