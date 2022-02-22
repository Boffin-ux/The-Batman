const rating = (wrap = '.main__rating-stars') => {
   const ratingStarsWrap = document.querySelector(wrap);
   const getRatingStar = [...ratingStarsWrap.children];
   const ratingNumber = document.querySelector('.rating-positive');
   let positiveRating = localStorage.getItem('rating') ? JSON.parse(localStorage.getItem('rating')) : 0;

   const setActiveStar = (selectedStar) => {
      ratingNumber.textContent = selectedStar;
      getRatingStar.forEach((item, index) => {
         if (selectedStar > index) {
            item.classList.add('star--active');
         } else {
            item.classList.remove('star--active');
         }
      });
   };
   const setRating = e => {
      let selectStar = getRatingStar.indexOf(e.target.closest('.main__rating-star'));
      if (selectStar > -1 && e.type === 'click') {
         localStorage.setItem('rating', JSON.stringify(selectStar + 1));
         setActiveStar(selectStar + 1);
         positiveRating = localStorage.getItem('rating') ? JSON.parse(localStorage.getItem('rating')) : 0;
      } else if (selectStar > -1 && e.type === 'mouseover') {
         setActiveStar(selectStar + 1);
      }
   };
   const mouseOut = () => setActiveStar(positiveRating);
   setActiveStar(positiveRating);
   ratingStarsWrap.addEventListener('mouseover', setRating);
   ratingStarsWrap.addEventListener('click', setRating);
   ratingStarsWrap.addEventListener('mouseout', mouseOut);
};

export default rating;