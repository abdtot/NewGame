// profile.js - نظام الملف الشخصي والإنجازات المتكامل والمحسن

// ============================================
// 1. هياكل البيانات المتقدمة
// ============================================

class AchievementSystem {
    constructor() {
        this.achievementsData = this.getAchievementsData();
        this.stats = {
            gameAttempts: 0,
            culturalCorrect: 0,
            hintsUsed: 0,
            dailyStreak: 0,
            perfectScores: 0,
            fastCompletions: 0
        };
        this.cache = new Map();
        this.eventListeners = new Map();
        this.init();
    }
    
    init() {
        this.loadStatsFromStorage();
        this.initEventSystem();
        this.initCache();
    }
    
    getAchievementsData() {
        return [
            {
                id: "first_level",
                title: "الخطوة الأولى",
                description: "أكمل أول مستوى في اللعبة",
                icon: "fas fa-play-circle",
                color: "#6c5ce7",
                category: "التقدم",
                requirement: { type: "levels_completed", value: 1 }
            },
            {
                id: "fast_learner",
                title: "متعلم سريع",
                description: "أكمل 5 مستويات",
                icon: "fas fa-bolt",
                color: "#00b894",
                category: "التقدم",
                requirement: { type: "levels_completed", value: 5 }
            },
            {
                id: "champion",
                title: "بطل مبتدئ",
                description: "أكمل 10 مستويات",
                icon: "fas fa-shield-alt",
                color: "#fd79a8",
                category: "التقدم",
                requirement: { type: "levels_completed", value: 10 }
            },
            {
                id: "perfect_score",
                title: "نتيجة مثالية",
                description: "احصل على 3 نقاط في مستوى واحد",
                icon: "fas fa-star",
                color: "#fdcb6e",
                category: "المهارة",
                requirement: { type: "perfect_score", value: 1 }
            },
            {
                id: "star_collector",
                title: "جامع النجوم",
                description: "اجمع 50 نقطة إجمالية",
                icon: "fas fa-star-shooting",
                color: "#a29bfe",
                category: "المجموع",
                requirement: { type: "total_points", value: 50 }
            },
            {
                id: "speed_runner",
                title: "عداء سريع",
                description: "أكمل مستوى في أقل من 30 ثانية",
                icon: "fas fa-running",
                color: "#74b9ff",
                category: "المهارة",
                requirement: { type: "fast_completion", value: 30 }
            },
            {
                id: "knowledge_seeker",
                title: "باحث عن المعرفة",
                description: "أجب على 5 ألغاز ثقافية بشكل صحيح",
                icon: "fas fa-brain",
                color: "#00cec9",
                category: "المعرفة",
                requirement: { type: "cultural_correct", value: 5 }
            },
            {
                id: "persistent",
                title: "مثابر",
                description: "لعِب لمدة 30 دقيقة متواصلة",
                icon: "fas fa-hourglass-half",
                color: "#e17055",
                category: "الالتزام",
                requirement: { type: "play_time", value: 30 }
            },
            {
                id: "daily_challenge",
                title: "تحدي يومي",
                description: "أكمل التحدي اليومي",
                icon: "fas fa-calendar-check",
                color: "#ff7675",
                category: "التحدي",
                requirement: { type: "daily_completed", value: 1 }
            },
            {
                id: "stage_master",
                title: "سيد المرحلة",
                description: "أكمل مرحلة كاملة",
                icon: "fas fa-crown",
                color: "#fdcb6e",
                category: "التقدم",
                requirement: { type: "stage_completed", value: 1 }
            },
            {
                id: "hint_master",
                title: "خبير التلميحات",
                description: "استخدم 10 تلميحات",
                icon: "fas fa-lightbulb",
                color: "#0984e3",
                category: "الإستراتيجية",
                requirement: { type: "hints_used", value: 10 }
            },
            {
                id: "streak_keeper",
                title: "حافظ على التسلسل",
                description: "لعب لمدة 7 أيام متتالية",
                icon: "fas fa-fire",
                color: "#e17055",
                category: "الالتزام",
                requirement: { type: "daily_streak", value: 7 }
            },
            {
                id: "master_strategist",
                title: "إستراتيجي محترف",
                description: "أكمل 20 مستوى دون استخدام تلميحات",
                icon: "fas fa-chess",
                color: "#a55eea",
                category: "الإستراتيجية",
                requirement: { type: "no_hints_completed", value: 20 }
            },
            {
                id: "perfectionist",
                title: "المثالي",
                description: "احصل على نتيجة مثالية في 5 مستويات متتالية",
                icon: "fas fa-gem",
                color: "#26de81",
                category: "المهارة",
                requirement: { type: "perfect_streak", value: 5 }
            }
        ];
    }
    
    async loadStatsFromStorage() {
        if (!db) return;
        
        try {
            const stats = await this.getDBData('stats');
            if (stats) {
                Object.assign(this.stats, stats);
            }
        } catch (error) {
            console.warn('Error loading stats:', error);
        }
    }
    
    initEventSystem() {
        this.on('achievementUnlocked', (achievement) => {
            this.showAchievementNotification(achievement);
            this.updateCache(`achievement_${achievement.id}`, achievement);
        });
        
        this.on('profileUpdated', () => {
            this.cache.delete('profile_stats');
            this.cache.delete('achievements_list');
        });
    }
    
    initCache() {
        // تنظيف الكاش كل 5 دقائق
        setInterval(() => this.cleanCache(), 5 * 60 * 1000);
    }
    
    // ============================================
    // 2. النظام الأساسي المحسن
    // ============================================
    
    async initProfileScreen() {
        console.log('🚀 تهيئة شاشة الملف الشخصي المتقدمة...');
        
        await Promise.all([
            this.loadProfileData(),
            this.initProfileEventListeners(),
            this.loadAchievements(),
            this.updateProfileStats(),
            this.initProfileStyles()
        ]);
        
        this.emit('profileInitialized', { timestamp: Date.now() });
    }
    
    async loadProfileData() {
        if (!db) {
            console.error('❌ قاعدة البيانات غير متاحة');
            return;
        }
        
        try {
            const cacheKey = 'profile_data';
            const cached = this.cache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < 30000) { // كاش لمدة 30 ثانية
                return this.updateProfileUI(cached.data);
            }
            
            const [userData, statsData] = await Promise.all([
                this.getDBData('user', 'profile'),
                this.getDBData('stats', 'totalPoints')
            ]);
            
            const profileData = {
                user: userData,
                stats: statsData
            };
            
            this.cache.set(cacheKey, {
                data: profileData,
                timestamp: Date.now()
            });
            
            this.updateProfileUI(profileData);
            
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showError('خطأ في تحميل البيانات');
        }
    }
    
    async getDBData(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not available'));
                return;
            }
            
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            
            let request;
            if (key) {
                request = store.get(key);
            } else {
                request = store.getAll();
            }
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    updateProfileUI(profileData) {
        const { user, stats } = profileData;
        
        if (user) {
            document.getElementById('profile-name').textContent = user.name || 'اللاعب';
            document.getElementById('user-name').value = user.name || '';
            document.getElementById('user-email').value = user.email || '';
            
            const level = this.calculateLevel(user.totalPoints || 0);
            document.getElementById('profile-level').textContent = level;
        }
        
        if (stats) {
            document.getElementById('total-points-profile').textContent = stats.value || 0;
        }
    }
    
    // ============================================
    // 3. نظام المستويات المتقدم
    // ============================================
    
    calculateLevel(points) {
        if (points < 10) return 1;
        if (points < 30) return 2;
        if (points < 60) return 3;
        if (points < 100) return 4;
        if (points < 150) return 5;
        if (points < 210) return 6;
        if (points < 280) return 7;
        if (points < 360) return 8;
        if (points < 450) return 9;
        if (points < 550) return 10;
        
        // مستوى عالي
        return Math.floor(10 + Math.pow((points - 550) / 100, 0.8));
    }
    
    getLevelProgress(points) {
        const level = this.calculateLevel(points);
        const pointsForCurrentLevel = this.getPointsForLevel(level);
        const pointsForNextLevel = this.getPointsForLevel(level + 1);
        
        if (level >= 50) return 100; // الحد الأقصى
        
        return Math.floor(((points - pointsForCurrentLevel) / 
                          (pointsForNextLevel - pointsForCurrentLevel)) * 100);
    }
    
    getPointsForLevel(level) {
        if (level <= 10) {
            return [0, 10, 30, 60, 100, 150, 210, 280, 360, 450, 550][level - 1] || 0;
        }
        
        return 550 + Math.pow((level - 10), 1.25) * 100;
    }
    
    // ============================================
    // 4. نظام الإنجازات المتقدم
    // ============================================
    
    async loadAchievements() {
        if (!db) return;
        
        const achievementsContainer = document.getElementById('achievements-container');
        if (!achievementsContainer) return;
        
        try {
            const storedAchievements = await this.getDBData('achievements');
            this.displayAchievements(storedAchievements || []);
            await this.checkAchievementsProgress();
            
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    }
    
    displayAchievements(storedAchievements) {
        const achievementsContainer = document.getElementById('achievements-container');
        achievementsContainer.innerHTML = '';
        
        // تجميع الإنجازات حسب الفئة
        const groupedAchievements = {};
        this.achievementsData.forEach(achievement => {
            const category = achievement.category || 'عام';
            if (!groupedAchievements[category]) {
                groupedAchievements[category] = [];
            }
            groupedAchievements[category].push(achievement);
        });
        
        // عرض الإنجابات حسب الفئة
        Object.entries(groupedAchievements).forEach(([category, achievements]) => {
            const categoryElement = this.createCategoryElement(category, achievements, storedAchievements);
            achievementsContainer.appendChild(categoryElement);
            
            achievements.forEach(achievement => {
                const stored = storedAchievements.find(a => a.id === achievement.id);
                const earned = stored?.earned || false;
                const earnedDate = stored?.earnedDate || null;
                
                const element = this.createAchievementElement(achievement, earned, earnedDate);
                achievementsContainer.appendChild(element);
            });
        });
    }
    
    createCategoryElement(category, achievements, storedAchievements) {
        // حساب عدد الإنجازات المكتسبة في هذه الفئة
        const earnedCount = achievements.filter(achievement => {
            const stored = storedAchievements.find(a => a.id === achievement.id);
            return stored?.earned || false;
        }).length;
        
        const div = document.createElement('div');
        div.className = 'achievement-category';
        div.innerHTML = `
            <div class="category-header">
                <i class="fas fa-folder"></i>
                <h3>${category}</h3>
                <span class="category-badge">${earnedCount}/${achievements.length}</span>
            </div>
        `;
        
        return div;
    }
    
    createAchievementElement(achievement, isEarned, earnedDate) {
        const element = document.createElement('div');
        element.className = `achievement-item ${isEarned ? 'earned' : 'locked'}`;
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        element.setAttribute('aria-label', `${achievement.title} - ${achievement.description}`);
        element.dataset.id = achievement.id;
        element.dataset.category = achievement.category;
        
        const progress = this.calculateAchievementProgress(achievement);
        
        element.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon" style="color: ${achievement.color}">
                    <i class="${achievement.icon}"></i>
                    ${isEarned ? '<div class="earned-badge"><i class="fas fa-check"></i></div>' : ''}
                </div>
                <div class="achievement-info">
                    <h4 class="achievement-title">${achievement.title}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                    ${!isEarned ? `
                    <div class="achievement-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${progress}%</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // إضافة الأحداث
        this.setupAchievementEvents(element, achievement, isEarned, earnedDate);
        
        return element;
    }
    
    setupAchievementEvents(element, achievement, isEarned, earnedDate) {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showAchievementDetails(achievement, isEarned, earnedDate);
            this.playSound('click');
            this.vibrate(30);
        });
        
        if (isEarned) {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }
    }
    
    // ============================================
    // 5. نظام التحقق من التقدم
    // ============================================
    
    async checkAchievementsProgress() {
        if (!db) return;
        
        try {
            const storedAchievements = await this.getDBData('achievements');
            const unlocked = [];
            
            for (const achievement of this.achievementsData) {
                const stored = storedAchievements?.find(a => a.id === achievement.id);
                
                if (!stored?.earned && this.checkAchievementCondition(achievement)) {
                    const unlockedAchievement = {
                        id: achievement.id,
                        title: achievement.title,
                        earned: true,
                        earnedDate: new Date().toISOString()
                    };
                    
                    unlocked.push(unlockedAchievement);
                    await this.saveAchievement(unlockedAchievement);
                }
            }
            
            if (unlocked.length > 0) {
                this.emit('achievementsUnlocked', unlocked);
                this.updateAchievementsDisplay();
            }
            
        } catch (error) {
            console.error('Error checking achievements:', error);
        }
    }
    
    checkAchievementCondition(achievement) {
        const requirement = achievement.requirement;
        
        // استخدام البيانات المخزنة مؤقتاً
        const currentStats = {
            levelsCompleted: parseInt(document.getElementById('completed-levels')?.textContent || 0),
            totalPoints: window.totalPoints || 0,
            playTime: this.getPlayTimeInMinutes(),
            hintsUsed: this.stats.hintsUsed || 0
        };
        
        switch (requirement.type) {
            case 'levels_completed':
                return currentStats.levelsCompleted >= requirement.value;
                
            case 'total_points':
                return currentStats.totalPoints >= requirement.value;
                
            case 'perfect_score':
                return (this.stats.perfectScores || 0) >= requirement.value;
                
            case 'fast_completion':
                return (this.stats.fastCompletions || 0) >= requirement.value;
                
            case 'cultural_correct':
                return (this.stats.culturalCorrect || 0) >= requirement.value;
                
            case 'play_time':
                return currentStats.playTime >= requirement.value;
                
            case 'hints_used':
                return currentStats.hintsUsed >= requirement.value;
                
            case 'daily_streak':
                return (this.stats.dailyStreak || 0) >= requirement.value;
                
            default:
                return false;
        }
    }
    
    calculateAchievementProgress(achievement) {
        const requirement = achievement.requirement;
        let currentValue = 0;
        let requiredValue = requirement.value;
        
        switch (requirement.type) {
            case 'levels_completed':
                currentValue = parseInt(document.getElementById('completed-levels')?.textContent || 0);
                break;
                
            case 'total_points':
                currentValue = window.totalPoints || 0;
                break;
                
            case 'perfect_score':
                currentValue = this.stats.perfectScores || 0;
                break;
                
            case 'cultural_correct':
                currentValue = this.stats.culturalCorrect || 0;
                break;
                
            case 'play_time':
                currentValue = this.getPlayTimeInMinutes();
                break;
                
            case 'hints_used':
                currentValue = this.stats.hintsUsed || 0;
                break;
                
            case 'daily_streak':
                currentValue = this.stats.dailyStreak || 0;
                break;
                
            case 'no_hints_completed':
                currentValue = this.stats.noHintsCompleted || 0;
                break;
                
            case 'perfect_streak':
                currentValue = this.stats.perfectStreak || 0;
                break;
        }
        
        return Math.min(100, Math.floor((currentValue / requiredValue) * 100));
    }
    
    // ============================================
    // 6. واجهة المستخدم المتقدمة
    // ============================================
    
    showAchievementDetails(achievement, isEarned, earnedDate) {
        const modal = new AchievementModal(achievement, isEarned, earnedDate);
        modal.show();
    }
    
    showAchievementNotification(achievement) {
        const notification = new AchievementNotification(achievement);
        notification.show();
        
        // إضافة التأثيرات البصرية
        this.createConfettiEffect();
        this.playSound('achievement');
    }
    
    async updateProfileStats() {
        if (!db) return;
        
        try {
            const [levelsData, statsData, userData] = await Promise.all([
                this.getDBData('levels'),
                this.getDBData('stats'),
                this.getDBData('user', 'profile')
            ]);
            
            const completedLevels = levelsData?.filter(level => level.completed)?.length || 0;
            const totalPoints = statsData?.find(s => s.id === 'totalPoints')?.value || 0;
            const playTime = userData?.playTime || 0;
            
            // تحديث الواجهة
            this.updateStatsUI({
                completedLevels,
                totalPoints,
                playTime,
                successRate: this.calculateSuccessRate(completedLevels),
                level: this.calculateLevel(totalPoints),
                levelProgress: this.getLevelProgress(totalPoints)
            });
            
            this.cache.set('profile_stats', {
                data: { completedLevels, totalPoints, playTime },
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error('Error updating profile stats:', error);
        }
    }
    
    updateStatsUI(stats) {
        const completedElement = document.getElementById('completed-levels');
        const pointsElement = document.getElementById('total-points-profile');
        const playTimeElement = document.getElementById('play-time');
        const successRateElement = document.getElementById('success-rate');
        const levelElement = document.getElementById('profile-level');
        
        if (completedElement) completedElement.textContent = stats.completedLevels;
        if (pointsElement) pointsElement.textContent = stats.totalPoints;
        if (playTimeElement) playTimeElement.textContent = this.formatPlayTime(stats.playTime);
        if (successRateElement) successRateElement.textContent = `${stats.successRate}%`;
        if (levelElement) levelElement.textContent = stats.level;
        
        // تحديث شريط تقدم المستوى
        this.updateLevelProgressBar(stats.levelProgress);
    }
    
    updateLevelProgressBar(progress) {
        let progressBar = document.getElementById('level-progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'level-progress-bar';
            progressBar.className = 'level-progress';
            const levelContainer = document.querySelector('.profile-level');
            if (levelContainer) {
                levelContainer.appendChild(progressBar);
            }
        }
        
        progressBar.innerHTML = `
            <div class="progress-track">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="progress-text">${progress}%</span>
        `;
    }
    
    // ============================================
    // 7. دوال المساعدة
    // ============================================
    
    formatPlayTime(minutes) {
        if (minutes < 60) return `${minutes} دقيقة`;
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours < 24) return `${hours} ساعة ${remainingMinutes} دقيقة`;
        
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        
        return `${days} يوم ${remainingHours} ساعة`;
    }
    
    getPlayTimeInMinutes() {
        const timeText = document.getElementById('play-time')?.textContent || '';
        if (!timeText) return 0;
        
        let minutes = 0;
        
        if (timeText.includes('يوم')) {
            const parts = timeText.split('يوم');
            const days = parseInt(parts[0]) || 0;
            const hoursPart = parts[1]?.split('ساعة')?.[0] || '0';
            const hours = parseInt(hoursPart) || 0;
            const minsPart = parts[1]?.split('دقيقة')?.[0]?.split('ساعة')?.[1] || '0';
            const mins = parseInt(minsPart) || 0;
            minutes = (days * 24 * 60) + (hours * 60) + mins;
        } else if (timeText.includes('ساعة')) {
            const parts = timeText.split('ساعة');
            const hours = parseInt(parts[0]) || 0;
            const mins = parseInt(parts[1]) || 0;
            minutes = (hours * 60) + mins;
        } else {
            minutes = parseInt(timeText) || 0;
        }
        
        return minutes;
    }
    
    calculateSuccessRate(completedLevels) {
        const attempts = completedLevels + (this.stats.gameAttempts || 0);
        if (attempts === 0) return 0;
        
        return Math.min(100, Math.floor((completedLevels / attempts) * 100));
    }
    
    playSound(soundName) {
        if (window.audioSystem && typeof audioSystem.play === 'function') {
            audioSystem.play(soundName);
        }
    }
    
    vibrate(duration) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
    
    showError(message) {
        console.error('❌', message);
        this.showToast(message, 'error');
    }
    
    showToast(message, type = 'info') {
        // تنفيذ مبسط لإشعارات Toast
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // ============================================
    // 8. نظام الأحداث
    // ============================================
    
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    emit(event, data) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }
    
    // ============================================
    // 9. نظام الكاش
    // ============================================
    
    setCache(key, value, ttl = 60000) {
        this.cache.set(key, {
            data: value,
            timestamp: Date.now(),
            ttl: ttl
        });
    }
    
    getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }
    
    cleanCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > value.ttl) {
                this.cache.delete(key);
            }
        }
    }
    
    // ============================================
    // 10. فئات المساعدة
    // ============================================
    
    async saveAchievement(achievement) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not available'));
                return;
            }
            
            const transaction = db.transaction(['achievements'], 'readwrite');
            const store = transaction.objectStore('achievements');
            
            const request = store.put({
                id: achievement.id,
                earned: achievement.earned,
                earnedDate: achievement.earnedDate,
                title: achievement.title
            });
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    createConfettiEffect() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
    
    initProfileEventListeners() {
        // سوف يتم التعامل معها في ProfileManager
    }
    
    initProfileStyles() {
        // سيتم استدعاؤها منفصلة
    }
    
    updateAchievementsDisplay() {
        this.loadAchievements();
    }
    
    async unlockAchievement(id) {
        const achievement = this.achievementsData.find(a => a.id === id);
        if (!achievement) return false;
        
        try {
            await this.saveAchievement({
                id: achievement.id,
                title: achievement.title,
                earned: true,
                earnedDate: new Date().toISOString()
            });
            
            this.showAchievementNotification(achievement);
            return true;
        } catch (error) {
            console.error('Error unlocking achievement:', error);
            return false;
        }
    }
}

// ============================================
// 11. الفئات المساعدة
// ============================================

class AchievementModal {
    constructor(achievement, isEarned, earnedDate) {
        this.achievement = achievement;
        this.isEarned = isEarned;
        this.earnedDate = earnedDate;
        this.modalId = `achievement-modal-${Date.now()}`;
    }
    
    show() {
        this.createModal();
        this.setupEvents();
        this.animateIn();
    }
    
    createModal() {
        const modalHTML = `
            <div class="achievement-modal-overlay" id="${this.modalId}">
                <div class="achievement-modal glass-effect">
                    <div class="modal-header">
                        <div class="modal-icon" style="color: ${this.achievement.color}">
                            <i class="${this.achievement.icon}"></i>
                        </div>
                        <button class="modal-close" aria-label="إغلاق">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <h3>${this.achievement.title}</h3>
                        <p class="modal-description">${this.achievement.description}</p>
                        
                        <div class="modal-details">
                            <div class="detail-item">
                                <span class="detail-label">الحالة:</span>
                                <span class="detail-value ${this.isEarned ? 'earned' : 'locked'}">
                                    ${this.isEarned ? 'مكتسب ✓' : 'غير مكتسب'}
                                </span>
                            </div>
                            
                            ${this.isEarned && this.earnedDate ? `
                            <div class="detail-item">
                                <span class="detail-label">تاريخ الاكتساب:</span>
                                <span class="detail-value">${this.formatDate(this.earnedDate)}</span>
                            </div>
                            ` : `
                            <div class="detail-item">
                                <span class="detail-label">المتطلب:</span>
                                <span class="detail-value requirement">${this.getRequirementText()}</span>
                            </div>
                            `}
                            
                            <div class="detail-item">
                                <span class="detail-label">الفئة:</span>
                                <span class="detail-value category">${this.achievement.category}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        ${this.isEarned ? `
                        <button class="btn btn-secondary btn-share">
                            <i class="fas fa-share-alt"></i> مشاركة
                        </button>
                        ` : ''}
                        <button class="btn btn-primary btn-close">
                            <i class="fas fa-check"></i> فهمت
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    setupEvents() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.modal-close');
        const shareBtn = modal.querySelector('.btn-share');
        const primaryBtn = modal.querySelector('.btn-primary');
        
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
        if (primaryBtn) primaryBtn.addEventListener('click', () => this.close());
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.share());
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
        
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', this.escapeHandler);
    }
    
    animateIn() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;
        
        const modalContent = modal.querySelector('.achievement-modal');
        gsap.from(modalContent, {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            ease: "back.out(1.7)"
        });
    }
    
    close() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;
        
        const modalContent = modal.querySelector('.achievement-modal');
        gsap.to(modalContent, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                if (this.escapeHandler) {
                    document.removeEventListener('keydown', this.escapeHandler);
                }
                if (modal.parentNode) {
                    modal.remove();
                }
            }
        });
    }
    
    share() {
        if (navigator.share) {
            navigator.share({
                title: `لقد حصلت على إنجاز ${this.achievement.title}!`,
                text: this.achievement.description,
                url: window.location.href
            }).then(() => {
                this.showToast('تمت المشاركة بنجاح!');
            }).catch(error => {
                console.log('Error sharing:', error);
                this.copyToClipboard();
            });
        } else {
            this.copyToClipboard();
        }
    }
    
    copyToClipboard() {
        const text = `🎉 لقد حصلت على إنجاز "${this.achievement.title}" في لعبة أبطال البطاقات! ${this.achievement.description}`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('تم نسخ الإنجاز إلى الحافظة!');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }
    
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('تم نسخ الإنجاز إلى الحافظة!');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showToast('تعذر نسخ الإنجاز');
        }
        
        document.body.removeChild(textArea);
    }
    
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffMins < 1) return 'الآن';
            if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
            if (diffHours < 24) return `منذ ${diffHours} ساعة`;
            if (diffDays < 7) return `منذ ${diffDays} يوم`;
            
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
            };
            return date.toLocaleDateString('ar-SA', options);
        } catch (e) {
            return 'تاريخ غير معروف';
        }
    }
    
    getRequirementText() {
        const req = this.achievement.requirement;
        const texts = {
            'levels_completed': `أكمل ${req.value} مستوى`,
            'total_points': `اجمع ${req.value} نقطة`,
            'perfect_score': `احصل على نتيجة مثالية (3/3)`,
            'fast_completion': `أكمل مستوى في أقل من ${req.value} ثانية`,
            'cultural_correct': `أجب على ${req.value} ألغاز ثقافية`,
            'play_time': `لعب لمدة ${req.value} دقيقة`,
            'daily_completed': 'أكمل التحدي اليومي',
            'stage_completed': 'أكمل مرحلة كاملة',
            'hints_used': `استخدم ${req.value} تلميح`,
            'daily_streak': `لعب لمدة ${req.value} أيام متتالية`,
            'no_hints_completed': `أكمل ${req.value} مستوى دون تلميحات`,
            'perfect_streak': `نتيجة مثالية في ${req.value} مستويات متتالية`
        };
        
        return texts[req.type] || 'متطلب غير معروف';
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }
}

class AchievementNotification {
    constructor(achievement) {
        this.achievement = achievement;
        this.notificationId = `achievement-notification-${Date.now()}`;
    }
    
    show() {
        this.createNotification();
        this.animateIn();
        this.setupAutoClose();
    }
    
    createNotification() {
        const notificationHTML = `
            <div class="achievement-notification" id="${this.notificationId}">
                <div class="notification-icon" style="color: ${this.achievement.color}">
                    <i class="${this.achievement.icon}"></i>
                </div>
                <div class="notification-content">
                    <h4>🎉 إنجاز جديد! 🎉</h4>
                    <h3>${this.achievement.title}</h3>
                    <p>${this.achievement.description}</p>
                    <div class="notification-tag">
                        <i class="fas fa-trophy"></i> مكتسب الآن!
                    </div>
                </div>
                <button class="notification-close" aria-label="إغلاق">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', notificationHTML);
        
        // إضافة حدث الإغلاق
        const closeBtn = document.querySelector(`#${this.notificationId} .notification-close`);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }
    
    animateIn() {
        const notification = document.getElementById(this.notificationId);
        if (!notification) return;
        
        gsap.from(notification, {
            y: -100,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    }
    
    setupAutoClose() {
        this.autoCloseTimeout = setTimeout(() => this.close(), 5000);
    }
    
    close() {
        if (this.autoCloseTimeout) {
            clearTimeout(this.autoCloseTimeout);
        }
        
        const notification = document.getElementById(this.notificationId);
        if (!notification) return;
        
        gsap.to(notification, {
            y: -100,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }
        });
    }
}

// ============================================
// 12. نظام ملف المستخدم الشخصي
// ============================================

class ProfileManager {
    constructor(achievementSystem) {
        this.system = achievementSystem;
        this.currentUser = null;
        this.avatars = [
            'fas fa-user',
            'fas fa-user-astronaut',
            'fas fa-user-ninja',
            'fas fa-user-graduate',
            'fas fa-user-tie',
            'fas fa-user-md',
            'fas fa-user-circle',
            'fas fa-user-secret'
        ];
        this.init();
    }
    
    init() {
        this.loadUserProfile();
        this.setupProfileEventListeners();
    }
    
    async loadUserProfile() {
        try {
            const userData = await this.system.getDBData('user', 'profile');
            this.currentUser = userData || this.createDefaultProfile();
            this.updateProfileUI();
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.currentUser = this.createDefaultProfile();
            this.updateProfileUI();
        }
    }
    
    createDefaultProfile() {
        return {
            id: 'profile',
            name: 'اللاعب',
            email: '',
            avatar: 'fas fa-user',
            joinDate: new Date().toISOString(),
            totalPoints: 0,
            playTime: 0,
            preferences: {
                sound: true,
                music: true,
                notifications: true,
                language: 'ar'
            }
        };
    }
    
    updateProfileUI() {
        if (!this.currentUser) return;
        
        // تحديث الاسم
        const profileName = document.getElementById('profile-name');
        const userNameInput = document.getElementById('user-name');
        const userEmailInput = document.getElementById('user-email');
        
        if (profileName) profileName.textContent = this.currentUser.name;
        if (userNameInput) userNameInput.value = this.currentUser.name;
        if (userEmailInput) userEmailInput.value = this.currentUser.email || '';
        
        // تحديث الأفاتار
        this.updateAvatarUI();
        
        // تحديث تاريخ الانضمام
        this.updateJoinDateUI();
        
        // تحديث التفضيلات
        this.updatePreferencesUI();
    }
    
    updateAvatarUI() {
        const avatarElement = document.querySelector('.profile-avatar i');
        if (avatarElement) {
            avatarElement.className = this.currentUser.avatar;
        }
    }
    
    updateJoinDateUI() {
        const joinDateElement = document.getElementById('join-date');
        if (joinDateElement) {
            joinDateElement.textContent = this.formatDate(this.currentUser.joinDate);
        }
    }
    
    updatePreferencesUI() {
        const preferences = this.currentUser.preferences || {};
        
        // يمكنك إضافة عناصر التفضيلات هنا
        if (document.getElementById('sound-toggle')) {
            document.getElementById('sound-toggle').checked = preferences.sound !== false;
        }
        
        if (document.getElementById('music-toggle')) {
            document.getElementById('music-toggle').checked = preferences.music !== false;
        }
    }
    
    // ============================================
    // حفظ التغييرات في الملف الشخصي
    // ============================================
    
    async saveProfileChanges() {
        const nameInput = document.getElementById('user-name');
        const emailInput = document.getElementById('user-email');
        
        if (!nameInput || !emailInput) {
            console.error('عناصر إدخال البيانات غير موجودة');
            return false;
        }
        
        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();
        
        // التحقق من صحة الاسم
        if (!newName) {
            this.system.showToast('الرجاء إدخال اسم المستخدم', 'error');
            this.system.vibrate(100);
            this.system.playSound('error');
            return false;
        }
        
        // التحقق من صحة الإيميل (اختياري)
        if (newEmail && !this.validateEmail(newEmail)) {
            this.system.showToast('البريد الإلكتروني غير صالح', 'error');
            this.system.playSound('error');
            return false;
        }
        
        try {
            // تحديث بيانات المستخدم
            this.currentUser.name = newName;
            this.currentUser.email = newEmail;
            this.currentUser.updatedAt = new Date().toISOString();
            
            // حفظ في قاعدة البيانات
            await this.saveUserToDB();
            
            // تحديث الواجهة
            this.updateProfileUI();
            
            // التأثيرات
            this.system.playSound('success');
            this.system.vibrate(50);
            this.system.showToast('تم حفظ التغييرات بنجاح!', 'success');
            
            // تأثير بصري على زر الحفظ
            this.animateSaveButton();
            
            // إرسال حدث تحديث الملف الشخصي
            this.system.emit('profileUpdated', this.currentUser);
            
            return true;
            
        } catch (error) {
            console.error('Error saving profile:', error);
            this.system.showToast('حدث خطأ أثناء الحفظ', 'error');
            this.system.playSound('error');
            return false;
        }
    }
    
    async saveUserToDB() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not available'));
                return;
            }
            
            const transaction = db.transaction(['user'], 'readwrite');
            const store = transaction.objectStore('user');
            
            const request = store.put(this.currentUser);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    // ============================================
    // تغيير صورة الملف الشخصي
    // ============================================
    
    changeAvatar() {
        if (!this.currentUser) return;
        
        this.system.playSound('click');
        this.system.vibrate(30);
        
        // العثور على الفهرس الحالي
        const currentIndex = this.avatars.indexOf(this.currentUser.avatar);
        let nextIndex = currentIndex + 1;
        
        // الدوران للخلف إذا وصل للنهاية
        if (nextIndex >= this.avatars.length) nextIndex = 0;
        
        // تحديث الأفاتار
        this.currentUser.avatar = this.avatars[nextIndex];
        
        // تحديث الواجهة
        this.updateAvatarUI();
        
        // تأثير الرسوم المتحركة
        this.animateAvatarChange();
        
        // حفظ التغيير في قاعدة البيانات
        this.saveAvatarPreference();
    }
    
    animateAvatarChange() {
        const avatarIcon = document.querySelector('.profile-avatar i');
        if (!avatarIcon) return;
        
        gsap.to(avatarIcon, {
            rotationY: 360,
            scale: 1.3,
            duration: 0.6,
            ease: "back.out(1.7)",
            onComplete: () => {
                gsap.to(avatarIcon, {
                    scale: 1,
                    duration: 0.2
                });
            }
        });
    }
    
    async saveAvatarPreference() {
        try {
            await this.saveUserToDB();
            
            // أيضا حفظ في الإعدادات للاستخدام السريع
            if (db) {
                const transaction = db.transaction(['settings'], 'readwrite');
                const store = transaction.objectStore('settings');
                await store.put({ 
                    id: 'avatar_icon', 
                    value: this.currentUser.avatar 
                });
            }
        } catch (error) {
            console.warn('Error saving avatar preference:', error);
        }
    }
    
    // ============================================
    // إعداد مستمعي الأحداث
    // ============================================
    
    setupProfileEventListeners() {
        // زر حفظ التغييرات
        const saveProfileBtn = document.getElementById('save-profile');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfileChanges());
        }
        
        // صورة الملف الشخصي (لتغيير الأفاتار)
        const avatarElement = document.querySelector('.profile-avatar');
        if (avatarElement) {
            avatarElement.addEventListener('click', () => this.changeAvatar());
        }
        
        // تحديث تلقائي عند إدخال الاسم
        const nameInput = document.getElementById('user-name');
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                // عرض معاينة الاسم مباشرة
                const previewName = document.getElementById('profile-name');
                if (previewName && nameInput.value.trim()) {
                    previewName.textContent = nameInput.value;
                }
            });
        }
        
        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's' && document.getElementById('user-name') === document.activeElement) {
                e.preventDefault();
                this.saveProfileChanges();
            }
        });
    }
    
    // ============================================
    // دوال مساعدة
    // ============================================
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return 'اليوم';
            if (diffDays === 1) return 'أمس';
            if (diffDays < 7) return `منذ ${diffDays} أيام`;
            if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
            
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('ar-SA', options);
        } catch (e) {
            return 'تاريخ غير معروف';
        }
    }
    
    animateSaveButton() {
        const saveBtn = document.getElementById('save-profile');
        if (!saveBtn) return;
        
        // تأثير الرجوع
        gsap.to(saveBtn, {
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
        
        // تغيير اللون مؤقتاً
        saveBtn.style.background = 'linear-gradient(135deg, #00b894, #00a085)';
        setTimeout(() => {
            saveBtn.style.background = '';
        }, 1000);
    }
    
    // ============================================
    // دوال عامة للاستخدام
    // ============================================
    
    getUserName() {
        return this.currentUser?.name || 'اللاعب';
    }
    
    getUserAvatar() {
        return this.currentUser?.avatar || 'fas fa-user';
    }
    
    updatePlayTime(minutes) {
        if (!this.currentUser) return;
        
        this.currentUser.playTime = (this.currentUser.playTime || 0) + minutes;
        this.saveUserToDB().catch(console.error);
    }
    
    updatePreferences(key, value) {
        if (!this.currentUser) return;
        
        if (!this.currentUser.preferences) {
            this.currentUser.preferences = {};
        }
        
        this.currentUser.preferences[key] = value;
        this.saveUserToDB().catch(console.error);
    }
}

// ============================================
// 13. التكامل الكامل للنظام
// ============================================

class CompleteProfileSystem {
    constructor() {
        this.achievementSystem = new AchievementSystem();
        this.profileManager = null;
        this.initialized = false;
    }
    
    async init() {
        if (this.initialized) return;
        
        console.log('🚀 تهيئة نظام الملف الشخصي المتكامل...');
        
        // تهيئة الأنماط
        initProfileStyles();
        
        // تهيئة نظام الإنجازات
        await this.achievementSystem.initProfileScreen();
        
        // تهيئة مدير الملف الشخصي
        this.profileManager = new ProfileManager(this.achievementSystem);
        
        // إعداد الأحداث المشتركة
        this.setupGlobalEventListeners();
        
        this.initialized = true;
        
        this.achievementSystem.emit('systemReady', {
            achievements: this.achievementSystem,
            profile: this.profileManager
        });
        
        console.log('✅ نظام الملف الشخصي جاهز للاستخدام');
        return this;
    }
    
    setupGlobalEventListeners() {
        // تحديث الإحصائيات عند ظهور شاشة الملف الشخصي
        document.addEventListener('visibilitychange', () => {
            const profileScreen = document.getElementById('profile-screen');
            if (!document.hidden && profileScreen?.classList.contains('active')) {
                this.achievementSystem.updateProfileStats();
                this.profileManager.loadUserProfile();
            }
        });
        
        // استماع لأحداث النظام
        this.achievementSystem.on('profileUpdated', (userData) => {
            console.log('📝 تم تحديث الملف الشخصي:', userData.name);
        });
    }
    
    // ============================================
    // واجهات برمجة التطبيقات العامة
    // ============================================
    
    // 1. إدارة المستخدم
    getUserProfile() {
        return this.profileManager?.currentUser;
    }
    
    updateUserName(name) {
        if (!this.profileManager) return false;
        
        const nameInput = document.getElementById('user-name');
        if (nameInput) {
            nameInput.value = name;
        }
        return this.profileManager.saveProfileChanges();
    }
    
    changeUserAvatar() {
        this.profileManager?.changeAvatar();
    }
    
    // 2. الإنجازات
    unlockAchievement(id) {
        return this.achievementSystem.unlockAchievement(id);
    }
    
    getAchievements() {
        return this.achievementSystem.achievementsData;
    }
    
    // 3. الإحصائيات
    getProfileStats() {
        return this.achievementSystem.getCache('profile_stats')?.data;
    }
    
    updateStats() {
        return this.achievementSystem.updateProfileStats();
    }
    
    // 4. المساعدة
    showAchievementDetails(id) {
        const achievement = this.achievementSystem.achievementsData.find(a => a.id === id);
        if (achievement) {
            this.achievementSystem.showAchievementDetails(achievement, false, null);
        }
    }
}

// ============================================
// 14. تهيئة الأنماط
// ============================================

function initProfileStyles() {
    const styleId = 'profile-styles';
    if (document.getElementById(styleId)) return;
    
    const styles = `
        /* أنماط النظام المحسن */
        .achievement-category {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
        }
        
        .category-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .category-header h3 {
            margin: 0;
            font-size: 18px;
            color: var(--secondary);
        }
        
        .category-badge {
            background: var(--accent);
            color: white;
            padding: 2px 10px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .achievement-item {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 15px;
            margin: 10px 0;
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid transparent;
        }
        
        .achievement-item.earned {
            background: rgba(108, 92, 231, 0.15);
            border-left: 4px solid var(--accent);
        }
        
        .achievement-item.locked {
            opacity: 0.7;
            filter: grayscale(0.5);
        }
        
        .achievement-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.1);
        }
        
        .achievement-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .achievement-icon {
            position: relative;
            font-size: 24px;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
        }
        
        .earned-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--accent);
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        
        .achievement-info {
            flex: 1;
        }
        
        .achievement-title {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: white;
        }
        
        .achievement-description {
            margin: 0;
            font-size: 14px;
            opacity: 0.8;
            line-height: 1.4;
        }
        
        .achievement-progress {
            margin-top: 10px;
        }
        
        .progress-bar {
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 5px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent), var(--primary));
            border-radius: 3px;
            transition: width 0.5s ease;
        }
        
        .progress-text {
            font-size: 12px;
            display: block;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
        }
        
        /* الأنماط الحديثة للنوافذ المنبثقة */
        .achievement-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .achievement-modal-overlay.active {
            opacity: 1;
        }
        
        .achievement-modal {
            width: 90%;
            max-width: 500px;
            background: linear-gradient(135deg, rgba(30, 30, 46, 0.95), rgba(20, 20, 36, 0.95));
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .achievement-modal-overlay.active .achievement-modal {
            transform: scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .modal-icon {
            font-size: 48px;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }
        
        .modal-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }
        
        .modal-body h3 {
            margin: 0 0 10px 0;
            color: var(--secondary);
            font-size: 24px;
        }
        
        .modal-description {
            margin: 0 0 20px 0;
            opacity: 0.8;
            line-height: 1.5;
        }
        
        .modal-details {
            margin: 20px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 15px;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .detail-item:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            opacity: 0.7;
            font-size: 14px;
        }
        
        .detail-value {
            font-weight: 500;
        }
        
        .detail-value.earned {
            color: #00b894;
            font-weight: bold;
        }
        
        .detail-value.locked {
            color: #fd79a8;
        }
        
        .modal-footer {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        /* إشعارات الإنجازات */
        .achievement-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            background: linear-gradient(135deg, rgba(30, 30, 46, 0.95), rgba(20, 20, 36, 0.95));
            border-radius: 15px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border-left: 4px solid var(--accent);
            transform: translateY(-100px);
            transition: transform 0.5s ease;
        }
        
        .achievement-notification.show {
            transform: translateY(0);
        }
        
        .notification-icon {
            font-size: 40px;
            min-width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-content h4 {
            color: var(--accent);
            margin: 0 0 5px 0;
            font-size: 16px;
        }
        
        .notification-content h3 {
            margin: 0 0 5px 0;
            color: white;
            font-size: 18px;
        }
        
        .notification-content p {
            margin: 0 0 10px 0;
            opacity: 0.8;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .notification-tag {
            background: rgba(253, 203, 110, 0.2);
            color: #fdcb6e;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            font-size: 18px;
            margin-left: auto;
            align-self: flex-start;
        }
        
        /* شريط تقدم المستوى */
        .level-progress {
            margin-top: 10px;
        }
        
        .progress-track {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 5px;
        }
        
        .progress-text {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            display: block;
        }
        
        /* تأثيرات الرسوم المتحركة */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .achievement-item.earned {
            animation: pulse 2s infinite;
        }
        
        /* إشعارات Toast */
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            left: 20px;
            max-width: 400px;
            margin: 0 auto;
            background: linear-gradient(135deg, rgba(30, 30, 46, 0.95), rgba(20, 20, 36, 0.95));
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 10002;
            text-align: center;
            border-left: 4px solid var(--accent);
        }
        
        .toast-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-notification.error {
            border-left-color: #ff7675;
        }
        
        .toast-notification.success {
            border-left-color: #00b894;
        }
        
        /* تحسينات للشاشات الصغيرة */
        @media (max-width: 768px) {
            .achievement-content {
                flex-direction: column;
                text-align: center;
            }
            
            .achievement-icon {
                margin-bottom: 10px;
            }
            
            .achievement-modal {
                width: 95%;
                padding: 20px;
            }
            
            .modal-footer {
                flex-direction: column;
            }
            
            .achievement-notification {
                left: 20px;
                right: 20px;
                max-width: none;
                flex-direction: column;
                text-align: center;
            }
            
            .notification-close {
                align-self: flex-end;
                margin-top: -10px;
            }
        }
        
        /* تأثيرات التحول */
        .profile-avatar {
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .profile-avatar:hover {
            transform: scale(1.1);
        }
        
        /* أزرار خاصة بالملف الشخصي */
        #save-profile {
            transition: all 0.3s ease;
        }
        
        #save-profile:active {
            transform: scale(0.95);
        }
        
        /* نماذج الإدخال */
        #user-name, #user-email {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 12px 15px;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
            width: 100%;
            margin-bottom: 15px;
        }
        
        #user-name:focus, #user-email:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
        }
    `;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = styles;
    document.head.appendChild(style);
}

// ============================================
// 15. التصدير والاستخدام النهائي
// ============================================

// إنشاء النسخة الفريدة من النظام
let profileSystem;

function getProfileSystem() {
    if (!profileSystem) {
        profileSystem = new CompleteProfileSystem();
    }
    return profileSystem;
}

// تصدير الدوال الرئيسية للاستخدام العالمي
window.ProfileSystem = {
    // التهيئة
    init: async () => {
        const system = getProfileSystem();
        await system.init();
        return system;
    },
    
    // إدارة المستخدم
    getUserName: () => profileSystem?.profileManager?.getUserName() || 'اللاعب',
    updateUserName: (name) => profileSystem?.updateUserName(name) || false,
    changeAvatar: () => profileSystem?.changeUserAvatar(),
    saveProfile: () => profileSystem?.profileManager?.saveProfileChanges() || false,
    getUserProfile: () => profileSystem?.getUserProfile(),
    
    // الإنجازات
    unlockAchievement: (id) => profileSystem?.unlockAchievement(id) || false,
    getAchievements: () => profileSystem?.getAchievements() || [],
    
    // الإحصائيات
    getStats: () => profileSystem?.getProfileStats() || {},
    updateStats: () => profileSystem?.updateStats(),
    
    // المساعدة
    showAchievement: (id) => profileSystem?.showAchievementDetails(id)
};

// التهيئة التلقائية
if (typeof window !== 'undefined') {
    // الانتظار حتى تكون قاعدة البيانات جاهزة
    let dbCheckCount = 0;
    const maxDbChecks = 50; // 5 ثواني كحد أقصى
    
    const dbCheckInterval = setInterval(() => {
        dbCheckCount++;
        
        if (typeof db !== 'undefined' && db) {
            clearInterval(dbCheckInterval);
            ProfileSystem.init().catch(console.error);
        } else if (dbCheckCount >= maxDbChecks) {
            clearInterval(dbCheckInterval);
            console.warn('تم تجاوز الوقت المحدد لانتظار قاعدة البيانات');
        }
    }, 100);
}

// دوال للاستخدام المباشر
window.updateProfileAfterLevelComplete = () => {
    if (profileSystem) {
        profileSystem.updateStats();
        setTimeout(() => {
            if (profileSystem.achievementSystem) {
                profileSystem.achievementSystem.checkAchievementsProgress();
            }
        }, 500);
    }
};

window.saveProfileChanges = () => {
    return profileSystem?.profileManager?.saveProfileChanges() || false;
};

window.changeAvatar = () => {
    profileSystem?.changeUserAvatar();
};

window.closeAchievementDetails = () => {
    document.querySelectorAll('.achievement-modal-overlay').forEach(modal => {
        if (modal.parentNode) {
            modal.remove();
        }
    });
};

window.showAchievementDetails = (id) => {
    ProfileSystem.showAchievement(id);
};

window.shareAchievement = (achievementTitle) => {
    const text = `🎉 لقد حصلت على إنجاز "${achievementTitle}" في لعبة أبطال البطاقات!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'إنجاز في أبطال البطاقات',
            text: text,
            url: window.location.href
        }).catch(console.error);
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            if (window.audioSystem && typeof window.audioSystem.play === 'function') {
                window.audioSystem.play('success');
            }
            
            // عرض Toast
            const toast = document.createElement('div');
            toast.className = 'toast-notification success';
            toast.textContent = 'تم نسخ الإنجاز إلى الحافظة!';
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, 3000);
        }).catch(console.error);
    }
};

// جعل النظام متاحاً عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المتغيرات الإحصائية إذا لم تكن موجودة
    if (typeof window.gameAttempts === 'undefined') window.gameAttempts = 0;
    if (typeof window.culturalCorrect === 'undefined') window.culturalCorrect = 0;
    if (typeof window.hintsUsed === 'undefined') window.hintsUsed = 0;
    if (typeof window.totalPoints === 'undefined') window.totalPoints = 0;
    
    console.log('📁 نظام الملف الشخصي جاهز للتحميل');
});
