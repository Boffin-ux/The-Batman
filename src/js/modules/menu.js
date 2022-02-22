const menu = () => {
   const menuBurger = document.querySelector('.header__menu-burger');
   const headerWrap = document.querySelector('.header__wrap');

   const openMenu = () => {
      headerWrap.style.display = 'flex';
      document.addEventListener('click', closedMenu);
   };

   const closedMenu = e => {
      if (e.target.closest('.header__menu-close') ||
         e.target.closest('.header__logo') ||
         e.target.closest('a') ||
         !e.target.closest('.header__container')) {
         headerWrap.style.display = 'none';
      }
   };

   menuBurger.addEventListener('click', openMenu);
};

export default menu;