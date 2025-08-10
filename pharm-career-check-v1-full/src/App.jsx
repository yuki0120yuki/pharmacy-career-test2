import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import questions from "./questions.js";
import "./styles.css";

/**
 * 役割（ロール）は questions 内の全選択肢の score のキーをユニオンして自動抽出
 * 例: hospital, community, industry, home, drugstore など
 */
const useRoles = () => {
  return useMemo(() => {
    const set = new Set();
    for (const q of questions) {
      for (const opt of q.options || []) {
        if (opt.score) {
          Object.keys(opt.score).forEach((k) => set.add(k));
        }
      }
    }
    // 表示名（日本語）マッピング（無ければキーをそのまま使う）
    const nameMap = {
      hospital: "病院薬剤師",
      community: "薬局薬剤師",
      drugstore: "ドラッグストア",
      home: "在宅医療",
      industry: "企業（研究・開発）",
      education: "アカデミア",
      regulation: "行政・規制",
    };
    return Array.from(set).map((k) => ({
      key: k,
      label: nameMap[k] || k,
    }));
  }, []);
};

const LP = ({ onStart }) => {
  return (
    <motion.section
      className="lp"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="lp-hero">
        <div className="lp-copy">
          <h1 className="lp-title">
            薬学部キャリア診断
            <span className="lp-badge">無料</span>
          </h1>
          <p className="lp-lead">
            たった 3 分・20 問に答えるだけ。あなたの
            <b>強み</b>と<b>向いている薬剤師の仕事</b>を、マッチ率でズバッと可視化。
          </p>
          <ul className="lp-benefits">
            <li>学年を問わず今すぐ受けられる（専門用語ナシ）</li>
            <li>結果はグラフで一目でわかる</li>
            <li>上位 3 職種の解説＆次の一歩のヒント付き</li>
          </ul>
          <button className="cta" onClick={onStart}>
            診断を受けてみる
          </button>
          <p className="lp-note">所要時間：3 分 ／ 登録不要</p>
        </div>

        {/* イラスト（プレースホルダ） */}
        <div className="lp-illust">
          <div className="pharmacist-card">
            <div className="avatar male" />
            <div className="bubble">調剤も病棟も、僕はどっち向き？</div>
          </div>
          <div className="pharmacist-card delay">
            <div className="avatar female" />
            <div className="bubble">企業や在宅…私の強みが活きる道は？</div>
          </div>
        </div>
      </div>

      <div className="lp-highlights">
        <div className="card">
          <span className="card-icon">📊</span>
          <h3>マッチ率を可視化</h3>
          <p>あなたに合う働き方を、ロールごとのスコアで比較。</p>
        </div>
        <div className="card">
          <span className="card-icon">✨</span>
          <h3>専門用語ゼロ</h3>
          <p>学生でもわかる質問だけで、性格や判断の傾向を診断。</p>
        </div>
        <div className="card">
          <span className="card-icon">🧭</span>
          <h3>次の一歩まで</h3>
          <p>上位 3 職種に向けたアクションのヒントを添えてお届け。</p>
        </div>
      </div>
    </motion.section>
  );
};

const Progress = ({ current, total }) => {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: `${pct}%` }} />
      <div className="progress-label">
        {current + 1} / {total}
      </div>
    </div>
  );
};

const Quiz = ({ onFinish }) => {
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);

  const q = questions[idx];

  const select = (opt) => {
    const next = [...answers];
    next[idx] = opt;
    setAnswers(next);

    if (idx + 1 >= total) {
      onFinish(next);
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <section className="quiz">
      <Progress current={idx} total={total} />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={idx}
          className="question-card"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="q-title">
            Q{idx + 1}. {q.text}
          </h2>
          <div className="options">
            {q.options.map((o, i) => (
              <button key={i} className="option" onClick={() => select(o)}>
                {o.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

const Result = ({ answers, onRetry }) => {
  const roles = useRoles();

  // スコア合算
  const raw = useMemo(() => {
    const acc = {};
    for (const r of roles) acc[r.key] = 0;

    for (const a of answers) {
      const sc = a?.score || {};
      Object.entries(sc).forEach(([k, v]) => {
        acc[k] = (acc[k] || 0) + Number(v || 0);
      });
    }
    return acc;
  }, [answers, roles]);

  // 正規化（最大を 100 にスケーリング）
  const normalized = useMemo(() => {
    const max = Math.max(1, ...Object.values(raw));
    return Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, Math.round((v / max) * 100)])
    );
  }, [raw]);

  // グラフ用データ
  const chartData = roles
    .map((r) => ({ name: r.label, value: normalized[r.key] || 0 }))
    .sort((a, b) => b.value - a.value);

  // 上位 3 職種
  const top3 = chartData.slice(0, 3);

  const nextStepTip = (key) => {
    const map = {
      hospital: "病院見学でチーム医療の現場を体感。実習の振り返りを深く！",
      community: "OTC・服薬指導のロールプレイで対人スキルを磨こう。",
      drugstore: "店舗の売場づくり・在庫管理の実例も見てみよう。",
      home: "在宅同行やカンファの見学で多職種連携を実感。",
      industry: "研究室の先輩訪問／企業セミナーで仕事内容を具体化。",
      education: "卒後の博士進学やTA経験の情報収集を始めよう。",
      regulation: "PMDAなど公的機関の説明会やインターン情報を要チェック。",
    };
    return map[key] || "先輩・現場の声を集めて、自分の『好き』を言語化しよう。";
  };

  return (
    <section className="result">
      <motion.h2
        className="result-title"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        あなたのキャリア・マッチ率
      </motion.h2>

      <div className="result-grid">
        <div className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 6, 6]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="top3">
          {top3.map((d, i) => (
            <motion.div
              key={d.name}
              className="top-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="rank">#{i + 1}</div>
              <div className="role">{d.name}</div>
              <div className="score">{d.value}%</div>
              <p className="tip">{nextStepTip(roles.find(r=>r.label===d.name)?.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button className="ghost" onClick={onRetry}>
          もう一度診断する
        </button>
      </div>
    </section>
  );
};

export default function App() {
  const [stage, setStage] = useState("lp"); // 'lp' | 'quiz' | 'result'
  const [answers, setAnswers] = useState([]);

  return (
    <div className="container">
      {stage === "lp" && <LP onStart={() => setStage("quiz")} />}
      {stage === "quiz" && (
        <Quiz
          onFinish={(ans) => {
            setAnswers(ans);
            setStage("result");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {stage === "result" && (
        <Result
          answers={answers}
          onRetry={() => {
            setAnswers([]);
            setStage("lp");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
