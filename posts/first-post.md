```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Glass Mouse Follow</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    height:100vh;
    overflow:hidden;
    font-family:sans-serif;

    /* 背景 */
    background:
        radial-gradient(circle at top left,#1d2b64,#0f172a 60%),
        linear-gradient(135deg,#111827,#020617);

    display:flex;
    justify-content:center;
    align-items:center;
}

/* マウス追従する白球 */
.cursor-glow{
    position:fixed;
    width:300px;
    height:300px;
    border-radius:50%;
    pointer-events:none;
    z-index:0;

    background:
        radial-gradient(
            circle,
            rgba(255,255,255,.55) 0%,
            rgba(255,255,255,.22) 35%,
            rgba(255,255,255,0) 72%
        );

    filter:blur(30px);
    transform:translate(-50%,-50%);
    transition:
        left .08s linear,
        top .08s linear;
}

/* すりガラス */
.glass-card{
    position:relative;
    z-index:2;

    width:700px;
    padding:50px;
    border-radius:30px;

    background:rgba(255,255,255,.08);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);

    border:1px solid rgba(255,255,255,.15);

    box-shadow:
        0 8px 32px rgba(0,0,0,.35),
        inset 0 1px 0 rgba(255,255,255,.12);
}

.glass-card h1{
    color:white;
    font-size:52px;
    margin-bottom:16px;
    font-weight:700;
}

.glass-card p{
    color:rgba(255,255,255,.72);
    line-height:1.8;
    font-size:17px;
}

.button{
    display:inline-block;
    margin-top:30px;
    padding:14px 26px;

    border-radius:999px;
    text-decoration:none;

    background:rgba(255,255,255,.12);
    border:1px solid rgba(255,255,255,.18);

    color:white;

    backdrop-filter:blur(12px);

    transition:.25s;
}

.button:hover{
    transform:translateY(-2px);
    background:rgba(255,255,255,.2);
    box-shadow:0 0 24px rgba(255,255,255,.18);
}

</style>
</head>

<body>

<div class="cursor-glow"></div>

<div class="glass-card">
    <h1>Glass UI</h1>
    <p>
        すりガラスの背後を、白い光球が静かに追従するデザイン。
        派手というより「空気が動く」感じの演出。
    </p>

    <a href="#" class="button">
        Explore
    </a>
</div>

<script>

const glow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
});

</script>

</body>
</html>
```
