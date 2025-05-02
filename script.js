document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('progress-form');
    const resultBlock = document.getElementById('result');
    
    // Constants
    const TOTAL_POINTS = 7500;
    const POINTS_PER_STAGE = 50;
    const STAGES_PER_CHAPTER = 50;
    const POINTS_PER_CHAPTER = 2500; // 50 этапов * 50 очков
    const CHAPTERS_TOTAL = 3;
    const START_DATE = new Date(new Date().getFullYear(), 2, 5); // March 5th (months are 0-based)
    const END_DATE = new Date(new Date().getFullYear(), 5, 3);  // June 3rd
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const chapter = parseInt(document.getElementById('chapter').value);
        const stage = parseInt(document.getElementById('stage').value);
        const pointsNumerator = parseInt(document.getElementById('points-numerator').value);
        
        // Calculate global stage number (1-150) based on chapter and stage
        const globalStageNumber = ((chapter - 1) * STAGES_PER_CHAPTER) + stage;
        
        // Calculate completed points based on chapter and stage
        let completedPoints = 0;
        
        // Add points from completed previous chapters
        if (chapter === 2) {
            // If in chapter 2, add all points from chapter 1
            completedPoints += POINTS_PER_CHAPTER; // 2500 points
        } else if (chapter === 3) {
            // If in chapter 3, add all points from chapters 1 and 2
            completedPoints += POINTS_PER_CHAPTER * 2; // 5000 points
        }
        
        // Add points from completed stages in current chapter (stages before the current one)
        completedPoints += (stage - 1) * POINTS_PER_STAGE;
        
        // Add points from current stage
        const currentStagePoints = pointsNumerator;
        const currentPoints = completedPoints + currentStagePoints;
        
        // Calculate expected points based on global stage number
        const expectedPoints = Math.min(globalStageNumber * POINTS_PER_STAGE, TOTAL_POINTS);
        
        // Calculate remaining points
        const remainingPoints = TOTAL_POINTS - currentPoints;
        
        // Calculate days remaining
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day
        
        // Check if we're within the event period
        if (today < START_DATE) {
            showResult(`Событие ещё не началось. Старт 5 марта ${START_DATE.getFullYear()} года.`);
            return;
        }
        
        if (today > END_DATE) {
            showResult(`Событие уже завершилось 3 июня ${END_DATE.getFullYear()} года.`);
            return;
        }
        
        // Calculate days remaining until end date
        const daysRemaining = Math.ceil((END_DATE - today) / (1000 * 60 * 60 * 24));
        
        // Calculate points needed per day
        const pointsPerDay = Math.ceil(remainingPoints / daysRemaining);
        
        // Format and display result
        const resultHTML = `
            <h3>Результаты расчёта:</h3>
            <p>Текущая дата: ${formatDate(today)}</p>
            <p>Конечная дата: ${formatDate(END_DATE)}</p>
            <p>Осталось дней: <span class="highlight">${daysRemaining}</span></p>
            <p>Текущая глава: <span class="highlight">${chapter}</span>, этап: <span class="highlight">${stage}</span> (общий этап: ${globalStageNumber})</p>
            <p>Всего очков получено: <span class="highlight">${currentPoints}</span> из ${TOTAL_POINTS}</p>
            <p>Очков осталось: <span class="highlight">${remainingPoints}</span></p>
            <p>Чтобы успеть набрать необходимое количество очков, вам нужно зарабатывать <span class="highlight">${pointsPerDay}</span> очков в день.</p>
        `;
        
        showResult(resultHTML);
    });
    
    function showResult(html) {
        resultBlock.innerHTML = html;
        resultBlock.classList.add('active');
    }
    
    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }
});
