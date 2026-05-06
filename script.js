
document.addEventListener('DOMContentLoaded', () => {
    // --- Глобальные переменные и константы ---
    const neonColors = [
        '#FF00FF', // Фиолетовый (Magenta/Fuchsia)
        '#00FF00', // Лаймовый
        '#FF0000', // Красный
        '#0000FF', // Синий
        '#FFFF00', // Желтый
        '#00FFFF'  // Бирюзовый (Cyan/Aqua)
    ];

    let currentLanguage = localStorage.getItem('language') || 'ru';
    const translations = {
        'ru': {
            aboutCreator: 'О создателе',
            aboutCreatorTitle: 'О создателе',
            aboutCreatorText: 'Привет! Меня зовут [Ваше Имя]. Я создал этот сайт, чтобы продемонстрировать функционал и дизайн.',
            register: 'Регистрация',
            registerTitle: 'Регистрация',
            login: 'Вход',
            loginTitle: 'Вход',
            profile: 'Профиль',
            usernameLabel: 'Никнейм:',
            passwordLabel: 'Пароль:',
            confirmPasswordLabel: 'Повтор пароля:',
            registerButton: 'Зарегистрироваться',
            loginButton: 'Войти',
            logoutButton: 'Выйти',
            profileTitle: 'Профиль',
            profileUsername: 'Никнейм:',
            profileRegDate: 'Дата регистрации:',
            profilePoints: 'Очки:',
            slide1Title: 'Добро пожаловать!',
            slide1Description: 'Выберите действие:',
            franchiseInfo: 'Информация о франшизе',
            secretKeeper: 'Секретник',
            slide2Title: 'Ещё что-то интересное',
            slide2Description: 'Здесь будет больше контента.',
            actionButton1: 'Действие 1',
            actionButton2: 'Действие 2',
            franchiseInfoTitle: 'Информация о франшизе',
            franchiseInfoText: 'Здесь будет подробная информация о франшизе. Условия, преимущества, контакты и т.д. Это может быть очень длинный текст или несколько параграфов.',
            franchiseInfoText2: 'Например, вы можете описать, что включает франшиза, какая поддержка предоставляется, необходимые инвестиции и ожидаемую доходность.',
            secretKeeperTitle: 'Секретник',
            secretKeeperPrompt: 'Введите секретный код, чтобы получить очки:',
            submitCodeButton: 'Отправить',
            passwordsMismatch: 'Пароли не совпадают!',
            usernameTaken: 'Никнейм уже занят.',
            registrationSuccess: 'Регистрация успешна!',
            invalidCredentials: 'Неверный никнейм или пароль.',
            secretCodeInvalid: 'Неверный секретный код или вы уже использовали его.',
            secretCodeSuccess: (points) => `Поздравляем! Вы получили ${points} очков!`,
            secretCodeAlreadyUsed: 'Вы уже использовали этот секретный код.',
            loginRequired: 'Пожалуйста, войдите, чтобы использовать Секретник.',
            loggedInAs: (username) => `Вы вошли как ${username}.`
        },
        'en': {
            aboutCreator: 'About Creator',
            aboutCreatorTitle: 'About Creator',
            aboutCreatorText: 'Hi! My name is [Your Name]. I created this site to showcase functionality and design.',
            register: 'Register',
            registerTitle: 'Registration',
            login: 'Login',
            loginTitle: 'Login',
            profile: 'Profile',
            usernameLabel: 'Username:',
            passwordLabel: 'Password:',
            confirmPasswordLabel: 'Confirm Password:',
            registerButton: 'Register',
            loginButton: 'Login',
            logoutButton: 'Logout',
            profileTitle: 'Profile',
            profileUsername: 'Username:',
            profileRegDate: 'Registration Date:',
            profilePoints: 'Points:',
            slide1Title: 'Welcome!',
            slide1Description: 'Choose an action:',
            franchiseInfo: 'Franchise Info',
            secretKeeper: 'Secret Keeper',
            slide2Title: 'More interesting things',
            slide2Description: 'More content will be here.',
            actionButton1: 'Action 1',
            actionButton2: 'Action 2',
            franchiseInfoTitle: 'Franchise Information',
            franchiseInfoText: 'Here you will find detailed information about the franchise. Terms, benefits, contacts, etc. This can be a very long text or several paragraphs.',
            franchiseInfoText2: 'For example, you can describe what the franchise includes, what support is provided, necessary investments, and expected profitability.',
            secretKeeperTitle: 'Secret Keeper',
            secretKeeperPrompt: 'Enter the secret code to get points:',
            submitCodeButton: 'Submit',
            passwordsMismatch: 'Passwords do not match!',
            usernameTaken: 'Username already taken.',
            registrationSuccess: 'Registration successful!',
            invalidCredentials: 'Invalid username or password.',
            secretCodeInvalid: 'Invalid secret code or you have already used it.',
            secretCodeSuccess: (points) => `Congratulations! You received ${points} points!`,
            secretCodeAlreadyUsed: 'You have already used this secret code.',
            loginRequired: 'Please log in to use the Secret Keeper.',
            loggedInAs: (username) => `You are logged in as ${username}.`
        }
    };

    // --- DOM Элементы ---
    const body = document.body;
    const authButton = document.getElementById('authButton');
    const loginButton = document.getElementById('loginButton');
    const languageToggleButton = document.querySelector('.language-toggle');
    const menuButtons = document.querySelectorAll('.menu-button');
    const sliderControls = document.getElementById('sliderControls');
    const slidesContainer = document.getElementById('slidesContainer');
    const slides = document.querySelectorAll('.slide');

    // Модальные окна
    const modals = {
        aboutCreator: document.getElementById('aboutCreatorModal'),
        register: document.getElementById('registerModal'),
        login: document.getElementById('loginModal'),
        profile: document.getElementById('profileModal'),
        franchiseInfo: document.getElementById('franchiseInfoModal'),
        secretKeeper: document.getElementById('secretKeeperModal')
    };
    const closeButtons = document.querySelectorAll('.close-button');

    // Формы
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const registerMessage = document.getElementById('registerMessage');
    const loginMessage = document.getElementById('loginMessage');
    const secretCodeInput = document.getElementById('secretCodeInput');
    const submitSecretCodeButton = document.getElementById('submitSecretCode');
    const secretKeeperMessage = document.getElementById('secretKeeperMessage');

    // Элементы профиля
    const profileUsernameDisplay = document.getElementById('profileUsernameDisplay');
    const profileRegDateDisplay = document.getElementById('profileRegDateDisplay');
    const profilePointsDisplay = document.getElementById('profilePointsDisplay');
    const logoutButton = document.getElementById('logoutButton');

    let currentSlideIndex = 0;
    let currentUser = null; // Для хранения данных текущего пользователя

    // --- Вспомогательные функции ---

    /**
     * Генерирует случайный HEX цвет из списка `neonColors`.
     * @returns {string} HEX цвет.
     */
    function getRandomNeonColor() {
        return neonColors[Math.floor(Math.random() * neonColors.length)];
    }

    /**
     * Устанавливает случайный неоновый градиент для элемента.
     * @param {HTMLElement} element - Элемент, которому нужно применить градиент.
     * @param {string} property - CSS свойство, например 'background' или 'border-image-source'.
     */
    function setRandomNeonGradient(element, property) {
        const c1 = getRandomNeonColor();
        const c2 = getRandomNeonColor();
        const c3 = getRandomNeonColor();
        element.style.setProperty('--neon-color-1', c1);
        element.style.setProperty('--neon-color-2', c2);
        element.style.setProperty('--neon-color-3', c3);
        element.style.setProperty('--neon-color-glow', c1); // Для свечения вокруг, можно использовать один из цветов градиента

        if (property === 'background') {
            element.style.background = `linear-gradient(45deg, var(--neon-color-1), var(--neon-color-2), var(--neon-color-3))`;
        } else if (property === 'border-image-source') {
            element.style.borderImageSource = `linear-gradient(to right, var(--neon-color-1), var(--neon-color-2), var(--neon-color-3))`;
        }
    }

    /**
     * Обновляет все тексты на странице в соответствии с выбранным языком.
     */
    function applyTranslations() {
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[currentLanguage][key]) {
                const translation = translations[currentLanguage][key];
                if (typeof translation === 'function') {
                    // Если перевод - функция (например, для сообщений с переменными)
                    // Здесь нужно будет вызывать ее с соответствующими аргументами,
                    // но для статических элементов просто используем ключ.
                    // Для кнопок на слайдах, сохраняем исходный текст для ::before
                    if (el.classList.contains('slide-button')) {
                        el.setAttribute('data-key-text', el.textContent); // Сохраняем оригинальный текст
                    }
                    el.textContent = key; // пока оставляем ключ, так как функцию нужно вызывать отдельно
                } else {
                     // Для кнопок на слайдах, сохраняем оригинальный текст в data-key-text
                    if (el.classList.contains('slide-button')) {
                        el.setAttribute('data-key-text', translation);
                    }
                    el.textContent = translation;
                }
            }
        });

        // Отдельная обработка для кнопки языка
        languageToggleButton.textContent = currentLanguage === 'ru' ? 'EN' : 'RU';
        languageToggleButton.dataset.lang = currentLanguage === 'ru' ? 'en' : 'ru';

        // Обновление состояния кнопки входа/регистрации
        updateAuthButton();
    }


    /**
     * Открывает модальное окно.
     * @param {string} modalId - ID модального окна (без префикса 'Modal').
     */
    function openModal(modalId) {
        if (modals[modalId]) {
            // Устанавливаем рандомный неоновый цвет для свечения модалки
            const c1 = getRandomNeonColor();
            modals[modalId].querySelector('.modal-content').style.setProperty('--neon-blue', c1);
            modals[modalId].classList.add('open');
            body.style.overflow = 'hidden'; // Запретить скролл основного контента
        }
    }

    /**
     * Закрывает модальное окно.
     * @param {string} modalId - ID модального окна (без префикса 'Modal').
     */
    function closeModal(modalId) {
        if (modals[modalId]) {
            modals[modalId].classList.remove('open');
            body.style.overflow = ''; // Разрешить скролл
            // Сбрасываем сообщения форм
            if (registerMessage) registerMessage.textContent = '';
            if (loginMessage) loginMessage.textContent = '';
            if (secretKeeperMessage) secretKeeperMessage.textContent = '';
        }
    }

    /**
     * Проверяет, вошел ли пользователь.
     * @returns {boolean} True, если пользователь вошел, иначе false.
     */
    function isLoggedIn() {
        return !!localStorage.getItem('currentUser');
    }

    /**
     * Получает данные текущего пользователя.
     * @returns {object|null} Объект пользователя или null, если не вошел.
     */
    function getCurrentUser() {
        const username = localStorage.getItem('currentUser');
        if (username) {
            const users = JSON.parse(localStorage.getItem('users')) || {};
            return users[username];
        }
        return null;
    }

    /**
     * Обновляет кнопку "Регистрация"/"Вход" на "Профиль".
     */
    function updateAuthButton() {
        if (isLoggedIn()) {
            const user = getCurrentUser();
            authButton.textContent = translations[currentLanguage].profile;
            authButton.dataset.key = 'profile';
            loginButton.style.display = 'none'; // Скрываем кнопку "Вход"
            if (user) {
                // Если есть текущий пользователь, используем его ник для сообщения
                authButton.setAttribute('title', translations[currentLanguage].loggedInAs(user.username));
            }
        } else {
            authButton.textContent = translations[currentLanguage].register;
            authButton.dataset.key = 'register';
            loginButton.style.display = 'block'; // Показываем кнопку "Вход"
            loginButton.textContent = translations[currentLanguage].login;
            loginButton.dataset.key = 'login';
            authButton.removeAttribute('title');
        }
    }

    /**
     * Сохраняет пользователей в localStorage.
     * @param {object} users - Объект с данными пользователей.
     */
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // --- Функционал Аутентификации ---

    /**
     * Регистрация пользователя.
     * @param {string} username - Никнейм.
     * @param {string} password - Пароль.
     */
    function registerUser(username, password) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            registerMessage.textContent = translations[currentLanguage].usernameTaken;
            registerMessage.style.color = neonColors[2]; // Красный
            return false;
        }

        const regDate = new Date().toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US');
        users[username] = {
            username: username,
            password: password, // В реальном проекте здесь должно быть хеширование пароля!
            regDate: regDate,
            points: 0,
            usedCodes: [] // Список использованных секретных кодов
        };
        saveUsers(users);
        registerMessage.textContent = translations[currentLanguage].registrationSuccess;
        registerMessage.style.color = neonColors[1]; // Лаймовый
        return true;
    }

    /**
     * Вход пользователя.
     * @param {string} username - Никнейм.
     * @param {string} password - Пароль.
     */
    function loginUser(username, password) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username] && users[username].password === password) {
            localStorage.setItem('currentUser', username); // Сохраняем ник текущего пользователя
            updateAuthButton();
            closeModal('login');
            // Если пользователь залогинился, и он на странице профиля, обновим ее
            if (modals.profile.classList.contains('open')) {
                displayProfile();
            }
            return true;
        }
        loginMessage.textContent = translations[currentLanguage].invalidCredentials;
        loginMessage.style.color = neonColors[2]; // Красный
        return false;
    }

    /**
     * Выход пользователя.
     */
    function logoutUser() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        updateAuthButton();
        closeModal('profile');
    }

    /**
     * Отображает данные профиля в модальном окне.
     */
    function displayProfile() {
        const user = getCurrentUser();
        if (user) {
            profileUsernameDisplay.textContent = user.username;
            profileRegDateDisplay.textContent = user.regDate;
            profilePointsDisplay.textContent = user.points;
            openModal('profile');
        } else {
            // Если каким-то образом нет текущего пользователя, но нажали "Профиль", переводим на вход
            openModal('login');
        }
    }

    // --- Функционал Слайдера ---
    /**
     * Переключает на указанный слайд.
     * @param {number} index - Индекс слайда (начиная с 0).
     */
    function showSlide(index) {
        if (index < 0 || index >= slides.length) return;

        currentSlideIndex = index;
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;

        // Обновляем активную кнопку управления
        document.querySelectorAll('.slider-control-button').forEach((button, i) => {
            if (i === index) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Применяем рандомные градиенты к новому слайду и панели управления
        setRandomNeonGradient(sliderControls, 'background');
        slides.forEach(slide => {
             setRandomNeonGradient(slide, 'background');
        });
        // А также к кнопкам на слайдах
        document.querySelectorAll('.slide-button').forEach(button => {
            setRandomNeonGradient(button, 'border-image-source'); // Для бордера кнопки
            // И устанавливаем цвет для текста "дырки"
            button.style.setProperty('--neon-color-glow', getRandomNeonColor());
        });
    }

    // --- Функционал Секретника ---
    const validSecretCodes = {
        'NEONSTAR': 100,
        'GLOWUP': 50,
        'MATRIXCODE': 150
    };

    function processSecretCode(code) {
        if (!isLoggedIn()) {
            secretKeeperMessage.textContent = translations[currentLanguage].loginRequired;
            secretKeeperMessage.style.color = neonColors[2]; // Красный
            return;
        }

        const user = getCurrentUser();
        if (!user) {
            // Это не должно произойти, если isLoggedIn() = true, но для безопасности
            secretKeeperMessage.textContent = translations[currentLanguage].loginRequired;
            secretKeeperMessage.style.color = neonColors[2];
            return;
        }

        const codeValue = validSecretCodes[code.toUpperCase()];
        if (codeValue !== undefined) {
            if (user.usedCodes.includes(code.toUpperCase())) {
                secretKeeperMessage.textContent = translations[currentLanguage].secretCodeAlreadyUsed;
                secretKeeperMessage.style.color = neonColors[2];
            } else {
                user.points += codeValue;
                user.usedCodes.push(code.toUpperCase());
                let users = JSON.parse(localStorage.getItem('users')) || {};
                users[user.username] = user;
                saveUsers(users);
                secretKeeperMessage.textContent = translations[currentLanguage].secretCodeSuccess(codeValue);
                secretKeeperMessage.style.color = neonColors[1]; // Лаймовый
            }
        } else {
            secretKeeperMessage.textContent = translations[currentLanguage].secretCodeInvalid;
            secretKeeperMessage.style.color = neonColors[2];
        }
    }


    // --- Обработчики событий ---

    // Кнопки верхнего меню
    menuButtons.forEach(button => {
        button.addEventListener('mouseover', (e) => {
            // При наведении на кнопки верхнего меню меняем обводку на градиентную
            setRandomNeonGradient(e.currentTarget, 'border-image-source');
            e.currentTarget.classList.add('hover-neon');
        });

        button.addEventListener('mouseout', (e) => {
            // Возвращаем белую обводку при уходе курсора
            e.currentTarget.style.borderImageSource = '';
            e.currentTarget.classList.remove('hover-neon');
            e.currentTarget.style.borderColor = 'var(--primary-text-color)'; // Возвращаем белый бордер
        });

        button.addEventListener('mousedown', (e) => {
            e.currentTarget.classList.add('pressed');
        });

        button.addEventListener('mouseup', (e) => {
            e.currentTarget.classList.remove('pressed');
        });

        button.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.key;
            if (action === 'register') {
                openModal('register');
            } else if (action === 'login') {
                openModal('login');
            } else if (action === 'profile') {
                displayProfile();
            } else if (action === 'aboutCreator') {
                openModal('aboutCreator');
            }
        });
    });

    // Переключатель языка
    languageToggleButton.addEventListener('click', (e) => {
        currentLanguage = (e.target.dataset.lang === 'ru') ? 'ru' : 'en';
        localStorage.setItem('language', currentLanguage);
        applyTranslations();
    });

    // Закрытие модальных окон по кнопке X или по клику вне контента
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(Object.keys(modals).find(key => modals[key] === modal));
            }
        });
    });

    Object.values(modals).forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) { // Если клик был прямо по фону модалки
                    closeModal(Object.keys(modals).find(key => modals[key] === modal));
                }
            });
        }
    });


    // Обработка форм
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.regUsername.value;
        const password = e.target.regPassword.value;
        const confirmPassword = e.target.regConfirmPassword.value;

        if (password !== confirmPassword) {
            registerMessage.textContent = translations[currentLanguage].passwordsMismatch;
            registerMessage.style.color = neonColors[2];
            return;
        }

        if (registerUser(username, password)) {
            // Можно автоматически залогинить после регистрации
            // loginUser(username, password);
            // closeModal('register');
            // Или просто показать сообщение и дать пользователю войти
            e.target.reset(); // Очистить форму
            setTimeout(() => {
                closeModal('register');
            }, 1500);
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.logUsername.value;
        const password = e.target.logPassword.value;

        if (loginUser(username, password)) {
            e.target.reset(); // Очистить форму
        }
    });

    logoutButton.addEventListener('click', logoutUser);

    // Управление слайдами
    sliderControls.addEventListener('click', (e) => {
        if (e.target.classList.contains('slider-control-button')) {
            const slideIndex = parseInt(e.target.dataset.slide);
            showSlide(slideIndex);
        }
    });

    // Кнопки на слайдах
    document.querySelectorAll('.slide-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            // Анимация пульсации
            e.currentTarget.classList.remove('pulsate'); // Сбрасываем, чтобы анимация сработала снова
            void e.currentTarget.offsetWidth; // Триггер рефлоу для перезапуска анимации
            e.currentTarget.classList.add('pulsate');

            if (action === 'franchiseInfo') {
                openModal('franchiseInfo');
            } else if (action === 'secretKeeper') {
                openModal('secretKeeper');
            }
            // Добавить другие действия для actionButton1, actionButton2 и т.д.
        });
    });

    // Обработка секретного кода
    submitSecretCodeButton.addEventListener('click', () => {
        processSecretCode(secretCodeInput.value);
        secretCodeInput.value = ''; // Очистить поле ввода
    });


    // --- Инициализация ---

    // 1. Инициализация частиц
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const MAX_PARTICLES = 100; // Максимальное количество частиц
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // 1-3px
            this.speedX = (Math.random() - 0.5) * 1; // -0.5 to 0.5
            this.speedY = (Math.random() - 0.5) * 1; // -0.5 to 0.5
            this.opacity = Math.random() * 0.5 + 0.5; // 0.5-1.0
            this.color = `rgba(255, 255, 255, ${this.opacity})`; // Белый светящийся
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Если частица вышла за пределы экрана, пересоздаем ее
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size * 3; // Эффект свечения
            ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.8})`; // Цвет свечения
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 0; // Сбрасываем, чтобы не влияло на другие элементы
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < MAX_PARTICLES; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animateParticles();


    // 2. Инициализация языка
    applyTranslations();

    // 3. Обновление состояния кнопки авторизации
    updateAuthButton();

    // 4. Загрузка первого слайда с рандомными градиентами
    showSlide(0);
});
