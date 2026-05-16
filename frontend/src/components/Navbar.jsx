import { useState, useEffect } from 'react';

export default function Navbar({ anomCount }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const upd = () => setTime(new Date().toLocaleTimeString());
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="nav-brand">
        <svg className="brand-hex" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <polygon points="15,2 28,8.5 28,21.5 15,28 2,21.5 2,8.5"
            fill="none" stroke="#63d2ff" strokeWidth="1.5"/>
          <circle cx="15" cy="15" r="4.5" fill="#63d2ff"/>
          {[0,60,120,180,240,300].map((deg,i)=>{
            const r=Math.PI*deg/180;
            const x1=15+5*Math.cos(r), y1=15+5*Math.sin(r);
            const x2=15+11*Math.cos(r),y2=15+11*Math.sin(r);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#63d2ff" strokeWidth="1"/>;
          })}
        </svg>
        <span className="brand-name">ABB<span className="brand-ai"> Creator</span></span>
      </div>

      {/* Cluster info */}
      <div style={{display:'flex',alignItems:'center',gap:24}}>
        <div className="cluster-badge">
          <span className="live-dot"/>
          k3s-local
        </div>
        <div className="nav-stats">
          {[['Services','3'],['Pods','8'],['Namespaces','4']].map(([l,v])=>(
            <div key={l} className="nav-stat">
              <span className="stat-lbl">{l}</span>
              <span className="stat-val">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="nav-right">
        <div className="bell">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {anomCount > 0 && <span className="bell-badge">{anomCount > 9 ? '9+' : anomCount}</span>}
        </div>
        <span className="nav-time">{time}</span>
      </div>
    </nav>
  );
}
