document.addEventListener('DOMContentLoaded', () => {
    function addCard(cardId, structure) {
        // Создаем новый элемент div с классом 'card'
        let div = document.createElement("DIV");
        div.className = 'card';

        // Если structure включает div с классом 'card', убираем его
        let tempDiv = document.createElement("DIV");
        tempDiv.innerHTML = structure;
        let innerContent = tempDiv.firstChild.className === 'card' ? tempDiv.firstChild.innerHTML : structure;

        div.innerHTML = innerContent;

        // Добавляем созданный div в контейнер с классом 'main'
        document.querySelector('.main').appendChild(div);

        // Добавляем обработчик события для каждой карточки
        div.addEventListener('click', () => {
            window.location.href = `card.html?id=${cardId}`;
        });

        let deleteIcons = document.querySelectorAll('.delete-icon')
        for(let i = 0; i < deleteIcons.length; i++) {
            deleteIcons[i].addEventListener('click', (e) => {
            e.stopPropagation();
            div.remove(); // Удаляем элемент из DOM
            deleteCardFromLocalStorage(cardId); // Удаляем элемент из локального хранилища
        });
    }
    }

    // Загрузка всех карточек из локального хранилища и добавление их на страницу
    const loadAllCards = () => {
        const allCards = JSON.parse(localStorage.getItem('allCards')) || [];
        allCards.forEach((cardStructure, index) => {
            addCard(index, cardStructure);
        });

    };

    loadAllCards();

    function deleteCardFromLocalStorage(cardId) {
        let allCards = JSON.parse(localStorage.getItem('allCards')) || [];
        allCards.splice(cardId, 1); // Удаляем карточку из массива

        // Удаляем код и консольный код из localStorage
        localStorage.removeItem(`code-${cardId}`);
        localStorage.removeItem(`console-code-${cardId}`);

        localStorage.setItem('allCards', JSON.stringify(allCards)); // Сохраняем обновленный массив в локальное хранилище
        reloadCards(); // Перезагружаем карточки на странице
    }

    function reloadCards() {
        document.querySelector('.main').innerHTML = ''; // Очищаем текущие карточки
        loadAllCards(); // Загружаем все карточки заново
    }

    function reloadCards() {
        document.querySelector('.main').innerHTML = ''; // Очищаем текущие карточки
        loadAllCards(); // Загружаем все карточки заново
    }
});