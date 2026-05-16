export default function MetricCards({ avgCpu, avgMem, net, pvc, anomalies, pods }) {
  const critCount = anomalies.filter(a=>a.sev==='crit').length;
  const warnCount = anomalies.filter(a=>a.sev==='warn').length;
  const totalAnom = critCount + warnCount;

  const hotCpu = pods.reduce((a,b)=>a.cpu>b.cpu?a:b, pods[0]||{});
  const hotMem = pods.reduce((a,b)=>a.mem>b.mem?a:b, pods[0]||{});

  const cpuBg = avgCpu>80
    ? 'linear-gradient(90deg,#f87171,#fb923c)'
    : 'linear-gradient(90deg,var(--accent),#38bdf8)';

  return (
    <div className="metric-grid">
      {/* CPU */}
      <div className="card m-card">
        <div className="m-icon i-cpu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
            <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
            <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
          </svg>
        </div>
        <div className="m-body">
          <div className="m-lbl">Cluster CPU</div>
          <div className="m-val">{avgCpu}%</div>
          <div className="m-bar"><div className="m-fill" style={{width:avgCpu+'%',background:cpuBg}}/></div>
          <div className="m-sub">Hot: {hotCpu.name?.replace('-svc','')} ({hotCpu.cpu}%)</div>
        </div>
      </div>

      {/* Memory */}
      <div className="card m-card">
        <div className="m-icon i-mem">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M10 14h.01M14 14h.01M18 14h.01"/>
          </svg>
        </div>
        <div className="m-body">
          <div className="m-lbl">Memory Usage</div>
          <div className="m-val">{avgMem}%</div>
          <div className="m-bar"><div className="m-fill f-mem" style={{width:avgMem+'%'}}/></div>
          <div className="m-sub">Peak: {hotMem.name?.replace('-svc','')} ({hotMem.mem}%)</div>
        </div>
      </div>

      {/* Network */}
      <div className="card m-card">
        <div className="m-icon i-net">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="2"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/>
            <circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/>
            <line x1="6" y1="6" x2="10" y2="11"/><line x1="18" y1="6" x2="14" y2="11"/>
            <line x1="6" y1="18" x2="10" y2="13"/><line x1="18" y1="18" x2="14" y2="13"/>
          </svg>
        </div>
        <div className="m-body">
          <div className="m-lbl">Network I/O</div>
          <div className="m-val">{net} <span style={{fontSize:'0.9rem',fontWeight:500}}>MB/s</span></div>
          <div className="m-bar"><div className="m-fill f-net" style={{width:(net/10)+'%'}}/></div>
          <div className="m-sub">↑ {Math.round(net*0.6)} ↓ {Math.round(net*0.4)} MB/s</div>
        </div>
      </div>

      {/* PVC */}
      <div className="card m-card">
        <div className="m-icon i-pvc">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
          </svg>
        </div>
        <div className="m-body">
          <div className="m-lbl">PVC I/O Ops</div>
          <div className="m-val">{pvc.toLocaleString()} <span style={{fontSize:'0.75rem',fontWeight:500}}>IOPS</span></div>
          <div className="m-bar"><div className="m-fill f-pvc" style={{width:(pvc/52)+'%'}}/></div>
          <div className="m-sub">postgres-db PVC · {Math.floor(Math.random()*46)+2}ms avg</div>
        </div>
      </div>

      {/* Anomalies */}
      <div className="card m-card">
        <div className="m-icon i-anom">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div className="m-body">
          <div className="m-lbl">Anomalies</div>
          <div className="m-val red">{totalAnom}</div>
          <div className="a-pills">
            {critCount>0 && <span className="a-pill pill-c">{critCount} CRITICAL</span>}
            {warnCount>0 && <span className="a-pill pill-w">{warnCount} WARN</span>}
            {totalAnom===0 && <span className="m-sub">All systems normal</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
