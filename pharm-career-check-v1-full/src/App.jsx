import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing.jsx'
import Quiz from './components/Quiz.jsx'
import Result from './components/Result.jsx'
import { ROLES, QUESTIONS } from './data/questions.js'

export default function App(){
  const [stage,setStage] = useState('lp')
  const [scores,setScores] = useState(null)
  const [picked,setPicked] = useState([])

  const onStart = ()=> setStage('quiz')
  const onCancel = ()=>{ setStage('lp'); setScores(null); setPicked([]) }
  const onFinish = (s,p)=>{ setScores(s); setPicked(p); setStage('result') }

  return (
    <div>
      <AnimatePresence mode="wait">
        {stage==='lp' && <motion.div key="lp" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><Landing onStart={onStart}/></motion.div>}
        {stage==='quiz' && <motion.div key="quiz" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><Quiz roles={ROLES} questions={QUESTIONS} onCancel={onCancel} onFinish={onFinish}/></motion.div>}
        {stage==='result' && scores && <motion.div key="result" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><Result roles={ROLES} scores={scores} onRestart={onCancel} onRetake={()=>setStage('quiz')}/></motion.div>}
      </AnimatePresence>
    </div>
  )
}
