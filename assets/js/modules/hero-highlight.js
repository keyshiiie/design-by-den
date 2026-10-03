// ============================================
// Анимация смены слова в hero highlight
// ============================================
(function () {
    'use strict';

    function init() {
        const wrapEl      = document.querySelector('.hero-title .highlight-wrap');
        const highlightEl = document.querySelector('.hero-title .highlight');
        const wordEl      = document.querySelector('.hero-title .highlight__word');
        if (!wrapEl || !highlightEl || !wordEl) return;

        const words = ['время', 'деньги', 'силы', 'ресурсы', 'нервы'];
        let currentIndex = 0;

        const INTERVAL       = 2800;   // 2.8s между сменами
        const ANIM_DURATION  = 500;    // совпадает с transition в CSS
        const WIDTH_DURATION = 400;    // ms — длительность анимации ширины

        function changeWord() {
            // 1. Уводим слово и плашку вверх (opacity → 0).
            highlightEl.classList.add('is-leaving');

            // 2. Когда слово скрыто — меняем текст + анимируем ширину.
            setTimeout(function () {
                // --- Фиксируем СТАРУЮ ширину в inline-style ДО смены текста ---
                const oldWidth = wrapEl.offsetWidth;
                wrapEl.style.width = oldWidth + 'px';
                wrapEl.offsetWidth; // reflow — стартовое значение зафиксировано

                // --- Меняем текст ---
                currentIndex = (currentIndex + 1) % words.length;
                wordEl.textContent = words[currentIndex];

                // --- Замеряем НОВУЮ ширину ---
                wrapEl.style.width = 'auto';
                const newWidth = wrapEl.offsetWidth;

                // --- Устанавливаем старую ширину (уже зафиксирована) ---
                wrapEl.style.width = oldWidth + 'px';
                wrapEl.offsetWidth; // reflow

                // --- Анимируем к новой ---
                wrapEl.style.width = newWidth + 'px';

                // --- После анимации снимаем inline-стиль ---
                setTimeout(function () {
                    wrapEl.style.width = '';
                }, WIDTH_DURATION);

                // --- Возвращаем слово ---
                highlightEl.classList.remove('is-leaving');
            }, ANIM_DURATION);
        }

        setInterval(changeWord, INTERVAL);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();