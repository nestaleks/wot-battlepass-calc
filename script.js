document.addEventListener('DOMContentLoaded', function() {
    // Mode configurations
    const MODES = {
        original: {
            TOTAL_POINTS: 7500,
            POINTS_PER_STAGE: 50,
            STAGES_PER_CHAPTER: 50,
            POINTS_PER_CHAPTER: 2500,
            CHAPTERS_TOTAL: 3,
            START_DATE: new Date(2025, 5, 4), // June 4th, 2025
            END_DATE: new Date(2025, 8, 2),   // September 2nd, 2025
            periodText: "з 4 червня до 2 вересня",
            descriptionText: "Вкажіть главу, яку вже виконуєте, етап та кількість отриманих очок в етапі і нажмите кнопку.",
            maxChapters: 3
        },
        alternative: {
            TOTAL_POINTS: 2500,
            POINTS_PER_STAGE: 50,
            STAGES_PER_CHAPTER: 50,
            POINTS_PER_CHAPTER: 2500,
            CHAPTERS_TOTAL: 1,
            START_DATE: new Date(2025, 7, 8), // August 8th, 2025
            END_DATE: new Date(2025, 7, 31),  // August 31st, 2025
            periodText: "з 8 серпня до 31 серпня",
            descriptionText: "Вкажіть етап та кількість отриманих очок в етапі і нажмите кнопку.",
            maxChapters: 1
        }
    };

    let currentMode = 'original';

    const form = document.getElementById('progress-form');
    const resultBlock = document.getElementById('result');

    // Initialize mode switching
    initializeModes();

    form.addEventListener('submit', calculateProgress);
    loadHistory(); // Add this line

    function initializeModes() {
        const modeRadios = document.querySelectorAll('input[name="mode"]');
        modeRadios.forEach(radio => {
            radio.addEventListener('change', handleModeChange);
        });
        
        // Set initial mode UI
        updateModeUI();
    }

    function handleModeChange(event) {
        currentMode = event.target.value;
        updateModeUI();
        clearResults();
    }

    function updateModeUI() {
        const config = getCurrentConfig();
        
        // Update info texts
        document.getElementById('info-period').textContent = config.periodText;
        document.getElementById('info-description').textContent = config.descriptionText;
        
        // Update chapter input
        const chapterInput = document.getElementById('chapter');
        const chapterLabel = document.querySelector('label[for="chapter"]');
        
        if (currentMode === 'alternative') {
            chapterInput.style.display = 'none';
            chapterLabel.style.display = 'none';
            chapterInput.parentElement.style.display = 'none';
            chapterInput.removeAttribute('required');
            chapterInput.value = '1'; // Set default value for calculations
        } else {
            chapterInput.style.display = '';
            chapterLabel.style.display = '';
            chapterInput.parentElement.style.display = '';
            chapterInput.setAttribute('required', 'required');
            chapterInput.max = config.maxChapters;
            chapterLabel.textContent = `Глава (1-${config.maxChapters}):`;
        }
    }

    function getCurrentConfig() {
        return MODES[currentMode];
    }

    function clearResults() {
        resultBlock.innerHTML = '';
        resultBlock.classList.remove('active');
    }

    function calculateProgress(e) {
        e.preventDefault();

        const config = getCurrentConfig();
        const chapter = currentMode === 'alternative' ? 1 : parseInt(document.getElementById('chapter').value);
        const stage = parseInt(document.getElementById('stage').value);
        const pointsNumerator = parseInt(document.getElementById('points-numerator').value);

        // Validate inputs
        const chapterValid = currentMode === 'alternative' || !isNaN(chapter);
        if (!chapterValid || isNaN(stage) || isNaN(pointsNumerator)) {
            showResult('Будь ласка, заповніть всі поля коректно');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today < config.START_DATE) {
            const startDateText = currentMode === 'original' ? '4 червня' : '8 серпня';
            showResult(`Подія ще не почалася. Старт ${startDateText} ${config.START_DATE.getFullYear()} року.`);
            return;
        }

        if (today > config.END_DATE) {
            const endDateText = currentMode === 'original' ? '2 вересня' : '31 серпня';
            showResult(`Подія вже завершилася ${endDateText} ${config.END_DATE.getFullYear()} року.`);
            return;
        }

        const totalDays = Math.ceil((config.END_DATE - config.START_DATE) / (1000 * 60 * 60 * 24));
        const averagePointsPerDay = Math.ceil(config.TOTAL_POINTS / totalDays);

        const daysPassed = Math.ceil((today - config.START_DATE) / (1000 * 60 * 60 * 24));
        const expectedPoints = Math.ceil(averagePointsPerDay * daysPassed);
        const expectedChapter = currentMode === 'alternative' ? 1 : Math.ceil(expectedPoints / config.POINTS_PER_CHAPTER);
        const pointsInCurrentExpectedChapter = currentMode === 'alternative' ? expectedPoints : expectedPoints % config.POINTS_PER_CHAPTER;
        const expectedStage = Math.ceil(pointsInCurrentExpectedChapter / config.POINTS_PER_STAGE);
        const expectedStagePoints = pointsInCurrentExpectedChapter % config.POINTS_PER_STAGE;

        const globalStageNumber = currentMode === 'alternative' ? stage : ((chapter - 1) * config.STAGES_PER_CHAPTER) + stage;
        let completedPoints = calculateCompletedPoints(chapter, stage, pointsNumerator, config);
        const remainingPoints = config.TOTAL_POINTS - completedPoints;
        const daysRemaining = Math.ceil((config.END_DATE - today) / (1000 * 60 * 60 * 24));
        const pointsPerDay = Math.ceil(remainingPoints / daysRemaining);

        const progressStatus = completedPoints >= expectedPoints 
            ? `Ви випереджаєте графік на ${completedPoints - expectedPoints} очок` 
            : `Ви відстали від графіку на ${expectedPoints - completedPoints} очок`;
        const progressClass = completedPoints >= expectedPoints ? 'highlight' : 'highlight-warning';

        // Save progress to history after calculations
        saveToHistory(chapter, stage, pointsNumerator, completedPoints);

        displayResults(today, completedPoints, remainingPoints, daysRemaining, pointsPerDay, 
            chapter, stage, globalStageNumber, averagePointsPerDay, progressStatus, progressClass,
            expectedChapter, expectedStage, expectedStagePoints, config);
    }

    function calculateCompletedPoints(chapter, stage, pointsNumerator, config) {
        let points = 0;
        if (currentMode === 'original' && chapter > 1) {
            points += config.POINTS_PER_CHAPTER * (chapter - 1);
        }
        points += (stage - 1) * config.POINTS_PER_STAGE;
        points += pointsNumerator;
        return points;
    }

    function displayResults(today, completedPoints, remainingPoints, daysRemaining, pointsPerDay, 
        chapter, stage, globalStageNumber, averagePointsPerDay, progressStatus, progressClass,
        expectedChapter, expectedStage, expectedStagePoints, config) {
        
        const chapterInfo = currentMode === 'alternative' ? 
            `<p>Поточний етап: <span class="highlight">${stage}</span></p>` :
            `<p>Поточна глава: <span class="highlight">${chapter}</span>, етап: <span class="highlight">${stage}</span> (загальний етап: ${globalStageNumber})</p>`;
        
        const expectedInfo = currentMode === 'alternative' ?
            `<p>Сьогодні ви повинні бути на: етап <span class="highlight">${expectedStage}</span>, з <span class="highlight">${expectedStagePoints}</span> очками в етапі</p>` :
            `<p>Сьогодні ви повинні бути на: глава <span class="highlight">${expectedChapter}</span>, етап <span class="highlight">${expectedStage}</span>, з <span class="highlight">${expectedStagePoints}</span> очками в етапі</p>`;

        const resultHTML = `
            <h3>Результати розрахунку:</h3>
            <p>Поточна дата: ${formatDate(today)}</p>
            <p>Кінцева дата: ${formatDate(config.END_DATE)}</p>
            <p>Залишилося днів: <span class="highlight">${daysRemaining}</span></p>
            ${chapterInfo}
            <p>Всього очок отримано: <span class="highlight">${completedPoints}</span> з ${config.TOTAL_POINTS}</p>
            <p>Очок залишилось: <span class="highlight">${remainingPoints}</span></p>
            <p>Середня кількість очок в день за весь період: <span class="highlight">${averagePointsPerDay}</span></p>
            ${expectedInfo}
            <p>Поточний прогрес: <span class="${progressClass}">${progressStatus}</span></p>
            <p>Щоб встигнути набрати необхідну кількість очок, вам необхідно набирати <span class="highlight">${pointsPerDay}</span> очок в день.</p>

            <div class="actions-form">
                <button type="button" id="copy-btn" class="action-btn">Копіювати результати</button>
                <span id="copy-status" class="copy-status"></span>
            </div>
        `;
        showResult(resultHTML);
        
        // Add copy button handler
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
        const chapterText = currentMode === 'alternative' ? 
            `Поточний етап: ${stage}` :
            `Поточна глава: ${chapter}, етап: ${stage}`;

        return `Результати розрахунку на ${formatDate(today)}:

${chapterText}
Всього очок отримано: ${completedPoints}
Очок залишилось: ${remainingPoints}
Залишилося днів: ${daysRemaining}
${progressStatus}
Необхідно набирати ${pointsPerDay} очок в день`;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const statusEl = document.getElementById('copy-status');
            statusEl.textContent = 'Скопійовано!';
            statusEl.style.opacity = '1';
            
            setTimeout(() => {
                statusEl.style.opacity = '0';
            }, 2000);
        }).catch(err => {
            console.error('Помилка копіювання:', err);
            alert('Не вдалося скопіювати текст');
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

        // Prevent multiple entries per day
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

        // Sort by date (newest first) and keep only last 5 entries
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
            <h3>Історія прогресу:</h3>
            <table>
                <tr>
                    <th>Дата</th>
                    <th>Глава</th>
                    <th>Етап</th>
                    <th>Очки в етапі</th>
                    <th>Всього очок</th>
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
