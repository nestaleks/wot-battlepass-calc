document.addEventListener('DOMContentLoaded', function() {
    // Translations
    const translations = {
        uk: {
            'calculator-title': 'Калькулятор прогресу',
            'battlepass-title': 'Бойова перепустка 18 сезон',
            'info-period': 'з 4 березня до 3 червня',
            'info-description': 'Вкажіть главу, яку вже виконуєте, етап та кількість отриманих очок в етапі і нажмите кнопку.',
            'chapter-label': 'Глава (1-3):',
            'stage-label': 'Етап (1-50):',
            'points-label': 'Кількість очок в етапі:',
            'calculate-btn': 'Розрахувати',
            'copy-btn': 'Копіювати результати',
            'copy-status': 'Скопійовано!',
            'results-title': 'Результати розрахунку:',
            'current-date': 'Поточна дата:',
            'end-date': 'Кінцева дата:',
            'days-left': 'Залишилося днів:',
            'current-chapter': 'Поточна глава:',
            'current-stage': 'етап:',
            'global-stage': 'загальний етап:',
            'total-points': 'Всього очок отримано:',
            'points-left': 'Очок залишилось:',
            'average-points': 'Середня кількість очок в день за весь період:',
            'expected-today': 'Сьогодні ви повинні бути на: глава',
            'expected-stage': 'етап',
            'expected-points': 'з',
            'expected-points-end': 'очками в етапі',
            'progress-ahead': 'Ви випереджаєте графік на',
            'progress-behind': 'Ви відстали від графіку на',
            'points-word': 'очок',
            'current-progress': 'Поточний прогрес:',
            'daily-need': 'Щоб встигнути набрати необхідну кількість очок, вам необхідно набирати',
            'daily-need-end': 'очок в день.',
            'history-title': 'Історія прогресу:',
            'history-date': 'Дата',
            'history-chapter': 'Глава',
            'history-stage': 'Етап',
            'history-stage-points': 'Очки в етапі',
            'history-total': 'Всього очок',
            'event-not-started': 'Подія ще не почалася. Старт',
            'event-ended': 'Подія вже завершилася',
            'fill-fields': 'Будь ласка, заповніть всі поля коректно',
            'copy-error': 'Не вдалося скопіювати текст',
            'results-copy-text': 'Результати розрахунку на'
        },
        en: {
            'calculator-title': 'Progress Calculator',
            'battlepass-title': 'Battle Pass Season 18',
            'info-period': 'March 4 - June 3',
            'info-description': 'Enter the chapter you are currently working on, stage and the number of points received in the stage, then click the button.',
            'chapter-label': 'Chapter (1-3):',
            'stage-label': 'Stage (1-50):',
            'points-label': 'Points in stage:',
            'calculate-btn': 'Calculate',
            'copy-btn': 'Copy Results',
            'copy-status': 'Copied!',
            'results-title': 'Calculation Results:',
            'current-date': 'Current date:',
            'end-date': 'End date:',
            'days-left': 'Days remaining:',
            'current-chapter': 'Current chapter:',
            'current-stage': 'stage:',
            'global-stage': 'global stage:',
            'total-points': 'Total points earned:',
            'points-left': 'Points remaining:',
            'average-points': 'Average points per day for the entire period:',
            'expected-today': 'Today you should be on: chapter',
            'expected-stage': 'stage',
            'expected-points': 'with',
            'expected-points-end': 'points in stage',
            'progress-ahead': 'You are ahead of schedule by',
            'progress-behind': 'You are behind schedule by',
            'points-word': 'points',
            'current-progress': 'Current progress:',
            'daily-need': 'To earn the required number of points in time, you need to earn',
            'daily-need-end': 'points per day.',
            'history-title': 'Progress History:',
            'history-date': 'Date',
            'history-chapter': 'Chapter',
            'history-stage': 'Stage',
            'history-stage-points': 'Stage Points',
            'history-total': 'Total Points',
            'event-not-started': 'Event has not started yet. Start',
            'event-ended': 'Event has already ended',
            'fill-fields': 'Please fill in all fields correctly',
            'copy-error': 'Failed to copy text',
            'results-copy-text': 'Calculation results for'
        },
        ru: {
            'calculator-title': 'Калькулятор прогресса',
            'battlepass-title': 'Боевой пропуск 18 сезон',
            'info-period': 'с 4 марта по 3 июня',
            'info-description': 'Укажите главу, которую уже выполняете, этап и количество полученных очков в этапе и нажмите кнопку.',
            'chapter-label': 'Глава (1-3):',
            'stage-label': 'Этап (1-50):',
            'points-label': 'Количество очков в этапе:',
            'calculate-btn': 'Рассчитать',
            'copy-btn': 'Копировать результаты',
            'copy-status': 'Скопировано!',
            'results-title': 'Результаты расчёта:',
            'current-date': 'Текущая дата:',
            'end-date': 'Конечная дата:',
            'days-left': 'Осталось дней:',
            'current-chapter': 'Текущая глава:',
            'current-stage': 'этап:',
            'global-stage': 'общий этап:',
            'total-points': 'Всего очков получено:',
            'points-left': 'Очков осталось:',
            'average-points': 'Среднее количество очков в день за весь период:',
            'expected-today': 'Сегодня вы должны быть на: глава',
            'expected-stage': 'этап',
            'expected-points': 'с',
            'expected-points-end': 'очками в этапе',
            'progress-ahead': 'Вы опережаете график на',
            'progress-behind': 'Вы отстали от графика на',
            'points-word': 'очков',
            'current-progress': 'Текущий прогресс:',
            'daily-need': 'Чтобы успеть набрать необходимое количество очков, вам необходимо набирать',
            'daily-need-end': 'очков в день.',
            'history-title': 'История прогресса:',
            'history-date': 'Дата',
            'history-chapter': 'Глава',
            'history-stage': 'Этап',
            'history-stage-points': 'Очки в этапе',
            'history-total': 'Всего очков',
            'event-not-started': 'Событие ещё не началось. Старт',
            'event-ended': 'Событие уже завершилось',
            'fill-fields': 'Пожалуйста, заполните все поля корректно',
            'copy-error': 'Не удалось скопировать текст',
            'results-copy-text': 'Результаты расчёта на'
        }
    };

    let currentLang = localStorage.getItem('preferred-language') || 'uk';
    
    // Utility functions for UTC+3 timezone
    function getUTC3Date() {
        const now = new Date();
        // Create a new date representing current time in UTC+3
        const utc3 = new Date(now.getTime() + ((now.getTimezoneOffset() + (3 * 60)) * 60000));
        utc3.setHours(0, 0, 0, 0); // Set to start of day
        return utc3;
    }
    
    function createUTC3Date(year, month, day, hour = 0, minute = 0, second = 0, ms = 0) {
        // Create date assuming local timezone, then adjust if needed
        return new Date(year, month, day, hour, minute, second, ms);
    }
    
    const CONFIG = {
        TOTAL_POINTS: 7500,
        POINTS_PER_STAGE: 50,
        STAGES_PER_CHAPTER: 50,
        POINTS_PER_CHAPTER: 2500,
        CHAPTERS_TOTAL: 3,
        START_DATE: createUTC3Date(2026, 2, 4, 0, 0, 0, 0), // March 4th, 2026 (UTC+3)
        END_DATE: createUTC3Date(2026, 5, 3, 23, 59, 59, 999), // June 3rd, 2026 (UTC+3)
        periodText: "з 4 березня до 2 червня",
        descriptionText: "Вкажіть главу, яку вже виконуєте, етап та кількість отриманих очок в етапі і нажмите кнопку.",
        maxChapters: 3
    };


    const form = document.getElementById('progress-form');
    const resultBlock = document.getElementById('result');

    // Language functions
    function translate(key) {
        return translations[currentLang][key] || translations['uk'][key] || key;
    }

    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferred-language', lang);
        
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = translate(key);
        });
        
        // Update period text in CONFIG
        CONFIG.periodText = translate('info-period');
        CONFIG.descriptionText = translate('info-description');
        
        // Update date texts
        const dateTexts = {
            uk: { start: '4 березня', end: '3 червня' },
            en: { start: 'March 4', end: 'June 3' },
            ru: { start: '4 марта', end: '3 июня' }
        };
        CONFIG.startDateText = dateTexts[lang].start;
        CONFIG.endDateText = dateTexts[lang].end;
        
        updateModeUI();
    }

    // Initialize language
    updateLanguage(currentLang);

    // Language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateLanguage(btn.dataset.lang);
        });
    });

    updateModeUI();

    form.addEventListener('submit', calculateProgress);
    loadHistory();


    function updateModeUI() {
        const config = getCurrentConfig();
        
        const periodEl = document.getElementById('info-period');
        if (periodEl) periodEl.textContent = config.periodText;
        const descEl = document.getElementById('info-description');
        if (descEl) descEl.textContent = config.descriptionText;
        
        const chapterInput = document.getElementById('chapter');
        const chapterLabel = document.querySelector('label[for="chapter"]');
        if (chapterInput && chapterLabel) {
            chapterInput.style.display = '';
            chapterLabel.style.display = '';
            chapterInput.parentElement.style.display = '';
            chapterInput.setAttribute('required', 'required');
            chapterInput.max = config.maxChapters;
            chapterLabel.textContent = translate('chapter-label').replace('(1-3)', `(1-${config.maxChapters})`);
        }
    }

    function getCurrentConfig() {
        return CONFIG;
    }

    function clearResults() {
        resultBlock.innerHTML = '';
        resultBlock.classList.remove('active');
    }

    function calculateProgress(e) {
        e.preventDefault();

        const config = getCurrentConfig();
        const chapter = parseInt(document.getElementById('chapter').value);
        const stage = parseInt(document.getElementById('stage').value);
        const pointsNumerator = parseInt(document.getElementById('points-numerator').value);

        const chapterValid = !isNaN(chapter);
        if (!chapterValid || isNaN(stage) || isNaN(pointsNumerator)) {
            showResult(translate('fill-fields'));
            return;
        }

        const today = getUTC3Date(); // Get current date in UTC+3

        if (today < config.START_DATE) {
            const startDateText = config.startDateText || '4 березня';
            showResult(`${translate('event-not-started')} ${startDateText} ${config.START_DATE.getFullYear()} року.`);
            return;
        }

        if (today > config.END_DATE) {
            const endDateText = config.endDateText || '3 червня';
            showResult(`${translate('event-ended')} ${endDateText} ${config.END_DATE.getFullYear()} року.`);
            return;
        }

        const totalDays = Math.ceil((config.END_DATE - config.START_DATE) / (1000 * 60 * 60 * 24));
        const averagePointsPerDay = Math.ceil(config.TOTAL_POINTS / totalDays);

        const daysPassed = Math.ceil((today - config.START_DATE) / (1000 * 60 * 60 * 24));
        const expectedPoints = Math.ceil(averagePointsPerDay * daysPassed);
        const expectedChapter = Math.ceil(expectedPoints / config.POINTS_PER_CHAPTER);
        const pointsInCurrentExpectedChapter = expectedPoints % config.POINTS_PER_CHAPTER;
        const expectedStage = Math.ceil(pointsInCurrentExpectedChapter / config.POINTS_PER_STAGE);
        const expectedStagePoints = pointsInCurrentExpectedChapter % config.POINTS_PER_STAGE;

        // Save calculation for language switching
        localStorage.setItem('lastCalculation', JSON.stringify({
            chapter: chapter,
            stage: stage,
            points: pointsNumerator
        }));

        const globalStageNumber = ((chapter - 1) * config.STAGES_PER_CHAPTER) + stage;
        let completedPoints = calculateCompletedPoints(chapter, stage, pointsNumerator, config);
        const remainingPoints = config.TOTAL_POINTS - completedPoints;
        const daysRemaining = Math.ceil((config.END_DATE - today) / (1000 * 60 * 60 * 24));
        const pointsPerDay = Math.ceil(remainingPoints / daysRemaining);

        const progressStatus = completedPoints >= expectedPoints 
            ? `${translate('progress-ahead')} ${completedPoints - expectedPoints} ${translate('points-word')}` 
            : `${translate('progress-behind')} ${expectedPoints - completedPoints} ${translate('points-word')}`;
        const progressClass = completedPoints >= expectedPoints ? 'highlight' : 'highlight-warning';

        saveToHistory(chapter, stage, pointsNumerator, completedPoints);

        displayResults(today, completedPoints, remainingPoints, daysRemaining, pointsPerDay, 
            chapter, stage, globalStageNumber, averagePointsPerDay, progressStatus, progressClass,
            expectedChapter, expectedStage, expectedStagePoints, config);
    }

    function calculateCompletedPoints(chapter, stage, pointsNumerator, config) {
        let points = 0;
        if (chapter > 1) {
            points += config.POINTS_PER_CHAPTER * (chapter - 1);
        }
        points += (stage - 1) * config.POINTS_PER_STAGE;
        points += pointsNumerator;
        return points;
    }

    function displayResults(today, completedPoints, remainingPoints, daysRemaining, pointsPerDay, 
        chapter, stage, globalStageNumber, averagePointsPerDay, progressStatus, progressClass,
        expectedChapter, expectedStage, expectedStagePoints, config) {
        
        const chapterInfo = `<p>${translate('current-chapter')} <span class="highlight">${chapter}</span>, ${translate('current-stage')} <span class="highlight">${stage}</span> (${translate('global-stage')} ${globalStageNumber})</p>`;
        
        const expectedInfo = `<p>${translate('expected-today')} <span class=\"highlight\">${expectedChapter}</span>, ${translate('expected-stage')} <span class=\"highlight\">${expectedStage}</span>, ${translate('expected-points')} <span class=\"highlight\">${expectedStagePoints}</span> ${translate('expected-points-end')}</p>`;

        const resultHTML = `
            <h3>${translate('results-title')}</h3>
            <p>${translate('current-date')} ${formatDate(today)}</p>
            <p>${translate('end-date')} ${formatDate(config.END_DATE)}</p>
            <p>${translate('days-left')} <span class="highlight">${daysRemaining}</span></p>
            ${chapterInfo}
            <p>${translate('total-points')} <span class="highlight">${completedPoints}</span> ${currentLang === 'uk' ? 'з' : currentLang === 'en' ? 'of' : 'из'} ${config.TOTAL_POINTS}</p>
            <p>${translate('points-left')} <span class="highlight">${remainingPoints}</span></p>
            <p>${translate('average-points')} <span class="highlight">${averagePointsPerDay}</span></p>
            ${expectedInfo}
            <p>${translate('current-progress')} <span class="${progressClass}">${progressStatus}</span></p>
            <p>${translate('daily-need')} <span class="highlight">${pointsPerDay}</span> ${translate('daily-need-end')}</p>

            <div class="actions-form">
                <button type="button" id="copy-btn" class="action-btn">${translate('copy-btn')}</button>
                <span id="copy-status" class="copy-status"></span>
            </div>
        `;
        showResult(resultHTML);
        
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = formatResultsForCopy(today, completedPoints, remainingPoints, 
                    daysRemaining, pointsPerDay, chapter, stage, progressStatus);
                copyToClipboard(text);
            });
        }
    }

    function formatResultsForCopy(today, completedPoints, remainingPoints, daysRemaining, 
        pointsPerDay, chapter, stage, progressStatus) {
        const chapterText = `${translate('current-chapter')} ${chapter}, ${translate('current-stage')} ${stage}`;

        return `${translate('results-copy-text')} ${formatDate(today)}:

${chapterText}
${translate('total-points')} ${completedPoints}
${translate('points-left')} ${remainingPoints}
${translate('days-left')} ${daysRemaining}
${progressStatus}
${translate('daily-need')} ${pointsPerDay} ${translate('daily-need-end').replace('.', '')}`;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const statusEl = document.getElementById('copy-status');
            statusEl.textContent = translate('copy-status');
            statusEl.style.opacity = '1';
            
            setTimeout(() => {
                statusEl.style.opacity = '0';
            }, 2000);
        }).catch(err => {
            console.error('Помилка копіювання:', err);
            alert(translate('copy-error'));
        });
    }

    function showResult(html) {
        resultBlock.innerHTML = html;
        resultBlock.classList.add('active');
    }

    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('uk-UA', options);
    }

    function saveToHistory(chapter, stage, points, totalPoints) {
        const history = JSON.parse(localStorage.getItem('wotBattlePassHistory') || '[]');
        const today = new Date().toISOString().split('T')[0];

        const existingEntryIndex = history.findIndex(entry => entry.date === today);
        const entry = {
            date: today,
            chapter: chapter,
            stage: stage,
            points: points,
            totalPoints: totalPoints
        };

        if (existingEntryIndex !== -1) {
            history[existingEntryIndex] = entry;
        } else {
            history.push(entry);
        }

        const sortedHistory = history
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        localStorage.setItem('wotBattlePassHistory', JSON.stringify(sortedHistory));
        displayHistory();
    }

    function loadHistory() {
        displayHistory();
    }

    function displayHistory() {
        const history = JSON.parse(localStorage.getItem('wotBattlePassHistory') || '[]');
        if (history.length === 0) return;

        const historyHTML = `
            <h3>${translate('history-title')}</h3>
            <table>
                <tr>
                    <th>${translate('history-date')}</th>
                    <th>${translate('history-chapter')}</th>
                    <th>${translate('history-stage')}</th>
                    <th>${translate('history-stage-points')}</th>
                    <th>${translate('history-total')}</th>
                </tr>
                ${history.sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(entry => `
                        <tr>
                            <td>${formatDate(new Date(entry.date))}</td>
                            <td>${entry.chapter}</td>
                            <td>${entry.stage}</td>
                            <td>${entry.points}</td>
                            <td>${entry.totalPoints}</td>
                        </tr>
                    `).join('')}
            </table>
        `;

        let historyBlock = document.getElementById('history');
        if (!historyBlock) {
            historyBlock = document.createElement('div');
            historyBlock.id = 'history';
            resultBlock.parentNode.insertBefore(historyBlock, resultBlock.nextSibling);
        }
        historyBlock.innerHTML = historyHTML;
    }
});
