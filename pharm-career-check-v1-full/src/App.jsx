import React from "react";

export default function App() {
  return (
    <main>
      {/* ヘッダー（安全に表示） */}
      <header className="header">
        <strong>Pharm Career Check</strong>
        <span style={{ color: "var(--subtext)" }}>β</span>
      </header>

      {/* ヒーロー */}
      <section className="hero">
        <h1>薬学部キャリア診断</h1>
        <p>20問に答えるだけで、あなたに合った薬剤師の仕事を診断！</p>

        <div className="cta">
          <button className="button primary" onClick={() => scrollToForm()}>
            診断を始める
          </button>
          <a className="button" href="#how">使い方</a>
        </div>

        {/* キャラ２体（/public/images） */}
        <div className="characters" aria-hidden="true">
          <img
            className="character"
            src="/images/char-male.png"
            alt=""
            loading="lazy"
          />
          <img
            className="character"
            src="/images/char-female.png"
            alt=""
            loading="lazy"
            style={{ position: "absolute", right: "5%", bottom: "0", maxWidth: "42%" }}
          />
        </div>
      </section>

      {/* ３つのメリットカード（例） */}
      <section className="grid" id="how">
        <article className="card">
          <h3>結果はグラフィックで</h3>
          <p>レーダーチャート＋Top3マッチ率で一目でわかる！</p>
        </article>
        <article className="card">
          <h3>学生でもわかる</h3>
          <p>専門用語は最小限。直感でスイスイ答えられる設計。</p>
        </article>
        <article className="card">
          <h3>学内イベントでも活用</h3>
          <p>QR配布OK。診断後にLPへ誘導して告知・応募に繋げる。</p>
        </article>
      </section>

      {/* ↓ 実際の診断フォームへ繋ぐ（今のアプリの診断へスクロールなど） */}
      <div id="form-anchor" style={{ height: "24px" }} />
    </main>
  );
}

function scrollToForm() {
  const el = document.querySelector("#form-anchor");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
