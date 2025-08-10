import { useState } from 'react'
import { motion } from 'framer-motion'
import QuestionCard from './QuestionCard.jsx'
import Progress from './Progress.jsx'

export default function Quiz({ questions, roles, onCancel, onFinish }){
  const [step,setStep] = useState(0)
  const [picked,setPicked] = useState([])

  const total = questions.length
  const onSelect = (choiceIndex)=>{
    const q = questions[step]
    const next = [...picked, { qid:q.id, choiceIndex }]
    setPicked(next)
    if(step < total-1){
      setStep(step+1)
    }else{
      const score = aggregateScores(next, questions, roles)
      onFinish(score, next)
    }
  }

  return (
    <div className="quiz-wrap">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
        <div className="pill">診断</div>
        <button className="btn outline" onClick={onCancel}>LPへ戻る</button>
      </div>
      <div style={{marginTop:10}}>
        <Progress value={step/total}/>
      </div>
      <motion.div key={step} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.25}}>
        <QuestionCard q={questions[step]} step={step} total={total} onSelect={onSelect}/>
      </motion.div>
    </div>
  )
}

function aggregateScores(picked, questions, roles){
  const scores = {}; roles.forEach(r=>scores[r.key]=0)
  picked.forEach(({qid,choiceIndex})=>{
    const q = questions.find(x=>x.id===qid)
    const w = q.choices[choiceIndex].weight
    Object.entries(w).forEach(([k,v])=>{ scores[k]+=v })
  })
  const max = picked.length * 10
  Object.keys(scores).forEach(k=>{ scores[k] = Math.round((scores[k]/max)*100) })
  return scores
}
