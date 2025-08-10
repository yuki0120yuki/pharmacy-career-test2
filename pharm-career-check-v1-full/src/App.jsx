import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const QUESTIONS = [
  { id: 1, text: '人と話すのは得意？', a: '得意', b: 'どちらかと言えば苦手' },
  { id: 2, text: 'コツコツ作業が好き？', a: 'はい', b: 'いいえ' },
  { id: 3, text: '緊急対応の現場にやりがいを感じる？', a: '感じる', b: '落ち着いた環境が良い' }
]

const ROLES = [
  { key: 'community', label: '薬局薬剤師' },
  { key: 'hospital', label: '病院薬剤師' },
  { key: 'company', label: '企業薬剤師' }
]

export default function App() {
  const [page, setPage] = useState('lp') // 'lp' | 'quiz' | 'result'
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState({ community: 0, hospital: 0, company: 0 })

  const handleAnswer = (choice) => {
    const q = QUESTIONS[current]
    const next = { ...scores }
    if (q.id === 1) {
      // 人と話すの得意 → 薬局寄り
      if (choice === 'a') next.community += 2
      else next.company += 1
    } else if (q.id === 2) {
      // コツコツ → 企業/病院の記録系
      if (choice === 'a') { next.company += 2; next.hospital += 1 }
      else next.community += 1
    } else if (q.id === 3) {
      // 緊急対応 → 病院寄り
      if (choice === 'a') next.hospital += 2
      else next.community += 1
    }
    setScores(next)
    if (current + 1 < QUESTIONS.length) setCurrent((v) => v + 1)
    else setPage('result')
  }

  const resultData = useMemo(() => {
    const total = Math.max(1, scores.community + scores.hospital + scores.company)
    return ROLES.map((r) => ({
      name: r.label,
      value: Math.round((scores[r.key] / total) * 100)
    })).sort((a, b) => b.value - a.value)
  }, [scores])

  return (
    <div className="card">
      <AnimatePresence mode="wait">
        {page === 'lp' && (
          <motion.section
            key="lp"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="title">薬学部キャリア診断</h1>
            <p className="lead">たった数問で、あなたに合う薬剤師の働き方をざっくり可視化。</p>
            <div className="row">
              <div>
                <ul>
                  <li>✔ わかりやすい設問（専門用語最小）</li>
                  <li>✔ マッチ率をグラフ化</li>
                  <li>✔ 次の一歩のヒントも</li>
                </ul>
                <button
                  onClick={() => {
                    setPage('quiz')
                    setCurrent(0)
                    setScores({ community: 0, hospital: 0, company: 0 })
                  }}
                >
                  診断を受けてみる
                </button>
              </div>
              <div>
                <DummyChart />
              </div>
            </div>
          </motion.section>
        )}

        {page === 'quiz' && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <p className="lead">Q{current + 1}/{QUESTIONS.length}</p>
            <h2 className="title" style={{ fontSize: 24, marginBottom: 16 }}>
              {QUESTIONS[current].text}
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => handleAnswer('a')}>{QUESTIONS[current].a}</button>
              <button onClick={() => handleAnswer('b')}>{QUESTIONS[current].b}</button>
            </div>
          </motion.section>
        )}

        {page === 'result' && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="title">マッチ率</h2>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resultData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  {/* ← テンプレートリテラルを使わず連結に変更 */}
                  <YAxis domain={[0, 100]} tickFormatter={(v) => (v + '%')} />
                  <Tooltip formatter={(v) => [ (v + '%'), 'マッチ率' ]} />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setPage('lp')}>LPに戻る</button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

function DummyChart() {
  const data = [
    { name: '薬局', value: 70 },
    { name: '病院', value: 55 },
    { name: '企業', value: 40 }
  ]
  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          {/* ← テンプレートリテラルを使わず連結に変更 */}
          <YAxis domain={[0, 100]} tickFormatter={(v) => (v + '%')} />
          <Tooltip formatter={(v) => [ (v + '%'), 'マッチ率（例）' ]} />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
