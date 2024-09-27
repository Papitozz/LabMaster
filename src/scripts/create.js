document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.querySelector('.toggle-icon.uploadButton');
    const fileInput = document.getElementById('fileInput');
    const cardList = document.querySelector('.card-list');
    const scrollUpButton = document.getElementById('scrollUp');
    const scrollDownButton = document.getElementById('scrollDown');
    const namesContainer = document.querySelector('.container-names');
    const nameSearchInput = document.getElementById('nameSearch');
    const nameList = document.querySelector('.name-list');
    const deleteIcon = document.createElement('span');
    let currentCardIndex = 0;
    let cardsLoaded = false;
    let currentNameElement = null;
    let currentCardElement = null;
    let currentLanguageElement = null;
    let icons = document.querySelectorAll('.toggle-icon');
    const languageList = document.querySelector('.language-list');
    const languageSearchInput = document.getElementById('languageSearch');
    const addLanguageButton = document.querySelector('.addLanguageButton');
    const submitButton = document.getElementById('submitBtn');
    const works = document.querySelector('.works')

    // Загрузка названий из локального хранилища
    const loadNames = () => {
        const savedNames = JSON.parse(localStorage.getItem('names')) || [];
        savedNames.forEach(name => {
            addName(name);
        });
    };

    // Сохранение названий в локальное хранилище
    const saveNames = () => {
        const names = Array.from(nameList.querySelectorAll('div')).map(nameDiv => nameDiv.textContent);
        localStorage.setItem('names', JSON.stringify(names));
    };

    // Добавление нового названия
    const addName = (name) => {
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name'
        nameDiv.textContent = name;

        const deleteIcon = document.createElement('span');
        deleteIcon.className = 'delete-name';
        deleteIcon.addEventListener('click', () => {
            deleteName(nameDiv);
        });

        nameDiv.appendChild(deleteIcon);
        nameList.appendChild(nameDiv);
    };

    const deleteName = (nameDiv) => {
        nameDiv.remove();
        saveNames(); // Удаляем название из локального хранилища
    };


    // Функция для поиска названий
    const searchNames = () => {
        const searchTerm = nameSearchInput.value.toLowerCase();
        const names = Array.from(nameList.querySelectorAll('div'));
        names.forEach(nameDiv => {
            const name = nameDiv.textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                nameDiv.style.display = 'block';
            } else {
                nameDiv.style.display = 'none';
            }
        });
    };

    // Обработчик события для поля ввода поиска
    nameSearchInput.addEventListener('input', searchNames);

    // Добавление нового названия по клику на иконку "плюс"
    const addNameButton = document.querySelector('.names-flex .toggle-icon');
    addNameButton.addEventListener('click', () => {
        const newName = prompt('Введите новое название:');
        if (newName) {
            addName(newName);
            saveNames(); // Сохраняем новое название в локальное хранилище
        }
    });

    // Обработчик события для поля ввода поиска
    nameSearchInput.addEventListener('input', () => {
        const searchTerm = nameSearchInput.value.toLowerCase();
        const names = document.querySelectorAll('.name-list div');
        names.forEach(name => {
            const nameText = name.textContent.toLowerCase();
            if (nameText.includes(searchTerm)) {
                name.style.display = 'block';
            } else {
                name.style.display = 'none';
            }
        });
    });

    const loadCards = () => {
        const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
        savedCards.forEach((cardData, index) => {
            addCard(cardData.src, cardData.alt, index === 0, false);
        });
        cardsLoaded = true;

        if (!currentCardIndex && cardList.children.length > 0) {
            showCard(currentCardIndex);
        }
    };

    const saveCards = () => {
        const cards = document.querySelectorAll('.card:not([data-predefined]) img');
        const cardsData = Array.from(cards).map(card => ({
            src: card.src,
            alt: card.alt
        }));
        localStorage.setItem('cards', JSON.stringify(cardsData));
    };

    const addCard = (src, alt, isActive, manuallyAdded) => {
        const card = document.createElement('div');
        card.className = 'card';
        if (isActive) {
            card.classList.add('active');
        }
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = 'card-img';

        const deleteIcon = document.createElement('span');
        deleteIcon.className = 'delete-icon';
        deleteIcon.addEventListener('click', () => {
            const cardIndex = Array.from(cardList.children).indexOf(card);
            const previousIndex = currentCardIndex > 0 ? currentCardIndex - 1 : 0;

            card.remove();
            saveCards();

            if (currentCardIndex === cardIndex) {
                showCard(previousIndex);
            } else if (currentCardIndex > cardIndex) {
                currentCardIndex--;
                showCard(currentCardIndex);
            }
        });

        card.appendChild(img);
        card.appendChild(deleteIcon);
        cardList.appendChild(card);

        if (manuallyAdded) {
            saveCards();
        }
    };

    const showCard = (index) => {
        const cards = document.querySelectorAll('.card');
        if (cards.length === 0) return null;

        let currentCard = null;
        cards.forEach((card, i) => {
            card.classList.remove('active', 'slide-in-up', 'slide-out-up', 'slide-in-down', 'slide-out-down');
            if (i === currentCardIndex && i !== index) {
                card.classList.add(index > currentCardIndex ? 'slide-out-up' : 'slide-out-down');
            }
            if (i === index) {
                card.classList.add('active', index > currentCardIndex ? 'slide-in-down' : 'slide-in-up');
                currentCard = card;
            }
        });
        currentCardIndex = index;
        return currentCard;
    };

    const selectElement = (element) => {
        const allElements = element.parentElement.querySelectorAll('.selected');
        allElements.forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
    };

    // Обработчик события для клика на карточке
    cardList.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                currentCardElement = null
            } else {
                selectElement(card);
                currentCardElement = card
            }
        }
    });

    // Обработчик события для клика на названии
    nameList.addEventListener('click', (event) => {
        const name = event.target.closest('.name');
        if (name) {
            if (name.classList.contains('selected')) {
                name.classList.remove('selected');
                currentNameElement = null
            } else {
                selectElement(name);
                currentNameElement = name
            }
        }
    });

    // Обработчик события для клика на языке
    languageList.addEventListener('click', (event) => {
        const language = event.target.closest('.language');
        console.log(language)
        if (language) {
            if (language.classList.contains('selected')) {
                language.classList.remove('selected');
                currentLanguageElement = null
            } else {
                selectElement(language);
                currentLanguageElement = language
            }
        }
    });

    languageSearchInput.addEventListener('input', () => {
        const searchTerm = languageSearchInput.value.toLowerCase();
        const languages = Array.from(languageList.querySelectorAll('.language'));
        languages.forEach(languageDiv => {
            const language = languageDiv.textContent.toLowerCase();
            if (language.includes(searchTerm)) {
                languageDiv.style.display = 'block';
            } else {
                languageDiv.style.display = 'none';
            }
        });
    });

    scrollUpButton.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            showCard(currentCardIndex - 1);
        }
    });

    scrollDownButton.addEventListener('click', () => {
        const cards = document.querySelectorAll('.card');
        if (currentCardIndex < cards.length - 1) {
            showCard(currentCardIndex + 1);
        }
    });

    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        if (files.length === 0) {
            return;
        }

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                continue;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                addCard(e.target.result, file.name, cardList.children.length === 0, true);
            };
            reader.readAsDataURL(file);
        }
    });

    window.addEventListener('unload', () => {
        saveCards();
        saveNames();
    });

    submitButton.addEventListener('click', () => {
        if (currentNameElement && currentCardElement && currentLanguageElement) {
            const selectedName = currentNameElement ? currentNameElement.textContent : null;
            const selectedCard = currentCardElement ? currentCardElement.querySelector('img').src : null;
            const selectedLanguage = currentLanguageElement ? currentLanguageElement.textContent : null;
    
            let structure = `<div class="card">
                                <p id="selectedName">${selectedName}</p>
                                <img class="card-img" src="${selectedCard}" alt="Selected Card">
                                <p id="selectedLanguage">${selectedLanguage}</p>
                                <span class="delete-icon"></span>
                            </div>`;
            
            localStorage.setItem('structure', JSON.stringify(structure));
    
            // Добавляем структуру карточки в массив всех карточек
            let allCards = JSON.parse(localStorage.getItem('allCards')) || [];
            allCards.push(structure);
            localStorage.setItem('allCards', JSON.stringify(allCards));
    
            window.location.href = 'works.html';
        } else {
            alert("Выберите название, карточку и язык")
        }
    });

    loadCards();
    loadNames()
});