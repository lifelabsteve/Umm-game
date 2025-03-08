document.addEventListener('DOMContentLoaded', function() {
    // 필요한 요소 가져오기
    const problemDisplay = document.getElementById('current-problem');
    const timerDisplay = document.getElementById('timer');
    const pauseBtn = document.getElementById('pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const activeRulesList = document.getElementById('active-rules');
    const addRuleBtn = document.getElementById('add-rule-btn');
    
    // 타이머 변수
    let timerRunning = false;
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval;
    
    // 형용사와 명사 데이터를 직접 배열로 선언
    const adjectives = ["가난한", "가벼운", "가득한", "가련한", "간단한", "강한", /* 나머지 형용사 추가 */];
    const nouns = ["가게", "가구", "가방", "가슴", "가족", /* 나머지 명사 추가 */];
    
    // 규칙 목록
    const rules = [
        "'그리고'라는 말 쓰지 않기",
        "손짓 하지 않기",
        "의성어 쓰지 않기",
        "의태어 쓰지 않기",
        "고개 끄덕이지 않기",
        "웃지 않기",
        "3초 이상 침묵하지 않기",
        "상대방 말 따라하지 않기",
        "질문하지 않기",
        "영어 사용하지 않기",
        "숫자 말하지 않기",
        "고개 젓지 않기",
        "눈 깜빡이지 않기",
        "입술 물지 않기"
    ];
    
    // 활성화된 규칙 배열
    let activeRules = [];
    
    // 랜덤 문제 생성
    function generateProblem() {
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${randomAdj} ${randomNoun}`;
    }
    
    // 타이머 업데이트 함수
    function updateTimer() {
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime + elapsedTime;
        
        const hours = Math.floor(timeElapsed / 3600000);
        const minutes = Math.floor((timeElapsed % 3600000) / 60000);
        const seconds = Math.floor((timeElapsed % 60000) / 1000);
        
        timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // 타이머 시작 함수
    function startTimer() {
        if (!timerRunning) {
            timerRunning = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }
    }
    
    // 타이머 일시정지 함수
    function pauseTimer() {
        if (timerRunning) {
            timerRunning = false;
            clearInterval(timerInterval);
            elapsedTime += Date.now() - startTime;
        } else {
            startTimer();
        }
    }
    
    // 타이머 초기화 함수
    function resetTimer() {
        clearInterval(timerInterval);
        timerRunning = false;
        elapsedTime = 0;
        timerDisplay.textContent = "00:00:00";
    }
    
    // 다음 문제 함수
    function nextProblem() {
        problemDisplay.textContent = generateProblem();
        
        // 타이머 초기화
        resetTimer();
        
        // 타이머 시작
        startTimer();
    }
    
    // 규칙 추가 함수
    function addRule() {
        if (activeRules.length >= 3) {
            return; // 최대 3개까지만 추가 가능
        }
        
        // 아직 추가되지 않은 규칙 중에서 랜덤하게 선택
        const availableRules = rules.filter(rule => !activeRules.includes(rule));
        
        if (availableRules.length === 0) {
            return; // 더 이상 추가할 규칙이 없음
        }
        
        const randomRule = availableRules[Math.floor(Math.random() * availableRules.length)];
        activeRules.push(randomRule);
        
        // 화면에 규칙 추가
        updateRulesDisplay();
        
        // 규칙이 3개가 되면 버튼 비활성화
        if (activeRules.length >= 3) {
            addRuleBtn.disabled = true;
        }
    }
    
    // 규칙 삭제 함수
    function removeRule(index) {
        activeRules.splice(index, 1);
        updateRulesDisplay();
        
        // 규칙이 3개 미만이면 버튼 활성화
        if (activeRules.length < 3) {
            addRuleBtn.disabled = false;
        }
    }
    
    // 규칙 표시 업데이트 함수
    function updateRulesDisplay() {
        activeRulesList.innerHTML = '';
        
        activeRules.forEach((rule, index) => {
            const li = document.createElement('li');
            li.textContent = rule;
            li.addEventListener('click', () => removeRule(index));
            activeRulesList.appendChild(li);
        });
    }
    
    // 이벤트 리스너 설정
    pauseBtn.addEventListener('click', () => {
        pauseTimer();
        pauseBtn.textContent = timerRunning ? '일시정지' : '재개';
    });
    
    nextBtn.addEventListener('click', nextProblem);
    
    addRuleBtn.addEventListener('click', addRule);
}); 