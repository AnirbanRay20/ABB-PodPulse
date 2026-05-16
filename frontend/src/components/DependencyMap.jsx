import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NODES = [
  { id:'attendance', label:'attendance-svc', color:'#63d2ff', r:22 },
  { id:'canteen',    label:'canteen-svc',    color:'#7c6cf7', r:24 },
  { id:'library',    label:'library-svc',    color:'#fb923c', r:22 },
  { id:'postgres',   label:'postgres-db',    color:'#34d399', r:20 },
  { id:'prometheus', label:'prometheus',     color:'#34d399', r:16 },
  { id:'ollama',     label:'ollama-llm',     color:'#c084fc', r:20 },
  { id:'cadvisor',   label:'cAdvisor',       color:'#fbbf24', r:14 },
  { id:'langchain',  label:'LangChain',      color:'#c084fc', r:16 },
];

const LINKS = [
  { source:'attendance', target:'postgres',   color:'#63d2ff', w:2   },
  { source:'canteen',    target:'postgres',   color:'#63d2ff', w:2   },
  { source:'library',    target:'postgres',   color:'#fb923c', w:2.5 },
  { source:'attendance', target:'canteen',    color:'#63d2ff', w:1.5 },
  { source:'ollama',     target:'attendance', color:'#c084fc', w:1.5 },
  { source:'ollama',     target:'canteen',    color:'#c084fc', w:1.5 },
  { source:'ollama',     target:'library',    color:'#c084fc', w:1.5 },
  { source:'langchain',  target:'ollama',     color:'#c084fc', w:1   },
  { source:'prometheus', target:'attendance', color:'#34d399', w:1   },
  { source:'prometheus', target:'canteen',    color:'#34d399', w:1   },
  { source:'cadvisor',   target:'prometheus', color:'#fbbf24', w:1   },
];

export default function DependencyMap() {
  const svgRef = useRef(null);

  useEffect(() => {
    const el  = svgRef.current;
    const W   = el.clientWidth  || 420;
    const H   = el.clientHeight || 270;

    const svg = d3.select(el)
      .attr('width',  W)
      .attr('height', H);
    svg.selectAll('*').remove();

    // defs: arrowheads
    const defs = svg.append('defs');
    ['#63d2ff','#fb923c','#c084fc','#34d399','#fbbf24'].forEach(c => {
      defs.append('marker')
        .attr('id',`arrow-${c.slice(1)}`)
        .attr('viewBox','0 -5 10 10').attr('refX',22).attr('refY',0)
        .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
        .append('path').attr('d','M0,-5L10,0L0,5').attr('fill',c);
    });

    const nodes = NODES.map(n=>({...n}));
    const links = LINKS.map(l=>({...l}));

    const sim = d3.forceSimulation(nodes)
      .force('link',  d3.forceLink(links).id(d=>d.id).distance(80))
      .force('charge',d3.forceManyBody().strength(-350))
      .force('center',d3.forceCenter(W/2, H/2))
      .force('collision', d3.forceCollide(d=>d.r+10));

    const link = svg.append('g').selectAll('line').data(links).join('line')
      .attr('stroke',        d=>d.color)
      .attr('stroke-width',  d=>d.w)
      .attr('stroke-opacity',0.65)
      .attr('marker-end',    d=>`url(#arrow-${d.color.slice(1)})`);

    const node = svg.append('g').selectAll('g').data(nodes).join('g')
      .call(d3.drag()
        .on('start',(e,d)=>{ if(!e.active)sim.alphaTarget(.3).restart(); d.fx=d.x;d.fy=d.y; })
        .on('drag', (e,d)=>{ d.fx=e.x; d.fy=e.y; })
        .on('end',  (e,d)=>{ if(!e.active)sim.alphaTarget(0); d.fx=null;d.fy=null; }));

    node.append('circle')
      .attr('r',    d=>d.r)
      .attr('fill', d=>d.color+'22')
      .attr('stroke',d=>d.color)
      .attr('stroke-width',2);

    node.append('text')
      .attr('text-anchor','middle')
      .attr('dy','0.35em')
      .attr('fill','#e2e8f0')
      .attr('font-size',8)
      .attr('font-family','Inter')
      .text(d=>d.label.replace('-svc','').replace('-db',''));

    sim.on('tick', () => {
      link
        .attr('x1',d=>d.source.x).attr('y1',d=>d.source.y)
        .attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
      node.attr('transform',d=>`translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, []);

  return <svg ref={svgRef} style={{width:'100%',height:'100%',borderRadius:8,background:'rgba(255,255,255,0.02)'}}/>;
}
