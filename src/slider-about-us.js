const swiper = new Swiper('.swiper-geschichte', {
    centeredSlides: true,
    slidesPerView: 1,
    loop: true,
    createElements: true,
    pagination: false,
    autoplay: {
        delay: 5000,
    },

    navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prev',
    },
    autoplayDisableOnInteraction: false,
    runCallbacksOnInit: true,
    on: {
        slideChange: function () {
            var currentSlide = this.realIndex + 1;
            document.querySelector('#currentSlide-about-us').innerHTML = currentSlide;
        },
        beforeInit: function () {
            let numOfSlides = this.wrapperEl.querySelectorAll(".swiper-slide").length;
            document.querySelector('#totalSlides-about-us').innerHTML = numOfSlides;
        }
    },
});