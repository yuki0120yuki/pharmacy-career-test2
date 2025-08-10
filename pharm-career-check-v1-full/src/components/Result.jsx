import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Result({ roles, scores, onRestart, onRetake }){
  const sorted = roles.map(r=>({...r, score:scores[r.key]})).sort((a,b)=>b.score-a.score)
  const top3 = sorted.slice(0,3)

  const data = {
    labels: roles.map(r=>r.label),
    datasets: [{
      label: 'マッチ率（％）',
      data: roles.map(r=>scores[r.key]),
      backgroundColor: ['#60a5fa','#34d399','#f59e0b','#f472b6','#94a3b8','#a3e635'],
      borderRadius: 8
    }]
  }
  const options = { responsive:true, plugins:{ legend:{display:false} }, scales:{ y:{ suggestedMax:100, ticks:{stepSize:20}} } }

  return (
    <div className="container" style={{padding:'24px 20px 40px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
        <h2 style={{margin:0}}>診断結果</h2>
        <div style={{display:'flex',gap:10}}>
          <button className="btn outline" onClick={onRetake}>もう一度診断</button>
          <button className="btn" onClick={onRestart}>LPへ</button>
        </div>
      </div>

      <div className="result-grid" style={{marginTop:16}}>
        <div className="topcard">
          <Bar data={data} options={options}/>
        </div>
        <div className="topcard">
          <div className="pill" style={{marginBottom:8}}>上位3職種</div>
          {top3.map((r,i)=>(
            <motion.div key={r.key} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} style={{border:'1px solid #e2e8f0',borderRadius:12,padding:12,marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h4 style={{margin:'0 0 2px 0'}}>{i+1}位：{r.label}</h4>
                <span className="badge">{r.score}%</span>
              </div>
              <p style={{margin:'6px 0 8px 0',color:'#475569'}}>{r.desc}</p>
              <ul style={{margin:'0 0 0 18px',padding:0,color:'#475569'}}>
                {r.next.map((n,idx)=><li key={idx}>{n}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
