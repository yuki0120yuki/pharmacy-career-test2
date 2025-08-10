// src/components/Result.jsx
import React, { useMemo } from "react";

const ROLE_ORDER = [
  "community",  // 薬局薬剤師（調剤薬局）
  "drugstore",  // ドラッグ/店舗運営・管理
  "homecare",   // 在宅/訪問
  "hospital",   // 病院薬剤師
  "ma_mr",      // MA/MR
  "clinical",   // 臨床志向
  "research",   // 研究志向
  "education",  // 教育志向
  "startup",    // 起業志向
  "speed"       // スピード
];

// 役割ごとの表示名マップ（既存に合わせて調整）
const ROLE_LABEL = {
  community: "薬局薬剤師（調剤薬局）",
  drugstore: "ドラッグ/店舗運営・管理",
  homecare: "在宅/訪問薬剤師",
  hospital: "病院薬剤師",
  ma_mr: "MA/MR（メディカル）",
  clinical: "臨床志向",
  research: "研究志向",
  education: "教育志向",
  startup: "起業志向",
  speed: "スピード",
};

// 役割アイコン（画像が無いものは絵文字）
const ROLE_ICON = {
  community: "/images/pharmacist_community.png",
  drugstore: "🛍️",
  homecare: "🏠",
  hospital: "🏥",
  ma_mr: "📊",
  clinical: "🧪",
  research: "🔬",
  education: "📚",
  startup: "🚀",
  speed: "⚡",
};

export default function Result({ nickname, scores, onRestart }) {
  // 上位3つ
  const top3 = useMemo(() => {
    const entries = Object.entries(scores || {});
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 3);
  }, [scores]);

  return (
    <div className="container" style={{ padding: "24px 20px 40px" }}>
      <div className="row" style={{ alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>
          {nickname ? `${nickname}さんの診断結果` : "診断結果"}
        </h2>
        <div style={{ flex: 1 }} />
        <button className="btn outline" onClick={onRestart}>
          もう一度診断する
        </button>
      </div>

      {/* 上位3カード */}
      <div className="row" style={{ marginTop: 16 }}>
        {top3.map(([key, pct]) => (
          <div className="card" key={key} style={{ minWidth: 260 }}>
            <div className="lead" style={{ marginBottom: 8 }}>
              {ROLE_LABEL[key] ?? key}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{pct}%</div>
            <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
              {ROLE_ICON[key]?.startsWith("/images/") ? (
                <img
                  src={ROLE_ICON[key]}
                  alt=""
                  width={72}
                  height={72}
                  style={{ borderRadius: 12, objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 40 }}>{ROLE_ICON[key] ?? "💊"}</span>
              )}
              <p style={{ margin: 0, opacity: .9 }}>
                {/* 簡単な説明（必要なら役割ごとに丁寧に書く） */}
                あなたの強みが活きやすい領域です。詳細は学校/企業の先輩に話を聞いてみよう。
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 次の一歩 */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="lead">次の一歩</div>
        <ul style={{ margin: "8px 0 0 16px", opacity: .9 }}>
          <li>気になる職種のOB/OGに話を聞いてみる</li>
          <li>実習や研究室選びを「適性軸」で見直す</li>
          <li>在宅/病院見学や企業セミナーに申込み</li>
        </ul>
      </div>
    </div>
  );
}
