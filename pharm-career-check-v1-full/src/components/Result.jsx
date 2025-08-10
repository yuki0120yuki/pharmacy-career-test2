import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * 画像マッピング（public/images/ 配下）
 * 無い場合は hero-illustration.svg にフォールバック
 */
const careerImages = {
  "薬局薬剤師（調剤薬局）": "/images/pharmacist_community.png",
  "ドラッグ/店舗運営・管理": "/images/drugstore.png",
  "在宅/訪問薬剤師": "/images/homecare.png",
  "病院薬剤師": "/images/hospital.png",
  "企業（研究/開発）": "/images/company_rnd.png",
  "企業（学術/薬事）": "/images/company_reg.png",
  "MR/MS": "/images/mr.png",
  "治験コーディネーター（CRC）": "/images/crc.png",
  "行政/公務員": "/images/government.png",
  "教育・研究": "/images/academia.png",
};

/** 簡易説明（必要に応じて調整OK） */
const roleDescriptions = {
  "薬局薬剤師（調剤薬局）":
    "生活に近い現場で継続支援。OTC/在宅/健康相談まで幅広く。",
  "ドラッグ/店舗運営・管理":
    "数字を見て改善・マネジメント。スピードと統率力が鍵。",
  "在宅/訪問薬剤師":
    "地域・患者さんに長期並走。連携力とコミュ力が活きる領域。",
  "病院薬剤師":
    "チーム医療の中心で高度な薬学・安全管理。探究心も活きる。",
  "企業（研究/開発）":
    "新薬や製品の価値を作る。仮説検証と継続的な探究が好きな人に。",
  "企業（学術/薬事）":
    "エビデンスを整理して価値を届ける裏方の要。精密さと責任感。",
  "MR/MS": "情報の橋渡し役。提案力・信頼構築力・継続力が武器。",
  "治験コーディネーター（CRC）":
    "臨床試験の現場を前に進める推進役。調整力と丁寧さが肝。",
  "行政/公務員": "地域全体の安全とルールづくり。俯瞰力と誠実さ。",
  "教育・研究": "後進育成と研究推進。伝える力・探究心が要。",
};

export default function Result({ roles, scores, onRestart, onRetake }) {
  // スコア付きに整形 → 降順 → 上位3件
  const enriched = roles
    .map((r) => ({ ...r, score: scores[r.key] ?? 0 }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const top3 = enriched.slice(0, 3);

  // バーチャート用データ
  const data = {
    labels: roles.map((r) => r.label),
    datasets: [
      {
        label: "マッチ率（%）",
        data: roles.map((r) => scores[r.key] ?? 0),
        backgroundColor: [
          "#60a5fa",
          "#34d399",
          "#f59e0b",
          "#f472b6",
          "#94a3b8",
          "#a3e635",
          "#f97316",
          "#22d3ee",
          "#c084fc",
          "#38bdf8",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { suggestedMax: 100, ticks: { stepSize: 20 } } },
  };

  return (
    <div className="container" style={{ padding: "24px 20px 40px" }}>
      {/* ヘッダー＋操作ボタン */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h2 style={{ margin: 0 }}>診断結果</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn outline" onClick={onRetake}>
            もう一度診断
          </button>
          <button className="btn" onClick={onRestart}>
            LPへ
          </button>
        </div>
      </div>

      {/* チャート */}
      <div style={{ marginTop: 16 }}>
        <Bar data={data} options={options} />
      </div>

      {/* 上位3カード（画像付き） */}
      <div className="result-grid" style={{ marginTop: 16 }}>
        {top3.map((r, i) => {
          const src =
            careerImages[r.label] || "/images/hero-illustration.svg";
          const desc =
            roleDescriptions[r.label] || "この職種にはあなたの強みが活きます。";

          return (
            <motion.div
              key={r.key}
              className="card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              style={{
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 14,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 64,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "rgba(255,255,255,.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* public 配下は絶対パスでOK */}
                <img
                  src={src}
                  alt={r.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/images/hero-illustration.svg";
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.7,
                    marginBottom: 4,
                  }}
                >
                  第{i + 1}位
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ fontSize: 18 }}>{r.label}</strong>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: 0.3,
                    }}
                  >
                    {Math.round(r.score ?? 0)}%
                  </span>
                </div>
                <p style={{ marginTop: 6, lineHeight: 1.6, fontSize: 14 }}>
                  {desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 次の一歩 */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>次の一歩</h3>
        <ul style={{ margin: "8px 0 0 18px", lineHeight: 1.8 }}>
          <li>気になる領域のOB/OGに話を聞いてみる</li>
          <li>実習や研究室選び/座学単位の見直し</li>
          <li>在宅/病院見学や企業セミナーに申込み</li>
        </ul>
      </div>
    </div>
  );
}
