/* ========================================
   济南水系文化数字人文平台 - JavaScript
   ======================================== */

// 全局变量
let currentLang = 'zh';
let currentPage = 1;
const totalPages = 6;
let panoramaX = 0;
let panoramaZoom = 1;
let isDragging = false;
let startX = 0;

// ========================================
// 初始化
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initLanguageToggle();
    initResourceTabs();
    initContactForm();
    initBackToTop();
    initFlipbook();
    initPanorama();
    initMapInteraction();
});

// ========================================
// 导航功能
// ========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // 滚动效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 更新活动链接
        updateActiveLink();
    });

    // 移动端菜单
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // 点击链接关闭移动端菜单
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ========================================
// 语言切换
// ========================================
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');

    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        this.textContent = currentLang === 'zh' ? 'EN' : '中文';
        updateLanguage();
    });
}

function updateLanguage() {
    // 更新所有带 data-zh 和 data-en 属性的元素
    const elements = document.querySelectorAll('[data-zh][data-en]');
    elements.forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });

    // 更新输入框占位符
    const inputs = document.querySelectorAll('[data-placeholder-zh][data-placeholder-en]');
    inputs.forEach(input => {
        input.placeholder = input.getAttribute(`data-placeholder-${currentLang}`);
    });
}

// ========================================
// 资源标签切换
// ========================================
function initResourceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');

            // 更新按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 显示对应内容
            document.querySelectorAll('.resource-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById('tab-' + tab).classList.add('active');
        });
    });
}

// ========================================
// AI对话功能
// ========================================
function openChat() {
    const aiDemo = document.getElementById('aiDemo');
    const overlay = document.querySelector('.overlay') || createOverlay();
    aiDemo.style.display = 'block';
    overlay.classList.add('active');
}

function closeChat() {
    const aiDemo = document.getElementById('aiDemo');
    const overlay = document.querySelector('.overlay');
    aiDemo.style.display = 'none';
    if (overlay) overlay.classList.remove('active');
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.onclick = function() {
        closeChat();
        closeVoice();
        closeRoute();
    };
    document.body.appendChild(overlay);
    return overlay;
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('chatMessages');

    // 添加用户消息
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<span>${message}</span>`;
    messagesContainer.appendChild(userMessage);

    // 清空输入
    input.value = '';

    // 模拟AI回复
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = `<span>${getAIResponse(message)}</span>`;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getAIResponse(question) {
    const responses = {
        zh: [
            '济南素有"泉城"之称，拥有七十二名泉，趵突泉是其中最著名的，被誉为"天下第一泉"。',
            '李清照是宋代著名女词人，济南章丘人，被誉为"千古第一才女"，她的词作感情真挚，语言清丽。',
            '大明湖是济南三大名胜之一，由众泉汇流而成，面积46公顷，素有"四面荷花三面柳，一城山色半城湖"的美誉。',
            '护城河环绕济南古城，全长6.9公里，是国内唯一可以完整乘船游览的护城河。',
            '辛弃疾是南宋豪放派词人，济南历城人，与李清照并称"济南二安"，是著名的爱国词人。'
        ],
        en: [
            'Jinan is known as the "City of Springs" with 72 famous springs. Baotu Spring is the most famous, hailed as "The First Spring Under Heaven".',
            'Li Qingzhao was a renowned Song Dynasty poetess from Zhangqiu, Jinan, praised as "The Greatest Female Poet" with sincere emotions and elegant language.',
            'Daming Lake is one of Jinan\'s three famous attractions, fed by numerous springs, covering 46 hectares with beautiful lotus and willows.',
            'The City Moat surrounds Jinan\'s ancient city, 6.9 km long, the only fully navigable moat in China.',
            'Xin Qiji was a Southern Song poet from Licheng, Jinan, known as one of the "Two Ans of Jinan" with Li Qingzhao.'
        ]
    };

    const langResponses = responses[currentLang];
    return langResponses[Math.floor(Math.random() * langResponses.length)];
}

// 语音讲解
function openVoice() {
    const overlay = document.querySelector('.overlay') || createOverlay();
    alert(currentLang === 'zh' ?
        '语音讲解功能演示：AI将为您朗读景点的历史文化介绍，支持中英双语切换。' :
        'Voice narration demo: AI will read historical and cultural introductions of attractions in both Chinese and English.');
}

// 路线规划
function openRoute() {
    const overlay = document.querySelector('.overlay') || createOverlay();
    alert(currentLang === 'zh' ?
        '路线规划功能演示：根据您的兴趣偏好（泉水文化、历史人文、美食体验等），AI将为您规划最佳游览路线。' :
        'Route planning demo: Based on your interests (spring culture, history, food experience), AI will plan the best tour route.');
}

function closeVoice() {}
function closeRoute() {}

// ========================================
// 虚拟漫游 - 翻页相册
// ========================================
function initFlipbook() {
    // 显示第一页
    showPage(1);

    // 触摸滑动支持
    const flipbook = document.getElementById('flipbook');
    let touchStartX = 0;
    let touchEndX = 0;

    flipbook.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    flipbook.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextPage();
            } else {
                prevPage();
            }
        }
    }

    // 鼠标滑动支持
    let mouseStartX = 0;
    let isMouseDown = false;

    flipbook.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        mouseStartX = e.clientX;
    });

    document.addEventListener('mouseup', function(e) {
        if (isMouseDown) {
            const diff = mouseStartX - e.clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextPage();
                } else {
                    prevPage();
                }
            }
        }
        isMouseDown = false;
    });
}

function showPage(page) {
    const pages = document.querySelectorAll('.flipbook-page');

    pages.forEach((p, index) => {
        p.classList.remove('active', 'prev');
        if (index + 1 === page) {
            p.classList.add('active');
        } else if (index + 1 < page) {
            p.classList.add('prev');
        }
    });

    document.getElementById('currentPage').textContent = page;
    currentPage = page;
}

function nextPage() {
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

// ========================================
// 虚拟漫游 - 模式切换
// ========================================
function switchTourMode(mode) {
    const modeBtns = document.querySelectorAll('.mode-btn');
    const albumMode = document.getElementById('albumMode');
    const panoramaMode = document.getElementById('panoramaMode');

    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        }
    });

    if (mode === 'album') {
        albumMode.style.display = 'block';
        panoramaMode.style.display = 'none';
    } else {
        albumMode.style.display = 'none';
        panoramaMode.style.display = 'block';
    }
}

// ========================================
// 虚拟漫游 - 全景查看器
// ========================================
function initPanorama() {
    const viewer = document.getElementById('panoramaViewer');
    const canvas = document.getElementById('panoramaCanvas');
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    // 鼠标拖动
    viewer.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX - panoramaX;
        viewer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        panoramaX = e.clientX - startX;
        updatePanorama();
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });

    // 触摸拖动
    viewer.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].clientX - panoramaX;
    });

    viewer.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        panoramaX = e.touches[0].clientX - startX;
        updatePanorama();
    });

    viewer.addEventListener('touchend', function() {
        isDragging = false;
    });

    // 滚轮缩放
    viewer.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    });

    // 更新热点位置
    updateHotspots();
}

function updatePanorama() {
    const canvas = document.getElementById('panoramaCanvas');
    const maxOffset = canvas.offsetWidth * 0.5;

    // 限制拖动范围
    panoramaX = Math.max(-maxOffset, Math.min(0, panoramaX));

    canvas.style.transform = `translateX(${panoramaX}px) scale(${panoramaZoom})`;
}

function updateHotspots() {
    // 热点位置会根据场景变化
}

function zoomIn() {
    if (panoramaZoom < 2) {
        panoramaZoom += 0.1;
        updatePanorama();
    }
}

function zoomOut() {
    if (panoramaZoom > 0.5) {
        panoramaZoom -= 0.1;
        updatePanorama();
    }
}

function resetView() {
    panoramaX = 0;
    panoramaZoom = 1;
    updatePanorama();
}

function toggleFullscreen() {
    const viewer = document.getElementById('panoramaViewer');
    if (!document.fullscreenElement) {
        viewer.requestFullscreen().catch(err => {
            console.log('全屏模式不可用');
        });
        viewer.classList.add('fullscreen');
    } else {
        document.exitFullscreen();
        viewer.classList.remove('fullscreen');
    }
}

// 场景切换
function switchScene(scene) {
    const sceneBtns = document.querySelectorAll('.scene-btn');
    const sceneTitle = document.getElementById('sceneTitle');
    const sceneDesc = document.getElementById('sceneDesc');
    const hotspots = document.getElementById('panoramaHotspots');

    sceneBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-scene') === scene) {
            btn.classList.add('active');
        }
    });

    // 更新场景信息和热点
    const sceneData = {
        daminglake: {
            title: { zh: '大明湖全景', en: 'Daming Lake Panorama' },
            desc: {
                zh: '大明湖是济南三大名胜之一，由众泉汇流而成，面积46公顷，素有"四面荷花三面柳，一城山色半城湖"的美誉。',
                en: 'Daming Lake is one of Jinan\'s three famous attractions, fed by numerous springs, covering 46 hectares.'
            },
            hotspots: [
                { top: '40%', left: '30%', name: { zh: '历下亭', en: 'Lixia Pavilion' }, desc: { zh: '大明湖标志性建筑', en: 'Landmark' } },
                { top: '50%', left: '60%', name: { zh: '荷花池', en: 'Lotus Pond' }, desc: { zh: '夏季荷花盛开', en: 'Lotus blooms' } }
            ]
        },
        baotu: {
            title: { zh: '趵突泉全景', en: 'Baotu Spring Panorama' },
            desc: {
                zh: '趵突泉是济南七十二名泉之首，被誉为"天下第一泉"，三股泉水喷涌而出，气势壮观。',
                en: 'Baotu Spring is the most famous of Jinan\'s 72 springs, known as "The First Spring Under Heaven".'
            },
            hotspots: [
                { top: '45%', left: '40%', name: { zh: '观澜亭', en: 'Guanlan Pavilion' }, desc: { zh: '观泉最佳位置', en: 'Best view point' } }
            ]
        },
        furong: {
            title: { zh: '芙蓉街全景', en: 'Furong Street Panorama' },
            desc: {
                zh: '芙蓉街是济南最古老的街道之一，青石板路、老字号商铺、泉水穿街，呈现浓郁的泉城风貌。',
                en: 'Furong Street is one of Jinan\'s oldest streets with stone paths and springs.'
            },
            hotspots: [
                { top: '50%', left: '35%', name: { zh: '老字号', en: 'Time-honored Brand' }, desc: { zh: '传统美食店铺', en: 'Traditional food' } }
            ]
        },
        moat: {
            title: { zh: '护城河全景', en: 'City Moat Panorama' },
            desc: {
                zh: '护城河环绕济南古城，全长6.9公里，是国内唯一可以完整乘船游览的护城河，两岸柳树成荫。',
                en: 'The City Moat surrounds Jinan\'s ancient city, 6.9 km long, fully navigable.'
            },
            hotspots: [
                { top: '45%', left: '50%', name: { zh: '游船码头', en: 'Boat Dock' }, desc: { zh: '乘船游览起点', en: 'Starting point' } }
            ]
        }
    };

    const data = sceneData[scene];
    sceneTitle.textContent = data.title[currentLang];
    sceneTitle.setAttribute('data-zh', data.title.zh);
    sceneTitle.setAttribute('data-en', data.title.en);
    sceneDesc.textContent = data.desc[currentLang];
    sceneDesc.setAttribute('data-zh', data.desc.zh);
    sceneDesc.setAttribute('data-en', data.desc.en);

    // 更新热点
    hotspots.innerHTML = data.hotspots.map(h => `
        <div class="hotspot" style="top: ${h.top}; left: ${h.left};">
            <span class="hotspot-marker">📍</span>
            <div class="hotspot-tooltip">
                <h5 data-zh="${h.name.zh}" data-en="${h.name.en}">${h.name[currentLang]}</h5>
                <p data-zh="${h.desc.zh}" data-en="${h.desc.en}">${h.desc[currentLang]}</p>
            </div>
        </div>
    `).join('');

    // 重置视图
    resetView();
}

// ========================================
// 地图交互
// ========================================
function initMapInteraction() {
    const mapLayer = document.getElementById('mapLayer');
    const mapPeriod = document.getElementById('mapPeriod');

    mapLayer.addEventListener('change', function() {
        filterMapPoints(this.value);
    });

    mapPeriod.addEventListener('change', function() {
        updateMapPeriod(this.value);
    });

    // 点击点位显示信息
    const mapPoints = document.querySelectorAll('.map-point');
    mapPoints.forEach(point => {
        point.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            showPointInfo(name);
        });
    });
}

function filterMapPoints(type) {
    const points = document.querySelectorAll('.map-point');
    const waterLine = document.querySelector('.water-line');

    points.forEach(point => {
        if (type === 'all') {
            point.style.opacity = '1';
        } else if (point.classList.contains(type)) {
            point.style.opacity = '1';
        } else {
            point.style.opacity = '0.3';
        }
    });

    if (type === 'all' || type === 'water') {
        waterLine.style.opacity = '0.6';
    } else {
        waterLine.style.opacity = '0.1';
    }
}

function updateMapPeriod(period) {
    // 模拟不同时期的地图显示
    const periodNames = {
        now: { zh: '当代济南', en: 'Contemporary Jinan' },
        ming: { zh: '明代济南', en: 'Ming Dynasty Jinan' },
        qing: { zh: '清代济南', en: 'Qing Dynasty Jinan' },
        republic: { zh: '民国济南', en: 'Republic Era Jinan' }
    };
    console.log('切换到时期: ' + periodNames[period][currentLang]);
}

function showPointInfo(name) {
    const info = {
        zh: {
            '趵突泉': '趵突泉：天下第一泉，位于济南市历下区，是济南七十二名泉之首。',
            '黑虎泉': '黑虎泉：济南七十二名泉之一，泉水从三个石雕虎头喷出。',
            '大明湖': '大明湖：济南三大名胜之一，由众泉汇流而成。',
            '解放阁': '解放阁：纪念济南战役胜利的标志性建筑。',
            '小清河': '小清河：济南重要的排洪河道和航运水道。'
        },
        en: {
            '趵突泉': 'Baotu Spring: The First Spring Under Heaven, the most famous of Jinan\'s 72 springs.',
            '黑虎泉': 'Black Tiger Spring: Water sprays from three stone tiger heads.',
            '大明湖': 'Daming Lake: One of Jinan\'s three famous attractions.',
            '解放阁': 'Liberation Pavilion: A landmark commemorating the Jinan Battle.',
            '小清河': 'Xiaoqing River: An important drainage and shipping channel.'
        }
    };

    alert(info[currentLang][name] || name);
}

// ========================================
// 联系表单
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // 模拟提交
        alert(currentLang === 'zh' ?
            `感谢您的留言，${name}！我们会尽快回复您。` :
            `Thank you for your message, ${name}! We will reply soon.`);

        form.reset();
    });
}

// ========================================
// 返回顶部
// ========================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// 辅助函数
// ========================================

// 平滑滚动到指定section
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 键盘支持
document.addEventListener('keydown', function(e) {
    // ESC关闭对话框
    if (e.key === 'Escape') {
        closeChat();
    }

    // 左右箭头翻页（在相册模式下）
    const albumMode = document.getElementById('albumMode');
    if (albumMode && albumMode.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        }
    }
});

// 回车发送消息
document.getElementById('userInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 全屏变化监听
document.addEventListener('fullscreenchange', function() {
    const viewer = document.getElementById('panoramaViewer');
    if (!document.fullscreenElement) {
        viewer.classList.remove('fullscreen');
    }
});

console.log('济南水系文化数字人文平台 - 已加载完成');
