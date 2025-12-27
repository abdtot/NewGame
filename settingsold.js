// settings.js - إدارة شاشة الإعدادات

// متغيرات الإعدادات
let soundEnabled = true;
let vibrationEnabled = true;
let notificationsEnabled = true;
let deferredPrompt = null;

// تهيئة إعدادات المستخدم
function loadUserSettings() {
    if (!db) return;
    
    const transaction = db.transaction(['settings'], 'readonly');
    const settingsStore = transaction.objectStore('settings');
    
    const vibrationRequest = settingsStore.get('vibration');
    vibrationRequest.onsuccess = (event) => {
        if (vibrationRequest.result) {
            vibrationEnabled = vibrationRequest.result.value;
            const toggle = document.getElementById('vibration-toggle');
            if (toggle) toggle.checked = vibrationEnabled;
        }
    };
    
    const soundRequest = settingsStore.get('sound');
    soundRequest.onsuccess = (event) => {
        if (soundRequest.result) {
            soundEnabled = soundRequest.result.value;
            const toggle = document.getElementById('sound-toggle');
            if (toggle) toggle.checked = soundEnabled;
        }
    };
    
    const notificationsRequest = settingsStore.get('notifications');
    notificationsRequest.onsuccess = (event) => {
        if (notificationsRequest.result) {
            notificationsEnabled = notificationsRequest.result.value;
            const toggle = document.getElementById('notifications-toggle');
            if (toggle) toggle.checked = notificationsEnabled;
        }
    };
}

// إعداد مستمعي أحداث شاشة الإعدادات
function setupSettingsEventListeners() {
    // تبديل الصوت
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            soundEnabled = e.target.checked;
            saveSetting('sound', soundEnabled);
            
            if (soundEnabled) playSound('click');
        });
    }
    
    // تبديل الاهتزاز
    const vibrationToggle = document.getElementById('vibration-toggle');
    if (vibrationToggle) {
        vibrationToggle.addEventListener('change', (e) => {
            vibrationEnabled = e.target.checked;
            saveSetting('vibration', vibrationEnabled);
            
            if (vibrationEnabled) vibrate();
        });
    }
    
    // تبديل الإشعارات
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', (e) => {
            notificationsEnabled = e.target.checked;
            saveSetting('notifications', notificationsEnabled);
        });
    }
    
    // ألوان السمات
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            handleColorChange(option);
        });
    });
    
    // مشاركة التطبيق
    const shareBtn = document.getElementById('share-app');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareApp);
    }
    
    // تقييم التطبيق
    const rateBtn = document.getElementById('rate-app');
    if (rateBtn) {
        rateBtn.addEventListener('click', rateApp);
    }
    
    // إعادة ضبط التطبيق
    const resetBtn = document.getElementById('reset-app');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetApp);
    }
    
    // المساعدة
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', showHelpGuide);
    }
    
    // اتصل بنا
    const contactBtn = document.getElementById('contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', showContactForm);
    }
    
    // سياسة الخصوصية
    const privacyBtn = document.getElementById('privacy-btn');
    if (privacyBtn) {
        privacyBtn.addEventListener('click', showPrivacyPolicy);
    }
    
    // تثبيت التطبيق
    const installBtn = document.getElementById('install-app');
    if (installBtn) {
        installBtn.addEventListener('click', installApp);
    }
}

// حفظ الإعدادات في قاعدة البيانات
function saveSetting(settingId, value) {
    if (!db) return;
    
    const transaction = db.transaction(['settings'], 'readwrite');
    const settingsStore = transaction.objectStore('settings');
    settingsStore.put({ id: settingId, value: value });
}

// تغيير اللون
function handleColorChange(colorOption) {
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
        opt.setAttribute('aria-checked', 'false');
    });
    
    colorOption.classList.add('active');
    colorOption.setAttribute('aria-checked', 'true');
    
    const newColor = colorOption.getAttribute('data-color');
    
    // تحديث المتغيرات CSS
    document.documentElement.style.setProperty('--primary', newColor);
    document.documentElement.style.setProperty('--card-back', newColor);
    document.documentElement.style.setProperty('--gradient', `linear-gradient(120deg, ${newColor}, #fd79a8)`);
    
    // حفظ اللون المفضل
    localStorage.setItem('preferredColor', newColor);
}

// استعادة اللون المحفوظ
function restorePreferredColor() {
    const savedColor = localStorage.getItem('preferredColor');
    if (savedColor) {
        const colorOption = document.querySelector(`.color-option[data-color="${savedColor}"]`);
        if (colorOption) {
            handleColorChange(colorOption);
        }
    }
}

// مشاركة التطبيق
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'أبطال البطاقات',
            text: 'جرب هذه اللعبة المثيرة للذكاء!',
            url: window.location.href
        })
        .then(() => console.log('تم المشاركة بنجاح'))
        .catch((error) => {
            console.log('خطأ في المشاركة:', error);
            showToast('ميزة المشاركة غير مدعومة في متصفحك');
        });
    } else {
        showToast('ميزة المشاركة غير مدعومة في متصفحك');
    }
}

// تقييم التطبيق
function rateApp() {
    // يمكن تغيير هذا الرابط ليناسب متجر التطبيقات المستهدف
    const ratingUrl = 'https://play.google.com/store/apps/details?id=com.example.cardheroes';
    
    // عرض خيارات التقييم
    const ratingOptions = [
        { text: '⭐⭐⭐⭐⭐ ممتاز', value: 5 },
        { text: '⭐⭐⭐⭐ جيد جداً', value: 4 },
        { text: '⭐⭐⭐ متوسط', value: 3 },
        { text: '⭐⭐ ضعيف', value: 2 },
        { text: '⭐ سيء', value: 1 }
    ];
    
    const ratingHTML = `
        <div class="cultural-puzzle-overlay active" id="rating-overlay">
            <div class="cultural-puzzle-container glass-effect">
                <div class="puzzle-header">
                    <h2>تقييم التطبيق</h2>
                </div>
                <div class="puzzle-question">كيف تقيم تجربتك مع تطبيق أبطال البطاقات؟</div>
                <div class="puzzle-options">
                    ${ratingOptions.map(option => `
                        <button class="puzzle-option glass-effect-light" data-value="${option.value}">
                            ${option.text}
                        </button>
                    `).join('')}
                </div>
                <div class="puzzle-result" id="rating-result"></div>
                <button class="btn" id="close-rating-btn">إغلاق</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', ratingHTML);
    
    document.querySelectorAll('#rating-overlay .puzzle-option').forEach(option => {
        option.addEventListener('click', function() {
            const ratingValue = parseInt(this.dataset.value);
            const resultElement = document.getElementById('rating-result');
            
            if (ratingValue >= 4) {
                resultElement.innerHTML = `<i class="fas fa-smile"></i> شكراً لتقييمك الإيجابي!`;
                resultElement.className = 'puzzle-result correct';
                
                // توجيه المستخدم لكتابة مراجعة في المتجر
                setTimeout(() => {
                    window.open(ratingUrl, '_blank');
                }, 1500);
            } else {
                resultElement.innerHTML = `<i class="fas fa-frown"></i> نأسف لتجربتك. سنعمل على تحسين التطبيق.`;
                resultElement.className = 'puzzle-result incorrect';
                
                // طلب ملاحظات من المستخدم
                showFeedbackForm();
            }
        });
    });
    
    document.getElementById('close-rating-btn').addEventListener('click', () => {
        document.getElementById('rating-overlay').remove();
    });
}

// إعادة ضبط التطبيق
function resetApp() {
    const confirmationMessage = `
        <div class="cultural-puzzle-overlay active" id="reset-confirmation">
            <div class="cultural-puzzle-container glass-effect">
                <div class="puzzle-header">
                    <h2>⚠️ تأكيد إعادة الضبط</h2>
                </div>
                <div class="puzzle-question">
                    هل أنت متأكد من أنك تريد إعادة ضبط التطبيق؟<br>
                    <strong>هذا الإجراء لا يمكن التراجع عنه وسيتم:</strong><br>
                    • حذف جميع الإحصائيات<br>
                    • حذف جميع الإنجازات<br>
                    • إعادة جميع المستويات للحالة الافتراضية<br>
                    • حذف جميع الإعدادات الشخصية
                </div>
                <div class="puzzle-options" style="grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button class="puzzle-option glass-effect-light" style="background: rgba(214, 48, 49, 0.3);" id="confirm-reset">
                        <i class="fas fa-check"></i> نعم، إعادة ضبط
                    </button>
                    <button class="puzzle-option glass-effect-light" style="background: rgba(0, 184, 148, 0.3);" id="cancel-reset">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmationMessage);
    
    document.getElementById('confirm-reset').addEventListener('click', () => {
        performReset();
        document.getElementById('reset-confirmation').remove();
    });
    
    document.getElementById('cancel-reset').addEventListener('click', () => {
        document.getElementById('reset-confirmation').remove();
    });
}

// تنفيذ إعادة الضبط
function performReset() {
    // حذف قاعدة البيانات
    indexedDB.deleteDatabase('CardGameDB');
    
    // حذف localStorage
    localStorage.clear();
    
    // إعادة تحميل الصفحة
    showToast('تم إعادة ضبط التطبيق بنجاح');
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// عرض دليل المساعدة
function showHelpGuide() {
    const helpContent = [
        {
            title: "🎮 كيف تلعب",
            content: "1. اختر مرحلة من الخريطة<br>2. اختر المستوى المناسب<br>3. انقر على بطاقات اللغز لقلبها<br>4. اختر البطاقة الصحيحة للحل<br>5. حاول إيجاد 3 تطابقات صحيحة"
        },
        {
            title: "🏆 النظام النقاطي",
            content: "• إجابة صحيحة: +1 نقطة<br>• إجابة خاطئة: -1 نقطة<br>• حل لغز ثقافي: +1 نقطة<br>• إكمال مستوى: +3 نقاط<br>• التحدي اليومي: نقاط مضاعفة"
        },
        {
            title: "💡 التلميحات والمساعدة",
            content: "• تكلفة التلميح: 10 نقاط<br>• شخصية المرشد تساعدك<br>• الألغاز الثقافية تعطيك نقاطاً إضافية<br>• حاول إكمال المستويات بدون تلميحات لإنجاز خاص"
        },
        {
            title: "⚙️ الإعدادات المتقدمة",
            content: "• يمكنك تغيير الألوان<br>• تفعيل/تعطيل الصوت والاهتزاز<br>• التحكم بالإشعارات<br>• تثبيت التطبيق على جهازك"
        }
    ];
    
    const helpHTML = `
        <div class="cultural-puzzle-overlay active" id="help-overlay">
            <div class="cultural-puzzle-container glass-effect" style="max-width: 600px;">
                <div class="puzzle-header">
                    <h2>📚 دليل المساعدة</h2>
                    <span class="puzzle-category">كل ما تحتاج معرفته عن اللعبة</span>
                </div>
                <div class="help-content" style="text-align: right; max-height: 400px; overflow-y: auto;">
                    ${helpContent.map(section => `
                        <div class="help-section" style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                            <h3 style="color: var(--accent); margin-bottom: 10px;">${section.title}</h3>
                            <p style="line-height: 1.6;">${section.content}</p>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; justify-content: center; margin-top: 20px; gap: 10px;">
                    <button class="btn" id="close-help-btn">
                        <i class="fas fa-times"></i> إغلاق
                    </button>
                    <button class="btn" id="mascot-help-btn" style="background: linear-gradient(135deg, #6c5ce7, #a29bfe);">
                        <i class="fas fa-robot"></i> اسأل المساعد
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', helpHTML);
    
    document.getElementById('close-help-btn').addEventListener('click', () => {
        document.getElementById('help-overlay').remove();
    });
    
    document.getElementById('mascot-help-btn').addEventListener('click', () => {
        document.getElementById('help-overlay').remove();
        if (mascotSystem) {
            mascotSystem.showMessage();
        }
    });
}

// عرض نموذج الاتصال
function showContactForm() {
    const contactHTML = `
        <div class="cultural-puzzle-overlay active" id="contact-overlay">
            <div class="cultural-puzzle-container glass-effect" style="max-width: 500px;">
                <div class="puzzle-header">
                    <h2>📞 اتصل بنا</h2>
                    <span class="puzzle-category">نحن هنا لمساعدتك</span>
                </div>
                <div class="contact-form" style="text-align: right;">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="contact-name" style="display: block; margin-bottom: 5px; font-weight: 600;">
                            <i class="fas fa-user"></i> الاسم
                        </label>
                        <input type="text" id="contact-name" 
                               placeholder="أدخل اسمك" 
                               style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;">
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="contact-email" style="display: block; margin-bottom: 5px; font-weight: 600;">
                            <i class="fas fa-envelope"></i> البريد الإلكتروني
                        </label>
                        <input type="email" id="contact-email" 
                               placeholder="أدخل بريدك الإلكتروني" 
                               style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;">
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="contact-message" style="display: block; margin-bottom: 5px; font-weight: 600;">
                            <i class="fas fa-comment"></i> الرسالة
                        </label>
                        <textarea id="contact-message" 
                                  rows="4" 
                                  placeholder="أدخل رسالتك هنا..." 
                                  style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; resize: vertical;"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="contact-type" style="display: block; margin-bottom: 5px; font-weight: 600;">
                            <i class="fas fa-tag"></i> نوع الرسالة
                        </label>
                        <select id="contact-type" 
                                style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;">
                            <option value="bug">تقرير عن خطأ</option>
                            <option value="suggestion">اقتراح تحسين</option>
                            <option value="question">سؤال</option>
                            <option value="other">أخرى</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 10px;">
                    <button class="btn" id="send-contact-btn">
                        <i class="fas fa-paper-plane"></i> إرسال
                    </button>
                    <button class="btn" id="close-contact-btn" style="background: rgba(214, 48, 49, 0.3);">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
                <div class="contact-result" id="contact-result" style="margin-top: 15px; display: none;"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', contactHTML);
    
    // تعبئة البيانات تلقائياً إذا كانت موجودة
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    
    if (userName && contactName) {
        contactName.value = userName;
    }
    if (userEmail && contactEmail) {
        contactEmail.value = userEmail;
    }
    
    document.getElementById('send-contact-btn').addEventListener('click', () => {
        sendContactMessage();
    });
    
    document.getElementById('close-contact-btn').addEventListener('click', () => {
        document.getElementById('contact-overlay').remove();
    });
}

// إرسال رسالة الاتصال
function sendContactMessage() {
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    const type = document.getElementById('contact-type').value;
    const resultElement = document.getElementById('contact-result');
    
    if (!name || !email || !message) {
        resultElement.innerHTML = '<div style="color: #fdcb6e; padding: 10px; background: rgba(253, 203, 110, 0.1); border-radius: 8px;">الرجاء ملء جميع الحقول المطلوبة</div>';
        resultElement.style.display = 'block';
        return;
    }
    
    // في بيئة حقيقية، هنا سيكون هناك كود لإرسال البيانات للخادم
    // الآن سنعرض رسالة نجاح وهمية
    
    resultElement.innerHTML = `
        <div style="color: #00b894; padding: 10px; background: rgba(0, 184, 148, 0.1); border-radius: 8px;">
            <i class="fas fa-check-circle"></i> تم إرسال رسالتك بنجاح!<br>
            سنقوم بالرد عليك في أقرب وقت ممكن.
        </div>
    `;
    resultElement.style.display = 'block';
    
    // إخفاء النموذج بعد 3 ثوانٍ
    setTimeout(() => {
        document.getElementById('contact-overlay').remove();
        showToast('شكراً لتواصلك معنا!');
    }, 3000);
}

// عرض سياسة الخصوصية
function showPrivacyPolicy() {
    const privacyHTML = `
        <div class="cultural-puzzle-overlay active" id="privacy-overlay">
            <div class="cultural-puzzle-container glass-effect" style="max-width: 700px; max-height: 80vh;">
                <div class="puzzle-header">
                    <h2>🔒 سياسة الخصوصية</h2>
                    <span class="puzzle-category">آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}</span>
                </div>
                <div class="privacy-content" style="text-align: right; max-height: 400px; overflow-y: auto; line-height: 1.8;">
                    <div class="privacy-section" style="margin-bottom: 20px;">
                        <h3 style="color: var(--accent); margin-bottom: 10px;">1. المعلومات التي نجمعها</h3>
                        <p>نحن نحترم خصوصيتك. المعلومات التي قد نجمعها:</p>
                        <ul style="padding-right: 20px; margin-top: 10px;">
                            <li>الإحصائيات والنتائج داخل اللعبة</li>
                            <li>الإعدادات المفضلة (الألوان، الصوت، الاهتزاز)</li>
                            <li>الإنجازات والمستويات المكتملة</li>
                            <li>وقت اللعب والتفاعلات</li>
                        </ul>
                    </div>
                    
                    <div class="privacy-section" style="margin-bottom: 20px;">
                        <h3 style="color: var(--accent); margin-bottom: 10px;">2. كيفية استخدام المعلومات</h3>
                        <p>نستخدم المعلومات ل:</p>
                        <ul style="padding-right: 20px; margin-top: 10px;">
                            <li>تحسين تجربة اللعب</li>
                            <li>تتبع التقدم والإنجازات</li>
                            <li>تخصيص الإعدادات</li>
                            <li>تحليل أداء التطبيق</li>
                        </ul>
                    </div>
                    
                    <div class="privacy-section" style="margin-bottom: 20px;">
                        <h3 style="color: var(--accent); margin-bottom: 10px;">3. تخزين البيانات</h3>
                        <p>جميع البيانات تخزن محلياً على جهازك:</p>
                        <ul style="padding-right: 20px; margin-top: 10px;">
                            <li>لا نرسل أي بيانات إلى خوادم خارجية</li>
                            <li>البيانات محفوظة في IndexedDB و localStorage</li>
                            <li>يمكنك حذف البيانات في أي وقت من إعدادات التطبيق</li>
                        </ul>
                    </div>
                    
                    <div class="privacy-section" style="margin-bottom: 20px;">
                        <h3 style="color: var(--accent); margin-bottom: 10px;">4. حقوقك</h3>
                        <p>لديك الحق في:</p>
                        <ul style="padding-right: 20px; margin-top: 10px;">
                            <li>حذف بياناتك في أي وقت</li>
                            <li>إعادة ضبط التطبيق</li>
                            <li>عدم مشاركة أي معلومات شخصية</li>
                            <li>تعطيل الإشعارات والتتبع</li>
                        </ul>
                    </div>
                    
                    <div class="privacy-section">
                        <h3 style="color: var(--accent); margin-bottom: 10px;">5. التغييرات على السياسة</h3>
                        <p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنعلمك بأي تغييرات جوهرية عن طريق إشعار في التطبيق.</p>
                    </div>
                </div>
                <div style="display: flex; justify-content: center; margin-top: 20px;">
                    <button class="btn" id="close-privacy-btn">
                        <i class="fas fa-check"></i> فهمت وقبلت السياسة
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', privacyHTML);
    
    document.getElementById('close-privacy-btn').addEventListener('click', () => {
        localStorage.setItem('privacyAccepted', 'true');
        document.getElementById('privacy-overlay').remove();
        showToast('شكراً لقراءة سياسة الخصوصية');
    });
}

// تثبيت التطبيق
function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('تم قبول التثبيت');
                showToast('جاري تثبيت التطبيق...');
                
                // إخفاء زر التثبيت بعد النجاح
                const installBtn = document.getElementById('install-app');
                if (installBtn) installBtn.style.display = 'none';
            } else {
                console.log('تم رفض التثبيت');
            }
            deferredPrompt = null;
        });
    }
}

// فتح نموذج الملاحظات
function showFeedbackForm() {
    setTimeout(() => {
        const feedbackHTML = `
            <div class="cultural-puzzle-overlay active" id="feedback-overlay">
                <div class="cultural-puzzle-container glass-effect" style="max-width: 500px;">
                    <div class="puzzle-header">
                        <h2>💬 ملاحظاتك تهمنا</h2>
                        <span class="puzzle-category">ساعدنا على التحسين</span>
                    </div>
                    <div class="feedback-form" style="text-align: right;">
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">
                                ما الذي يمكننا تحسينه؟
                            </label>
                            <textarea id="feedback-message" 
                                      rows="4" 
                                      placeholder="أخبرنا بتجربتك وما يمكننا تحسينه..." 
                                      style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; resize: vertical;"></textarea>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 10px;">
                        <button class="btn" id="send-feedback-btn">
                            <i class="fas fa-paper-plane"></i> إرسال الملاحظات
                        </button>
                        <button class="btn" id="close-feedback-btn" style="background: rgba(214, 48, 49, 0.3);">
                            <i class="fas fa-times"></i> تخطي
                        </button>
                    </div>
                    <div class="feedback-result" id="feedback-result" style="margin-top: 15px; display: none;"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', feedbackHTML);
        
        document.getElementById('send-feedback-btn').addEventListener('click', () => {
            const feedback = document.getElementById('feedback-message').value;
            if (feedback.trim()) {
                // هنا يمكن إرسال الملاحظات للخادم
                document.getElementById('feedback-result').innerHTML = `
                    <div style="color: #00b894; padding: 10px; background: rgba(0, 184, 148, 0.1); border-radius: 8px;">
                        <i class="fas fa-check-circle"></i> شكراً لك على ملاحظاتك القيمة!
                    </div>
                `;
                document.getElementById('feedback-result').style.display = 'block';
                
                setTimeout(() => {
                    document.getElementById('feedback-overlay').remove();
                }, 2000);
            }
        });
        
        document.getElementById('close-feedback-btn').addEventListener('click', () => {
            document.getElementById('feedback-overlay').remove();
        });
    }, 1000);
}

// التحقق من تثبيت التطبيق
function checkInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.getElementById('install-app');
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
            
            // إضافة تأثير مميز لزر التثبيت
            installBtn.classList.add('pulse');
            setTimeout(() => {
                installBtn.classList.remove('pulse');
            }, 3000);
        }
    });
    
    // التحقق مما إذا كان التطبيق مثبتاً بالفعل
    window.addEventListener('appinstalled', () => {
        const installBtn = document.getElementById('install-app');
        if (installBtn) installBtn.style.display = 'none';
        deferredPrompt = null;
        showToast('تم تثبيت التطبيق بنجاح!');
    });
}

// تهيئة شاشة الإعدادات
function initSettingsScreen() {
    loadUserSettings();
    setupSettingsEventListeners();
    restorePreferredColor();
    checkInstallPrompt();
    
    // التحقق من قبول سياسة الخصوصية
    if (!localStorage.getItem('privacyAccepted')) {
        setTimeout(() => {
            showPrivacyPolicy();
        }, 3000);
    }
}

// إضافة هذا الكود إلى الدالة الرئيسية للتطبيق
// function initApp() {
//     ... كود موجود ...
//     initSettingsScreen();
// }
