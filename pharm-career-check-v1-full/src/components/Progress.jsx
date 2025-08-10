export default function Progress({ value }){
  return (
    <div className="progress">
      <span style={{width:`${Math.max(5, Math.round(value*100))}%`}}/>
    </div>
  )
}
