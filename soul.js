const soul = document.getElementById("soul");
const record = document.getElementById("recordText");
const sig = document.getElementById("sig");

/* =========================
   本文を1文字ずつ分解（改行・構造維持版）
========================= */

const chars = [];
let charIndex = 0;

// record（preタグ）の直下にある要素（pやhrなど）を1つずつループ処理する
const childNodes = Array.from(record.childNodes);

childNodes.forEach(node => {
    // もしテキストノード（直書きの文字や改行）だったら
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        // 空白や改行文字だけでない場合のみ処理
        if (text.trim() !== "") {
            const fragment = document.createDocumentFragment();
            [...text].forEach(ch => {
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
    // もし <p> タグなどの要素だったら、その中身の文字を分解する
    else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "HR") {
        const text = node.textContent;
        node.innerHTML = ""; // pタグの中身だけを空にする
        
        [...text].forEach(ch => {
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

const totalTime =
    chars.length * 35 + 2500;

setTimeout(() => {

    sig.style.opacity = "1";

}, totalTime);

/* =========================
   人魂追従
========================= */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let soulX = mouseX;
let soulY = mouseY;

document.addEventListener("mousemove", e => {

    mouseX = e.clientX;
    mouseY = e.clientY;

});

/* =========================
   アニメーション
========================= */

function animateSoul(){

    soulX += (mouseX - soulX) * 0.18;
    soulY += (mouseY - soulY) * 0.18;

    soul.style.left = soulX + "px";
    soul.style.top  = soulY + "px";

    illuminateChars();

    requestAnimationFrame(animateSoul);
}

animateSoul();

/* =========================
   文字照射
========================= */

function illuminateChars(){

    chars.forEach(char => {

        const rect = char.getBoundingClientRect();

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = cx - soulX;
        const dy = cy - soulY;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if(distance < 80){

            char.classList.add("lit");

        }else{

            char.classList.remove("lit");

        }
    });
}
