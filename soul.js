const soul = document.getElementById("soul");
const record = document.getElementById("recordText");
const sig = document.getElementById("sig");

// 初期状態は人魂を透明にしておく（左上の映り込み対策）
if (soul) {
    soul.style.opacity = "0";
    soul.style.transition = "opacity 0.4s ease";
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
// 最初は画面中央をターゲットにしておく
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let soulX = mouseX;
let soulY = mouseY;
let hasMoved = false; // マウスが動いたかどうかのフラグ

document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // 💡 最初にマウスが動いた瞬間に人魂をふわっと表示させる
    if (!hasMoved && soul) {
        soul.style.opacity = "1";
        hasMoved = true;
    }
});

window.addEventListener("scroll", () => {
    // 💡 position: fixed なので座標の引き算は不要。文字の明滅判定だけを強制実行
    illuminateChars();
}, { passive: true });

// 文字の座標を事前にキャッシュする配列
let cachedCharPositions = [];

function cachePositions() {
    const currentX = window.scrollX;
    const currentY = window.scrollY;

    cachedCharPositions = chars.map(char => {
        const rect = char.getBoundingClientRect();
        const w = rect.width || 18; 
        const h = rect.height || 21; 

        return {
            element: char,
            // スクロール差分をあらかじめ吸収した「ドキュメント絶対座標」
            cx: rect.left + w / 2 + currentX,
            cy: rect.top + h / 2 + currentY
        };
    });
}

// 文字が長いため、開いてすぐに1回キャッシュを作る
setTimeout(cachePositions, 100); 
const cacheDelay = Math.max(2500, totalTime - 1000);
setTimeout(cachePositions, cacheDelay);

window.addEventListener("resize", cachePositions);


function animateSoul() {
    if (!soul) return;

    // 通常時のねっとり追従
    soulX += (mouseX - soulX) * 0.18;
    soulY += (mouseY - soulY) * 0.18;

    // 12px引くことで、24pxサイズの人魂の中心をカーソルに合わせる
    soul.style.transform = `translate3d(${soulX - 12}px, ${soulY - 12}px, 0)`;

    illuminateChars();
    requestAnimationFrame(animateSoul);
}

// ループ開始
animateSoul();


/* =========================
   文字照射（絶対座標比較版・軽量）
========================= */
function illuminateChars() {
    const len = cachedCharPositions.length;
    if (len === 0) return; 

    const currentScrollX = window.scrollX;
    const currentScrollY = window.scrollY;
    
    // 人魂の現在の「ドキュメント上の絶対座標」を算出
    const absoluteSoulX = soulX + currentScrollX;
    const absoluteSoulY = soulY + currentScrollY;
    
    for (let i = 0; i < len; i++) {
        const charData = cachedCharPositions[i];
        
        // 絶対座標同士で比較するから、スクロールの計算ズレが発生しない
        const dx = charData.cx - absoluteSoulX;
        const dy = charData.cy - absoluteSoulY;

        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < 6400) { // 範囲の広さ（80pxの2乗）
            charData.element.classList.add("lit");
        } else {
            charData.element.classList.remove("lit");
        }
    }
}
