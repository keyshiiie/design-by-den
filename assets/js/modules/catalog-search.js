/**
 * Каталог: поиск с автодополнением.
 *
 * Три состояния:
 * 1. Пусто + не в фокусе → дропдаун скрыт.
 * 2. Фокус + пустой input → дропдаун с «Рекомендации».
 * 3. Введён текст → дропдаун с отфильтрованными совпадениями + крестик.
 */
(function () {
    'use strict';

    function init() {
        const root = document.querySelector('[data-catalog-search]');
        if (!root) return;

        const form     = root.querySelector('.catalog-search__form');
        const input    = root.querySelector('.catalog-search__input');
        const clearBtn = root.querySelector('.catalog-search__clear');
        const dropdown = root.querySelector('.catalog-search__dropdown');
        const list     = root.querySelector('.catalog-search__dropdown-list');
        const titleEl  = root.querySelector('.catalog-search__dropdown-title');

        if (!form || !input || !dropdown || !list) return;

        const suggestions = Array.isArray(window.catalog_search_suggestions)
            ? window.catalog_search_suggestions
            : [];

        // --------------------------------------------
        // Рендер списка
        // --------------------------------------------
        function renderList(items) {
            list.innerHTML = '';

            if (!items.length) {
                const li = document.createElement('li');
                li.className = 'catalog-search__dropdown-empty';
                li.textContent = 'Ничего не найдено';
                list.appendChild(li);
                return;
            }

            items.forEach(function (item) {
                const li = document.createElement('li');
                const a  = document.createElement('a');

                a.className = 'catalog-search__dropdown-item';
                a.href = item.url;
                a.textContent = item.title;
                a.setAttribute('role', 'option');

                li.appendChild(a);
                list.appendChild(li);
            });
        }

        // --------------------------------------------
        // Показать/скрыть дропдаун
        // --------------------------------------------
        function openDropdown(title, items) {
            titleEl.textContent = title;
            renderList(items);
            dropdown.hidden = false;
            root.classList.add('is-open');
            input.setAttribute('aria-expanded', 'true');
        }

        function closeDropdown() {
            dropdown.hidden = true;
            root.classList.remove('is-open');
            input.setAttribute('aria-expanded', 'false');
        }

        // --------------------------------------------
        // Фильтрация рекомендаций по введённому тексту
        // --------------------------------------------
        function getMatches(query) {
            const q = query.trim().toLowerCase();
            if (!q) return suggestions;

            return suggestions.filter(function (item) {
                return item.title.toLowerCase().includes(q);
            });
        }

        // --------------------------------------------
        // Обновить состояние (текст + крестик + дропдаун)
        // --------------------------------------------
        function update() {
            const hasText = input.value.trim().length > 0;

            // Крестик
            if (clearBtn) {
                clearBtn.hidden = !hasText;
            }

            // Дропдаун
            if (!document.activeElement || document.activeElement !== input) {
                // Не в фокусе — скрываем
                if (!hasText) closeDropdown();
                return;
            }

            if (hasText) {
                const matches = getMatches(input.value);
                openDropdown('Результаты', matches);
            } else {
                openDropdown('Рекомендации', suggestions);
            }
        }

        // --------------------------------------------
        // Слушаем события
        // --------------------------------------------
        input.addEventListener('focus', update);
        input.addEventListener('input', update);

        // Клик по крестику
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                input.value = '';
                input.focus();
                update();

                // Дёргаем событие, чтобы каталог перезапросил товары
                document.dispatchEvent(new CustomEvent('catalog:filter-changed'));
            });
        }

        // Клик вне — закрыть
        document.addEventListener('click', function (e) {
            if (root.contains(e.target)) return;
            closeDropdown();
        });

        // Esc — закрыть
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeDropdown();
                input.blur();
            }
        });

        // Клик по подсказке — не мешаем переходу по ссылке,
        // но перед этим закрываем дропдаун.
        list.addEventListener('click', function (e) {
            const link = e.target.closest('.catalog-search__dropdown-item');
            if (!link) return;
            closeDropdown();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();