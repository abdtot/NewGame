// تعريف المتغيرات العامة
let db;
let currentStage = 1;
let currentLevel = 1;
let levelPoints = 0;
let totalPoints = 0;
let selectedCard = null;
let vibrationEnabled = true;
let soundEnabled = true;
let notificationsEnabled = true;
let userName = "المستخدم";
let userEmail = "";
let playTime = 0;
let playTimer;
let deferredPrompt;
let gameMode = "normal";
let gameTimer;
let timeLeft = 60;
let hintCost = 10;
let culturalPuzzles = [];
let achievements = [
    { id: "first_win", title: "الفائز الأول", description: "أكمل مستوى واحد", icon: "fa-trophy", earned: false },
    { id: "five_wins", title: "بطل مبتدئ", description: "أكمل 5 مستويات", icon: "fa-medal", earned: false },
    { id: "ten_wins", title: "بطل محترف", description: "أكمل 10 مستويات", icon: "fa-crown", earned: false },
    { id: "daily_challenge", title: "متحدي اليوم", description: "أكمل التحدي اليومي", icon: "fa-calendar", earned: false },
    { id: "speed_runner", title: "عداء سريع", description: "أكمل مستوى في أقل من 30 ثانية", icon: "fa-stopwatch", earned: false },
    { id: "hint_master", title: "سيد التلميحات", description: "أكمل مستوى دون استخدام تلميحات", icon: "fa-lightbulb", earned: false },
    { id: "puzzle_master", title: "سيد الألغاز", description: "أجب على 10 ألغاز ثقافية بشكل صحيح", icon: "fa-puzzle-piece", earned: false }
];

// بيانات المراحل والمستويات والبطاقات
const stagesData = [
    {
        id: 1,
        title: "المرحلة الأولى",
        background: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        requiredPoints: 0,
        levels: 23
    },
    {
        id: 2,
        title: "المرحلة الثانية",
        background: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        requiredPoints: 69, // 23 مستوى × 3 نقاط لكل مستوى
        levels: 25
    },
    {
        id: 3,
        title: "المرحلة الثالثة",
        background: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        requiredPoints: 144, // 48 مستوى × 3 نقاط لكل مستوى
        levels: 30
    },
    {
        id: 4,
        title: "المرحلة الرابعة",
        background: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        requiredPoints: 234, // 78 مستوى × 3 نقاط لكل مستوى
        levels: 42
    },
    {
        id: 5,
        title: "المرحلة الخامسة",
        background: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        requiredPoints: 360, // 120 مستوى × 3 نقاط لكل مستوى
        levels: 50
    }
];

const levelsData = [];

// إنشاء بيانات المستويات ديناميكيًا
let levelCounter = 1;
for (let stage = 1; stage <= stagesData.length; stage++) {
    const stageInfo = stagesData[stage-1];
    
    for (let level = 1; level <= stageInfo.levels; level++) {
        const cards = [];
        
        for (let j = 1; j <= 3; j++) {
            cards.push({ id: `${levelCounter}-${j}`, type: 'puzzle', path: `img/stage-${stage}/puzzle-${level}-${j}.jpg` });
            cards.push({ id: `${levelCounter}-${j}`, type: 'solution', path: `img/stage-${stage}/solution-${level}-${j}.jpg` });
        }
        
        levelsData.push({
            id: levelCounter,
            stage: stage,
            level: level,
            cards: cards,
            background: stageInfo.background,
            requiredPoints: (levelCounter > 1) ? (levelCounter-1) * 3 : 0
        });
        
        levelCounter++;
    }
}

// بيانات التحدي اليومي
const dailyChallenges = [
    {
        id: 1,
        title: "تحدي اليوم",
        background: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        cards: [
            { id: 'daily-1-1', type: 'puzzle', path: 'img/daily/puzzle-1-1.jpg' },
            { id: 'daily-1-1', type: 'solution', path: 'img/daily/solution-1-1.jpg' },
            { id: 'daily-1-2', type: 'puzzle', path: 'img/daily/puzzle-1-2.jpg' },
            { id: 'daily-1-2', type: 'solution', path: 'img/daily/solution-1-2.jpg' },
            { id: 'daily-1-3', type: 'puzzle', path: 'img/daily/puzzle-1-3.jpg' },
            { id: 'daily-1-3', type: 'solution', path: 'img/daily/solution-1-3.jpg' }
        ]
    }
];

// بيانات تحدي الوقت
const timedChallenges = [
    {
        id: 1,
        title: "تحدي السرعة",
        background: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        timeLimit: 60,
        cards: [
            { id: 'timed-1-1', type: 'puzzle', path: 'img/timed/puzzle-1-1.jpg' },
            { id: 'timed-1-1', type: 'solution', path: 'img/timed/solution-1-1.jpg' },
            { id: 'timed-1-2', type: 'puzzle', path: 'img/timed/puzzle-1-2.jpg' },
            { id: 'timed-1-2', type: 'solution', path: 'img/timed/solution-1-2.jpg' },
            { id: 'timed-1-3', type: 'puzzle', path: 'img/timed/puzzle-1-3.jpg' },
            { id: 'timed-1-3', type: 'solution', path: 'img/timed/solution-1-3.jpg' }
        ]
    }
];

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    createStars();
    initializeDB();
    loadCulturalPuzzles();
    setupEventListeners();
    checkFirstTime();
    setupServiceWorker();
    startPlayTimer();
    checkInstallPrompt();
    showScreen('stages-screen');
}

// تحميل الألغاز الثقافية
async function loadCulturalPuzzles() {
    try {
        const response = await fetch('cultural-puzzles.json');
        const data = await response.json();
        culturalPuzzles = data.puzzles;
        console.log('تم تحميل الألغاز الثقافية بنجاح');
    } catch (error) {
        console.error('فشل في تحميل الألغاز الثقافية:', error);
        // إنشاء ألغاز افتراضية في حالة فشل التحميل
        culturalPuzzles = [
            {
                id: 1,
                question: "ما هي عاصمة المملكة العربية السعودية؟",
                options: ["الرياض", "جدة", "مكة", "الدمام"],
                correctAnswer: 0,
                category: "جغرافيا"
            },
            {
                id: 2,
                question: "من هو مؤلف كتاب 'ديوان المتنبي'؟",
                options: ["أبو تمام", "المتنبي", "أبو فراس الحمداني", "البحتري"],
                correctAnswer: 1,
                category: "أدب"
            },
            {
                id: 3,
                question: "ما هو أطول نهر في العالم؟",
                options: ["نهر النيل", "نهر الأمازون", "نهر المسيسيبي", "نهر اليانغتسي"],
                correctAnswer: 0,
                category: "جغرافيا"
            },
            {
                id: 4,
                question: "من هو صاحب لوحة الموناليزا؟",
                options: ["ليوناردو دافنشي", "بابلو بيكاسو", "فان جوخ", "ميكيلانجيلو"],
                correctAnswer: 0,
                category: "فن"
            },
            {
                id: 5,
                question: "ما هي اللغة الرسمية في البرازيل؟",
                options: ["البرتغالية", "الإسبانية", "الإنجليزية", "الفرنسية"],
                correctAnswer: 0,
                category: "ثقافة عامة"
            }
        ];
    }
}

// بدء مستوى جديد مع عرض اللغز الثقافي أولاً
function startLevel(levelId) {
    currentLevel = levelId;
    levelPoints = 0;
    
    const levelData = levelsData.find(l => l.id === levelId);
    currentStage = levelData.stage;
    
    // عرض اللغز الثقافي أولاً قبل شاشة اللعب
    showCulturalPuzzleBeforeLevel(levelData);
}

// عرض اللغز الثقافي قبل بدء المستوى
function showCulturalPuzzleBeforeLevel(levelData) {
    if (culturalPuzzles.length === 0) {
        // إذا لم توجد ألغاز، انتقل مباشرة إلى شاشة اللعب
        setupGameScreen(levelData);
        return;
    }
    
    // اختيار لغز عشوائي
    const randomIndex = Math.floor(Math.random() * culturalPuzzles.length);
    const puzzle = culturalPuzzles[randomIndex];
    
    // إنشاء واجهة اللغز الثقافي
    const puzzleHTML = `
        <div class="cultural-puzzle-overlay active" id="cultural-puzzle-before-level">
            <div class="cultural-puzzle-container">
                <div class="puzzle-header">
                    <h2>لغز ثقافي</h2>
                    <span class="puzzle-category">${puzzle.category}</span>
                    <p class="puzzle-instruction">حل هذا اللغز لبدء المستوى!</p>
                </div>
                <div class="puzzle-question">${puzzle.question}</div>
                <div class="puzzle-options">
                    ${puzzle.options.map((option, index) => `
                        <button class="puzzle-option" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
                <div class="puzzle-result" id="puzzle-before-result"></div>
                <button class="puzzle-continue-btn" id="puzzle-continue-btn" style="display: none;">متابعة إلى اللعبة</button>
            </div>
        </div>
    `;
    
    // إضافة اللغز إلى DOM
    document.body.insertAdjacentHTML('beforeend', puzzleHTML);
    
    // إضافة مستمعي الأحداث
    document.querySelectorAll('#cultural-puzzle-before-level .puzzle-option').forEach(option => {
        option.addEventListener('click', function() {
            const selectedIndex = parseInt(this.dataset.index);
            const resultElement = document.getElementById('puzzle-before-result');
            const continueBtn = document.getElementById('puzzle-continue-btn');
            
            // منع النقر على الخيارات الأخرى
            document.querySelectorAll('#cultural-puzzle-before-level .puzzle-option').forEach(opt => {
                opt.disabled = true;
            });
            
            if (selectedIndex === puzzle.correctAnswer) {
                resultElement.innerHTML = '<i class="fas fa-check-circle"></i> إجابة صحيحة! لقد ربحت نقطة إضافية.';
                resultElement.className = 'puzzle-result correct';
                
                // منح نقطة إضافية للإجابة الصحيحة
                totalPoints++;
                updatePointsInDatabase();
                showToast('لقد ربحت نقطة إضافية لإجابتك الصحيحة!');
                
            } else {
                resultElement.innerHTML = '<i class="fas fa-times-circle"></i> إجابة خاطئة. حاول في المرة القادمة!';
                resultElement.className = 'puzzle-result incorrect';
                this.classList.add('incorrect');
                
                // اهتزاز للإشارة إلى الخطأ
                vibrate(200);
            }
            
            // عرض زر المتابعة في كل الحالات
            continueBtn.style.display = 'block';
        });
    });
    
    // إضافة مستمع حدث لزر المتابعة
    document.getElementById('puzzle-continue-btn').addEventListener('click', function() {
        document.getElementById('cultural-puzzle-before-level').remove();
        setupGameScreen(levelData);
    });
}

// إعداد شاشة اللعب بعد حل اللغز
function setupGameScreen(levelData) {
    showScreen('game-screen');
    document.getElementById('current-stage').textContent = currentStage;
    document.getElementById('current-level').textContent = levelData.level;
    document.getElementById('level-points').textContent = '0';
    updateProgress('level-progress', 0, 3);
    
    // إعداد المؤقت لوضع الوقت المحدد
    if (gameMode === "timed") {
        timeLeft = 60;
        document.getElementById('timer-container').style.display = 'flex';
        document.getElementById('timer').textContent = timeLeft;
        startGameTimer();
    } else {
        document.getElementById('timer-container').style.display = 'none';
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
    }
    
    // إعداد التلميحات
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('hint-cost').textContent = hintCost;
    
    createCards(levelData.id);
}

// تحديث النقاط في قاعدة البيانات
function updatePointsInDatabase() {
    const transaction = db.transaction(['stats'], 'readwrite');
    const statsStore = transaction.objectStore('stats');
    statsStore.put({
        id: 'totalPoints',
        value: totalPoints
    });
    
    document.getElementById('total-points').textContent = totalPoints;
    updateProgress('total-progress', totalPoints, getMaxPoints());
    updateTotalPointsInUI();
}

// الحصول على أقصى عدد من النقاط الممكنة
function getMaxPoints() {
    return levelsData.length * 3;
}

// بدء حساب وقت اللعب
function startPlayTimer() {
    playTimer = setInterval(() => {
        playTime++;
        if (document.getElementById('profile-screen').classList.contains('active')) {
            updateProfileStats();
        }
    }, 60000); // تحديث كل دقيقة
}

// تسجيل Service Worker للتخزين المؤقت
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
}

// التحقق من أول مرة يتم فيها فتح التطبيق
function checkFirstTime() {
    if (!localStorage.getItem('firstTime')) {
        setTimeout(() => {
            showToast('مرحباً بك في أبطال البطاقات! استمتع باللعبة');
            localStorage.setItem('firstTime', 'false');
        }, 2000);
    }
}

// التحقق من إمكانية تثبيت التطبيق
function checkInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('install-app').style.display = 'inline-flex';
    });

    document.getElementById('install-app').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            document.getElementById('install-app').style.display = 'none';
        }
    });
}

// إنشاء تأثير النجوم في الخلفية
function createStars() {
    const starsCount = 30;
    const container = document.body;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(star);
    }
}

// تأثير confetti عند الفوز
function createConfetti() {
    const confettiCount = 70;
    const colors = ['#6c5ce7', '#a29bfe', '#fd79a8', '#00b894', '#fdcb6e', '#d63031'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 50}%`;
        
        document.body.appendChild(confetti);
        
        const animationDuration = Math.random() * 2 + 2;
        confetti.style.animation = `confettiFall ${animationDuration}s linear forwards`;
        
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}

// تهيئة قاعدة البيانات IndexedDB
function initializeDB() {
    const request = indexedDB.open('CardGameDB', 8); // ترقية الإصدار إلى 8

    request.onerror = (event) => {
        console.error('فشل في فتح قاعدة البيانات', event);
        showToast('خطأ في تحميل البيانات، يرجاء إعادة تحميل التطبيق');
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadGameData();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const oldVersion = event.oldVersion;

        // إنشاء مخزن للمستويات
        if (!db.objectStoreNames.contains('levels')) {
            const levelsStore = db.createObjectStore('levels', { keyPath: 'id' });
            levelsStore.createIndex('completed', 'completed', { unique: false });
            levelsStore.createIndex('points', 'points', { unique: false });
            levelsStore.createIndex('stage', 'stage', { unique: false });
        }

        // إنشاء مخزن للإحصائيات
        if (!db.objectStoreNames.contains('stats')) {
            const statsStore = db.createObjectStore('stats', { keyPath: 'id' });
            statsStore.add({ id: 'puzzlesSolved', value: 0 });
        }

        // إنشاء مخزن للإعدادات
        if (!db.objectStoreNames.contains('settings')) {
            const settingsStore = db.createObjectStore('settings', { keyPath: 'id' });
            settingsStore.add({ id: 'vibration', value: true });
            settingsStore.add({ id: 'sound', value: true });
            settingsStore.add({ id: 'notifications', value: true });
        }

        // إنشاء مخزن للمستخدم
        if (!db.objectStoreNames.contains('user')) {
            const userStore = db.createObjectStore('user', { keyPath: 'id' });
            userStore.add({ 
                id: 'profile', 
                name: 'المستخدم',
                email: '',
                playTime: 0,
                totalPoints: 0,
                completedLevels: 0,
                currentStage: 1
            });
        }
        
        // إضافة مخزن جديد للصور
        if (!db.objectStoreNames.contains('images')) {
             db.createObjectStore('images', { keyPath: 'path' });
        }
        
        // إضافة مخزن للإنجازات
        if (!db.objectStoreNames.contains('achievements')) {
            const achievementsStore = db.createObjectStore('achievements', { keyPath: 'id' });
            achievements.forEach(achievement => {
                achievementsStore.add({
                    id: achievement.id,
                    title: achievement.title,
                    description: achievement.description,
                    icon: achievement.icon,
                    earned: false
                });
            });
        }
        
        // إضافة مخزن للتحدي اليومي
        if (!db.objectStoreNames.contains('dailyChallenge')) {
            const dailyStore = db.createObjectStore('dailyChallenge', { keyPath: 'date' });
        }
        
        // إضافة مخزن للمراحل
        if (!db.objectStoreNames.contains('stages')) {
            const stagesStore = db.createObjectStore('stages', { keyPath: 'id' });
            stagesData.forEach(stage => {
                stagesStore.add({
                    id: stage.id,
                    title: stage.title,
                    completed: false,
                    completedLevels: 0,
                    totalLevels: stage.levels
                });
            });
        }
        
        // إضافة مخزن لتحديات الوقت
        if (!db.objectStoreNames.contains('timedChallenges')) {
            const timedStore = db.createObjectStore('timedChallenges', { keyPath: 'id' });
        }
    };
}

// جلب الصور وتخزينها في قاعدة البيانات
async function cacheAllImages() {
    const transaction = db.transaction(['images'], 'readwrite');
    const imagesStore = transaction.objectStore('images');

    // جمع مسارات جميع الصور من جميع المستويات
    const allImagePaths = new Set();
    levelsData.forEach(level => {
        level.cards.forEach(card => {
            allImagePaths.add(card.path);
        });
    });

    // إضافة صور التحدي اليومي
    dailyChallenges.forEach(challenge => {
        challenge.cards.forEach(card => {
            allImagePaths.add(card.path);
        });
    });

    // إضافة صور تحدي الوقت
    timedChallenges.forEach(challenge => {
        challenge.cards.forEach(card => {
            allImagePaths.add(card.path);
        });
    });

    for (const path of allImagePaths) {
        try {
            const response = await fetch(path);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                imagesStore.put({ path: path, data: reader.result });
            };
        } catch (error) {
            console.error(`Failed to cache image at ${path}`, error);
        }
    }
}

// تحميل بيانات اللعبة
function loadGameData() {
    const transaction = db.transaction(['stats', 'settings', 'user', 'achievements', 'stages'], 'readonly');
    const statsStore = transaction.objectStore('stats');
    const settingsStore = transaction.objectStore('settings');
    const userStore = transaction.objectStore('user');
    const achievementsStore = transaction.objectStore('achievements');
    const stagesStore = transaction.objectStore('stages');
    
    const pointsRequest = statsStore.get('totalPoints');
    pointsRequest.onsuccess = (event) => {
        if (pointsRequest.result) {
            totalPoints = pointsRequest.result.value;
            document.getElementById('total-points').textContent = totalPoints;
            updateProgress('total-progress', totalPoints, getMaxPoints());
            
            // تحديث إجمالي النقاط في شاشة المراحل والمستويات
            updateTotalPointsInUI();
        }
    };
    
    const vibrationRequest = settingsStore.get('vibration');
    vibrationRequest.onsuccess = (event) => {
        if (vibrationRequest.result) {
            vibrationEnabled = vibrationRequest.result.value;
            document.getElementById('vibration-toggle').checked = vibrationEnabled;
        }
    };
    
    const soundRequest = settingsStore.get('sound');
    soundRequest.onsuccess = (event) => {
        if (soundRequest.result) {
            soundEnabled = soundRequest.result.value;
            document.getElementById('sound-toggle').checked = soundEnabled;
        }
    };
    
    const notificationsRequest = settingsStore.get('notifications');
    notificationsRequest.onsuccess = (event) => {
        if (notificationsRequest.result) {
            notificationsEnabled = notificationsRequest.result.value;
            document.getElementById('notifications-toggle').checked = notificationsEnabled;
        }
    };
    
    const userRequest = userStore.get('profile');
    userRequest.onsuccess = (event) => {
        if (userRequest.result) {
            userName = userRequest.result.name;
            userEmail = userRequest.result.email;
            playTime = userRequest.result.playTime || 0;
            currentStage = userRequest.result.currentStage || 1;
            
            document.getElementById('user-name').value = userName;
            document.getElementById('user-email').value = userEmail;
            document.getElementById('profile-name').textContent = userName;
            
            updateProfileStats();
        }
    };
    
    const achievementsRequest = achievementsStore.getAll();
    achievementsRequest.onsuccess = (event) => {
        if (achievementsRequest.result && achievementsRequest.result.length > 0) {
            achievements = achievementsRequest.result;
            loadAchievements();
        }
    };
    
    loadStages();
}

// تحديث إجمالي النقاط في واجهة المستخدم
function updateTotalPointsInUI() {
    // تحديث إجمالي النقاط في شاشة المراحل
    const totalPointsStages = document.getElementById('total-points-stages');
    if (totalPointsStages) {
        totalPointsStages.textContent = totalPoints;
    }
    
    // تحديث إجمالي النقاط في شاشة المستويات
    const totalPointsLevels = document.getElementById('total-points-levels');
    if (totalPointsLevels) {
        totalPointsLevels.textContent = totalPoints;
    }
    
    // تحديث إجمالي النقاط في شاشة الملف الشخصي
    const totalPointsProfile = document.getElementById('total-points-profile');
    if (totalPointsProfile) {
        totalPointsProfile.textContent = totalPoints;
    }
}

// تحميل المراحل
function loadStages() {
    const stagesContainer = document.getElementById('stages-container');
    stagesContainer.innerHTML = '';
    
    const transaction = db.transaction(['stages', 'levels'], 'readonly');
    const stagesStore = transaction.objectStore('stages');
    const levelsStore = transaction.objectStore('levels');
    
    stagesData.forEach(stageData => {
        const stageCard = document.createElement('div');
        stageCard.className = 'stage-card ripple';
        stageCard.dataset.stage = stageData.id;
        
        const stageBg = document.createElement('div');
        stageBg.className = 'stage-bg';
        stageBg.style.backgroundImage = `url(${stageData.background})`;
        stageCard.appendChild(stageBg);
        
        const stageNumber = document.createElement('div');
        stageNumber.className = 'stage-number';
        stageNumber.innerHTML = `<i class="fas fa-${stageData.id === 1 ? 'play' : 'hashtag'}"></i> ${stageData.id}`;
        stageCard.appendChild(stageNumber);
        
        const stageTitle = document.createElement('div');
        stageTitle.className = 'stage-title';
        stageTitle.textContent = stageData.title;
        stageCard.appendChild(stageTitle);
        
        const stageStatus = document.createElement('div');
        stageStatus.className = 'stage-status';
        stageCard.appendChild(stageStatus);
        
        // التحقق من حالة المرحلة
        const stageRequest = stagesStore.get(stageData.id);
        stageRequest.onsuccess = (event) => {
            if (stageRequest.result) {
                const stage = stageRequest.result;
                
                // حساب عدد المستويات المكتملة في هذه المرحلة
                const levelsRequest = levelsStore.index('stage').openCursor(IDBKeyRange.only(stageData.id));
                let completedLevels = 0;
                let totalPointsInStage = 0;
                
                levelsRequest.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        if (cursor.value.completed) {
                            completedLevels++;
                            totalPointsInStage += cursor.value.points;
                        }
                        cursor.continue();
                    } else {
                        // تحديث حالة المرحلة
                        if (completedLevels === stage.totalLevels) {
                            stageCard.classList.add('completed');
                            stageStatus.innerHTML = `<i class="fas fa-star"></i> ${totalPointsInStage}/${stage.totalLevels * 3}`;
                        } else {
                            stageStatus.innerHTML = `<i class="fas fa-star"></i> ${completedLevels}/${stage.totalLevels}`;
                        }
                        
                        // التحقق مما إذا كانت المرحلة مقفلة
                        if (stageData.id > 1) {
                            if (totalPoints < stageData.requiredPoints) {
                                stageCard.classList.add('locked');
                                stageStatus.innerHTML = `<i class="fas fa-lock"></i> ${stageData.requiredPoints} نقطة`;
                            } else {
                                // التحقق مما إذا كانت المرحلة السابقة مكتملة
                                const prevStageRequest = stagesStore.get(stageData.id - 1);
                                prevStageRequest.onsuccess = (e) => {
                                    const prevStage = e.target.result;
                                    if (!prevStage.completed) {
                                        stageCard.classList.add('locked');
                                        stageStatus.innerHTML = '<i class="fas fa-lock"></i> مقفل';
                                    }
                                };
                            }
                        }
                    }
                };
            }
        };
        
        stageCard.addEventListener('click', () => {
            if (!stageCard.classList.contains('locked')) {
                vibrate();
                playSound('click');
                showLevelsScreen(stageData.id);
            } else {
                vibrate(100);
                showToast('هذه المرحلة مقفلة، يجب إكمال المرحلة السابقة أولاً');
            }
        });
        
        stagesContainer.appendChild(stageCard);
    });
    
    // تحديث إجمالي النقاط في شاشة المراحل
    updateTotalPointsInUI();
}

// عرض شاشة المستويات لمرحلة محددة
function showLevelsScreen(stageId) {
    currentStage = stageId;
    const stageData = stagesData.find(s => s.id === stageId);
    
    document.getElementById('stage-title').textContent = stageData.title;
    showScreen('levels-screen');
    loadLevels(stageId);
}

// تحميل المستويات لمرحلة محددة
function loadLevels(stageId) {
    const levelsContainer = document.getElementById('levels-container');
    levelsContainer.innerHTML = '';
    
    const stageLevels = levelsData.filter(level => level.stage === stageId);
    const stagePoints = stageLevels.reduce((acc, level) => {
        return acc + (level.completed ? level.points : 0);
    }, 0);
    
    document.getElementById('stage-points').textContent = stagePoints;
    updateProgress('stage-progress', stagePoints, stageLevels.length * 3);
    
    const transaction = db.transaction(['levels'], 'readonly');
    const levelsStore = transaction.objectStore('levels');
    
    stageLevels.forEach(levelData => {
        const levelCard = document.createElement('div');
        levelCard.className = 'level-card ripple';
        levelCard.dataset.level = levelData.id;
        
        const levelBg = document.createElement('div');
        levelBg.className = 'level-bg';
        levelBg.style.backgroundImage = `url(${levelData.background})`;
        levelCard.appendChild(levelBg);
        
        const levelNumber = document.createElement('div');
        levelNumber.className = 'level-number';
        levelNumber.innerHTML = `<i class="fas fa-${levelData.id === 1 ? 'play' : 'hashtag'}"></i> ${levelData.level}`;
        levelCard.appendChild(levelNumber);
        
        const levelStatus = document.createElement('div');
        levelStatus.className = 'level-status';
        levelCard.appendChild(levelStatus);
        
        if (levelData.level % 5 === 0) {
            const ribbon = document.createElement('div');
            ribbon.className = 'ribbon';
            ribbon.innerHTML = '<span>مميز</span>';
            levelCard.appendChild(ribbon);
        }
        
        const request = levelsStore.get(levelData.id);
        
        request.onsuccess = (event) => {
            if (request.result) {
                if (request.result.completed) {
                    levelCard.classList.add('completed');
                    levelStatus.innerHTML = `<i class="fas fa-star"></i> ${request.result.points}/3`;
                }
            }
            
            // التحقق مما إذا كان المستوى مقفلاً بناءً على النقاط المطلوبة
            if (levelData.id > 1) {
                if (totalPoints < levelData.requiredPoints) {
                    levelCard.classList.add('locked');
                    levelStatus.innerHTML = `<i class="fas fa-lock"></i> ${levelData.requiredPoints} نقطة`;
                } else {
                    // التحقق مما إذا كان المستوى السابق مكتملاً
                    const prevRequest = levelsStore.get(levelData.id-1);
                    prevRequest.onsuccess = (e) => {
                        if (!prevRequest.result || !prevRequest.result.completed) {
                            levelCard.classList.add('locked');
                            levelStatus.innerHTML = '<i class="fas fa-lock"></i> مقفل';
                        }
                    };
                }
            }
        };
        
        levelCard.addEventListener('click', () => {
            if (!levelCard.classList.contains('locked')) {
                vibrate();
                playSound('click');
                startLevel(levelData.id);
            } else {
                vibrate(100);
                showToast('هذا المستوى مقفل، يجب إكمال المستوى السابق أولاً');
            }
        });
        
        levelsContainer.appendChild(levelCard);
    });
    
    // تحديث إجمالي النقاط في شاشة المستويات
    updateTotalPointsInUI();
}

// تحميل الإنجازات
function loadAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${achievement.earned ? '' : 'locked'}`;
        achievementElement.innerHTML = `
            <i class="fas ${achievement.icon}"></i>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;
        achievementsContainer.appendChild(achievementElement);
    });
}

// تحديث إحصائيات الملف الشخصي
function updateProfileStats() {
    const transaction = db.transaction(['levels', 'user', 'stages'], 'readonly');
    const levelsStore = transaction.objectStore('levels');
    const userStore = transaction.objectStore('user');
    const stagesStore = transaction.objectStore('stages');
    
    let completedLevels = 0;
    let totalEarnedPoints = 0;
    let successRate = 0;
    let totalLevels = levelsData.length;
    
    const countRequest = levelsStore.index('completed').openCursor(IDBKeyRange.only(true));
    countRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            completedLevels++;
            totalEarnedPoints += cursor.value.points;
            cursor.continue();
        } else {
            successRate = completedLevels > 0 ? Math.round((totalEarnedPoints / (completedLevels * 3)) * 100) : 0;
            
            // تحديث إحصائيات الملف الشخصي
            document.getElementById('total-points-profile').textContent = totalEarnedPoints;
            document.getElementById('completed-levels').textContent = `${completedLevels}/${totalLevels}`;
            document.getElementById('success-rate').textContent = `${successRate}%`;
            
            const hours = Math.floor(playTime / 60);
            const minutes = playTime % 60;
            document.getElementById('play-time').textContent = `${hours} س ${minutes} د`;
            
            const userLevel = Math.floor(completedLevels / 5) + 1;
            document.getElementById('profile-level').textContent = userLevel;
            
            // تحديث تقدم المستويات المكتملة
            updateProgress('completed-levels-progress', completedLevels, totalLevels);
            
            // تحديث تقدم معدل النجاح
            updateProgress('success-rate-progress', successRate, 100);
            
            // تحديث تقدم الوقت
            const maxPlayTime = 1000; // أقصى وقت للعرض على شريط التقدم (1000 دقيقة)
            const playTimePercentage = Math.min((playTime / maxPlayTime) * 100, 100);
            updateProgress('play-time-progress', playTimePercentage, 100);
            
            // تحديث تقدم النقاط
            const maxPoints = totalLevels * 3;
            const pointsPercentage = Math.min((totalEarnedPoints / maxPoints) * 100, 100);
            updateProgress('points-progress', pointsPercentage, 100);
            
            const userTransaction = db.transaction(['user'], 'readwrite');
            const userStore = userTransaction.objectStore('user');
            userStore.put({
                id: 'profile',
                name: userName,
                email: userEmail,
                playTime: playTime,
                totalPoints: totalEarnedPoints,
                completedLevels: completedLevels,
                currentStage: currentStage
            });
            
            // تحديث الإنجازات
            checkAchievements(completedLevels, totalEarnedPoints);
        }
    };
}

// التحقق من الإنجازات
function checkAchievements(completedLevels, totalPoints) {
    const achievementsToUpdate = [];
    
    if (completedLevels >= 1 && !achievements.find(a => a.id === "first_win").earned) {
        achievementsToUpdate.push({ id: "first_win", earned: true });
    }
    
    if (completedLevels >= 5 && !achievements.find(a => a.id === "five_wins").earned) {
        achievementsToUpdate.push({ id: "five_wins", earned: true });
    }
    
    if (completedLevels >= 10 && !achievements.find(a => a.id === "ten_wins").earned) {
        achievementsToUpdate.push({ id: "ten_wins", earned: true });
    }
    
    if (achievementsToUpdate.length > 0) {
        const transaction = db.transaction(['achievements'], 'readwrite');
        const achievementsStore = transaction.objectStore('achievements');
        
        achievementsToUpdate.forEach(achievement => {
            achievementsStore.get(achievement.id).onsuccess = (event) => {
                const data = event.target.result;
                data.earned = true;
                achievementsStore.put(data);
                
                // عرض إشعار الإنجاز
                showAchievement(`تهانينا! لقد حصلت على إنجاز: ${data.title}`);
            };
        });
        
        // إعادة تحميل الإنجازات
        loadAchievements();
    }
}

// تحديث شريط التقدم
function updateProgress(progressBarId, current, max) {
    const progressBar = document.getElementById(progressBarId);
    if (progressBar) {
        const percentage = (current / max) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// إنشاء بطاقات المستوى
function createCards(levelId) {
    const appCardsContainer = document.getElementById('app-cards');
    const playerCardsContainer = document.getElementById('player-cards');
    
    appCardsContainer.innerHTML = '';
    playerCardsContainer.innerHTML = '';
    
    const levelData = levelsData.find(l => l.id === levelId);
    
    const puzzleCards = levelData.cards.filter(card => card.type === 'puzzle');
    const solutionCards = levelData.cards.filter(card => card.type === 'solution');
    
    shuffleArray(solutionCards);
    
    puzzleCards.forEach(card => {
        const cardElement = createAppCardElement(card);
        appCardsContainer.appendChild(cardElement);
    });
    
    solutionCards.forEach(card => {
        const cardElement = createPlayerCardElement(card);
        playerCardsContainer.appendChild(cardElement);
    });
    
    // Lazy load images for the game screen
    lazyLoadImages();
}

// إنشاء بطاقات التحدي
function createChallengeCards(challenge, type) {
    const appCardsContainer = document.getElementById('app-cards');
    const playerCardsContainer = document.getElementById('player-cards');
    
    appCardsContainer.innerHTML = '';
    playerCardsContainer.innerHTML = '';
    
    const puzzleCards = challenge.cards.filter(card => card.type === 'puzzle');
    const solutionCards = challenge.cards.filter(card => card.type === 'solution');
    
    shuffleArray(solutionCards);
    
    puzzleCards.forEach(card => {
        const cardElement = createAppCardElement(card);
        appCardsContainer.appendChild(cardElement);
    });
    
    solutionCards.forEach(card => {
        const cardElement = createPlayerCardElement(card);
        playerCardsContainer.appendChild(cardElement);
    });
    
    // Lazy load images for the game screen
    lazyLoadImages();
}

// Lazy Loading للصور
function lazyLoadImages() {
    const images = document.querySelectorAll('.card-image');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const path = img.dataset.src;
                
                // جلب الصورة من IndexedDB
                const transaction = db.transaction(['images'], 'readonly');
                const imagesStore = transaction.objectStore('images');
                const request = imagesStore.get(path);
                
                request.onsuccess = () => {
                    if (request.result) {
                        img.src = request.result.data;
                        img.classList.remove('loading');
                    } else {
                        // إذا لم تكن موجودة، جلبها وتخزينها
                        fetchImageAndCache(path, img);
                    }
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "0px 0px 100px 0px" // تحميل الصور قبل ظهورها بقليل
    });

    images.forEach(img => {
        observer.observe(img);
    });
}

// جلب الصورة من الشبكة وتخزينها في IndexedDB
async function fetchImageAndCache(path, imgElement) {
    try {
        const response = await fetch(path);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            const transaction = db.transaction(['images'], 'readwrite');
            const imagesStore = transaction.objectStore('images');
            imagesStore.put({ path: path, data: base64data });
            
            imgElement.src = base64data;
            imgElement.classList.remove('loading');
        };
    } catch (error) {
        console.error(`Failed to load image from network: ${path}`, error);
        imgElement.classList.remove('loading');
        imgElement.classList.add('error');
    }
}

// إنشاء عنصر بطاقة التطبيق (ذات الوجهين)
function createAppCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'card ripple';
    card.dataset.id = cardData.id;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path; // استخدام data-src
    cardImage.alt = 'لغز';
    cardFront.appendChild(cardImage);
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    
    // تخصيص مظهر البطاقات حسب نوع التحدي
    if (gameMode === "daily") {
        cardBack.style.background = "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)";
        cardBack.innerHTML = '<div class="pattern daily">☀️</div><div>تحدي اليوم</div>';
    } else if (gameMode === "timed") {
        cardBack.style.background = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
        cardBack.innerHTML = '<div class="pattern timed">⏱️</div><div>تحدي الوقت</div>';
    } else {
        cardBack.innerHTML = '<div class="pattern">❖</div><div>؟</div>';
    }
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => showPuzzleCard(card));
    
    return card;
}

// إنشاء عنصر بطاقة اللاعب (ذات الوجه الواحد)
function createPlayerCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'player-card ripple';
    card.dataset.id = cardData.id;
    
    // تخصيص مظهر بطاقات اللاعب حسب نوع التحدي
    if (gameMode === "daily") {
        card.classList.add('daily-card');
    } else if (gameMode === "timed") {
        card.classList.add('timed-card');
    }
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path; // استخدام data-src
    cardImage.alt = 'حل';
    card.appendChild(cardImage);
    card.addEventListener('click', () => selectCard(card));
    
    return card;
}

// عرض بطاقة اللغز
function showPuzzleCard(card) {
    if (selectedCard) return;
    
    card.classList.add('flipped');
    selectedCard = card;
    playSound('flip');
    
    setTimeout(() => {
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            selectedCard = null;
        }
    }, 3000);
}

// اختيار بطاقة الحل
function selectCard(card) {
    if (!selectedCard) {
        showMessage('تنبيه', `${userName}، الرجاء النقر على إحدى بطاقات اللغز أولاً`);
        vibrate(100);
        return;
    }
    
    if (selectedCard.dataset.id === card.dataset.id) {
        selectedCard.style.visibility = 'hidden';
        selectedCard = null;
        
        levelPoints++;
        document.getElementById('level-points').textContent = levelPoints;
        updateProgress('level-progress', levelPoints, 3);
        
        playSound('success');
        vibrate(50);
        
        if (levelPoints === 3) {
            completeLevel();
        } else {
            showToast(`إجابة صحيحة! ${userName}، لقد كسبت نقطة`);
        }
    } else {
        playSound('error');
        vibrate(200);
        
        // خصم نقطة عند الإجابة الخاطئة
        if (totalPoints > 0) {
            totalPoints--;
            const transaction = db.transaction(['stats'], 'readwrite');
            const statsStore = transaction.objectStore('stats');
            statsStore.put({
                id: 'totalPoints',
                value: totalPoints
            });
            
            document.getElementById('total-points').textContent = totalPoints;
            updateProgress('total-progress', totalPoints, getMaxPoints());
            updateTotalPointsInUI();
            showToast('تم خصم نقطة بسبب الإجابة الخاطئة');
        }
        
        showMessage('إجابة خاطئة', `${userName}، حاول مرة أخرى`);
        selectedCard.classList.remove('flipped');
        selectedCard = null;
    }
}

// استخدام تلميح
function useHint() {
    if (totalPoints < hintCost) {
        showToast(`ليس لديك نقاط كافية. تحتاج إلى ${hintCost} نقاط`);
        return;
    }
    
    if (!selectedCard) {
        showToast('الرجاء النقر على إحدى بطاقات اللغز أولاً');
        return;
    }
    
    // خصم تكلفة التلميح
    totalPoints -= hintCost;
    const transaction = db.transaction(['stats'], 'readwrite');
    const statsStore = transaction.objectStore('stats');
    statsStore.put({
        id: 'totalPoints',
        value: totalPoints
    });
    
    document.getElementById('total-points').textContent = totalPoints;
    updateProgress('total-progress', totalPoints, getMaxPoints());
    updateTotalPointsInUI();
    
    // عرض التلميح
    const hintText = document.getElementById('hint-text');
    hintText.style.display = 'block';
    hintText.textContent = `البطاقة الصحيحة هي إحدى البطاقات الثلاث المتاحة. حاول التركيز على التفاصيل!`;
    
    playSound('click');
    showToast(`تم استخدام تلميح وخصم ${hintCost} نقاط`);
}

// إكمال المستوى
function completeLevel() {
    const transaction = db.transaction(['levels', 'stats', 'user', 'stages'], 'readwrite');
    
    const levelsStore = transaction.objectStore('levels');
    levelsStore.put({
        id: currentLevel,
        completed: true,
        points: levelPoints,
        stage: currentStage
    });
    
    totalPoints += levelPoints;
    const statsStore = transaction.objectStore('stats');
    statsStore.put({
        id: 'totalPoints',
        value: totalPoints
    });
    
    // تحديث حالة المرحلة
    const stagesStore = transaction.objectStore('stages');
    const stageRequest = stagesStore.get(currentStage);
    
    stageRequest.onsuccess = (event) => {
        const stage = event.target.result;
        
        // حساب عدد المستويات المكتملة في هذه المرحلة
        const levelsInStage = levelsData.filter(l => l.stage === currentStage);
        const completedLevelsInStage = levelsInStage.filter(l => l.completed).length + 1; // +1 لأننا نضيف المستوى الحالي
        
        // تحديث عدد المستويات المكتملة في المرحلة
        stage.completedLevels = completedLevelsInStage;
        
        // إذا اكتملت جميع مستويات المرحلة، وضع علامة اكتمال
        if (completedLevelsInStage === levelsInStage.length) {
            stage.completed = true;
            
            // إذا كانت هناك مرحلة تالية، فتحها
            if (currentStage < stagesData.length) {
                const nextStage = stagesData.find(s => s.id === currentStage + 1);
                const nextStageRequest = stagesStore.get(nextStage.id);
                
                nextStageRequest.onsuccess = (e) => {
                    const nextStageData = e.target.result;
                    nextStageData.completed = false;
                    stagesStore.put(nextStageData);
                };
            }
        }
        
        stagesStore.put(stage);
    };
    
    transaction.oncomplete = () => {
        // إوقف المؤقت إذا كان نشطاً
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
        
        createConfetti();
        playSound('win');
        
        // عرض رسالة النجاح
        showMessage('تهانينا!', `${userName}، لقد أكملت المستوى ${currentLevel} بنجاح`, true);
        
        // تحديث النقاط والعناصر المرتبطة بها
        document.getElementById('total-points').textContent = totalPoints;
        updateProgress('total-progress', totalPoints, getMaxPoints());
        updateTotalPointsInUI();
        
        updateProfileStats();
        
        // الانتقال مباشرة إلى شاشة المستويات بعد إكمال المستوى
        setTimeout(() => {
            if (gameMode === "daily" || gameMode === "timed") {
                showScreen('stages-screen');
            } else {
                showLevelsScreen(currentStage);
            }
        }, 2000);
        
        if (currentLevel % 5 === 0) {
            showAchievement(`مبارك ${userName}! لقد وصلت إلى المستوى ${currentLevel}!`);
        }
        
        // التحقق من إنجاز السرعة إذا كان في وضع الوقت المحدد
        if (gameMode === "timed" && timeLeft >= 30) {
            unlockAchievement("speed_runner");
        }
        
        // إذا كان تحدي يومي، فتح إنجاز التحدي اليومي
        if (gameMode === "daily") {
            unlockAchievement("daily_challenge");
        }
    };
}

// فتح إنجاز
function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.earned) {
        const transaction = db.transaction(['achievements'], 'readwrite');
        const achievementsStore = transaction.objectStore('achievements');
        
        achievementsStore.get(achievementId).onsuccess = (event) => {
            const data = event.target.result;
            data.earned = true;
            achievementsStore.put(data);
            
            // تحديث القائمة المحلية
            achievement.earned = true;
            
            // عرض إشعار الإنجاز
            showAchievement(`تهانينا! لقد حصلت على إنجاز: ${data.title}`);
            
            // إعادة تحميل الإنجازات
            loadAchievements();
        };
    }
}

// عرض رسالة
function showMessage(title, text, isLevelComplete = false) {
    const message = document.getElementById('message');
    const messageTitle = document.getElementById('message-title');
    const messageText = document.getElementById('message-text');
    const messageBtn = document.getElementById('message-btn');
    
    messageTitle.textContent = title;
    messageText.textContent = text;
    message.classList.add('show');
    
    messageBtn.onclick = () => {
        message.classList.remove('show');
        
        if (isLevelComplete) {
            if (gameMode === "daily" || gameMode === "timed") {
                showScreen('stages-screen');
            } else {
                showLevelsScreen(currentStage);
            }
        }
    };
}

// عرض إشعار تقدم
function showAchievement(text) {
    if (!notificationsEnabled) return;
    
    const badge = document.createElement('div');
    badge.className = 'achievement-badge';
    badge.innerHTML = `<i class="fas fa-trophy"></i> <span>${text}</span>`;
    
    document.body.appendChild(badge);
    
    setTimeout(() => {
        badge.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        badge.classList.remove('show');
        setTimeout(() => {
            badge.remove();
        }, 500);
    }, 3000);
}

// عرض إشعار toast
function showToast(message) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #6c5ce7, #fd79a8)",
        stopOnFocus: true
    }).showToast();
}

// تغيير الشاشة المعروضة
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNavItem = document.querySelector(`.nav-item[data-target="${screenId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    if (screenId === 'profile-screen') {
        updateProfileStats();
    } else if (screenId === 'stages-screen') {
        loadStages();
    }
}

// تغيير نمط اللعبة
function changeGameMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.mode-tab[data-mode="${mode}"]`).classList.add('active');
    
    // إعادة تحميل المستويات بناءً على النمط المختار
    if (mode === "normal") {
        loadLevels(currentStage);
    } else if (mode === "daily") {
        loadDailyChallenges();
    } else if (mode === "timed") {
        loadTimedChallenges();
    }
}

// تحميل التحديات اليومية
function loadDailyChallenges() {
    const levelsContainer = document.getElementById('levels-container');
    levelsContainer.innerHTML = '';
    
    dailyChallenges.forEach(challenge => {
        const challengeCard = document.createElement('div');
        challengeCard.className = 'level-card ripple daily-challenge';
        challengeCard.dataset.id = challenge.id;
        
        const challengeBg = document.createElement('div');
        challengeBg.className = 'level-bg';
        challengeBg.style.backgroundImage = `url(${challenge.background})`;
        challengeCard.appendChild(challengeBg);
        
        const challengeNumber = document.createElement('div');
        challengeNumber.className = 'level-number';
        challengeNumber.innerHTML = `<i class="fas fa-calendar-day"></i> ${challenge.id}`;
        challengeCard.appendChild(challengeNumber);
        
        const challengeTitle = document.createElement('div');
        challengeTitle.className = 'challenge-title';
        challengeTitle.textContent = challenge.title;
        challengeCard.appendChild(challengeTitle);
        
        const challengeStatus = document.createElement('div');
        challengeStatus.className = 'level-status';
        challengeStatus.innerHTML = '<i class="fas fa-star"></i> 0/3';
        challengeCard.appendChild(challengeStatus);
        
        challengeCard.addEventListener('click', () => {
            vibrate();
            playSound('click');
            startDailyChallenge();
        });
        
        levelsContainer.appendChild(challengeCard);
    });
}

// تحميل تحديات الوقت
function loadTimedChallenges() {
    const levelsContainer = document.getElementById('levels-container');
    levelsContainer.innerHTML = '';
    
    timedChallenges.forEach(challenge => {
        const challengeCard = document.createElement('div');
        challengeCard.className = 'level-card ripple timed-challenge';
        challengeCard.dataset.id = challenge.id;
        
        const challengeBg = document.createElement('div');
        challengeBg.className = 'level-bg';
        challengeBg.style.backgroundImage = `url(${challenge.background})`;
        challengeCard.appendChild(challengeBg);
        
        const challengeNumber = document.createElement('div');
        challengeNumber.className = 'level-number';
        challengeNumber.innerHTML = `<i class="fas fa-stopwatch"></i> ${challenge.id}`;
        challengeCard.appendChild(challengeNumber);
        
        const challengeTitle = document.createElement('div');
        challengeTitle.className = 'challenge-title';
        challengeTitle.textContent = challenge.title;
        challengeCard.appendChild(challengeTitle);
        
        const challengeTime = document.createElement('div');
        challengeTime.className = 'challenge-time';
        challengeTime.innerHTML = `<i class="fas fa-clock"></i> ${challenge.timeLimit} ثانية`;
        challengeCard.appendChild(challengeTime);
        
        const challengeStatus = document.createElement('div');
        challengeStatus.className = 'level-status';
        challengeStatus.innerHTML = '<i class="fas fa-star"></i> 0/3';
        challengeCard.appendChild(challengeStatus);
        
        challengeCard.addEventListener('click', () => {
            vibrate();
            playSound('click');
            startTimedChallenge();
        });
        
        levelsContainer.appendChild(challengeCard);
    });
}

// بدء تحدي يومي
function startDailyChallenge() {
    gameMode = "daily";
    const challenge = dailyChallenges[0]; // يمكن التوسع لاحقاً لدعم تحديات متعددة
    
    // عرض اللغز الثقافي أولاً
    showCulturalPuzzleBeforeLevel(challenge);
}

// بدء تحدي الوقت
function startTimedChallenge() {
    gameMode = "timed";
    const challenge = timedChallenges[0]; // يمكن التوسع لاحقاً لدعم تحديات متعددة
    
    // عرض اللغز الثقافي أولاً
    showCulturalPuzzleBeforeLevel(challenge);
}

// تهيئة مستمعي الأحداث
function setupEventListeners() {
    document.getElementById('back-to-levels-btn').addEventListener('click', () => {
        playSound('click');
        vibrate();
        if (gameMode === "daily" || gameMode === "timed") {
            showScreen('stages-screen');
        } else {
            showLevelsScreen(currentStage);
        }
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            playSound('click');
            vibrate();
            
            const targetScreen = item.getAttribute('data-target');
            showScreen(targetScreen);
        });
    });
    
    document.getElementById('save-profile').addEventListener('click', () => {
        const newName = document.getElementById('user-name').value;
        const newEmail = document.getElementById('user-email').value;
        
        if (newName.trim() === '') {
            showToast('الرجاء إدخال اسم مستخدم صحيح');
            return;
        }
        
        userName = newName;
        userEmail = newEmail;
        
        const transaction = db.transaction(['user'], 'readwrite');
        const userStore = transaction.objectStore('user');
        
        userStore.get('profile').onsuccess = (event) => {
            const userData = event.target.result;
            userData.name = userName;
            userData.email = userEmail;
            
            userStore.put(userData).onsuccess = () => {
                document.getElementById('profile-name').textContent = userName;
                showToast('تم حفظ التغييرات بنجاح');
            };
        };
    });
    
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
        const transaction = db.transaction(['settings'], 'readwrite');
        const settingsStore = transaction.objectStore('settings');
        settingsStore.put({ id: 'sound', value: soundEnabled });
        
        if (soundEnabled) playSound('click');
    });
    
    document.getElementById('vibration-toggle').addEventListener('change', (e) => {
        vibrationEnabled = e.target.checked;
        const transaction = db.transaction(['settings'], 'readwrite');
        const settingsStore = transaction.objectStore('settings');
        settingsStore.put({ id: 'vibration', value: vibrationEnabled });
        
        if (vibrationEnabled) vibrate();
    });
    
    document.getElementById('notifications-toggle').addEventListener('change', (e) => {
        notificationsEnabled = e.target.checked;
        const transaction = db.transaction(['settings'], 'readwrite');
        const settingsStore = transaction.objectStore('settings');
        settingsStore.put({ id: 'notifications', value: notificationsEnabled });
    });
    
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            
            const newColor = option.getAttribute('data-color');
            document.documentElement.style.setProperty('--primary', newColor);
            document.documentElement.style.setProperty('--card-back', newColor);
            document.documentElement.style.setProperty('--gradient', `linear-gradient(120deg, ${newColor}, #fd79a8)`);
        });
    });
    
    document.getElementById('share-app').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'أبطال البطاقات',
                text: 'جرب هذه اللعبة المثيرة للذكاء!',
                url: window.location.href
            })
            .then(() => console.log('تم المشاركة بنجاح'))
            .catch((error) => console.log('خطأ في المشاركة:', error));
        } else {
            showToast('ميزة المشاركة غير مدعومة في متصفحك');
        }
    });
    
    document.getElementById('reset-app').addEventListener('click', () => {
        if (confirm('هل أنت متأكد من أنك تريد إعادة ضبط التطبيق؟ سيتم حذف جميع بياناتك.')) {
            indexedDB.deleteDatabase('CardGameDB');
            localStorage.clear();
            location.reload();
        }
    });
    
    document.getElementById('hint-btn').addEventListener('click', () => {
        useHint();
    });
    
    // أحداث أنماط اللعبة
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.getAttribute('data-mode');
            changeGameMode(mode);
        });
    });
    
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// دالة لخلط المصفوفة (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// دالة للاهتزاز
function vibrate(duration = 50) {
    if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// دالة لتشغيل الصوت
function playSound(type) {
    if (!soundEnabled) return;
    
    // يمكن إضافة أصوات حقيقية هنا
    switch(type) {
        case 'click':
            // صوت النقر
            break;
        case 'flip':
            // صوت قلب البطاقة
            break;
        case 'success':
            // صوت النجاح
            break;
        case 'error':
            // صوت الخطأ
            break;
        case 'win':
            // صوت الفوز
            break;
    }
}
