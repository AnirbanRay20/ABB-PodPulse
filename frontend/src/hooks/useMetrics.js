// useMetrics.js — simulates React + Axios polling every 5s (tech stack: Live updates)
import { useState, useEffect, useRef } from 'react';

const SERVICES = ['attendance', 'canteen', 'library'];
const PODS = [
  { name: 'attendance-svc',  ns: 'production', status: 'running', cpu: 44, mem: 51, port: 5001 },
  { name: 'canteen-svc',     ns: 'production', status: 'running', cpu: 67, mem: 70, port: 5002 },
  { name: 'library-svc',     ns: 'production', status: 'warn',    cpu: 88, mem: 84, port: 5003 },
  { name: 'postgres-db',     ns: 'production', status: 'running', cpu: 31, mem: 63, port: 5432 },
  { name: 'prometheus-core', ns: 'monitoring', status: 'running', cpu: 22, mem: 44, port: 9090 },
  { name: 'cadvisor',        ns: 'monitoring', status: 'running', cpu: 14, mem: 29, port: 8080 },
  { name: 'ollama-llm',      ns: 'ai',         status: 'running', cpu: 55, mem: 78, port: 11434 },
  { name: 'kube-scheduler',  ns: 'kube-system',status: 'error',   cpu: 5,  mem: 13, port: 0 },
];

const ANOMALY_TEMPLATES = [
  { sev:'crit', text:'CPU spike +142% on <b>library-svc</b> — threshold breached (88%→95%)',   agent:'CPU Agent' },
  { sev:'warn', text:'Memory trend upward on <b>canteen-svc</b> — OOM risk in ~8 min',          agent:'Memory Agent' },
  { sev:'warn', text:'PVC I/O burst on <b>postgres-db</b> — 4 200 IOPS peak',                   agent:'Storage Agent' },
  { sev:'info', text:'Network correlation: <b>attendance-svc</b> ↔ <b>canteen-svc</b> (r=0.89)',agent:'Correlation Engine' },
  { sev:'crit', text:'Restart loop on <b>kube-scheduler</b> — 3 restarts in 10 min',            agent:'Log Agent' },
  { sev:'warn', text:'High disk latency on <b>postgres-db</b> PVC — avg 42ms (normal <5ms)',    agent:'Storage Agent' },
  { sev:'info', text:'Dependency: <b>library-svc</b> shares PVC with <b>postgres-db</b>',       agent:'Dependency Mapper' },
  { sev:'warn', text:'CPU Granger-causes memory spike on <b>ollama-llm</b> (lag=2s, p<0.01)',   agent:'CPU Agent' },
  { sev:'info', text:'Isolation Forest: 2 outliers detected in <b>ai</b> namespace',             agent:'Anomaly Detector' },
  { sev:'crit', text:'Network saturation on <b>canteen-svc</b> — 980 Mbps (cap: 1 000)',        agent:'Memory Agent' },
];

const INSIGHTS = [
  { icon:'⚠️', title:'OOM Risk Prediction',      body:'canteen-svc memory trending +2.3 MB/s. LSTM forecast: OOM likely in 8 min. Add memory limit or scale horizontally.', act:'kubectl set resources deployment/canteen-svc --limits=memory=2Gi' },
  { icon:'🔗', title:'Causal Dependency Found',  body:'CPU spikes on library-svc Granger-cause PVC I/O on postgres-db (2s lag, p=0.004). Batch writes to cut storage stress.', act:'Review write batch size in library-svc config' },
  { icon:'🚀', title:'Optimisation Opportunity', body:'attendance-svc CPU is <20% while canteen-svc is at 67%. Offload session caching → Redis to cut gateway load ~25%.', act:'Enable session caching via Redis' },
  { icon:'🔴', title:'Restart Loop Alert',       body:'kube-scheduler restarted 3× in 10 min. Log: OOMKilled. Increase memory request 128Mi→256Mi.', act:'kubectl edit pod kube-scheduler -n kube-system' },
  { icon:'📊', title:'Correlated Workloads',     body:'attendance-svc & canteen-svc show 89% network correlation — critical path, single-point failure risk.', act:'Deploy attendance-svc as DaemonSet for resilience' },
];

const rand  = (mn,mx) => Math.floor(Math.random()*(mx-mn+1))+mn;
const clamp = (v,mn,mx) => Math.min(Math.max(v,mn),mx);

export function useMetrics() {
  const [pods,     setPods]     = useState(PODS.map(p=>({...p})));
  const [anomalies,setAnomalies]= useState([]);
  const [insights, setInsights] = useState([INSIGHTS[0], INSIGHTS[1]]);
  const [net,      setNet]      = useState(340);
  const [pvc,      setPvc]      = useState(1800);
  const [anomCount,setAnomCount]= useState(0);

  const tmplIdx    = useRef(0);
  const insIdx     = useRef(2);

  // Axios-style poll every 5s
  useEffect(() => {
    const tick = () => {
      setPods(prev => prev.map(p => ({
        ...p,
        cpu: clamp(p.cpu + rand(-6,6), 5, 97),
        mem: clamp(p.mem + rand(-4,4), 5, 97),
      })));
      setNet(prev => clamp(prev + rand(-30,30), 120, 980));
      setPvc(prev => clamp(prev + rand(-200,200), 800, 5200));
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);

  // Anomaly feed every 4-9s
  useEffect(() => {
    const fire = () => {
      const tmpl = ANOMALY_TEMPLATES[tmplIdx.current % ANOMALY_TEMPLATES.length];
      tmplIdx.current++;
      setAnomalies(prev => {
        const next = [{ ...tmpl, id: Date.now(), time: new Date().toLocaleTimeString() }, ...prev];
        return next.slice(0, 14);
      });
      if (tmpl.sev !== 'info') setAnomCount(c => c+1);
      schedAnomaly();
    };
    const schedAnomaly = () => { setTimeout(fire, rand(4000,9000)); };
    const init = setTimeout(fire, 1500);
    return () => clearTimeout(init);
  }, []);

  // Insights every 18s
  useEffect(() => {
    const id = setInterval(() => {
      setInsights(prev => {
        const ins = INSIGHTS[insIdx.current % INSIGHTS.length];
        insIdx.current++;
        const next = [ins, ...prev];
        return next.slice(0, 5);
      });
    }, 18000);
    return () => clearInterval(id);
  }, []);

  const avgCpu = Math.round(pods.reduce((s,p)=>s+p.cpu,0)/pods.length);
  const avgMem = Math.round(pods.reduce((s,p)=>s+p.mem,0)/pods.length);

  return { pods, anomalies, insights, net, pvc, anomCount, avgCpu, avgMem };
}
