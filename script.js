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
    
    // 형용사와 명사 데이터를 저장할 배열
    let adjectives = [];
    let nouns = [];
    
    // 데이터 로드 함수
    async function loadData() {
        try {
            // JSON 파일에서 데이터 로드
            const response = await fetch('words.json');
            const data = await response.json();
            
            adjectives = data.adjectives;
            nouns = data.nouns;
            
            // 첫 문제 생성
            nextProblem();
        } catch (error) {
            console.error('데이터 로드 중 오류 발생:', error);
            // 오류 발생 시 기본 데이터 사용
            adjectives = ["가난한", "가벼운", "가득한", "가련한", "간단한", "강한"];
            nouns = ["가게", "가구", "가방", "가슴", "가족"];
            nextProblem();
        }
    }
    
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
        "입술 물지 않기",
        "'음...' 말하지 않기",
        "손가락으로 가리키지 않기",
        "팔짱 끼지 않기",
        "다리 꼬지 않기",
        "'아니' 라는 말 쓰지 않기",
        "의견 부정하지 않기",
        "반복된 단어 사용하지 않기",
        "허리 숙이지 않기",
        "어깨 으쓱하지 않기",
        "입 다물지 않기",
        "혀 차지 않기",
        "한숨 쉬지 않기",
        "목청 가다듬지 않기",
        "손바닥 비비지 않기",
        "손톱 만지지 않기",
        "'그냥'이라는 말 쓰지 않기",
        "발로 바닥 치지 않기",
        "의자 돌리지 않기",
        "'저기'라는 말 쓰지 않기",
        "머리 긁지 않기",
        "'뭐지'라는 말 쓰지 않기",
        "손목시계 보지 않기",
        "머리카락 만지지 않기",
        "입술 핥지 않기",
        "손가락 꼬지 않기",
        "'아마'라는 말 쓰지 않기",
        "'이제'라는 말 쓰지 않기",
        "책상 두드리지 않기",
        "의자에서 흔들리지 않기",
        "주머니에 손 넣지 않기"
    ];
    
    // 활성화된 규칙 배열
    let activeRules = [];
    
    // 문제 생성 함수
    function generateProblem() {
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${randomAdj} ${randomNoun}`;
    }
    
    // 타이머 시작 함수
    function startTimer() {
        if (!timerRunning) {
            timerRunning = true;
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateTimer, 10);
        }
    }
    
    // 타이머 업데이트 함수
    function updateTimer() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        
        const formattedTime = 
            (hours < 10 ? "0" + hours : hours) + ":" + 
            (minutes < 10 ? "0" + minutes : minutes) + ":" + 
            (seconds < 10 ? "0" + seconds : seconds);
        
        timerDisplay.textContent = formattedTime;
    }
    
    // 타이머 일시정지 함수
    function pauseTimer() {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
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
    
    // 데이터 로드 시작
    loadData();
}); 