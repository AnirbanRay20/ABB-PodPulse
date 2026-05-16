import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const COLORS = ['#63d2ff','#7c6cf7','#34d399','#fb923c','#c084fc'];
const MAX_PTS = 20;

export default function CPUChart({ pods }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const histRef   = useRef({});
  const labelsRef = useRef(Array.from({length:MAX_PTS},(_,i)=>`-${MAX_PTS-i}s`));

  const TRACKED = ['attendance-svc','canteen-svc','library-svc','postgres-db','ollama-llm'];

  useEffect(() => {
    // init history
    TRACKED.forEach(name => {
      const pod = pods.find(p=>p.name===name);
      if (pod && !histRef.current[name])
        histRef.current[name] = Array.from({length:MAX_PTS}, ()=>pod.cpu + Math.floor(Math.random()*10-5));
    });

    const datasets = TRACKED.map((name,i) => ({
      label: name.replace('-svc','').replace('-db','').replace('-llm',''),
      data: [...(histRef.current[name]||[])],
      borderColor: COLORS[i],
      backgroundColor: COLORS[i]+'18',
      borderWidth: 2, pointRadius: 0, tension: 0.4, fill: false,
    }));

    chartRef.current = new Chart(canvasRef.current, {
      type:'line',
      data:{ labels:[...labelsRef.current], datasets },
      options:{
        responsive:true, maintainAspectRatio:false,
        animation:{ duration:400 },
        plugins:{ legend:{ labels:{ color:'#94a3b8', font:{size:10,family:'Inter'}, boxWidth:10, padding:10 }}},
        scales:{
          x:{ ticks:{color:'#475569',font:{size:9}}, grid:{color:'rgba(255,255,255,0.04)'} },
          y:{ min:0, max:100, ticks:{color:'#475569',font:{size:9},callback:v=>v+'%'}, grid:{color:'rgba(255,255,255,0.04)'} },
        },
      },
    });
    return ()=>{ chartRef.current?.destroy(); };
  }, []);

  // update on each poll
  useEffect(() => {
    if (!chartRef.current) return;
    TRACKED.forEach((name,i) => {
      const pod = pods.find(p=>p.name===name);
      if (!pod) return;
      if (!histRef.current[name]) histRef.current[name] = Array(MAX_PTS).fill(pod.cpu);
      histRef.current[name].shift();
      histRef.current[name].push(pod.cpu);
      chartRef.current.data.datasets[i].data = [...histRef.current[name]];
    });
    chartRef.current.update('none');
  }, [pods]);

  return (
    <div style={{ position: 'relative', height: 200, width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
