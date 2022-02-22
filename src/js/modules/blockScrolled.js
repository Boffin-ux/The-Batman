const disableScroll = () => {
   const checkResponse = () => {
      document.body.dataset.scrollY = window.scrollY;
      let scrollWidth = window.innerWidth - document.body.offsetWidth;
      console.log('scrollWidth: ', scrollWidth);
      document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      left: 0;
      width: 100%;
      overflow: hidden;
      height: 100vh;
      padding-right: ${scrollWidth}px;
   `;
   };
   checkResponse();
   window.addEventListener('resize', checkResponse);
};
const enableScroll = () => {
   document.body.style.cssText = '';
   window.scroll({
      top: document.body.dataset.scrollY
   });
};

export { disableScroll, enableScroll };
