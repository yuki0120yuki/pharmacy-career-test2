// src/components/Quiz.jsx
import React, { useMemo, useState, useEffect } from "react";
import Progress from "./Progress";

// ★ここにあなたのGAS URLを貼り付けてください
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyI-iHWSThCYzgMGz9hN-7MS2nr1vsnN8kOSLTbxXEkZHkTxbeKbe5NsUcYCIjacVc_/exec";

/**
 * props:
 * - questions: [{ id, text, choices: [{label, value}] , weight?: { roleKey: number, ... } }, ...]
 * - roles: { key: { label, ... }, ... }  ← 役割のメタデータ（既存の構成に合わせて）
 * - onFinish: (payload) => void         ← 結果画面へ渡す
 */
export default function Quiz({ questions, roles, onFinish }) {
  const [nick, setNick] = useState("");
  const [started, setStarted] = useState(false); // ニックネーム入力後に開始
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // {id, value, label}[]
  const total = questions.length;

  // スコア集計（回答が変わるたびにメモ化）
  const roleScores = useMemo(() => {
    const scores = Object.fromEntries(Object.keys(roles).map(k => [k, 0]));
    answers.forEach(a => {
      const q = questions.find(q => q.id === a.id);
      if (!q?.weight) return;
      // 質問ごとの重み付け×回答値で加点（例）
      for (const key of Object.keys(q.weight)) {
        const w = q.weight[key] ?? 0;
        scores[key] += (a.value ?? 0) * w;
      }
    });
    // 0-100 に正規化（適当な最大値で割る）
    // ここは既存のアルゴリズムに合わせて調整してください
    const max = Math.max(...Object.values(scores), 1);
    const percent = Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, Math.round((v / max) * 100)])
    );
    return { raw: scores, percent };
  }, [answers, questions, roles]);

  const handleStart = () => {
    if (!nick.trim()) {
      alert("ニックネームを入力してください");
      return;
    }
    setStarted(true);
  };

  // 回答を選択 → 次の質問へ自動遷移
  const handleSelect = (choice) => {
    const q = questions[index];
    const nextAnswers = [
      ...answers,
      { id: q.id, label: choice.label, value: choice.value }
    ];
    setAnswers(nextAnswers);

    const isLast = index === total - 1;
    if (!isLast) {
      setIndex((i) => i + 1);
    } else {
      // 完了 → GAS送信 → 親へ結果通知
      submitToGAS(nick, nextAnswers, roleScores.percent).finally(() => {
        const payload = {
          nickname: nick,
          answers: nextAnswers,
          scores: roleScores.percent,
        };
        onFinish?.(payload);
      });
    }
  };

  // GASへ送る
  const submitToGAS = async (nickname, aList, scoreObj) => {
    if (!GAS_ENDPOINT || GAS_ENDPOINT.includes("XXXXXXXX")) return; // 未設定なら送らない
    try {
      const res = await fetch(GAS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          answers: aList,
          score: scoreObj,
        }),
      });
      const json = await res.json();
      if (json?.status !== "success") {
        console.warn("GAS response:", json);
      }
    } catch (e) {
      console.error("GAS error:", e);
    }
  };

  // 画面
  if (!started) {
    return (
      <div className="container" style={{ padding: "24px 20px 40px" }}>
        <h2 style={{ margin: "0 0 12px" }}>ニックネームを入力して診断を開始</h2>
        <p style={{ opacity: .8, marginBottom: 12 }}>
          ※スコアと回答は匿名で集計して、サービス改善に利用します
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            placeholder="例）ゆき"
            className="input"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid color-mix(in oklab, canvasText 20%, canvas 80%)",
              background: "color-mix(in oklab, canvas 96%, canvasText 4%)",
            }}
          />
          <button className="btn" onClick={handleStart}>診断を始める</button>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="container" style={{ padding: "24px 20px 40px" }}>
      <Progress current={index + 1} total={total} />

      <div className="card" style={{ marginTop: 16 }}>
        <div className="lead" style={{ marginBottom: 8, fontSize: 12 }}>
          Q{index + 1}/{total}
        </div>
        <h2 style={{ margin: "4px 0 16px", lineHeight: 1.5 }}>{q.text}</h2>

        <div className="row" style={{ gap: 12 }}>
          {q.choices.map((c) => (
            <button
              key={c.label}
              className="btn"
              onClick={() => handleSelect(c)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 16px",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
