import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import QUESTIONS from "./data/questions";
import { ROLES, DIMENSIONS, ROLE_WEIGHTS } from "./data/roles";
import "./styles.css";

/* ============== 小さめSVGのデコ（背景でふわっと動く） ============== */
const Pill = (props) => (
  <svg viewBox="0 0 120 40" width={120} height={40} {...props}>
    <defs>
      <linearGradient id="g1" x1="0" x2="1">
        <stop offset="0%" stopColor="#FF7ACB" />
        <stop offset="100%" stopColor="#FEC260" />
      </linearGradient>
    </defs>
    <rect rx="20" ry="20" width="120" height="40" fill="url(#g1)" />
    <rect rx="20" ry="20" x="55" width="65" height="40" fill="#fff" opacity="0.9" />
  </svg>
);

const Flask = (props) => (
  <svg viewBox="0 0 80 100" width={80} height={100} {...props}>
    <defs>
      <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#7BD6F6" />
        <stop offset="100%" stopColor="#7DE7C3" />
      </linearGradient>
    </defs>
    <path d="M30 5h20v6l8 12v46c0 10-8 18-18 18s-18-8-18-18V23l8-12V5z" fill="url(#g2)" />
    <circle cx="40" cy="60" r="8" fill="#fff" opacity="0.9" />
  </svg>
);

/* ============== ユーティリティ ============== */
const clamp01 = (n) => Math.max(0, Math.min(1, n));

/* ============== LP ============== */
function Landing({ onStart }) {
  return (
    <motion.section
      className="section landing"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
    >
      <Pill className="deco pill pill-1" />
      <Pill className="deco pill pill-2" />
      <Flask className="deco flask flask-1" />

      <div className="hero">
        <motion.h1 layout>
          薬学部キャリア診断
          <span className="accent">（1分）</span>
        </motion.h1>
        <p className="lead">
          かんたんな質問に答えるだけ。あなたの強みから、10職種の中で
          <strong>相性が高いキャリア</strong>をレーダーチャートで可視化します。
        </p>
        <div className="cta-row">
          <button className="btn btn-primary" onClick={onStart}>
            診断を始める
          </button>
          <span className="sub">所要時間：1分／質問：24問</span>
        </div>
      </div>

      <div className="cards">
        <FeatureCard
          title="結果はグラフィックで"
          desc="レーダーチャート＋Top3マッチで、強みと向いている職種がひと目でわかる。"
        />
        <FeatureCard
          title="質問は学生向け"
          desc="専門用語は最小限。学校生活や性格に寄った質問なので直感で回答OK。"
        />
        <FeatureCard
          title="学内イベントでも使える"
          desc="QRで配布・無料で公開OK。診断後にLPへ誘導して企画の告知も。"
        />
      </div>

      <div className="flow">
        <Step n={1} t="質問に回答" />
        <Step n={2} t="スコアを分析" />
        <Step n={3} t="結果を確認＆次の一歩" />
      </div>

      <div className="cta-bottom">
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          今すぐ診断する
        </button>
      </div>
    </motion.section>
  );
}

const FeatureCard = ({ title, desc }) => (
  <motion.div className="card glass" whileHover={{ y: -4 }}>
    <h3>{title}</h3>
    <p>{desc}</p>
  </motion.div>
);
const Step = ({ n, t }) => (
  <div className="step">
    <div className="badge">{n}</div>
    <div>{t}</div>
  </div>
);

/* ============== 診断画面 ============== */
function Quiz({ onFinish }) {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState([]); // 0..4 の5段階

  const q = QUESTIONS[page];
  const percent = Math.round(((page + 1) / QUESTIONS.length) * 100);

  const setAns = (v) => {
    const next = [...answers];
    next[page] = v;
    setAnswers(next);
  };

  const next = () => {
    if (page < QUESTIONS.length - 1) setPage(page + 1);
    else onFinish(answers);
  };
  const back = () => page > 0 && setPage(page - 1);

  return (
    <motion.section
      className="section quiz"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
    >
      <div className="progress">
        <div className="bar" style={{ width: `${percent}%` }} />
      </div>

      <div className="qbox">
        <div className="qhead">
          <div className="qcount">
            Q{page + 1} / {QUESTIONS.length}
          </div>
          <h2>{q.text}</h2>
        </div>

        <div className="choices">
          {["全く違う", "やや違う", "どちらとも", "やや当てはまる", "とても当てはまる"].map(
            (label, i) => (
              <button
                key={i}
                className={`choice ${answers[page] === i ? "active" : ""}`}
                onClick={() => setAns(i)}
              >
                {label}
              </button>
            )
          )}
        </div>

        <div className="nav">
          <button className="btn ghost" onClick={back} disabled={page === 0}>
            戻る
          </button>
          <button
            className="btn btn-primary"
            onClick={next}
            disabled={answers[page] == null}
          >
            {page === QUESTIONS.length - 1 ? "結果を見る" : "次へ"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

/* ============== 結果画面 ============== */
function Results({ rawAnswers, onRetry, onBackLP }) {
  // 1) 質問→各適性軸(ディメンション)のスコア化（0..1）
  const dimScores = useMemo(() => {
    const sums = Object.fromEntries(DIMENSIONS.map((d) => [d, 0]));
    const counts = Object.fromEntries(DIMENSIONS.map((d) => [d, 0]));
    rawAnswers.forEach((a, i) => {
      const q = QUESTIONS[i];
      const v = [0, 0.25, 0.5, 0.75, 1][a]; // 5段階→0..1
      q.dimensions.forEach((d) => {
        sums[d] += v;
        counts[d] += 1;
      });
    });
    const avg = {};
    DIMENSIONS.forEach((d) => {
      avg[d] = counts[d] ? sums[d] / counts[d] : 0;
    });
    return avg;
  }, [rawAnswers]);

  // 2) ディメンション×重み→職種スコア(0..100)
  const roleScores = useMemo(() => {
    const out = ROLES.map((role) => {
      const w = ROLE_WEIGHTS[role.key]; // {dim: weight}
      let s = 0;
      let totalW = 0;
      DIMENSIONS.forEach((d) => {
        const ww = w[d] ?? 0;
        s += (dimScores[d] ?? 0) * ww;
        totalW += Math.abs(ww);
      });
      const normalized = totalW ? (s / totalW) * 100 : 0;
      return { key: role.key, name: role.name, score: Math.round(normalized) };
    });
    return out.sort((a, b) => b.score - a.score);
  }, [dimScores]);

  // 3) RadarChart用データ
  const chartData = DIMENSIONS.map((d) => ({
    axis: d,
    value: Math.round((clamp01(dimScores[d]) * 100)),
  }));

  const top3 = roleScores.slice(0, 3);

  return (
    <motion.section
      className="section results"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
    >
      <Pill className="deco pill pill-3" />
      <Flask className="deco flask flask-2" />

      <header className="res-header">
        <h2>診断結果</h2>
        <p className="sub">
          レーダーはあなたの<strong>適性バランス</strong>。下のカードで<strong>相性の高い職種Top3</strong>をチェック。
        </p>
      </header>

      <div className="chart-wrap glass">
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart data={chartData} outerRadius="80%">
            <PolarGrid stroke="rgba(255,255,255,.3)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(255,255,255,.8)", fontSize: 12 }} />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,.5)", fontSize: 10 }}
            />
            <Radar
              name="適性"
              dataKey="value"
              stroke="#7BD6F6"
              fill="#7BD6F6"
              fillOpacity={0.45}
            />
            <Tooltip formatter={(v) => `${v}%`} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="top-cards">
        {top3.map((r, i) => (
          <motion.div key={r.key} className="card role" whileHover={{ y: -4 }}>
            <div className="rank">{i + 1}</div>
            <div className="role-title">{r.name}</div>
            <div className="score">{r.score}%</div>
            <p className="role-desc">{ROLES.find((x) => x.key === r.key)?.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="actions">
        <button className="btn ghost" onClick={onBackLP}>
          LPに戻る
        </button>
        <button className="btn btn-primary" onClick={onRetry}>
          もう一度診断する
        </button>
      </div>

      <div className="next-steps glass">
        <h3>次の一歩</h3>
        <ul>
          <li>気になる職種のOB/OGに話を聞いてみる</li>
          <li>学内実習や研究室選びを「適性軸」で見直す</li>
          <li>在宅/病院見学や企業セミナーに申込み</li>
        </ul>
      </div>
    </motion.section>
  );
}

/* ============== ルート ============== */
export default function App() {
  const [mode, setMode] = useState("lp"); // 'lp' | 'quiz' | 'results'
  const [answers, setAnswers] = useState([]);

  return (
    <div className="container">
      <AnimatePresence mode="wait">
        {mode === "lp" && <Landing key="lp" onStart={() => setMode("quiz")} />}
        {mode === "quiz" && (
          <Quiz
            key="quiz"
            onFinish={(ans) => {
              setAnswers(ans);
              setMode("results");
            }}
          />
        )}
        {mode === "results" && (
          <Results
            key="results"
            rawAnswers={answers}
            onRetry={() => setMode("quiz")}
            onBackLP={() => setMode("lp")}
          />
        )}
      </AnimatePresence>

      <footer className="footer">
        <span>© Pharm Career Check</span>
        <span className="dot">•</span>
        <a href="#" onClick={(e) => e.preventDefault()}>
          プライバシー
        </a>
      </footer>
    </div>
  );
}
