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

let soulX = mouseX;
let soulY = mouseY;

document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 文字の座標を事前にキャッシュする配列
let cachedCharPositions = [];

// 画面のリサイズやスクロール時に文字の位置を再計算する関数
function cachePositions() {
    cachedCharPositions = chars.map(char => {
        const rect = char.getBoundingClientRect();
        return {
            element: char,
            // 画面（ビューポート）に対する静的な中心座標を記録
            cx: rect.left + rect.width / 2,
            cy: rect.top + rect.height / 2
        };
    });
}

// 最初のタイピングアニメーションが終わる頃、または初期化時にキャッシュを作る
// ※最初の段階で位置を取ると、アニメーション中のズレた位置を拾うため、少し遅らせるのがコツ
setTimeout(cachePositions, 500);

// ウィンドウのサイズが変わったら位置がズレるので再キャッシュ
window.addEventListener("resize", cachePositions);
window.addEventListener("scroll", cachePositions, { passive: true });


function animateSoul() {
    // 追従ロジック（0.18のままでOK、ねっとり感を出したければ0.08〜0.1あたりに落としてもいい）
    soulX += (mouseX - soulX) * 0.18;
    soulY += (mouseY - soulY) * 0.18;

    // ★重要: left/top ではなく transform3d を使う。圧倒的に軽い。
    // 人魂のサイズ（24px）の半分（12px）をここで引いて、中心がカーソルに合うようにする。
    soul.style.transform = `translate3d(${soulX - 12}px, ${soulY - 12}px, 0)`;

    illuminateChars();

    requestAnimationFrame(animateSoul);
}

animateSoul();

/* =========================
   文字照射（超軽量化版）
========================= */
function illuminateChars() {
    // 毎回 getBoundingClientRect を呼ばず、キャッシュした配列を回す
    const len = cachedCharPositions.length;
    
    // パフォーマンス最優先のため、通常のforEachより高速なforループを採用
    for (let i = 0; i < len; i++) {
        const charData = cachedCharPositions[i];
        
        const dx = charData.cx - soulX;
        const dy = charData.cy - soulY;

        // 重い Math.sqrt（平方根）を排除
        // 距離が80未満かどうかは、2乗同士の比較（dx*dx + dy*dy < 80*80）で判定できる
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < 6400) { // 80 の 2乗 = 6400
            charData.element.classList.add("lit");
        } else {
            charData.element.classList.remove("lit");
        }
    }
}
