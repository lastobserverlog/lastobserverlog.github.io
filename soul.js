const soul = document.getElementById("soul");
const record = document.getElementById("recordText");
const sig = document.getElementById("sig");

/* =========================
   本文を1文字ずつ分解
========================= */

const originalText = record.textContent;

record.innerHTML = "";

const chars = [];

[...originalText].forEach((ch, i) => {

    const span = document.createElement("span");

    span.className = "char";
    span.textContent = ch;

    span.style.animationDelay = `${i * 0.035}s`;

    record.appendChild(span);

    chars.push(span);
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
