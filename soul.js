const soul = document.getElementById("soul");
const record = document.getElementById("recordText");
const sig = document.getElementById("sig");

if (soul) {
    soul.style.opacity = "0";
}

/* =========================
   本文を1文字ずつ分解（改行・構造維持版）
========================= */
const chars = [];
let charIndex = 0;

if (record) {
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
}

const totalTime = chars.length * 35 + 2500;
setTimeout(() => {
    if (sig) sig.style.opacity = "1";
}, totalTime);

/* =========================
   人魂追従 & アニメーション（絶対座標完全同期版）
========================= */
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let soulX = mouseX;
let soulY = mouseY;
let hasMoved = false;

document.addEventListener("mousemove", e => {
    // 💡 ページ全体の絶対座標（pageX/Y）を取得する
    mouseX = e.pageX;
    mouseY = e.pageY;
    
    if (!hasMoved && soul) {
        soul.style.opacity = "1";
        hasMoved = true;
    }
});

// 文字の座標を事前にキャッシュする配列
let cachedCharPositions = [];

function cachePositions() {
    cachedCharPositions = chars.map(char => {
        const rect = char.getBoundingClientRect();
        return {
            element: char,
            // ドキュメント上の絶対座標を完全に固定キャッシュ
            cx: rect.left + (rect.width || 18) / 2 + window.scrollX,
            cy: rect.top + (rect.height || 21) / 2 + window.scrollY
        };
    });
}

setTimeout(cachePositions, 100); 
setTimeout(cachePositions, Math.max(2500, totalTime - 1000));
window.addEventListener("resize", cachePositions);
window.addEventListener("scroll", illuminateChars, { passive: true });

function animateSoul() {
    if (!soul) return;

    // 絶対座標に向けてねっとり追従
    soulX += (mouseX - soulX) * 0.18;
    soulY += (mouseY - soulY) * 0.18;

    // 💡 ★ここがキモ：HTML直下（body外）に出したことで、
    // スクロール量を差し引いた値を transform に渡すと画面に完全に張り付く
    const displayX = soulX - window.scrollX;
    const displayY = soulY - window.scrollY;

    soul.style.transform = `translate3d(${displayX - 12}px, ${displayY - 12}px, 0)`;

    illuminateChars();
    requestAnimationFrame(animateSoul);
}

animateSoul();

/* =========================
   文字照射
========================= */
function illuminateChars() {
    const len = cachedCharPositions.length;
    if (len === 0 || !hasMoved) return; 
    
    for (let i = 0; i < len; i++) {
        const charData = cachedCharPositions[i];
        
        // 人魂の絶対座標（soulX, soulY）と文字の絶対座標をガチンコ比較
        const dx = charData.cx - soulX;
        const dy = charData.cy - soulY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < 6400) { 
            charData.element.classList.add("lit");
        } else {
            charData.element.classList.remove("lit");
        }
    }
}
