import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

// ====== 職種メタ（画像ファイル名は public/images に置いたものと一致させます） ======
const ROLES = [
  { key: "hospital", label: "病院薬剤師", image: "pharmacist_hospital.png", color: "#7C8CFF" },
  { key: "community", label: "薬局薬剤師", image: "pharmacist_community.png", color: "#9BDB7C" },
  { key: "drugstore", label: "ドラッグストア", image: "pharmacist_drugstore.png", color: "#FFC66E" },
  { key: "company", label: "企業（開発/学術/安全性）", image: "pharmacist_company.png", color: "#6EDBFF" },
  { key: "mr", label: "MR", image: "pharmacist_mr.png", color: "#F9A6D1" },
  { key: "homecare", label: "在宅医療", image: "pharmacist_homecare.png", color: "#B0E4FF" },
  { key: "research", label: "研究職", image: "pharmacist_research.png", color: "#E6C0FF" },
  { key: "publichealth", label: "公衆衛生/行政", image: "pharmacist_publichealth.png", color: "#7CE9CB" },
  { key: "it", label: "医療IT/データ", image: "pharmacist_it.png", color: "#7CD7FF" },
  { key: "education", label: "教育/アカデミア", image: "pharmacist_education.png", color: "#FFD39B" },
];

// ====== 20問（例）: 各選択肢が複数職種に配点されます ======
// ポイントはざっくりです。あとで自由に調整OK（roles:[] に足す/weights変えるなど）
const QUESTIONS = [
  {
    q: "患者さんと向き合って、チームで治療に関わるのはワクワクする？",
    a: [
      { label: "はい", give: { hospital: 2, homecare: 1 } },
      { label: "いいえ", give: { company: 1, it: 1 } },
    ],
  },
  {
    q: "生活者の身近な相談相手として、日々の健康サポートをしたい",
    a: [
      { label: "はい", give: { community: 2, drugstore: 1 } },
      { label: "いいえ", give: { research: 1, mr: 1 } },
    ],
  },
  {
    q: "未知の領域をコツコツ調べて、仕組みに落とし込むのが得意",
    a: [
      { label: "はい", give: { research: 2, it: 1, company: 1 } },
      { label: "いいえ", give: { community: 1, hospital: 1 } },
    ],
  },
  {
    q: "数字やデータを見て仮説検証する作業は好き",
    a: [
      { label: "はい", give: { it: 2, research: 1, company: 1 } },
      { label: "いいえ", give: { community: 1, education: 1 } },
    ],
  },
  {
    q: "大勢の前で説明/発表するのはわりと平気",
    a: [
      { label: "はい", give: { education: 2, mr: 1, publichealth: 1 } },
      { label: "いいえ", give: { research: 1, hospital: 1 } },
    ],
  },
  {
    q: "新薬や製品の価値を相手に合わせて伝えるのが得意",
    a: [
      { label: "はい", give: { mr: 2, company: 1 } },
      { label: "いいえ", give: { hospital: 1, research: 1 } },
    ],
  },
  {
    q: "患者さんの生活背景まで踏み込んで支援したい",
    a: [
      { label: "はい", give: { homecare: 2, community: 1 } },
      { label: "いいえ", give: { research: 1, it: 1 } },
    ],
  },
  {
    q: "制度や仕組みを整え、社会全体を良くするのに興味がある",
    a: [
      { label: "はい", give: { publichealth: 2, education: 1 } },
      { label: "いいえ", give: { community: 1, drugstore: 1 } },
    ],
  },
  {
    q: "スピード感のある現場で、臨機応変に動くのが性に合う",
    a: [
      { label: "はい", give: { hospital: 1, drugstore: 2 } },
      { label: "いいえ", give: { research: 1, education: 1 } },
    ],
  },
  {
    q: "売場づくりやPOPなど、見せ方を考えるのも好き",
    a: [
      { label: "はい", give: { drugstore: 2, community: 1 } },
      { label: "いいえ", give: { research: 1, hospital: 1 } },
    ],
  },
  {
    q: "根拠を調べて“わかりやすく伝える”のが得意",
    a: [
      { label: "はい", give: { education: 1, mr: 1, company: 1 } },
      { label: "いいえ", give: { drugstore: 1, community: 1 } },
    ],
  },
  {
    q: "バイタルや検査値を読み、薬物治療計画を立てたい",
    a: [
      { label: "はい", give: { hospital: 2, research: 1 } },
      { label: "いいえ", give: { mr: 1, drugstore: 1 } },
    ],
  },
  {
    q: "現場の課題をデジタルで解決してみたい",
    a: [
      { label: "はい", give: { it: 2, company: 1 } },
      { label: "いいえ", give: { community: 1, hospital: 1 } },
    ],
  },
  {
    q: "薬事や安全性など、品質を守る役割に興味がある",
    a: [
      { label: "はい", give: { company: 2, publichealth: 1 } },
      { label: "いいえ", give: { education: 1, mr: 1 } },
    ],
  },
  {
    q: "教育・指導・研修など、人を育てることに関心がある",
    a: [
      { label: "はい", give: { education: 2, hospital: 1 } },
      { label: "いいえ", give: { it: 1, drugstore: 1 } },
    ],
  },
  {
    q: "臨床・製造・研究など、幅広く関わりたい",
    a: [
      { label: "はい", give: { company: 1, hospital: 1, research: 1 } },
      { label: "いいえ", give: { community: 1, drugstore: 1 } },
    ],
  },
  {
    q: "個別訪問（在宅）など、フィールドワークも苦にならない",
    a: [
      { label: "はい", give: { homecare: 2, mr: 1 } },
      { label: "いいえ", give: { it: 1, research: 1 } },
    ],
  },
  {
    q: "商品企画や売上管理など、事業観点で考えるのが好き",
    a: [
      { label: "はい", give: { drugstore: 1, company: 1 } },
      { label: "いいえ", give: { hospital: 1, research: 1 } },
    ],
  },
  {
    q: "全国/海外など、異動や出張もOKだと思う",
    a: [
      { label: "はい", give: { mr: 2, company: 1 } },
      { label: "いいえ", give: { community: 1, homecare: 1 } },
    ],
  },
  {
    q: "“仕組みを磨いて社会を良くする”にワクワクする",
    a: [
      { label: "はい", give: { publichealth: 1, it: 1, research: 1 } },
      { label: "いいえ", give: { community: 1, drugstore: 1 } },
    ],
  },
];

// 初期スコア
const initScores = () =>
  ROLES.reduce((acc, r) => {
    acc[r.key] = 0;
    return acc;
  }, {});

// シンプルなLPと診断フロー
export default function App() {
  const [step, setStep] = useState<"lp" | "quiz" | "result">("lp");
  const [i, setI] = useState(0);
  const [scores, setScores] = useState(initScores);

  // 回答→すぐ次の設問に進む
  const answer = (give) => {
    setScores((prev) => {
      const next = { ...prev };
      Object.entries(give).forEach(([k, v]) => {
        next[k] = (next[k] || 0) + v;
      });
      return next;
    });
    setI((v) => {
      const nx = v + 1;
      if (nx >= QUESTIONS.length) setStep("result");
      return nx;
    });
  };

  const sorted = useMemo(() => {
    return [...ROLES]
      .map((r) => ({ ...r, value: scores[r.key] || 0 }))
      .sort((a, b) => b.value - a.value);
  }, [scores]);

  const top3 = sorted.slice(0, 3);

  return (
    <div className="wrap">
      <AnimatePresence mode="wait">
        {step === "lp" && (
          <motion.section
            key="lp"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="section"
          >
            <Hero />
            <div className="cta-row">
              <button className="btn" onClick={() => setStep("quiz")}>
                診断を始める
              </button>
              <div className="mini">所要時間：1分／質問：20問</div>
            </div>

            <FeatureCards />
            <Flow3 />
          </motion.section>
        )}

        {step === "quiz" && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="section"
          >
            <div className="card quiz">
              <div className="quiz-head">
                <span className="pill">
                  Q{Math.min(i + 1, QUESTIONS.length)} / {QUESTIONS.length}
                </span>
                <h2 className="q">{QUESTIONS[i].q}</h2>
              </div>

              {/* 押した瞬間に次へ */}
              <div className="ans-grid">
                {QUESTIONS[i].a.map((opt, idx) => (
                  <button
                    key={idx}
                    className="ans"
                    onClick={() => answer(opt.give)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {step === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="section"
          >
            <h2 className="title">診断結果</h2>

            {/* 上位3職種（画像付きカード） */}
            <div className="top-grid">
              {top3.map((r, index) => (
                <ResultCard key={r.key} role={r} rank={index + 1} />
              ))}
            </div>

            {/* レーダーチャート（全体傾向） */}
            <div className="card">
              <h3 className="card-title">マッチの全体傾向</h3>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={sorted.map((r) => ({
                      subject: r.label,
                      value: r.value,
                    }))}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar
                      name="match"
                      dataKey="value"
                      stroke="#7C8CFF"
                      fill="#7C8CFF"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 棒グラフ（TOP10ランキング） */}
            <div className="card">
              <h3 className="card-title">職種別スコア</h3>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart
                    data={sorted.map((r) => ({
                      name: r.label,
                      value: r.value,
                    }))}
                    margin={{ top: 12, right: 12, left: 12, bottom: 32 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} height={60} />
                    <YAxis />
                    <Tooltip
                      formatter={(v) => [`${v}`, "スコア"]}
                      labelFormatter={(l) => `${l}`}
                    />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="cta-row">
              <button className="btn" onClick={() => window.location.reload()}>
                もう一度診断する
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================== パーツ ================== */

function Hero() {
  return (
    <div className="hero card">
      <h1 className="hero-title">薬学部キャリア診断</h1>
      <p className="lead">
        20問に答えるだけ。あなたに合った薬剤師の仕事をグラフィックで可視化。
      </p>
      <div className="hero-badges">
        <span className="pill">無料</span>
        <span className="pill">匿名</span>
        <span className="pill">1分で完了</span>
      </div>
    </div>
  );
}

function FeatureCards() {
  return (
    <div className="row">
      <div className="card">
        <h3 className="card-title">結果はグラフィックで</h3>
        <p>レーダーチャート＋Top3マッチで、強みがひと目でわかる。</p>
      </div>
      <div className="card">
        <h3 className="card-title">学生でもわかる</h3>
        <p>専門用語は最小限。直感でサクサク答えられる設計。</p>
      </div>
      <div className="card">
        <h3 className="card-title">学内イベントでも活用</h3>
        <p>QR配布OK。結果からLPに誘導して告知・応募に繋げられる。</p>
      </div>
    </div>
  );
}

function Flow3() {
  return (
    <div className="flow">
      <div className="step">
        <div className="num">1</div>
        <div>質問に回答</div>
      </div>
      <div className="step">
        <div className="num">2</div>
        <div>スコアを分析</div>
      </div>
      <div className="step">
        <div className="num">3</div>
        <div>結果を確認＆次の一歩</div>
      </div>
    </div>
  );
}

function ResultCard({ role, rank }) {
  const src = `/images/${role.image}`;
  return (
    <div className="result-card">
      <div className="rank">#{rank}</div>
      <div className="thumb">
        <img
          src={src}
          alt={role.label}
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder.png"; // 置かなければ自動で404→何も表示されないだけ
          }}
        />
      </div>
      <div className="info">
        <div className="role">{role.label}</div>
        <div className="score">スコア：{role.value}</div>
      </div>
    </div>
  );
}
