import { useState } from 'react';

const NS = [
  { name:'production', color:'#fb923c' },
  { name:'monitoring',  color:'#34d399' },
  { name:'ai',          color:'#c084fc' },
  { name:'kube-system', color:'#7c6cf7' },
];

const AGENTS = [
  { label:'CPU Agent',     dot:'a-green',  status:'ACTIVE' },
  { label:'Memory Agent',  dot:'a-blue',   status:'ACTIVE' },
  { label:'Storage Agent', dot:'a-purple', status:'ACTIVE' },
  { label:'Log Agent',     dot:'a-orange', status:'ACTIVE' },
];

export default function Sidebar({ pods }) {
  const [activeNs, setActiveNs] = useState('production');

  const statusCls = s => s==='running'?'s-run':s==='warn'?'s-warn':'s-err';

  return (
    <aside className="sidebar">
      {/* Namespaces */}
      <div className="sb-section">
        <div className="sb-label">Namespaces</div>
        <ul className="sb-list">
          {NS.map(ns=>(
            <li key={ns.name}
              className={activeNs===ns.name?'active':''}
              onClick={()=>setActiveNs(ns.name)}>
              <span className="ns-dot" style={{background:ns.color}}/>
              {ns.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Pods */}
      <div className="sb-section">
        <div className="sb-label">Pods</div>
        <ul className="sb-list">
          {pods.map((p,i)=>(
            <li key={p.name} className={i===0?'active':''}>
              <span className={`pod-dot ${statusCls(p.status)}`}/>
              {p.name.replace('-svc','').replace('-db','').replace('-llm','')}
            </li>
          ))}
        </ul>
      </div>

      {/* AI Agents */}
      <div className="sb-section agent-sep">
        <div className="sb-label">AI Agents</div>
        {AGENTS.map(a=>(
          <div key={a.label} className="agent-row">
            <span className={`a-dot ${a.dot}`}/>
            <span style={{fontSize:'0.74rem'}}>{a.label}</span>
            <span className="a-status">{a.status}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
