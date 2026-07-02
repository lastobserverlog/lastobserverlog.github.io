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

// 💡 スクロールした瞬間に、ブラウザの描画を待たずに即座に人魂の位置をズラすための仕掛け
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const diffY = currentScrollY - lastScrollY;
    
    // スクロールされた量だけ、人魂の「画面上の現在地」を即座に逆方向に相殺する
    // これによって文字がスクロールで上に動いた瞬間、人魂も物理的に画面上で同時に動く
    soulY -= diffY; 
    
    // transformを即座に更新して、描画遅延（置いていかれ現象）を強制的に潰す
    soul.style.transform = `translate3d(${soulX - 12}px, ${soulY - 12}px, 0)`;
    
    lastScrollY = currentScrollY;
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
            cx: rect.left + w / 2,
            cy: rect.top + h / 2,
            initialScrollX: currentX,
            initialScrollY: currentY
        };
    });
    // スクロール基準点を最新の状態にリセット
    lastScrollY = currentY;
}

const cacheDelay = Math.max(2500, totalTime - 1000);
setTimeout(cachePositions, cacheDelay);
window.addEventListener("resize", cachePositions);


function animateSoul() {
    // 通常のマウス移動に対するねっとり追従（0.18）
    soulX += (mouseX - soulX) * 0.18;
    soulY += (mouseY - soulY) * 0.18;

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
    if (len === 0) return; 

    const currentScrollX = window.scrollX;
    const currentScrollY = window.scrollY;
    
    for (let i = 0; i < len; i++) {
        const charData = cachedCharPositions[i];
        
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
