import { motion } from 'framer-motion'

export default function Landing({ onStart }){
  return (
    <header className="hero">
      <div className="container hero-grid">
        <div>
          <motion.h1 className="h1" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
            20の質問で見つける、<br/><span>あなたの未来の薬剤師像</span>
          </motion.h1>
          <p className="lead">専門用語なし。3分で結果。白衣の薬学生キャラと一緒に、楽しく診断。</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button className="btn" onClick={onStart}>診断をはじめる</button>
            <a href="#flow" className="btn outline">診断の流れを見る</a>
          </div>
          <p className="note">個人情報入力なし／ブラウザ内で完結</p>
        </div>
        <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.5,delay:.05}}>
          <div className="hero-card">
            <img src="/hero-illustration.svg" alt="" style={{width:'100%',borderRadius:12}}/>
            <div style={{display:'flex',gap:10,marginTop:10,flexWrap:'wrap'}}>
              <span className="pill">🎯 マッチする職種を可視化</span>
              <span className="pill">📊 グラフで一目瞭然</span>
              <span className="pill">🚀 次の一歩も分かる</span>
            </div>
          </div>
        </motion.div>
      </div>

      <main>
        <section className="section" id="flow">
          <div className="container">
            <h2>診断の流れ</h2>
            <ol className="steps">
              <li><b>質問に答える</b><br/>性格・価値観・働き方を直感で。</li>
              <li><b>スコアリング</b><br/>各職種にポイント配分。</li>
              <li><b>結果を見る</b><br/>マッチ率と上位3職種の解説。</li>
            </ol>
            <div style={{textAlign:'center',marginTop:18}}>
              <button className="btn" onClick={onStart}>今すぐ診断する</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="container foot-inner">
          <span>© 薬学生キャリア診断</span>
          <span>データは端末内でのみ処理されます</span>
        </div>
      </footer>
    </header>
  )
}
