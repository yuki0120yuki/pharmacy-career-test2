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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Result({ roles, scores, onRestart, onRetake }) {
  const enriched = roles
    .map((r) => ({ ...r, score: scores[r.key] ?? 0 }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  const top3 = enriched.slice(0, 3);

  const data = {
    labels: roles.map((r) => r.label),
    datasets: [
      {
        label: "マッチ率（%）",
        data: roles.map((r) => scores[r.key] ?? 0),
        backgroundColor: ["#60a5fa","#34d399","#f59e0b","#f472b6","#94a3b8","#a3e635","#f97316","#22d3ee","#c084fc","#38bdf8"],
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0 }}>診断結果</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn outline" onClick={onRetake}>もう一度診断</button>
          <button className="btn" onClick={onRestart}>LPへ</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Bar data={data} options={options} />
      </div>

      <div className="result-grid" style={{ marginTop: 16 }}>
        {top3.map((r, i) => {
          // ★デバッグ：どのカードでも絶対にこの画像を表示
          const src = "/images/pharmacist_community.png";
          return (
            <div key={r.key} className="card"
              style={{ overflow: "hidden", display: "grid", gridTemplateColumns: "80px 1fr", gap: 14, alignItems: "center" }}>
              <div style={{ width: 80, height: 64, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,.04)",
                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={src} alt={r.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>第{i + 1}位</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: 18 }}>{r.label}</strong>
                  <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 0.3 }}>
                    {Math.round(r.score ?? 0)}%
                  </span>
                </div>
                <p style={{ marginTop: 6, lineHeight: 1.6, fontSize: 14 }}>（デバッグ表示）</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
