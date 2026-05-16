export default function AIInsights({ insights }) {
  return (
    <div className="card ins-card">
      <div className="ch-header">
        <span className="ch-title">AI Insights</span>
        <span className="badge b-ai">OLLAMA · NLP</span>
      </div>
      <div className="feed-scroll">
        {insights.length === 0 && (
          <div style={{color:'var(--muted)',fontSize:'0.78rem',textAlign:'center',marginTop:20}}>
            Waiting for Ollama LLM response…
          </div>
        )}
        {insights.map((ins, i) => (
          <div key={i} className="ins-item">
            <div className="ins-head">
              <span className="ins-icon">{ins.icon}</span>
              <span className="ins-title">{ins.title}</span>
            </div>
            <div className="ins-body">{ins.body}</div>
            <div className="ins-act">→ {ins.act}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
