/* =========================
   LAST OBSERVER FX
========================= */

/* 主魂火 */
const glow = document.createElement('div');
glow.className = 'cursor-glow';

/* 副魂火 */
const glow2 = document.createElement('div');
glow2.className = 'cursor-glow secondary';

/* 月 */
const moon = document.createElement('div');
moon.className = 'moon';

document.body.appendChild(moon);
document.body.appendChild(glow);
document.body.appendChild(glow2);

/* 座標 */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let x1 = mouseX;
let y1 = mouseY;

let x2 = mouseX;
let y2 = mouseY;

/* PC */

document.addEventListener('mousemove', e => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    parallax(e.clientX, e.clientY);
});

/* mobile */

document.addEventListener('touchmove', e => {

    const t = e.touches[0];

    mouseX = t.clientX;
    mouseY = t.clientY;

    parallax(t.clientX, t.clientY);

}, { passive:true });

/* 慣性 */

function animate(){

    x1 += (mouseX - x1) * .18;
    y1 += (mouseY - y1) * .18;

    x2 += (mouseX - x2) * .08;
    y2 += (mouseY - y2) * .08;

    glow.style.left = x1 + 'px';
    glow.style.top = y1 + 'px';

    glow2.style.left = x2 + 'px';
    glow2.style.top = y2 + 'px';

    requestAnimationFrame(animate);
}

animate();

/* パララックス */

function parallax(mx,my){

    const wrap =
        document.querySelector('.glass-wrap');

    if(!wrap) return;

    const cx =
        window.innerWidth / 2;

    const cy =
        window.innerHeight / 2;

    const dx =
        (mx - cx) / cx;

    const dy =
        (my - cy) / cy;

    wrap.style.transform =
        `rotateY(${dx*2}deg)
         rotateX(${-dy*2}deg)
         translateZ(0)`;
}
