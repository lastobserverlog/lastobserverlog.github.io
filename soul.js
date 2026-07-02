const soul = document.getElementById("soul");
const record = document.getElementById("recordText");
const sig = document.getElementById("sig");

/* =========================
   本文を1文字ずつ分解（改行・構造維持版）
========================= */
const chars = [];
let charIndex = 0;

const childNodes = Array.from(record.childNodes);

childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (text.trim() !== "") {
            const fragment = document.createDocumentFragment();
            Array.from(text).forEach(ch => {
                const span = document.createElement("span");
                span.className = "char";
                span.textContent = ch;
                span.style.animationDelay = `${charIndex * 0.035}s`;
                fragment.appendChild(span);
                chars.push(span);
                charIndex++;
            });
            record.replaceChild(fragment, node);
        }
    } 
    else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "HR") {
        const text = node.textContent;
        node.innerHTML = ""; 
        
        Array.from(text).forEach(ch => {
            const span = document.createElement("span");
            span.className = "char";
            span.textContent = ch;
            span.style.animationDelay = `${charIndex * 0.035}s`;
            node.appendChild(span);
            chars.push(span);
            charIndex++;
        });
    }
});

/* =========================
   署名表示
========================= */
const totalTime = chars.length * 35 + 2500;
setTimeout(() => {
    if (sig) sig.style.opacity = "1";
}, totalTime);


/* =========================
   人魂追従 & アニメーション
========================= */
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let soulX = mouseX;
let soulY = mouseY;

document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 文字の座標を事前にキャッシュする配列
let cachedCharPositions = [];

function cachePositions() {
    // 💡 現在のスクロール量を取得しておく
    const currentX = window.scrollX;
    const currentY = window.scrollY;

    cachedCharPositions = chars.map(char => {
        const rect = char.getBoundingClientRect();
        
        // 💡 inline要素のバグ対策：widthやheightが0やイレギュラーな値になるのを防ぐ安全弁
        const w = rect.width || 18; 
        const h = rect.height || 21; 

        return {
            element: char,
            // 💡 ビューポート基準の中心点
            cx: rect.left + w / 2,
            cy: rect.top + h / 2,
            // 💡 この座標を「記録した瞬間」のスクロール位置をそれぞれに持たせる
            initialScrollX: currentX,
            initialScrollY: currentY
        };
    });
}

// 💡 【重要】1.8秒のアニメーション＋全体のタイピングが終わる「完全静止状態」を待ってからキャッシュする。
// 500msだと文字がまだ左側に激しくブレている最中なので、完全に演出が落ち着いた頃（2.5秒後〜全文字出現後）に取る。
const cacheDelay = Math.max(2500, totalTime - 1000);
setTimeout(cachePositions, cacheDelay);

// 画面サイズ変更時はアニメーションが終わっているはずなので即座に再計算
window.addEventListener("resize", cachePositions);


function animateSoul() {
    // 画面基準のマウス位置をねっとり追従
    soulX += (mouseX - soulX) * 0.18;
    soulY += (mouseY - soulY) * 0.18;

    // fixedなので、画面上の座標をそのまま叩き込む
    soul.style.transform = `translate3d(${soulX - 12}px, ${soulY - 12}px, 0)`;

    illuminateChars();
    requestAnimationFrame(animateSoul);
}

animateSoul();


/* =========================
   文字照射（スクロール差分完全吸収版）
========================= */
function illuminateChars() {
    const len = cachedCharPositions.length;
    if (len === 0) return; // キャッシュがまだ作られていない間はスキップ

    const currentScrollX = window.scrollX;
    const currentScrollY = window.scrollY;
    
    for (let i = 0; i < len; i++) {
        const charData = cachedCharPositions[i];
        
        // キャッシュ時からのスクロールの移動量を引き算して、現在の画面上の位置をリアルタイムに同期
        const scrollDiffX = currentScrollX - charData.initialScrollX;
        const scrollDiffY = currentScrollY - charData.initialScrollY;
        
        const currentCharCx = charData.cx - scrollDiffX;
        const currentCharCy = charData.cy - scrollDiffY;
        
        const dx = currentCharCx - soulX;
        const dy = currentCharCy - soulY;

        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < 6400) { 
            charData.element.classList.add("lit");
        } else {
            charData.element.classList.remove("lit");
        }
    }
}
