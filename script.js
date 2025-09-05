document.addEventListener('DOMContentLoaded', function() {
    // Mode configurations
    const CONFIG = {
        TOTAL_POINTS: 7500,
        POINTS_PER_STAGE: 50,
        STAGES_PER_CHAPTER: 50,
        POINTS_PER_CHAPTER: 2500,
        CHAPTERS_TOTAL: 3,
        START_DATE: new Date(2025, 8, 3), // September 3rd, 2025
        END_DATE: new Date(2025, 10, 25), // November 25th, 2025
        periodText: "з 3 вересня до 25 листопада",
        descriptionText: "Вкажіть главу, яку вже виконуєте, етап та кількість отриманих очок в етапі і нажмите кнопку.",
        maxChapters: 3
    };

    // Single mode (original) only

    const form = document.getElementById('progress-form');
    const resultBlock = document.getElementById('result');

    // Initialize fixed config UI
    updateModeUI();

    form.addEventListener('submit', calculateProgress);
    loadHistory(); // Add this line

    // Removed alternative mode; only single configuration remains

    function updateModeUI() {
        const config = getCurrentConfig();
        
        // Update info texts
        const periodEl = document.getElementById('info-period');
        if (periodEl) periodEl.textContent = config.periodText;
        const descEl = document.getElementById('info-description');
        if (descEl) descEl.textContent = config.descriptionText;
        
        // Update chapter input
        const chapterInput = document.getElementById('chapter');
        const chapterLabel = document.querySelector('label[for="chapter"]');
        if (chapterInput && chapterLabel) {
            chapterInput.style.display = '';
            chapterLabel.style.display = '';
            chapterInput.parentElement.style.display = '';
            chapterInput.setAttribute('required', 'required');
            chapterInput.max = config.maxChapters;
            chapterLabel.textContent = `Глава (1-${config.maxChapters}):`;
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

        // Validate inputs
        const chapterValid = !isNaN(chapter);
        if (!chapterValid || isNaN(stage) || isNaN(pointsNumerator)) {
            showResult('Будь ласка, заповніть всі поля коректно');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today < config.START_DATE) {
            const startDateText = '3 вересня';
            showResult(`Подія ще не почалася. Старт ${startDateText} ${config.START_DATE.getFullYear()} року.`);
            return;
        }

        if (today > config.END_DATE) {
            const endDateText = '25 листопада';
            showResult(`Подія вже завершилася ${endDateText} ${config.END_DATE.getFullYear()} року.`);
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

        const globalStageNumber = ((chapter - 1) * config.STAGES_PER_CHAPTER) + stage;
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
        
        const chapterInfo = `<p>Поточна глава: <span class="highlight">${chapter}</span>, етап: <span class="highlight">${stage}</span> (загальний етап: ${globalStageNumber})</p>`;
        
        const expectedInfo = `<p>Сьогодні ви повинні бути на: глава <span class=\"highlight\">${expectedChapter}</span>, етап <span class=\"highlight\">${expectedStage}</span>, з <span class=\"highlight\">${expectedStagePoints}</span> очками в етапі</p>`;

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
        const chapterText = `Поточна глава: ${chapter}, етап: ${stage}`;

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
