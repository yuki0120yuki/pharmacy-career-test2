import React, { useMemo, useState } from 'react'
import { QUESTIONS, ROLES } from './questions'

export default function App() {
  const [step, setStep] = useState('lp') // 'lp' | 'quiz' | 'result'
  const [answers, setAnswers] = useState([]) // true/false の配列
  const [idx, setIdx] = useState(0)

  const totalWeights = useMemo(() => {
    // Yes のときだけ weights を加点
    const scores = [0, 0, 0, 0, 0]
    answers.forEach((ans, i) => {
      if (ans) {
        const w = QUESTIONS[i].weights
        for (let j = 0; j < scores.length; j++) scores[j] += w[j]
      }
    })
    return scores
  }, [answers])

  const percentages = useMemo(() => {
    const sum = totalWeights.reduce((a, b) => a + b, 0) || 1
    return totalWeights.map(s => Math.round((s / sum) * 100))
  }, [totalWeights])

  const top = useMemo(() => {
    const pairs = ROLES.map((r, i) => ({ role: r, p: percentages[i] }))
    return pairs.sort((a, b) => b.p - a.p)
  }, [percentages])

  const startQuiz = () => {
    setStep('quiz')
    setAnswers([])
    setIdx(0)
  }

  const answer = (isYes) => {
    const next = [...answers]
    next[idx] = isYes
    setAnswers(next)

    if (idx < QUESTIONS.length - 1) {
      setIdx(idx + 1)
    } else {
      setStep('result')
    }
  }

  return (
    <div className="container">
      {step === 'lp' && <LP onStart={startQuiz} />}

      {step === 'quiz' && (
        <Quiz
          index={idx}
          question={QUESTIONS[idx]}
          total={QUESTIONS.length}
          onYes={() => answer(true)}
          onNo={() => answer(false)}
          onBack={() => setIdx(Math.max(0, idx - 1))}
        />
      )}

      {step === 'result' && (
        <Result
          top={top}
          percentages={percentages}
          onRetry={() => setStep('lp')}
        />
      )}
    </div>
  )
}

function LP({ onStart }) {
  return (
    <section className="lp">
      <div className="lp-hero">
        <div className="lp-copy">
          <h1>薬学部キャリア診断</h1>
          <p>20の質問に答えるだけ。あなたの強みから、ピッタリの薬剤師の働き方をグラフィックでご提案。</p>
          <ul className="lp-benefits">
            <li>⏱️ 3分で完了</li>
            <li>📊 マッチ率を可視化</li>
            <li>🧭 次の一歩もヒントで提示</li>
          </ul>
          <button className="primary" onClick={onStart}>診断を受けてみる</button>
        </div>
        <div className="lp-illust">
          <!-- イラストは後で差し替えOKのプレースホルダー -->
          <div className="pharmacist-card">
            <div className="avatar male"></div>
            <div className="avatar female"></div>
            <span className="badge">学生さん向け</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Quiz({ index, question, total, onYes, onNo, onBack }) {
  return (
    <section className="quiz">
      <div className="quiz-card">
        <div className="quiz-head">
          <span className="count">{index + 1}/{total}</span>
          {index > 0 && <button className="ghost" onClick={onBack}>戻る</button>}
        </div>
        <h2 className="q-text">{question.text}</h2>
        <div className="actions">
          <button className="yes" onClick={onYes}>はい</button>
          <button className="no" onClick={onNo}>いいえ</button>
        </div>
      </div>
    </section>
  )
}

function Result({ top, percentages, onRetry }) {
  return (
    <section className="result">
      <div className="result-card">
        <h2>診断結果</h2>
        <p className="lead">あなたに合う働き方のマッチ率</p>

        <div className="bars">
          {ROLES.map((role, i) => (
            <div className="bar-row" key={role}>
              <span className="bar-label">{role}</span>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${percentages[i]}%` }} />
              </div>
              <span className="bar-val">{percentages[i]}%</span>
            </div>
          ))}
        </div>

        <div className="top3">
          <h3>あなたに特に合いそう 💡</h3>
          <ol>
            {top.slice(0, 3).map(({ role, p }) => (
              <li key={role}>
                <strong>{role}</strong>（{p}%）
              </li>
            ))}
          </ol>
        </div>

        <button className="primary" onClick={onRetry}>もう一度診断する</button>
      </div>
    </section>
  )
}
