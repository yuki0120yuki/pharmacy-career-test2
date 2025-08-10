export default function QuestionCard({ q, step, total, onSelect }){
  return (
    <div className="qcard">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
        <div className="pill">Q{step+1} / {total}</div>
        <img src={step%2===0?'/student-boy.svg':'/student-girl.svg'} alt="" style={{height:52}}/>
      </div>
      <div className="qtitle">{q.title}</div>
      {q.desc && <div className="qdesc">{q.desc}</div>}
      <div style={{marginTop:10}}>
        {q.choices.map((c,idx)=>(
          <button key={idx} className="opt" onClick={()=>onSelect(idx)}>{c.label}</button>
        ))}
      </div>
    </div>
  )
}
