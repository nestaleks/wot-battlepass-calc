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
            showResult('Пожалуйста, заполните все поля корректно');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today < START_DATE) {
            showResult(`Событие ещё не началось. Старт 5 июня ${START_DATE.getFullYear()} года.`);
            return;
        }

        if (today > END_DATE) {
            showResult(`Событие уже завершилось 2 сентября ${END_DATE.getFullYear()} года.`);
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
            ? `Вы опережаете график на ${completedPoints - expectedPoints} очков` 
            : `Вы отстаете от графика на ${expectedPoints - completedPoints} очков`;
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
            <h3>Результаты расчёта:</h3>
            <p>Текущая дата: ${formatDate(today)}</p>
            <p>Конечная дата: ${formatDate(END_DATE)}</p>
            <p>Осталось дней: <span class="highlight">${daysRemaining}</span></p>
            <p>Текущая глава: <span class="highlight">${chapter}</span>, этап: <span class="highlight">${stage}</span> (общий этап: ${globalStageNumber})</p>
            <p>Всего очков получено: <span class="highlight">${completedPoints}</span> из ${TOTAL_POINTS}</p>
            <p>Очков осталось: <span class="highlight">${remainingPoints}</span></p>
            <p>Среднее количество очков в день за весь период: <span class="highlight">${averagePointsPerDay}</span></p>
            <p>Сегодня вы должны быть на: глава <span class="highlight">${expectedChapter}</span>, этап <span class="highlight">${expectedStage}</span>, с ${expectedStagePoints} очками в этапе</p>
            <p>Текущий прогресс: <span class="${progressClass}">${progressStatus}</span></p>
            <p>Чтобы успеть набрать необходимое количество очков, вам нужно зарабатывать <span class="highlight">${pointsPerDay}</span> очков в день.</p>
        `;
        showResult(resultHTML);
    }

    function showResult(html) {
        resultBlock.innerHTML = html;
        resultBlock.classList.add('active');
    }

    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }
});
