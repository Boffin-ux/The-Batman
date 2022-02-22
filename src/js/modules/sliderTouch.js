import modal from "./modal.js";

class SliderTouch {
   constructor({
      sliderWrap,
      sliderItems,
      slidesToShow = 3,
      position = 0,
      addClassName = false,
      btnNext,
      responsive = [],
   }) {
      this.sliderWrap = document.querySelector(sliderWrap);
      this.sliderItems = document.querySelector(sliderItems);
      this.slides = this.sliderItems.children;
      this.slidesToShow = slidesToShow;
      this.widthSlide = (100 / this.slidesToShow);
      this.addClassName = addClassName;
      this.position = position;
      this.responsive = responsive;
      this.btnNext = document.querySelector(btnNext);
      this.firstSlide = this.slides[0];
      this.lastSlide = this.slides[this.slides.length - 1];

      this.swipeStart = this.dragStart.bind(this);
      this.swipeEnd = this.dragEnd.bind(this);
      this.swipeAction = this.dragMove.bind(this);

      this.isDrag = false;
      this.animationId = '';
      this.timerId = '';
      this.timeTransform = '.6';
      this.startPosition = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.moving = this.widthSlide / 10;
      this.blockSlide = false;
   }
   cloneSlides() {
      if (this.slides.length <= this.slidesToShow) {
         [...this.slides].forEach(item => this.sliderItems.append(item.cloneNode(true)));
      }
      const cloneFirst = this.firstSlide.cloneNode(true);
      const cloneLast = this.lastSlide.cloneNode(true);
      this.sliderItems.append(cloneFirst);
      this.sliderItems.insertAdjacentElement('afterBegin', cloneLast);
   }
   addStyle() {
      let style = document.getElementById(`${this.addClassName}-style`);
      if (!style) {
         style = document.createElement('style');
         style.id = `${this.addClassName}-style`;
      }
      style.textContent = `
      .${this.addClassName} {
         min-width: calc(${this.widthSlide}% - 2.7rem);
         cursor: pointer;
         touch-action: none;
      }
      `;
      document.head.append(style);
   }
   addClass() {
      for (const item of [...this.slides]) {
         item.classList.add(`${this.addClassName}`);
      }
   }
   getPositionX(event) {
      return event.pageX;
   }
   dragStart(e) {
      this.sliderItems.ondragstart = () => false;

      if (e.target.closest(`.${this.addClassName}`)) {
         this.sliderItems.addEventListener('pointerup', this.swipeEnd);
         this.sliderItems.addEventListener('pointermove', this.swipeAction);
         this.sliderItems.addEventListener('pointerleave', this.swipeEnd);

         this.isDrag = true;
         this.animationId = requestAnimationFrame(this.animation.bind(this));
         this.startPosition = this.getPositionX(e);
      }
   }
   dragMove(e) {
      if (this.isDrag) {
         const currentPosition = this.getPositionX(e);
         this.currentTranslate = this.prevTranslate - ((currentPosition - this.startPosition) / this.startPosition * this.widthSlide);
      }
   }
   dragEnd(e) {
      this.isDrag = false;

      if (this.currentTranslate === this.prevTranslate && e.target.closest('.trailers__slider-item')) {
         const getId = e.target.closest('.trailers__slider-item').getAttribute('data-trailer');
         const selector = e.target.closest(`.${this.addClassName}`);
         modal(getId, selector);
      }

      const movedBy = this.currentTranslate - this.prevTranslate;

      if (movedBy < -this.moving && !this.blockSlide) {
         this.blockSlide = true;
         this.prevSlide();
      } else if (movedBy > this.moving && !this.blockSlide) {
         this.blockSlide = true;
         this.nextSlide();
      } else {
         this.currentTranslate = this.prevTranslate;
      }
      cancelAnimationFrame(this.animationId);
      this.sliderItems.removeEventListener('pointerup', this.swipeEnd);
      this.sliderItems.removeEventListener('pointermove', this.swipeAction);
      this.sliderItems.removeEventListener('pointerleave', this.swipeEnd);
   }
   nextSlide() {
      if (this.position < this.slides.length - 1) {
         this.setPosition(this.timeTransform, '+');
         if (this.position > this.slides.length - 2) {
            this.resetSlide(1);
         }
      }
   }
   prevSlide() {
      if (this.position > 0) {
         this.setPosition(this.timeTransform, '-');
         if (this.position < 1) {
            this.resetSlide(this.slides.length - 1);
         }
      }
   }
   resetSlide(value) {
      clearTimeout(this.timerId);
      this.setPosition(this.timeTransform);
      this.position = value;
      const clearTransition = () => {
         this.setPosition(0);
         this.blockSlide = false;
      };
      this.timerId = setTimeout(clearTransition, 600);
   }
   setPosition(time, sign) {
      if (sign) {
         sign === '+' ? ++this.position : --this.position;
      }
      if (this.mobilePosition) {
         this.currentTranslate = this.position * this.widthSlide;
      } else {
         this.currentTranslate = (this.position - 1) * this.widthSlide;
      }
      this.prevTranslate = this.currentTranslate;
      this.sliderItems.style.transition = `transform ${time}s`;
      this.moveSlider();

      const transitionEnd = () => {
         this.blockSlide = false;
         this.sliderItems.removeEventListener('transitionend', transitionEnd);
      };
      this.sliderItems.addEventListener("transitionend", transitionEnd);
   }
   moveSlider() {
      this.sliderItems.style.transform = `translateX(-${this.currentTranslate}%)`;
   }
   animation() {
      this.moveSlider();
      this.isDrag ? requestAnimationFrame(this.animation.bind(this)) : false;
   }
   controlSlider() {
      this.sliderItems.addEventListener('pointerdown', this.swipeStart);
      this.btnNext.addEventListener('click', () => {
         this.blockSlide = true;
         this.nextSlide();
      });
   }
   init() {
      this.addClass();
      this.cloneSlides();
      this.controlSlider();
      this.responseInit();
   }
   responseInit() {
      const slidesToShowDefault = this.slidesToShow;
      const allResponse = this.responsive.map(item => item.breakpoint);
      const maxResponse = Math.max(...allResponse);

      const checkResponse = () => {
         const widthWindow = document.documentElement.clientWidth;
         if (widthWindow < maxResponse) {
            for (let i = 0; i < allResponse.length; i++) {
               if (widthWindow < allResponse[i]) {
                  this.slidesToShow = this.responsive[i].slidesToShow;
                  this.widthSlide = (100 / this.slidesToShow);
                  this.addStyle();
                  this.moving = this.widthSlide / 20;
                  this.setPosition();
               }
            }
         } else {
            this.slidesToShow = slidesToShowDefault;
            this.widthSlide = (100 / this.slidesToShow);
            this.addStyle();
            this.moving = this.widthSlide / 10;
            this.setPosition();
         }
      };
      checkResponse();
      window.addEventListener('resize', checkResponse);
   }
}

const sliderTouch = new SliderTouch({
   sliderWrap: '.trailers__wrap',
   sliderItems: '.trailers__slider',
   slidesToShow: 2,
   position: 2,
   addClassName: 'slider-item',
   btnNext: '.trailers__slider-btn',
   responsive: [
      {
         breakpoint: 480,
         slidesToShow: 1,
      },
   ]
});

export default sliderTouch;