:root{
  --bg: #0f1220;
  --panel: rgba(255,255,255,.08);
  --glass: rgba(255,255,255,.12);
  --txt: #ffffff;
  --muted: rgba(255,255,255,.78);
  --accent: #7BD6F6;
  --accent2:#FF7ACB;

  /* モバイル向けサイズ・高さ */
  --container-w: min(1100px, 95%);
  --section-gap: clamp(16px, 3vw, 32px);
  --chart-h: clamp(240px, 64vw, 380px); /* 画面幅に応じて可変 */
  --tap: 14px; /* セーフエリア/Tap補助 */
}

*{box-sizing:border-box}
html,body,#root{height:100%}
html{ -webkit-text-size-adjust: 100%; }

body{
  margin:0;
  background:
    radial-gradient(1200px 600px at 70% -10%, #233, transparent),
    radial-gradient(1000px 500px at -10% 10%, #182235, transparent),
    var(--bg);
  color:var(--txt);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;

  /* iOSのタップ反応改善 */
  -webkit-tap-highlight-color: rgba(255,255,255,.08);
}

.container{
  min-height:100%;
  display:flex; flex-direction:column;
  gap:var(--section-gap);
  padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
}

/* 共通ボタン */
.btn{
  padding:12px 18px;
  border-radius:12px; border:none;
  color:#000; background:#fff;
  cursor:pointer; font-weight:700;
  touch-action: manipulation;
}
.btn:active{ transform: translateY(1px); }
.btn-lg{ padding:14px 22px; font-size:18px }
.btn-primary{ background:linear-gradient(135deg, var(--accent2), var(--accent)); color:#111 }
.btn.ghost{ background:transparent; border:1px solid rgba(255,255,255,.3); color:#fff }

/* LP */
.section{ width: var(--container-w); margin: 0 auto; }
.landing .hero{ text-align:center; margin: 24px 0 8px; }
.landing .hero h1{ font-size: clamp(26px, 5.5vw, 44px); margin: 0 0 8px; }
.landing .hero .accent{ color:var(--accent) }
.lead{ opacity:.9; max-width:760px; margin:8px auto 16px; line-height:1.7; font-size: clamp(15px, 3.8vw, 18px); }
.cta-row{ display:flex; gap:12px; justify-content:center; align-items:center; flex-wrap:wrap }
.sub{ opacity:.85; font-size: clamp(12px, 3.3vw, 14px); }

.cards{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:12px; margin: 16px 0 6px;
}
.card{ padding:16px 14px; border-radius:14px; background:var(--panel); border:1px solid rgba(255,255,255,.08) }
.card h3{ margin:0 0 6px; font-size: clamp(16px, 4.4vw, 18px); }
.card p{ margin:0; color:var(--muted); font-size: clamp(13px, 3.6vw, 15px); }
.card.glass{ background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.06)); backdrop-filter: blur(8px) }

.flow{ display:flex; justify-content:center; align-items:center; gap:16px; margin:8px 0 18px }
.step{ display:flex; align-items:center; gap:10px; opacity:.9; font-size: clamp(14px, 3.8vw, 16px) }
.badge{ width:28px; height:28px; border-radius:999px; display:grid; place-items:center; background:linear-gradient(135deg, var(--accent2), var(--accent)); color:#000; font-weight:800 }

/* クイズ */
.quiz .progress{ height:8px; background:rgba(255,255,255,.08); border-radius:999px; overflow:hidden; margin: 6px 0 12px }
.quiz .bar{ height:100%; background:linear-gradient(135deg, var(--accent2), var(--accent)) }

.qbox{ background:var(--panel); border:1px solid rgba(255,255,255,.1); border-radius:14px; padding:14px; }
.qhead .qcount{
  font-size: 12px; opacity:.8; background: rgba(255,255,255,.08);
  padding:6px 10px; border-radius:999px; display:inline-block;
}
.qhead h2{ margin:8px 0 0; font-size: clamp(18px, 5.2vw, 24px); line-height:1.5; }

/* 選択肢：指1本で押しやすい大きさ & 片手可 */
.choices{
  display:grid;
  grid-template-columns: 1fr;
  gap:10px; margin:14px 0;
}
.choice{
  padding:14px 16px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.18);
  background:rgba(255,255,255,.06);
  color:#fff; cursor:pointer; text-align:left;
  font-size: clamp(14px, 4.4vw, 16px);
  touch-action: manipulation;
}
.choice:active{ transform: translateY(1px); }
.choice.active{
  background:linear-gradient(135deg, rgba(255,122,203,.35), rgba(123,214,246,.35));
  border-color: rgba(255,255,255,.4);
}

/* ナビ：スマホは下部固定で大きなタップ領域 */
.nav{
  display:flex; justify-content:space-between; gap:10px;
  margin-top: 10px;
}
.nav.nav-mobile{
  position: sticky;
  bottom: calc(0px + env(safe-area-inset-bottom));
  background: color-mix(in oklab, black 20%, transparent);
  backdrop-filter: blur(10px);
  padding: 8px;
  border-radius: 12px;
}

/* 結果 */
.results .res-header{ text-align:center; margin: 6px 0 10px }
.chart-wrap{ padding:10px; border-radius:14px; }
.glass{ background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.05)); border:1px solid rgba(255,255,255,.12); backdrop-filter: blur(8px) }

/* レーダーチャートの高さを端末幅に連動させる */
.chart-wrap .recharts-responsive-container{
  height: var(--chart-h) !important;
}

.top-cards{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:12px; margin:12px 0;
}
.card.role{ position:relative; overflow:hidden; padding:14px }
.role-title{ font-weight:800; margin-top:4px; font-size: clamp(15px, 4.2vw, 18px); }
.score{ font-size: clamp(18px, 5vw, 26px); font-weight:900; color:var(--accent); margin:2px 0 }
.role-desc{ opacity:.9; font-size: clamp(13px, 3.6vw, 15px); }

/* 次の一歩 */
.next-steps{ padding:14px; border-radius:14px; margin-top:8px }
.next-steps h3{ margin:0 0 6px; font-size: clamp(16px, 4.5vw, 18px); }
.next-steps ul{ margin:6px 0; padding-left:18px; line-height:1.9; font-size: clamp(13px, 3.6vw, 15px); }

/* フッター */
.footer{
  width: var(--container-w);
  margin: 4px auto 24px;
  opacity:.75; display:flex; gap:10px; align-items:center;
  font-size: 13px;
}
.footer .dot{ opacity:.4 }

/* デコ */
.deco{ position:absolute; pointer-events:none; opacity:.35; filter:blur(.3px) }
.pill-1{ top:70px; left:60px; transform:rotate(-15deg) }
.pill-2{ top:180px; right:80px; transform:rotate(10deg) }
.pill-3{ top:140px; right:140px; transform:rotate(15deg) }
.flask-1{ top:430px; left:-10px }
.flask-2{ top:360px; right:-8px }

/* レスポンシブ調整 */
@media (max-width: 960px){
  .cards, .top-cards{ grid-template-columns: 1fr; }
  .landing .hero{ margin-top: 12px; }
  .cta-bottom{ margin-bottom: 4px; }
}

@media (max-width: 520px){
  .container{ gap: 18px; }
  .qbox{ padding: 12px; }
  .choice{ padding: 14px; }
  .nav.nav-mobile{ padding: 8px; }
}

/* アニメ苦手な人に配慮 */
@media (prefers-reduced-motion: reduce){
  *{ animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
}
