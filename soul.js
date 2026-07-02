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
            // サロゲートペア（特殊文字）にも安全な分割
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

// ページ全体の絶対座標としてのマウス位置（スクロール分を足す）
let pageMouseX = mouseX;
let pageMouseY = mouseY;

let soulX = mouseX;
let soulY = mouseY;

document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // マウスが動いた時点での、ページ全体に対する座標を計算
    pageMouseX = mouseX + window.scrollX;
    pageMouseY = mouseY + window.scrollY;
});

// 文字の座標を事前にキャッシュする配列
let cachedCharPositions = [];

function cachePositions() {
    cachedCharPositions = chars.map(char => {
        const rect = char.getBoundingClientRect();
        return {
            element: char,
            // 💡 画面（ビューポート）ではなく、ページ全体（ドキュメント）に対する絶対中心座標を記録！
            cx: rect.left + rect.width / 2 + window.scrollX,
            cy: rect.top + rect.height / 2 + window.scrollY
        };
    });
}

// 💡 スクロールイベントでの cachePositions 連発は削除！リサイズ時だけで十分。
setTimeout(cachePositions, 500);
window.addEventListener("resize", cachePositions);


function animateSoul() {
    // 💡 画面基準ではなく、ページ全体のターゲット（pageMouse）を追従する
    // スクロールが止まっていても、スクロール中であっても、これで人魂の位置がページに固定される
    const targetX = mouseX + window.scrollX;
    const targetY = mouseY + window.scrollY;

    soulX += (targetX - soulX) * 0.18;
    soulY += (targetY - soulY) * 0.18;

    // 💡 人魂自体が「position: fixed」なら画面基準に戻す必要があるし、
    // 「position: absolute」ならそのまま soulX/Y を使える。
    // ここでは、人魂が「position: fixed」として動いている前提で、画面に対する座標に変換して描画するね。
    const renderX = soulX - window.scrollX;
    const renderY = soulY - window.scrollY;

    soul.style.transform = `translate3d(${renderX - 12}px, ${renderY - 12}px, 0)`;

    illuminateChars();

    requestAnimationFrame(animateSoul);
}

animateSoul();

/* =========================
   文字照射（超軽量化版）
======================== */
function illuminateChars() {
    const len = cachedCharPositions.length;
    
    // 💡 soulX, soulY がページ絶対座標になったので、同じく絶対座標の cx, cy とそのまま比較できる
    for (let i = 0; i < len; i++) {
        const charData = cachedCharPositions[i];
        
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
