export default function AnomalyFeed({ anomalies }) {
  const total = anomalies.length;
  return (
    <div className="card feed-card">
      <div className="ch-header">
        <span className="ch-title">Anomaly Timeline</span>
        <span className="badge b-warn">{total} EVENTS</span>
      </div>
      <div className="feed-scroll">
        {anomalies.length === 0 && (
          <div style={{color:'var(--muted)',fontSize:'0.78rem',textAlign:'center',marginTop:20}}>
            No anomalies detected yet…
          </div>
        )}
        {anomalies.map(a => (
          <div key={a.id} className={`a-item sev-${a.sev}`}>
            <span className="a-sev">{a.sev.toUpperCase()}</span>
            <div>
              <div className="a-text" dangerouslySetInnerHTML={{__html: a.text}}/>
              <div className="a-meta">{a.time} · {a.agent}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
