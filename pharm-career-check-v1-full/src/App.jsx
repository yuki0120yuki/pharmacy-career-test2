// src/App.jsx
import React, { useState } from "react";
import Landing from "./components/Landing";
import Quiz from "./components/Quiz";
import Result from "./components/Result";

import QUESTIONS from "./data/questions"; // 既存
import ROLES from "./data/roles";         // 役割のメタ（なければ下で簡易定義）

// もし roles.js が無い場合の簡易定義（あれば消してください）
const ROLES_FALLBACK = {
  community: { label: "薬局薬剤師（調剤薬局）" },
  drugstore: { label: "ドラッグ/店舗運営・管理" },
  homecare: { label: "在宅/訪問薬剤師" },
  hospital: { label: "病院薬剤師" },
  ma_mr: { label: "MA/MR（メディカル）" },
  clinical: { label: "臨床志向" },
  research: { label: "研究志向" },
  education: { label: "教育志向" },
  startup: { label: "起業志向" },
  speed: { label: "スピード" },
};

export default function App() {
  const [view, setView] = useState("lp"); // lp | quiz | result
  const [resultPayload, setResultPayload] = useState(null);

  const roles = ROLES ?? ROLES_FALLBACK;

  return (
    <div id="root-inner">
      {view === "lp" && (
        <Landing
          onStart={() => setView("quiz")}
        />
      )}

      {view === "quiz" && (
        <Quiz
          questions={QUESTIONS}
          roles={roles}
          onFinish={(payload) => {
            setResultPayload(payload);
            setView("result");
          }}
        />
      )}

      {view === "result" && resultPayload && (
        <Result
          nickname={resultPayload.nickname}
          scores={resultPayload.scores}
          onRestart={() => {
            setResultPayload(null);
            setView("lp");
          }}
        />
      )}
    </div>
  );
}
