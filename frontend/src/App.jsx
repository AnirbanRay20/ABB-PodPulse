import './index.css';
import { useMetrics }    from './hooks/useMetrics';
import Navbar            from './components/Navbar';
import Sidebar           from './components/Sidebar';
import MetricCards       from './components/MetricCards';
import CPUChart          from './components/CPUChart';
import RAMChart          from './components/RAMChart';
import DependencyMap     from './components/DependencyMap';
import AnomalyFeed       from './components/AnomalyFeed';
import AIInsights        from './components/AIInsights';

export default function App() {
  const { pods, anomalies, insights, net, pvc, anomCount, avgCpu, avgMem } = useMetrics();

  return (
    <div className="app">
      <Navbar anomCount={anomCount}/>

      <div className="layout">
        <Sidebar pods={pods}/>

        <main className="main">
          {/* Row 1 — Metric Cards */}
          <MetricCards
            avgCpu={avgCpu} avgMem={avgMem}
            net={net} pvc={pvc}
            anomalies={anomalies} pods={pods}
          />

          {/* Row 2 — Chart.js line charts */}
          <div className="charts-row">
            <div className="card chart-card">
              <div className="ch-header">
                <span className="ch-title">CPU Usage — Services (cAdvisor)</span>
                <span className="badge b-cpu">LIVE</span>
              </div>
              <CPUChart pods={pods}/>
            </div>
            <div className="card chart-card">
              <div className="ch-header">
                <span className="ch-title">RAM Usage — Services (Prometheus)</span>
                <span className="badge b-mem">LIVE</span>
              </div>
              <RAMChart pods={pods}/>
            </div>
          </div>

          {/* Row 3 — D3 dep map + Anomaly feed + AI Insights */}
          <div className="bottom-row">
            {/* D3.js dependency map */}
            <div className="card dep-card">
              <div className="ch-header">
                <span className="ch-title">Pod Dependency Map (Scikit-learn)</span>
                <span className="badge b-dep">AI MAPPED</span>
              </div>
              <DependencyMap/>
              <div className="dep-legend">
                <span><span className="ld ld-net"/>Network</span>
                <span><span className="ld ld-pvc"/>Shared PVC</span>
                <span><span className="ld ld-cor"/>AI Correlated</span>
              </div>
            </div>

            {/* Right column: anomaly feed + AI insights */}
            <div className="right-col">
              <AnomalyFeed anomalies={anomalies}/>
              <AIInsights  insights={insights}/>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
