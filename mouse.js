const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);

document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
});
