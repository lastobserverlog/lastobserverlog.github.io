const soul = document.getElementById("soul");
const record = document.getElementById("recordText");
const sig = document.getElementById("sig");

// 初期状態は人魂を透明にしておく（左上の映り込み対策）
if (soul) {
    soul.style.opacity = "0";
    // CSS側にもtransitionが入っているが、念のためここでも設定
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
    // clientX/Y を使うことで、画面基準の座標を取得
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // 最初にマウスが動いた瞬間に人魂をふわっと表示させる
    if (!hasMoved && soul) {
        soul.style.opacity = "1";
        hasMoved = true;
    }
});

// スクロール時の余計な計算を削除し、明滅判定だけを行う
window.addEventListener("scroll", () => {
    // ここで座標を再キャッシュする必要はない。
    // animateSoul()のループ内で、最新の画面内座標を使って比較するため。
    illuminateChars();
}, { passive: true });

function animateSoul() {
    if (!soul) return;

    // 通常時のねっとり追従（常にclientX/Yを目指す）
    soulX += (mouseX - soulX) * 0.18;
    soulY += (mouseY - soulY) * 0.18;

    // 人魂の中心をカーソルに合わせる
    soul.style.transform = `translate3d(${soulX - 12}px, ${soulY - 12}px, 0)`;

    // 💡 ★このループ内で毎フレーム明滅判定を呼び出す
    illuminateChars();
    requestAnimationFrame(animateSoul);
}

// ループ開始
animateSoul();


/* =========================
   文字照射（画面基準・軽量版）
========================= */
// 💡 ★この関数を大幅に修正
function illuminateChars() {
    if (!hasMoved) return; // マウスが一度も動いていないなら判定しない

    // 画面内にある`.char`要素だけを対象にする（パフォーマンス対策）
    const len = chars.length;
    
    for (let i = 0; i < len; i++) {
        const charElement = chars[i];
        
        // 💡 毎フレーム、文字の最新の「画面基準の座標」を取得
        // これにより、スクロールされても自動的に座標が更新される
        const rect = charElement.getBoundingClientRect();
        
        // 画面外（上下）にある文字は判定をスキップして高速化
        if (rect.top > window.innerHeight || rect.bottom < 0) {
            charElement.classList.remove("lit");
            continue;
        }

        const charCX = rect.left + rect.width / 2;
        const charCY = rect.top + rect.height / 2;
        
        // 人魂の「画面基準の座標（soulX, soulY）」と比較
        const dx = charCX - soulX;
        const dy = charCY - soulY;

        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < 6400) { // 範囲の広さ（80pxの2乗）
            charElement.classList.add("lit");
        } else {
            charElement.classList.remove("lit");
        }
    }
}
