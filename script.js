document.addEventListener('DOMContentLoaded', function() {
    // Populate stages dropdown
    const stageSelect = document.getElementById('stage');
    for(let i = 1; i <= 50; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        stageSelect.appendChild(option);
    }

    // Constants
    const TOTAL_POINTS = 7500;
    const POINTS_PER_STAGE = 50;
    const STAGES_PER_CHAPTER = 50;
    const POINTS_PER_CHAPTER = 2500;
    const CHAPTERS_TOTAL = 3;
    const START_DATE = new Date(new Date().getFullYear(), 5, 5); // June 5th (months are 0-based)
    const END_DATE = new Date(new Date().getFullYear(), 8, 2);   // September 2nd

    const form = document.getElementById('progress-form');
    const resultBlock = document.getElementById('result');

    form.addEventListener('submit', calculateProgress);

    function calculateProgress(e) {
        e.preventDefault();

        const chapter = parseInt(document.getElementById('chapter').value);
        const stage = parseInt(document.getElementById('stage').value);
        const pointsNumerator = parseInt(document.getElementById('points-numerator').value);

        // Validate inputs
        if (isNaN(chapter) || isNaN(stage) || isNaN(pointsNumerator)) {
            showResult('Будь ласка, заповніть всі поля коректно');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today < START_DATE) {
            showResult(`Подія ще не почалася. Старт 5 червня ${START_DATE.getFullYear()} року.`);
            return;
        }

        if (today > END_DATE) {
            showResult(`Подія вже завершилася 2 вересня ${END_DATE.getFullYear()} року.`);
            return;
        }

        const totalDays = Math.ceil((END_DATE - START_DATE) / (1000 * 60 * 60 * 24));
        const averagePointsPerDay = Math.ceil(TOTAL_POINTS / totalDays);
        
        const daysPassed = Math.ceil((today - START_DATE) / (1000 * 60 * 60 * 24));
        const expectedPoints = Math.ceil(averagePointsPerDay * daysPassed);
        const expectedChapter = Math.ceil(expectedPoints / POINTS_PER_CHAPTER);
        const pointsInCurrentExpectedChapter = expectedPoints % POINTS_PER_CHAPTER;
        const expectedStage = Math.ceil(pointsInCurrentExpectedChapter / POINTS_PER_STAGE);
        const expectedStagePoints = pointsInCurrentExpectedChapter % POINTS_PER_STAGE;

        const globalStageNumber = ((chapter - 1) * STAGES_PER_CHAPTER) + stage;
        let completedPoints = calculateCompletedPoints(chapter, stage, pointsNumerator);
        const remainingPoints = TOTAL_POINTS - completedPoints;
        const daysRemaining = Math.ceil((END_DATE - today) / (1000 * 60 * 60 * 24));
        const pointsPerDay = Math.ceil(remainingPoints / daysRemaining);

        const progressStatus = completedPoints >= expectedPoints 
            ? `Ви випереджаєте графік на ${completedPoints - expectedPoints} очок` 
            : `Ви відстали від графіку на ${expectedPoints - completedPoints} очок`;
        const progressClass = completedPoints >= expectedPoints ? 'highlight' : 'highlight-warning';

        displayResults(today, completedPoints, remainingPoints, daysRemaining, pointsPerDay, 
            chapter, stage, globalStageNumber, averagePointsPerDay, progressStatus, progressClass,
            expectedChapter, expectedStage, expectedStagePoints);
    }

    function calculateCompletedPoints(chapter, stage, pointsNumerator) {
        let points = 0;
        if (chapter > 1) {
            points += POINTS_PER_CHAPTER * (chapter - 1);
        }
        points += (stage - 1) * POINTS_PER_STAGE;
        points += pointsNumerator;
        return points;
    }

    function displayResults(today, completedPoints, remainingPoints, daysRemaining, pointsPerDay, 
        chapter, stage, globalStageNumber, averagePointsPerDay, progressStatus, progressClass,
        expectedChapter, expectedStage, expectedStagePoints) {
        const resultHTML = `
            <h3>Результати розрахунку:</h3>
            <p>Поточна дата: ${formatDate(today)}</p>
            <p>Кінцева дата: ${formatDate(END_DATE)}</p>
            <p>Залишилося днів: <span class="highlight">${daysRemaining}</span></p>
            <p>Поточна глава: <span class="highlight">${chapter}</span>, етап: <span class="highlight">${stage}</span> (загальний етап: ${globalStageNumber})</p>
            <p>Всього очок отримано: <span class="highlight">${completedPoints}</span> з ${TOTAL_POINTS}</p>
            <p>Очок залишилось: <span class="highlight">${remainingPoints}</span></p>
            <p>Середня кількість очок в день за весь період: <span class="highlight">${averagePointsPerDay}</span></p>
            <p>Сьогодні ви повинні бути на: глава <span class="highlight">${expectedChapter}</span>, етап <span class="highlight">${expectedStage}</span>, з <span class="highlight">${expectedStagePoints}</span> очками в етапі</p>
            <p>Поточний прогрес: <span class="${progressClass}">${progressStatus}</span></p>
            <p>Щоб встигнути набрати необхідну кількість очок, вам необхідно набирати <span class="highlight">${pointsPerDay}</span> очок в день.</p>
        `;
        showResult(resultHTML);
    }

    function showResult(html) {
        resultBlock.innerHTML = html;
        resultBlock.classList.add('active');
    }

    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('uk-UA', options);
    }
});
