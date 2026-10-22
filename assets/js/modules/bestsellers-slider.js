import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function initBestsellersSlider() {
    const sliders = document.querySelectorAll('.bestsellers-wrap .swiper');

    sliders.forEach((sliderEl) => {
        const wrap = sliderEl.closest('.bestsellers-wrap');
        if (!wrap) return;

        const nextEl = wrap.querySelector('.slider-arrow--next');
        const prevEl = wrap.querySelector('.slider-arrow--prev');
        const paginationEl = wrap.querySelector('.slider-pagination');

        new Swiper(sliderEl, {
            modules: [Navigation, Pagination, A11y],
            slidesPerView: 1,
            spaceBetween: 30,
            breakpoints: {
                640:  { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
            },
            navigation: {
                nextEl: nextEl || null,
                prevEl: prevEl || null,
                disabledClass: 'swiper-button-disabled', // ← стандартный класс Swiper
            },
            pagination: paginationEl ? {
                el: paginationEl,
                clickable: true,
            } : false,
            a11y: {
                enabled: true,
            },
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBestsellersSlider);
} else {
    initBestsellersSlider();
}