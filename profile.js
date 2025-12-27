// profile.js - إدارة الملف الشخصي والإنجازات (نسخة كاملة محدثة)

// بيانات الإنجازات
let achievementsData = [
    { 
        id: "first_win", 
        title: "الفائز الأول", 
        description: "أكمل مستوى واحد", 
        icon: "fa-trophy", 
        earned: false,
        color: "#fdcb6e",
        points: 10
    },
    { 
        id: "five_wins", 
        title: "بطل مبتدئ", 
        description: "أكمل 5 مستويات", 
        icon: "fa-medal", 
        earned: false,
        color: "#a29bfe",
        points: 25
    },
    { 
        id: "ten_wins", 
        title: "بطل محترف", 
        description: "أكمل 10 مستويات", 
        icon: "fa-crown", 
        earned: false,
        color: "#6c5ce7",
        points: 50
    },
    { 
        id: "daily_challenge", 
        title: "متحدي اليوم", 
        description: "أكمل التحدي اليومي", 
        icon: "fa-calendar", 
        earned: false,
        color: "#00b894",
        points: 30
    },
    { 
        id: "speed_runner", 
        title: "عداء سريع", 
        description: "أكمل مستوى في أقل من 30 ثانية", 
        icon: "fa-stopwatch", 
        earned: false,
        color: "#fd79a8",
        points: 40
    },
    { 
        id: "hint_master", 
        title: "سيد التلميحات", 
        description: "أكمل مستوى دون استخدام تلميحات", 
        icon: "fa-lightbulb", 
        earned: false,
        color: "#fdcb6e",
        points: 35
    },
    { 
        id: "puzzle_master", 
        title: "سيد الألغاز", 
        description: "أجب على 10 ألغاز ثقافية بشكل صحيح", 
        icon: "fa-puzzle-piece", 
        earned: false,
        color: "#74b9ff",
        points: 45
    },
    { 
        id: "perfect_score", 
        title: "نتيجة مثالية", 
        description: "أكمل 3 مستويات بنتيجة 3/3", 
        icon: "fa-star", 
        earned: false,
        color: "#ffeaa7",
        points: 60
    },
    { 
        id: "stage_completer", 
        title: "فاتح المراحل", 
        description: "أكمل مرحلة كاملة", 
        icon: "fa-flag", 
        earned: false,
        color: "#55efc4",
        points: 100
    },
    { 
        id: "collector", 
        title: "جامع البطاقات", 
        description: "تطابق 50 بطاقة بشكل صحيح", 
        icon: "fa-layer-group", 
        earned: false,
        color: "#fd79a8",
        points: 75
    }
];

// متغيرات الملف الشخصي
let userProfileData = {
    name: "المستخدم",
    email: "",
    level: 1,
    totalPoints: 0,
    completedLevels: 0,
    successRate: 0,
    playTime: 0
};

// تهيئة الملف الشخصي
function initProfileScreen() {
    console.log('جاري تهيئة شاشة الملف الشخصي...');
    
    // انتظر حتى يتم تحميل DOM بالكامل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupProfileScreen();
        });
    } else {
        // DOM محمل بالفعل
        setTimeout(() => {
            setupProfileScreen();
        }, 100);
    }
}

// إعداد شاشة الملف الشخصي
function setupProfileScreen() {
    console.log('جاري إعداد شاشة الملف الشخصي...');
    
    // محاولة متعددة للعثور على العناصر
    let attempts = 0;
    const maxAttempts = 10;
    
    const trySetup = () => {
        attempts++;
        
        // التحقق من وجود العناصر الأساسية
        const profileScreen = document.getElementById('profile-screen');
        const achievementsContainer = document.getElementById('achievements-container');
        
        if (profileScreen && achievementsContainer) {
            console.log('تم العثور على عناصر شاشة الملف الشخصي');
            
            // تحميل بيانات المستخدم
            loadUserProfile();
            
            // إعداد مستمعي الأحداث
            setupProfileEventListeners();
            
            // تحميل الإنجازات
            loadAchievements();
            
            // تحديث الإحصائيات
            updateProfileStats();
            
            // إضافة مستمع لفحص عندما تصبح الشاشة نشطة
            setupProfileScreenObserver();
            
            // تحديث تلقائي كل 5 ثوان عند فتح الشاشة
            startProfileAutoUpdate();
            
        } else if (attempts < maxAttempts) {
            console.log(`محاولة ${attempts}/${maxAttempts}: العناصر غير جاهزة، إعادة المحاولة...`);
            setTimeout(trySetup, 300);
        } else {
            console.error('فشل في العثور على عناصر شاشة الملف الشخصي بعد عدة محاولات');
            createFallbackUI();
        }
    };
    
    trySetup();
}

// إعداد مراقب لشاشة الملف الشخصي
function setupProfileScreenObserver() {
    const profileScreen = document.getElementById('profile-screen');
    if (!profileScreen) return;
    
    // مراقبة تغييرات الفئة
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (profileScreen.classList.contains('active')) {
                    console.log('شاشة الملف الشخصي أصبحت نشطة، تحديث البيانات...');
                    
                    // تحديث البيانات بعد تأخير بسيط
                    setTimeout(() => {
                        loadUserProfile();
                        updateProfileStats();
                        loadAchievements();
                    }, 300);
                }
            }
        });
    });
    
    observer.observe(profileScreen, { attributes: true });
}

// بدء التحديث التلقائي
function startProfileAutoUpdate() {
    // تحديث كل 10 ثوان عند فتح الشاشة
    setInterval(() => {
        const profileScreen = document.getElementById('profile-screen');
        if (profileScreen && profileScreen.classList.contains('active')) {
            updateProfileStats();
        }
    }, 10000);
}

// تحميل بيانات المستخدم
function loadUserProfile() {
    console.log('جاري تحميل بيانات المستخدم...');
    
    // استخدام البيانات من المتغيرات العامة
    if (typeof window.userName !== 'undefined') {
        userProfileData.name = window.userName;
        console.log('اسم المستخدم:', window.userName);
    }
    
    if (typeof window.userEmail !== 'undefined') {
        userProfileData.email = window.userEmail;
    }
    
    if (typeof window.playTime !== 'undefined') {
        userProfileData.playTime = window.playTime;
    }
    
    if (typeof window.totalPoints !== 'undefined') {
        userProfileData.totalPoints = window.totalPoints;
    }
    
    // تحديث واجهة المستخدم
    updateProfileUI();
}

// تحديث واجهة المستخدم للملف الشخصي
function updateProfileUI() {
    console.log('جاري تحديث واجهة المستخدم للملف الشخصي...');
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const profileName = document.getElementById('profile-name');
    
    if (nameInput) {
        nameInput.value = userProfileData.name;
        console.log('تعيين اسم المستخدم في الحقل:', userProfileData.name);
    } else {
        console.warn('حقل اسم المستخدم غير موجود');
    }
    
    if (emailInput) {
        emailInput.value = userProfileData.email;
    }
    
    if (profileName) {
        profileName.textContent = userProfileData.name;
        console.log('تعيين اسم الملف الشخصي:', userProfileData.name);
    } else {
        console.warn('عنصر اسم الملف الشخصي غير موجود');
    }
}

// إعداد مستمعي أحداث الملف الشخصي
function setupProfileEventListeners() {
    console.log('جاري إعداد مستمعي أحداث الملف الشخصي...');
    
    // زر حفظ الملف الشخصي
    const saveProfileBtn = document.getElementById('save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
        console.log('تم إعداد مستمع لحفظ الملف الشخصي');
    } else {
        console.warn('زر حفظ الملف الشخصي غير موجود، إعادة المحاولة...');
        // إعادة المحاولة بعد فترة
        setTimeout(() => {
            const retryBtn = document.getElementById('save-profile');
            if (retryBtn) {
                retryBtn.addEventListener('click', saveProfile);
                console.log('تم إعداد مستمع لحفظ الملف الشخصي بعد إعادة المحاولة');
            }
        }, 500);
    }
    
    // حقول الإدخال
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveProfile();
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveProfile();
            }
        });
    }
    
    // تحديث عند تغيير الإدخال
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            const profileName = document.getElementById('profile-name');
            if (profileName) {
                profileName.textContent = e.target.value || userProfileData.name;
            }
        });
    }
}

// حفظ بيانات الملف الشخصي
function saveProfile() {
    console.log('جاري حفظ بيانات الملف الشخصي...');
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    
    if (!nameInput || !emailInput) {
        console.error('حقول الإدخال غير موجودة');
        showToast('خطأ في حفظ البيانات');
        return;
    }
    
    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();
    
    if (!newName) {
        showToast('الرجاء إدخال اسم مستخدم صحيح');
        if (typeof vibrate === 'function') vibrate(100);
        return;
    }
    
    userProfileData.name = newName;
    userProfileData.email = newEmail;
    
    // تحديث المتغيرات العامة
    if (typeof window.userName !== 'undefined') {
        window.userName = newName;
    }
    
    if (typeof window.userEmail !== 'undefined') {
        window.userEmail = newEmail;
    }
    
    // تحديث واجهة المستخدم
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = newName;
    }
    
    // حفظ في قاعدة البيانات إذا كانت متاحة
    if (typeof window.db !== 'undefined' && window.db) {
        try {
            const transaction = window.db.transaction(['user'], 'readwrite');
            const userStore = transaction.objectStore('user');
            
            userStore.get('profile').onsuccess = (event) => {
                const userData = event.target.result || {
                    id: 'profile',
                    name: newName,
                    email: newEmail,
                    playTime: userProfileData.playTime || 0,
                    totalPoints: userProfileData.totalPoints || 0,
                    completedLevels: userProfileData.completedLevels || 0,
                    currentStage: window.currentStage || 1
                };
                
                userData.name = newName;
                userData.email = newEmail;
                
                userStore.put(userData).onsuccess = () => {
                    showToast('تم حفظ التغييرات بنجاح');
                    if (typeof playSound === 'function') playSound('success');
                    if (typeof vibrate === 'function') vibrate(50);
                    
                    // تحديث الإحصائيات بعد الحفظ
                    setTimeout(() => {
                        updateProfileStats();
                    }, 500);
                };
                
                userStore.put(userData).onerror = (error) => {
                    console.error('خطأ في حفظ بيانات المستخدم:', error);
                    showToast('حدث خطأ أثناء الحفظ');
                };
            };
        } catch (error) {
            console.error('خطأ في عملية قاعدة البيانات:', error);
            showToast('تم حفظ التغييرات مؤقتاً');
        }
    } else {
        showToast('تم حفظ التغييرات مؤقتاً');
    }
}

// تحديث إحصائيات الملف الشخصي
function updateProfileStats() {
    console.log('جاري تحديث إحصائيات الملف الشخصي...');
    
    // محاولة استخدام البيانات المتاحة مباشرة
    if (typeof window.totalPoints !== 'undefined') {
        userProfileData.totalPoints = window.totalPoints;
        updateProfileStatsDirect();
    }
    
    // إذا كانت قاعدة البيانات متاحة، حاول الحصول على بيانات أكثر دقة
    if (typeof window.db !== 'undefined' && window.db) {
        updateProfileStatsFromDB();
    }
}

// تحديث الإحصائيات مباشرة من المتغيرات
function updateProfileStatsDirect() {
    console.log('تحديث الإحصائيات مباشرة من المتغيرات...');
    
    let completedLevels = 0;
    let totalPoints = userProfileData.totalPoints || 0;
    
    // تقدير عدد المستويات المكتملة بناءً على النقاط
    if (typeof window.levelsData !== 'undefined') {
        // افتراض أن كل مستوى يكسب 3 نقاط كحد أقصى
        completedLevels = Math.floor(totalPoints / 3);
        const totalLevels = window.levelsData.length;
        
        // حساب معدل النجاح
        const successRate = completedLevels > 0 ? 
            Math.round((totalPoints / (completedLevels * 3)) * 100) : 0;
        
        // تحديث البيانات
        userProfileData.completedLevels = completedLevels;
        userProfileData.successRate = successRate;
        
        // تحديث واجهة المستخدم
        updateProfileStatsUI(completedLevels, totalPoints, successRate, totalLevels);
    }
}

// تحديث الإحصائيات من قاعدة البيانات
function updateProfileStatsFromDB() {
    if (typeof window.db === 'undefined' || !window.db) {
        console.warn('قاعدة البيانات غير متاحة');
        return;
    }
    
    try {
        const transaction = window.db.transaction(['levels', 'user', 'stats'], 'readonly');
        const levelsStore = transaction.objectStore('levels');
        const userStore = transaction.objectStore('user');
        const statsStore = transaction.objectStore('stats');
        
        let completedLevels = 0;
        let totalEarnedPoints = 0;
        
        // حساب المستويات المكتملة والنقاط
        const countRequest = levelsStore.index('completed').openCursor(IDBKeyRange.only(true));
        
        countRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                completedLevels++;
                totalEarnedPoints += cursor.value.points || 0;
                cursor.continue();
            } else {
                // الحصول على إجمالي النقاط من الإحصائيات
                statsStore.get('totalPoints').onsuccess = (e) => {
                    const statsResult = e.target.result;
                    const totalPointsFromStats = statsResult ? statsResult.value : totalEarnedPoints;
                    
                    // حساب معدل النجاح
                    const successRate = completedLevels > 0 ? 
                        Math.round((totalEarnedPoints / (completedLevels * 3)) * 100) : 0;
                    
                    // تحديث بيانات الملف الشخصي
                    userProfileData.totalPoints = totalPointsFromStats;
                    userProfileData.completedLevels = completedLevels;
                    userProfileData.successRate = successRate;
                    
                    // الحصول على إجمالي المستويات
                    const totalLevels = window.levelsData ? window.levelsData.length : 0;
                    
                    // تحديث واجهة المستخدم
                    updateProfileStatsUI(completedLevels, totalPointsFromStats, successRate, totalLevels);
                    
                    // تحديث بيانات المستخدم في قاعدة البيانات
                    updateUserDataInDB(completedLevels, totalPointsFromStats);
                    
                    // التحقق من الإنجازات
                    checkAchievements(completedLevels, totalPointsFromStats);
                };
            }
        };
        
        countRequest.onerror = (error) => {
            console.error('خطأ في حساب المستويات المكتملة:', error);
            updateProfileStatsDirect();
        };
        
    } catch (error) {
        console.error('خطأ في تحديث الإحصائيات:', error);
        updateProfileStatsDirect();
    }
}

// تحديث واجهة المستخدم للإحصائيات
function updateProfileStatsUI(completedLevels, totalPoints, successRate, totalLevels) {
    console.log('تحديث واجهة الإحصائيات:', { 
        completedLevels, 
        totalPoints, 
        successRate, 
        totalLevels 
    });
    
    // تحديث النقاط الإجمالية
    const totalPointsElement = document.getElementById('total-points-profile');
    if (totalPointsElement) {
        totalPointsElement.textContent = totalPoints;
        console.log('تعيين النقاط الإجمالية:', totalPoints);
    } else {
        console.warn('عنصر النقاط الإجمالية غير موجود');
    }
    
    // تحديث المستويات المكتملة
    const completedLevelsElement = document.getElementById('completed-levels');
    if (completedLevelsElement) {
        completedLevelsElement.textContent = `${completedLevels}/${totalLevels}`;
        console.log('تعيين المستويات المكتملة:', completedLevels);
    }
    
    // تحديث معدل النجاح
    const successRateElement = document.getElementById('success-rate');
    if (successRateElement) {
        successRateElement.textContent = `${successRate}%`;
    }
    
    // تحديث وقت اللعب
    const playTimeElement = document.getElementById('play-time');
    if (playTimeElement) {
        const hours = Math.floor(userProfileData.playTime / 60);
        const minutes = userProfileData.playTime % 60;
        playTimeElement.textContent = `${hours} س ${minutes} د`;
    }
    
    // حساب مستوى المستخدم
    const userLevel = Math.floor(completedLevels / 5) + 1;
    userProfileData.level = userLevel;
    
    const profileLevelElement = document.getElementById('profile-level');
    if (profileLevelElement) {
        profileLevelElement.textContent = userLevel;
    }
    
    // تحديث شريط التقدم للمستوى
    const levelProgress = (completedLevels % 5) * 20;
    updateLevelProgressBar(levelProgress);
}

// تحديث شريط تقدم المستوى
function updateLevelProgressBar(progress) {
    let progressBar = document.getElementById('profile-level-progress');
    if (!progressBar) {
        // إنشاء شريط التقدم إذا لم يكن موجوداً
        const profileHeader = document.querySelector('.profile-header');
        if (profileHeader) {
            const progressHTML = `
                <div class="level-progress-container" style="margin-top: 15px;">
                    <div class="progress-bar" style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div class="progress" id="profile-level-progress" style="height: 100%; background: var(--gradient); width: ${progress}%; border-radius: 4px; transition: width 0.5s ease;"></div>
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 5px;">
                        التقدم للوصول للمستوى التالي: ${progress}%
                    </div>
                </div>
            `;
            profileHeader.insertAdjacentHTML('beforeend', progressHTML);
        }
    } else {
        progressBar.style.width = `${progress}%`;
    }
}

// تحديث بيانات المستخدم في قاعدة البيانات
function updateUserDataInDB(completedLevels, totalPoints) {
    if (typeof window.db === 'undefined' || !window.db) return;
    
    try {
        const transaction = window.db.transaction(['user'], 'readwrite');
        const userStore = transaction.objectStore('user');
        
        userStore.get('profile').onsuccess = (event) => {
            const userData = event.target.result || {
                id: 'profile',
                name: userProfileData.name,
                email: userProfileData.email,
                playTime: userProfileData.playTime,
                totalPoints: totalPoints,
                completedLevels: completedLevels,
                currentStage: window.currentStage || 1
            };
            
            userData.completedLevels = completedLevels;
            userData.totalPoints = totalPoints;
            userData.playTime = userProfileData.playTime;
            
            userStore.put(userData);
        };
    } catch (error) {
        console.error('خطأ في تحديث بيانات المستخدم:', error);
    }
}

// تحميل الإنجازات
function loadAchievements() {
    console.log('جاري تحميل الإنجازات...');
    
    // استخدام البيانات المخزنة محلياً أولاً
    const savedAchievements = localStorage.getItem('userAchievements');
    if (savedAchievements) {
        try {
            const parsedAchievements = JSON.parse(savedAchievements);
            achievementsData.forEach((achievement, index) => {
                const saved = parsedAchievements.find(a => a.id === achievement.id);
                if (saved) {
                    achievementsData[index].earned = saved.earned;
                }
            });
            console.log('تم تحميل الإنجازات من localStorage');
        } catch (error) {
            console.error('خطأ في تحميل الإنجازات من localStorage:', error);
        }
    }
    
    // إذا كانت قاعدة البيانات متاحة، حاول الحصول على بيانات أكثر دقة
    if (typeof window.db !== 'undefined' && window.db) {
        loadAchievementsFromDB();
    } else {
        renderAchievements();
    }
}

// تحميل الإنجازات من قاعدة البيانات
function loadAchievementsFromDB() {
    try {
        const transaction = window.db.transaction(['achievements'], 'readonly');
        const achievementsStore = transaction.objectStore('achievements');
        const request = achievementsStore.getAll();
        
        request.onsuccess = (event) => {
            if (request.result && request.result.length > 0) {
                console.log('تم تحميل الإنجازات من قاعدة البيانات:', request.result.length);
                
                // تحديث البيانات المحلية بالإنجازات المحفوظة
                request.result.forEach(savedAchievement => {
                    const index = achievementsData.findIndex(a => a.id === savedAchievement.id);
                    if (index !== -1) {
                        achievementsData[index].earned = savedAchievement.earned;
                        achievementsData[index].color = savedAchievement.color || achievementsData[index].color;
                        achievementsData[index].points = savedAchievement.points || achievementsData[index].points;
                    }
                });
                
                // حفظ في localStorage للنسخ الاحتياطي
                localStorage.setItem('userAchievements', JSON.stringify(achievementsData));
                
                renderAchievements();
            } else {
                console.log('لا توجد إنجازات محفوظة، حفظ الإنجازات الافتراضية');
                saveAchievementsToDB();
                renderAchievements();
            }
        };
        
        request.onerror = (error) => {
            console.error('خطأ في تحميل الإنجازات:', error);
            renderAchievements();
        };
    } catch (error) {
        console.error('خطأ في تحميل الإنجازات:', error);
        renderAchievements();
    }
}

// حفظ الإنجازات في قاعدة البيانات
function saveAchievementsToDB() {
    if (typeof window.db === 'undefined' || !window.db) return;
    
    try {
        const transaction = window.db.transaction(['achievements'], 'readwrite');
        const achievementsStore = transaction.objectStore('achievements');
        
        achievementsData.forEach(achievement => {
            achievementsStore.put({
                id: achievement.id,
                title: achievement.title,
                description: achievement.description,
                icon: achievement.icon,
                earned: achievement.earned,
                color: achievement.color,
                points: achievement.points
            });
        });
        
        // حفظ في localStorage أيضاً
        localStorage.setItem('userAchievements', JSON.stringify(achievementsData));
        
        console.log('تم حفظ الإنجازات في قاعدة البيانات و localStorage');
    } catch (error) {
        console.error('خطأ في حفظ الإنجازات:', error);
    }
}

// عرض الإنجازات
function renderAchievements() {
    console.log('جاري عرض الإنجازات...');
    
    const achievementsContainer = document.getElementById('achievements-container');
    if (!achievementsContainer) {
        console.error('حاوية الإنجازات غير موجودة');
        return;
    }
    
    achievementsContainer.innerHTML = '';
    
    if (achievementsData.length === 0) {
        achievementsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.5);">
                <i class="fas fa-trophy" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>لا توجد إنجازات متاحة حالياً</p>
            </div>
        `;
        return;
    }
    
    achievementsData.forEach(achievement => {
        const achievementElement = createAchievementElement(achievement);
        achievementsContainer.appendChild(achievementElement);
    });
    
    console.log('تم عرض', achievementsData.length, 'إنجاز');
}

// إنشاء عنصر الإنجاز
function createAchievementElement(achievement) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = `achievement-item ${achievement.earned ? 'earned' : 'locked'}`;
    achievementDiv.dataset.id = achievement.id;
    
    const iconColor = achievement.earned ? achievement.color : '#636e72';
    
    achievementDiv.innerHTML = `
        <div class="achievement-icon" style="
            width: 60px;
            height: 60px;
            background: ${achievement.earned ? 
                `linear-gradient(135deg, ${achievement.color}, ${lightenColor(achievement.color, 30)})` : 
                'rgba(255, 255, 255, 0.1)'};
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px auto;
            border: 2px solid ${achievement.earned ? achievement.color : 'rgba(255, 255, 255, 0.2)'};
            box-shadow: ${achievement.earned ? 
                `0 4px 15px ${achievement.color}40` : 
                'none'};
        ">
            <i class="fas ${achievement.icon}" style="
                font-size: 28px;
                color: ${achievement.earned ? 'white' : 'rgba(255, 255, 255, 0.5)'};
            "></i>
        </div>
        <div class="achievement-title" style="
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 5px;
            color: ${achievement.earned ? 'var(--light)' : 'rgba(255, 255, 255, 0.5)'};
        ">${achievement.title}</div>
        <div class="achievement-desc" style="
            font-size: 12px;
            color: ${achievement.earned ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)'};
            margin-bottom: 8px;
        ">${achievement.description}</div>
        <div class="achievement-points" style="
            font-size: 11px;
            font-weight: bold;
            color: ${achievement.earned ? '#fdcb6e' : 'rgba(255, 255, 255, 0.3)'};
        ">
            <i class="fas fa-coins"></i> ${achievement.points} نقطة
        </div>
        ${achievement.earned ? `
            <div class="achievement-badge" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: ${achievement.color};
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            ">
                <i class="fas fa-check"></i>
            </div>
        ` : ''}
    `;
    
    // إضافة تأثيرات التفاعل
    if (!achievement.earned) {
        achievementDiv.style.cursor = 'default';
        achievementDiv.title = 'لم يتم كسب هذا الإنجاز بعد';
    } else {
        achievementDiv.style.cursor = 'pointer';
        achievementDiv.title = 'انقر لعرض التفاصيل';
        
        achievementDiv.addEventListener('click', () => {
            showAchievementDetails(achievement);
        });
        
        // تأثير hover للإنجازات المكتسبة
        achievementDiv.addEventListener('mouseenter', () => {
            if (achievement.earned) {
                achievementDiv.style.transform = 'translateY(-5px) scale(1.05)';
                achievementDiv.style.boxShadow = `0 10px 25px ${achievement.color}40`;
            }
        });
        
        achievementDiv.addEventListener('mouseleave', () => {
            if (achievement.earned) {
                achievementDiv.style.transform = 'translateY(0) scale(1)';
                achievementDiv.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }
        });
    }
    
    return achievementDiv;
}

// التحقق من الإنجازات
function checkAchievements(completedLevels, totalPoints) {
    console.log('التحقق من الإنجازات:', { completedLevels, totalPoints });
    
    const achievementsToUpdate = [];
    
    // التحقق من كل إنجاز
    if (completedLevels >= 1 && !getAchievement("first_win").earned) {
        achievementsToUpdate.push({ id: "first_win", earned: true });
    }
    
    if (completedLevels >= 5 && !getAchievement("five_wins").earned) {
        achievementsToUpdate.push({ id: "five_wins", earned: true });
    }
    
    if (completedLevels >= 10 && !getAchievement("ten_wins").earned) {
        achievementsToUpdate.push({ id: "ten_wins", earned: true });
    }
    
    if (achievementsToUpdate.length > 0) {
        updateAchievementsInDB(achievementsToUpdate);
    }
}

// تحديث الإنجازات في قاعدة البيانات
function updateAchievementsInDB(achievementsToUpdate) {
    achievementsToUpdate.forEach(achievement => {
        const ach = getAchievement(achievement.id);
        if (ach && !ach.earned) {
            ach.earned = true;
            
            // حفظ في قاعدة البيانات إذا كانت متاحة
            if (typeof window.db !== 'undefined' && window.db) {
                try {
                    const transaction = window.db.transaction(['achievements'], 'readwrite');
                    const achievementsStore = transaction.objectStore('achievements');
                    achievementsStore.put(ach);
                } catch (error) {
                    console.error('خطأ في حفظ الإنجاز:', error);
                }
            }
            
            // حفظ في localStorage
            localStorage.setItem('userAchievements', JSON.stringify(achievementsData));
            
            // عرض إشعار الإنجاز
            showAchievementNotification(ach);
            
            // تحديث الواجهة
            setTimeout(() => {
                renderAchievements();
            }, 100);
        }
    });
}

// الحصول على إنجاز محدد
function getAchievement(achievementId) {
    return achievementsData.find(a => a.id === achievementId);
}

// فتح إنجاز محدد
function unlockAchievement(achievementId) {
    const achievement = getAchievement(achievementId);
    if (achievement && !achievement.earned) {
        achievement.earned = true;
        
        // حفظ في قاعدة البيانات
        if (typeof window.db !== 'undefined' && window.db) {
            try {
                const transaction = window.db.transaction(['achievements'], 'readwrite');
                const achievementsStore = transaction.objectStore('achievements');
                achievementsStore.put(achievement);
            } catch (error) {
                console.error('خطأ في حفظ الإنجاز:', error);
            }
        }
        
        // حفظ في localStorage
        localStorage.setItem('userAchievements', JSON.stringify(achievementsData));
        
        // عرض إشعار
        showAchievementNotification(achievement);
        
        // تحديث الواجهة
        renderAchievements();
        
        return true;
    }
    return false;
}

// عرض إشعار الإنجاز
function showAchievementNotification(achievement) {
    if (typeof window.showToast === 'function') {
        window.showToast(`🎉 تهانينا! لقد حصلت على إنجاز: ${achievement.title}`);
    }
    
    // إنشاء عنصر إشعار
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, ${achievement.color}, ${darkenColor(achievement.color, 20)});
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas ${achievement.icon}" style="font-size: 24px;"></i>
        <div>
            <div style="font-weight: bold; font-size: 16px;">${achievement.title}</div>
            <div style="font-size: 12px; opacity: 0.9;">${achievement.description}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// دوال مساعدة للألوان
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    )
    .toString(16)
    .slice(1)}`;
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return `#${(
        0x1000000 +
        (R > 0 ? R : 0) * 0x10000 +
        (G > 0 ? G : 0) * 0x100 +
        (B > 0 ? B : 0)
    )
    .toString(16)
    .slice(1)}`;
}

// دالة لتحديث بيانات المستخدم من الخارج
function updateUserProfileData(data) {
    if (data.name) {
        userProfileData.name = data.name;
        if (typeof window.userName !== 'undefined') {
            window.userName = data.name;
        }
    }
    
    if (data.email) {
        userProfileData.email = data.email;
        if (typeof window.userEmail !== 'undefined') {
            window.userEmail = data.email;
        }
    }
    
    if (data.playTime) {
        userProfileData.playTime = data.playTime;
    }
    
    if (data.totalPoints) {
        userProfileData.totalPoints = data.totalPoints;
    }
    
    updateProfileUI();
    updateProfileStats();
}

// إنشاء واجهة بديلة في حالة الفشل
function createFallbackUI() {
    console.log('إنشاء واجهة بديلة...');
    
    const profileScreen = document.getElementById('profile-screen');
    if (!profileScreen) return;
    
    profileScreen.innerHTML = `
        <header class="glass-effect" role="banner">
            <h1 id="profile-title">
                <i class="fas fa-user" aria-hidden="true"></i>
                الملف الشخصي
            </h1>
        </header>
        
        <div class="profile-container">
            <div class="profile-header glass-effect" style="padding: 25px; text-align: center;">
                <div class="profile-avatar" role="img" aria-label="صورة الملف الشخصي">
                    <i class="fas fa-user" aria-hidden="true"></i>
                </div>
                <h2 id="profile-name" style="margin: 15px 0 10px 0;">${userProfileData.name}</h2>
                <div class="user-level glass-effect-light" 
                     style="display: inline-block; padding: 8px 20px; border-radius: 20px;">
                    <i class="fas fa-chart-line" style="color: var(--accent);"></i>
                    المستوى: <span id="profile-level" style="font-weight: bold;">${userProfileData.level}</span>
                </div>
            </div>
            
            <section class="profile-stats" role="region" aria-labelledby="stats-title">
                <h3 id="stats-title" class="sr-only">الإحصائيات</h3>
                <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 25px 0;">
                    <div class="stat-card glass-effect" role="group" aria-label="النقاط الإجمالية">
                        <div class="stat-icon" style="width: 60px; height: 60px; background: var(--gradient); border-radius: 15px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto;">
                            <i class="fas fa-coins" style="font-size: 28px; color: white;"></i>
                        </div>
                        <div class="value" id="total-points-profile" style="font-size: 32px; font-weight: 800;">${userProfileData.totalPoints}</div>
                        <div class="label" style="font-size: 16px; color: var(--light); opacity: 0.9;">النقاط الإجمالية</div>
                    </div>
                    
                    <div class="stat-card glass-effect" role="group" aria-label="المستويات المكتملة">
                        <div class="stat-icon" style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--success), #00cec9); border-radius: 15px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto;">
                            <i class="fas fa-check-circle" style="font-size: 28px; color: white;"></i>
                        </div>
                        <div class="value" id="completed-levels" style="font-size: 32px; font-weight: 800;">${userProfileData.completedLevels}</div>
                        <div class="label" style="font-size: 16px; color: var(--light); opacity: 0.9;">المستويات المكتملة</div>
                    </div>
                </div>
            </section>
            
            <section class="profile-form glass-effect" role="form" aria-labelledby="profile-form-title">
                <h3 id="profile-form-title" style="margin-bottom: 20px;">
                    <i class="fas fa-edit" aria-hidden="true"></i>
                    تعديل الملف الشخصي
                </h3>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="user-name" style="display: block; margin-bottom: 8px; font-weight: 600;">
                        <i class="fas fa-user-tag" aria-hidden="true"></i>
                        اسم المستخدم
                    </label>
                    <input type="text" 
                           id="user-name" 
                           value="${userProfileData.name}"
                           placeholder="أدخل اسمك"
                           aria-label="اسم المستخدم"
                           style="width: 100%; padding: 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); color: var(--light);">
                </div>
                <button class="btn ripple" id="save-profile" aria-label="حفظ التغييرات">
                    <i class="fas fa-save" aria-hidden="true"></i>
                    حفظ التغييرات
                </button>
            </section>
        </div>
    `;
    
    // إعادة إعداد مستمعي الأحداث
    setupProfileEventListeners();
}

// دالة مساعدة لعرض الرسائل
function showToast(message) {
    console.log('Toast:', message);
    // إذا كانت الدالة متاحة في النطاق العام، استخدمها
    if (typeof window.showToast === 'function') {
        window.showToast(message);
    } else {
        // إنشاء toast بسيط
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// تصدير الدوال الرئيسية
window.profileModule = {
    initProfileScreen,
    loadUserProfile,
    saveProfile,
    updateProfileStats,
    loadAchievements,
    checkAchievements,
    unlockAchievement,
    getAchievement,
    achievementsData,
    updateUserProfileData
};

// تهيئة تلقائية عند تحميل الملف
console.log('تم تحميل ملف profile.js بنجاح');

// بدء التهيئة عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM محمل، جاري تهيئة شاشة الملف الشخصي...');
        initProfileScreen();
    });
} else {
    console.log('DOM محمل بالفعل، جاري تهيئة شاشة الملف الشخصي...');
    setTimeout(initProfileScreen, 1000);
}

// إضافة أنماط CSS للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
