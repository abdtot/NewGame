// إصدار Service Worker
const CACHE_VERSION = 'v3.5.0';
const CACHE_NAME = `card-heroes-cache-${CACHE_VERSION}`;

// الملفات الأساسية للتخزين المؤقت عند التثبيت
const PRE_CACHE_ASSETS = [
  '/',
  '/index.html',
  '/game.html',
  '/style.css',
  '/style1.css',
  '/script.js',
  '/manifest.json',
  
  // الصور الأساسية
  '/img/20240927_224804.jpg',
  '/img/20250330_180915.jpg',
  
  // الخطوط والرموز
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
  
  // البيانات الأساسية
  '/cultural-puzzles.json',
  
  // الأصوات (إذا وجدت)
  '/sounds/click.mp3',
  '/sounds/success.mp3',
  '/sounds/error.mp3',
  '/sounds/flip.mp3',
  '/sounds/win.mp3'
];

// الاستراتيجيات المختلفة للتخزين المؤقت
const STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only'
};

// تهيئة Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] التثبيت', CACHE_VERSION);
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[Service Worker] التخزين المسبق للملفات');
        
        // التخزين المسبق للملفات الأساسية
        await cache.addAll(PRE_CACHE_ASSETS.map(url => new Request(url, {
          cache: 'reload',
          credentials: 'same-origin'
        })));
        
        console.log('[Service Worker] التخزين المسبق مكتمل');
        
        // التنشيط الفوري
        self.skipWaiting();
      } catch (error) {
        console.error('[Service Worker] خطأ في التخزين المسبق:', error);
      }
    })()
  );
});

// التنشيط وتنظيف الذاكرة المؤقتة القديمة
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] التنشيط', CACHE_VERSION);
  
  event.waitUntil(
    (async () => {
      // تنظيف الذاكرة المؤقتة القديمة
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((cacheKey) => {
          if (cacheKey !== CACHE_NAME) {
            console.log('[Service Worker] حذف الذاكرة القديمة:', cacheKey);
            return caches.delete(cacheKey);
          }
        })
      );
      
      // المطالبة بالتحكم في العملاء
      await self.clients.claim();
      console.log('[Service Worker] جاهز للتحكم في العملاء');
    })()
  );
});

// معالجة طلبات الشبكة
self.addEventListener('fetch', (event) => {
  // تخطي طلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // تخطي طلبات التحقق من التحديث
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        const strategy = getStrategyForRequest(event.request);
        
        switch (strategy) {
          case STRATEGIES.CACHE_FIRST:
            return await cacheFirstStrategy(event.request);
            
          case STRATEGIES.NETWORK_FIRST:
            return await networkFirstStrategy(event.request);
            
          case STRATEGIES.STALE_WHILE_REVALIDATE:
            return await staleWhileRevalidateStrategy(event.request);
            
          case STRATEGIES.NETWORK_ONLY:
            return await networkOnlyStrategy(event.request);
            
          default:
            return await cacheFirstStrategy(event.request);
        }
      } catch (error) {
        console.error('[Service Worker] خطأ في معالجة الطلب:', error);
        return await handleOfflineFallback(event.request);
      }
    })()
  );
});

// تحديد استراتيجية التخزين المؤقت بناءً على نوع الطلب
function getStrategyForRequest(request) {
  const url = new URL(request.url);
  
  // الملفات الأساسية - Cache First
  if (PRE_CACHE_ASSETS.includes(url.pathname) || 
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.json')) {
    return STRATEGIES.CACHE_FIRST;
  }
  
  // الصور - Stale While Revalidate
  if (url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.gif')) {
    return STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // البيانات الديناميكية - Network First
  if (url.pathname.includes('/api/') ||
      url.pathname.includes('/data/')) {
    return STRATEGIES.NETWORK_FIRST;
  }
  
  // الطلبات الخارجية - Network Only
  if (url.origin !== self.location.origin) {
    return STRATEGIES.NETWORK_ONLY;
  }
  
  // الإعداد الافتراضي
  return STRATEGIES.CACHE_FIRST;
}

// استراتيجية Cache First
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('[Service Worker] serving from cache:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // تخزين الاستجابة في الذاكرة المؤقتة
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw new Error('Network error');
  }
}

// استراتيجية Network First
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    
    // تخزين الاستجابة في الذاكرة المؤقتة
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// استراتيجية Stale While Revalidate
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // إعادة التحقق في الخلفية
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
  }).catch(() => {
    // تجاهل الأخطاء في إعادة التحقق
  });
  
  // إرجاع الاستجابة المخزنة مع إعادة التحقق
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // إذا لم تكن هناك استجابة مخزنة، انتظر الشبكة
  return await fetch(request);
}

// استراتيجية Network Only
async function networkOnlyStrategy(request) {
  return await fetch(request);
}

// التعامل مع وضع عدم الاتصال
async function handleOfflineFallback(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // صفحات HTML - عرض صفحة عدم الاتصال
  if (request.headers.get('Accept').includes('text/html')) {
    return await cache.match('/offline.html') || 
           new Response('عذراً، أنت غير متصل بالإنترنت', {
             status: 503,
             statusText: 'Service Unavailable',
             headers: { 'Content-Type': 'text/html; charset=utf-8' }
           });
  }
  
  // الصور - عرض صورة بديلة
  if (request.headers.get('Accept').includes('image')) {
    return await cache.match('/img/offline-image.jpg') ||
           new Response(null, { status: 404 });
  }
  
  return new Response('عذراً، أنت غير متصل بالإنترنت', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// معالجة رسائل الخلفية
self.addEventListener('message', (event) => {
  console.log('[Service Worker] رسالة مستلمة:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_ADD':
      event.waitUntil(
        (async () => {
          const cache = await caches.open(CACHE_NAME);
          await cache.addAll(event.data.urls);
        })()
      );
      break;
      
    case 'CACHE_DELETE':
      event.waitUntil(
        (async () => {
          const cache = await caches.open(CACHE_NAME);
          await cache.delete(event.data.url);
        })()
      );
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        (async () => {
          const cacheKeys = await caches.keys();
          await Promise.all(
            cacheKeys.map(cacheKey => caches.delete(cacheKey))
          );
        })()
      );
      break;
      
    case 'GET_CACHE_INFO':
      event.waitUntil(
        (async () => {
          const cache = await caches.open(CACHE_NAME);
          const keys = await cache.keys();
          event.ports[0].postMessage({
            type: 'CACHE_INFO',
            count: keys.length,
            urls: keys.map(req => req.url)
          });
        })()
      );
      break;
  }
});

// معالجة إشعارات الدفع
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'إشعار جديد من أبطال البطاقات',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'general-notification',
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      },
      {
        action: 'dismiss',
        title: 'تجاهل'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'أبطال البطاقات', options)
  );
});

// معالجة نقر الإشعارات
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      if (clientList.length > 0) {
        const client = clientList[0];
        client.focus();
        client.postMessage({
          type: 'NOTIFICATION_CLICK',
          data: event.notification.data
        });
      } else {
        clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});

// معالجة إغلاق الإشعارات
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] الإشعار أغلق:', event.notification);
});

// معالجة التحديثات في الخلفية
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    console.log('[Service Worker] مزامنة دورية للمحتوى');
    event.waitUntil(syncContent());
  }
});

// مزامنة المحتوى
async function syncContent() {
  try {
    // مزامنة التحديات اليومية
    await syncDailyChallenges();
    
    // مزامنة الألغاز الثقافية
    await syncCulturalPuzzles();
    
    // مزامنة بيانات المستخدم
    await syncUserData();
    
    console.log('[Service Worker] المزامنة اكتملت بنجاح');
  } catch (error) {
    console.error('[Service Worker] خطأ في المزامنة:', error);
  }
}

// مزامنة التحديات اليومية
async function syncDailyChallenges() {
  // تنفيذ منطق المزامنة
}

// مزامنة الألغاز الثقافية
async function syncCulturalPuzzles() {
  // تنفيذ منطق المزامنة
}

// مزامنة بيانات المستخدم
async function syncUserData() {
  // تنفيذ منطق المزامنة
}

// تسجيل مزامنة دورية
async function registerPeriodicSync() {
  if ('periodicSync' in self.registration) {
    try {
      await self.registration.periodicSync.register('update-content', {
        minInterval: 24 * 60 * 60 * 1000 // مرة واحدة يومياً
      });
      console.log('[Service Worker] المزامنة الدورية مسجلة');
    } catch (error) {
      console.error('[Service Worker] فشل تسجيل المزامنة الدورية:', error);
    }
  }
}

// تهيئة المزامنة الدورية عند التنشيط
self.addEventListener('activate', (event) => {
  event.waitUntil(registerPeriodicSync());
});

// معالجة الأخطاء العالمية
self.addEventListener('error', (event) => {
  console.error('[Service Worker] خطأ غير معالج:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[Service Worker] promise rejection غير معالج:', event.reason);
});

// وظائف مساعدة للتخزين المؤقت
const CacheUtils = {
  // إضافة عنصر إلى الذاكرة المؤقتة
  async addToCache(url, options = {}) {
    const cache = await caches.open(CACHE_NAME);
    const request = new Request(url, options);
    const response = await fetch(request);
    
    if (response.ok) {
      await cache.put(request, response.clone());
      return true;
    }
    return false;
  },
  
  // الحصول على عنصر من الذاكرة المؤقتة
  async getFromCache(url) {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(url);
  },
  
  // حذف عنصر من الذاكرة المؤقتة
  async deleteFromCache(url) {
    const cache = await caches.open(CACHE_NAME);
    return await cache.delete(url);
  },
  
  // التحقق من وجود عنصر في الذاكرة المؤقتة
  async hasInCache(url) {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    return response !== undefined;
  },
  
  // مسح الذاكرة المؤقتة بالكامل
  async clearCache() {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => caches.delete(key)));
  },
  
  // الحصول على حجم الذاكرة المؤقتة
  async getCacheSize() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    let totalSize = 0;
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
    
    return totalSize;
  }
};

// تصدير الوظائف المساعدة للاستخدام العالمي
self.CacheUtils = CacheUtils;
