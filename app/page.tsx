"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Dashboard = {
  id: string; title: string; domain: string; description: string; owner: string;
  source: string; updated: string; state: "Live" | "Certified" | "Review";
  metric: string; value: string; trend: string; tone: string; image?: string;
};
type Row = { id: string; title: string; subtitle: string; items: Dashboard[] };

const d = (
  id: string, title: string, domain: string, description: string, owner: string,
  source: string, updated: string, state: Dashboard["state"], metric: string,
  value: string, trend: string, tone: string, image?: string,
): Dashboard => ({ id, title, domain, description, owner, source, updated, state, metric, value, trend, tone, image });

const rows: Row[] = [
  { id: "mission", title: "Mission & Vehicle Readiness", subtitle: "One view of readiness, risk and the road to flight", items: [
    d("gates", "Terran R · Gate Readiness", "Mission assurance", "Integrated gate health across vehicle, ground, software and mission assurance—with accountable blockers and time-to-clear.", "Mission Operations", "Vehicle · MES · Jira", "Updated 2m ago", "Live", "Gate confidence", "86%", "+4 pts this week", "ember", "/hero-factory.png"),
    d("mass", "Vehicle Mass Properties", "Integrated performance", "Current mass, margin and center-of-gravity posture by vehicle configuration.", "Vehicle Performance", "PLM · Simulation", "Updated 18m ago", "Certified", "Margin to limit", "+3.8%", "Within plan", "violet"),
    d("launch", "Launch Site Integration", "Ground systems", "Cape integration milestones, commissioning status and critical-path handoffs.", "Launch Operations", "P6 · Jira · ERP", "Updated 1h ago", "Live", "Milestones on track", "42 / 46", "2 at risk", "ocean"),
    d("risk", "Mission Risk Register", "Program risk", "Top integrated risks, mitigation burn-down and decisions due this week.", "Program Management", "Jira · Confluence", "Updated 34m ago", "Review", "Red risks", "4", "−2 in 30 days", "rose"),
    d("config", "Vehicle Configuration", "Digital thread", "As-designed, as-built and as-tested configuration alignment for the active vehicle.", "Configuration Management", "PLM · MES · Test", "Updated 7m ago", "Certified", "Thread coverage", "97.4%", "+0.8 pts", "steel"),
  ]},
  { id: "manufacturing", title: "Manufacturing & Propulsion", subtitle: "From powder to flight hardware", items: [
    d("fleet", "Additive Fleet Command", "Factory operations", "Print-cell availability, build progress, exceptions and predicted completion across the factory.", "Additive Manufacturing", "Printer · MES · Historian", "Live telemetry", "Live", "Fleet OEE", "78.6%", "+6.2 pts vs plan", "ember", "/metal-print.png"),
    d("engine", "Aeon R Build Flow", "Propulsion", "Engine genealogy, work-in-progress, constraint queues and acceptance posture.", "Propulsion Operations", "MES · QMS · ERP", "Updated 4m ago", "Live", "Flow time", "−11%", "Improving", "solar"),
    d("yield", "First-Pass Yield", "Production quality", "Yield and defect Pareto by process, machine, material lot and configuration.", "Manufacturing Quality", "MES · QMS", "Updated 12m ago", "Certified", "30-day FPY", "93.1%", "+2.4 pts", "mint"),
    d("material", "Material Lot Intelligence", "Materials & process", "Powder genealogy, certification status, consumption and downstream quality signals.", "Materials Engineering", "LIMS · QMS · MES", "Updated 26m ago", "Review", "Lots released", "31 / 33", "2 awaiting review", "cobalt"),
    d("constraints", "Factory Constraints", "Industrial engineering", "Emerging bottlenecks, queue age and modeled production impact by work center.", "Factory Systems", "MES · Simulation", "Updated 15m ago", "Live", "Lost hours avoided", "184", "This month", "rose"),
  ]},
  { id: "test", title: "Test, Quality & Reliability", subtitle: "Evidence that every system is ready to perform", items: [
    d("test-ops", "Test Constellation", "Test operations", "Today’s test landscape, asset readiness, data quality and decision outcomes.", "Test Operations", "Telemetry · Test · Jira", "Live telemetry", "Live", "Assets ready", "18 / 20", "1 test in progress", "ocean"),
    d("ncr", "NCR Command Center", "Quality", "Nonconformance aging, containment, causal themes and downstream exposure.", "Quality Engineering", "QMS · MES · PLM", "Updated 6m ago", "Certified", "Overdue NCRs", "7", "−3 this week", "rose"),
    d("reliability", "Reliability Growth", "Systems engineering", "Failure modes, accumulated evidence and reliability growth against mission targets.", "Reliability Engineering", "Test · FRACAS · PLM", "Updated 2h ago", "Review", "Evidence coverage", "82%", "+5 pts", "violet"),
    d("inspection", "Inspection Flow", "Metrology", "Inspection queues, cycle time, dispositions and asset utilization by value stream.", "Inspection", "QMS · MES", "Updated 9m ago", "Live", "Median queue", "3.1h", "−44 min", "steel"),
  ]},
  { id: "supply", title: "Supply Chain & Program Execution", subtitle: "See risk before it reaches the build", items: [
    d("shortage", "Shortage & Constraint Radar", "Supply chain", "Material risk mapped to build need dates, critical paths and accountable recovery plans.", "Supply Chain", "ERP · MES · P6", "Updated 11m ago", "Live", "Critical shortages", "12", "4 newly mitigated", "solar"),
    d("supplier", "Supplier Performance", "Supplier quality", "Delivery, quality and responsiveness scored by supplier and critical commodity.", "Supplier Management", "ERP · QMS", "Updated 1h ago", "Certified", "On-time delivery", "89.4%", "+1.7 pts", "mint"),
    d("program", "Program Control Tower", "Program management", "Integrated schedule health, milestone confidence, resource pressure and action aging.", "Program Controls", "P6 · Jira · ERP", "Updated 22m ago", "Live", "Plan confidence", "84%", "+3 pts", "cobalt"),
    d("inventory", "Inventory Position", "Materials", "Inventory health, aged stock, demand coverage and working-capital opportunities.", "Materials Planning", "ERP · MES", "Updated 46m ago", "Certified", "Demand coverage", "91.8%", "+2.1 pts", "violet"),
  ]},
  { id: "business", title: "Business & Executive", subtitle: "The operating picture, translated into decisions", items: [
    d("company", "Company Operating Review", "Executive", "The integrated weekly view of mission, product, factory, people and financial execution.", "Office of the President", "Enterprise metrics", "Updated today", "Certified", "Decisions due", "8", "3 before Friday", "ember"),
    d("cost", "Vehicle Cost & Forecast", "Finance", "Actual, committed and forecast cost by vehicle, subsystem and build phase.", "FP&A", "ERP · PLM · MES", "Updated 3h ago", "Certified", "Forecast variance", "−1.8%", "Favorable", "mint"),
    d("capacity", "Capacity & Talent", "People operations", "Critical-skill capacity, hiring pipeline and workload pressure against the operating plan.", "People · Finance", "HRIS · Plan", "Updated yesterday", "Review", "Critical roles open", "23", "6 at final stage", "violet"),
    d("decisions", "Decision Velocity", "Operating system", "Decision queue, cycle time, blocked value and recurring information friction.", "#DATA", "Jira · Slack · Meetings", "Updated 17m ago", "Live", "Median time-to-decision", "9.4h", "−31% this quarter", "ocean"),
  ]},
  { id: "data", title: "#DATA Platform & Governance", subtitle: "Trust, lineage and reusable intelligence beneath every decision", items: [
    d("health", "Enterprise Data Health", "#DATA platform", "Freshness, quality, lineage and serving health for critical enterprise data products.", "#DATA Platform", "Databricks · BigQuery · dbt", "Live monitoring", "Live", "Critical products healthy", "96.2%", "+1.3 pts", "cobalt"),
    d("metrics", "Metric Registry", "Semantic layer", "Certified definitions, ownership, adoption and divergence across enterprise reporting.", "Data Governance", "dbt · BI · Catalog", "Updated 8m ago", "Certified", "Certified metrics", "142", "88% adoption", "mint"),
    d("agents", "Agent Promotion System", "AI operations", "Candidate agents, evaluation evidence, guardrail posture and progress toward promotion.", "Applied AI", "Evals · Registry · Runtime", "Updated 3m ago", "Live", "Candidates in evaluation", "7", "2 near promotion", "violet"),
    d("knowledge", "Knowledge Coverage", "Enterprise ontology", "Coverage, provenance and retrieval quality across the operational knowledge base.", "Knowledge Engineering", "Confluence · QMS · Catalog", "Updated 41m ago", "Review", "Ontology coverage", "68%", "+9 pts this month", "solar"),
    d("usage", "Analytics Consumption", "BI enablement", "What teams use, where decisions stall and which dashboards should be improved or retired.", "BI Enablement", "Power BI · Grafana", "Updated 2h ago", "Certified", "Monthly active viewers", "1,284", "+14%", "steel"),
  ]},
];

const heroIds = ["gates", "fleet", "decisions", "health"];
const iconPaths = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>, info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
  plus: <path d="M12 5v14M5 12h14"/>, check: <path d="m5 12 4 4L19 6"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>, arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
};
function Icon({ name }: { name: keyof typeof iconPaths }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

function Art({ item, hero = false }: { item: Dashboard; hero?: boolean }) {
  return <div className={`art tone-${item.tone} ${hero ? "art-hero" : ""}`}>
    {item.image && <img src={item.image} alt="" />}
    <div className="art-scrim"/><div className="telemetry" aria-hidden="true"><i/><i/><i/><i/><i/></div>
    {!hero && <div className="signal" aria-hidden="true">{[1,2,3,4,5,6].map(n => <i key={n}/>)}</div>}
  </div>;
}

function Card({ item, saved, onSave, onDetail, onOpen }: { item: Dashboard; saved: boolean; onSave: (id:string)=>void; onDetail:(d:Dashboard)=>void; onOpen:(d:Dashboard)=>void }) {
  return <article className="card" tabIndex={0} id={`dashboard-${item.id}`}>
    <Art item={item}/><div className="card-title"><span>{item.domain}</span><h3>{item.title}</h3></div>
    <div className="card-more">
      <div className="card-actions"><button className="round play" onClick={()=>onOpen(item)} aria-label={`Open ${item.title}`}>▶</button><button className="round" onClick={()=>onSave(item.id)} aria-label={saved ? "Remove from My Dashboards" : "Add to My Dashboards"}><Icon name={saved?"check":"plus"}/></button><button className="round detail" onClick={()=>onDetail(item)} aria-label={`More information about ${item.title}`}><Icon name="chevron"/></button></div>
      <div className="meta"><b className={`state state-${item.state.toLowerCase()}`}>{item.state}</b><span>{item.updated}</span></div>
      <p>{item.description}</p><div className="card-metric"><span>{item.metric}</span><strong>{item.value}</strong><em>{item.trend}</em></div>
    </div>
  </article>;
}

function Rail({ row, saved, onSave, onDetail, onOpen }: { row:Row; saved:string[]; onSave:(id:string)=>void; onDetail:(d:Dashboard)=>void; onOpen:(d:Dashboard)=>void }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (n:number) => ref.current?.scrollBy({left:n*Math.min(window.innerWidth*.82,1100),behavior:"smooth"});
  return <section className="row" id={row.id}><header><h2>{row.title}</h2><span>{row.subtitle}</span><button onClick={()=>scroll(1)}>Explore all <Icon name="chevron"/></button></header><div className="rail-wrap"><button className="rail-arrow left" onClick={()=>scroll(-1)} aria-label={`Scroll ${row.title} left`}><Icon name="chevron"/></button><div className="rail" ref={ref}>{row.items.map(item=><Card key={item.id} item={item} saved={saved.includes(item.id)} onSave={onSave} onDetail={onDetail} onOpen={onOpen}/>)}</div><button className="rail-arrow right" onClick={()=>scroll(1)} aria-label={`Scroll ${row.title} right`}><Icon name="chevron"/></button></div></section>;
}

export default function Home() {
  const all = useMemo(()=>rows.flatMap(row=>row.items),[]);
  const heroes = useMemo(()=>heroIds.map(id=>all.find(item=>item.id===id)!).filter(Boolean),[all]);
  const [heroIndex,setHeroIndex]=useState(0), [paused,setPaused]=useState(false), [saved,setSaved]=useState(["gates","fleet","ncr","health"]);
  const [detail,setDetail]=useState<Dashboard|null>(null), [search,setSearch]=useState(false), [query,setQuery]=useState(""), [toast,setToast]=useState("");
  const hero=heroes[heroIndex]??all[0];
  const results=useMemo(()=>{const q=query.trim().toLowerCase();return (q?all.filter(x=>`${x.title} ${x.domain} ${x.description} ${x.owner} ${x.source}`.toLowerCase().includes(q)):all).slice(0,10)},[all,query]);
  useEffect(()=>{if(paused)return;const t=window.setInterval(()=>setHeroIndex(i=>(i+1)%heroes.length),8500);return()=>clearInterval(t)},[paused,heroes.length]);
  useEffect(()=>{if(!toast)return;const t=window.setTimeout(()=>setToast(""),3000);return()=>clearTimeout(t)},[toast]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="/"&&!search){e.preventDefault();setSearch(true)}if(e.key==="Escape"){setSearch(false);setDetail(null)}};addEventListener("keydown",key);return()=>removeEventListener("keydown",key)},[search]);
  const toggle=(id:string)=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const open=(item:Dashboard)=>setToast(`${item.title} opened in dashboard workspace`);
  return <main>
    <nav className="nav"><a className="brand" href="#top"><b>R</b><span><strong>RELATIVITY</strong><small>ANALYTICS CENTER</small></span></a><div className="nav-links"><a href="#top">Home</a><a href="#mission">Mission</a><a href="#manufacturing">Factory</a><a href="#test">Test & Quality</a><a href="#data">#DATA</a></div><div className="nav-actions"><button onClick={()=>setSearch(true)} aria-label="Search dashboards"><Icon name="search"/></button><button className="notify" aria-label="Notifications"><Icon name="bell"/><i/></button><button className="profile" aria-label="Profile">PM</button></div></nav>
    <section className={`hero tone-${hero.tone}`} id="top" key={hero.id}><Art item={hero} hero/><div className="hero-copy"><div className="kicker"><i/>FEATURED INTELLIGENCE · {hero.domain}</div><h1>{hero.title}</h1><div className="proof"><b className={`state state-${hero.state.toLowerCase()}`}>{hero.state}</b><strong>{hero.value}</strong><span>{hero.metric}</span><em>{hero.trend}</em></div><p>{hero.description}</p><div className="hero-actions"><button className="primary" onClick={()=>open(hero)}>▶ <span>Open dashboard</span></button><button className="secondary" onClick={()=>setDetail(hero)}><Icon name="info"/> More info</button></div><small>{hero.source} <i>•</i> {hero.updated}</small></div><div className="pagination">{heroes.map((item,i)=><button key={item.id} className={i===heroIndex?"active":""} onClick={()=>{setHeroIndex(i);setPaused(true)}} aria-label={`Show ${item.title}`}><i/><small>{String(i+1).padStart(2,"0")}</small></button>)}</div><div className="classification">RELATIVITY INTERNAL</div></section>
    <div className="content"><section className="favorites"><header><h2>My Dashboards</h2><span>Your mission-critical views, one action away</span></header><div className="favorites-grid">{saved.slice(0,4).map(id=>{const item=all.find(x=>x.id===id);return item&&<button key={id} onClick={()=>open(item)}><i className={`tone-${item.tone}`}>{item.value.slice(0,2)}</i><span><strong>{item.title}</strong><small>{item.updated}</small></span><Icon name="arrow"/></button>})}</div></section>{rows.map(row=><Rail key={row.id} row={row} saved={saved} onSave={toggle} onDetail={setDetail} onOpen={open}/>)}</div>
    <footer><div><b>R</b><strong>One company. One operating picture.</strong></div><p>Prototype dashboard discovery experience · Representative data only</p></footer>
    {detail&&<div className="backdrop" onMouseDown={()=>setDetail(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDetail(null)} aria-label="Close"><Icon name="close"/></button><div className="modal-art"><Art item={detail} hero/></div><div className="modal-copy"><small>{detail.domain}</small><h2 id="modal-title">{detail.title}</h2><div className="meta"><b className={`state state-${detail.state.toLowerCase()}`}>{detail.state}</b><span>{detail.updated}</span></div><p>{detail.description}</p><div className="modal-metric"><span>{detail.metric}</span><strong>{detail.value}</strong><em>{detail.trend}</em></div><dl><div><dt>Owner</dt><dd>{detail.owner}</dd></div><div><dt>Connected sources</dt><dd>{detail.source}</dd></div><div><dt>Trust posture</dt><dd>{detail.state==="Certified"?"Certified definition & lineage":"Monitored source lineage"}</dd></div></dl><div className="hero-actions"><button className="primary" onClick={()=>open(detail)}>▶ <span>Open dashboard</span></button><button className="secondary save" onClick={()=>toggle(detail.id)}><Icon name={saved.includes(detail.id)?"check":"plus"}/>{saved.includes(detail.id)?"In My Dashboards":"Add to My Dashboards"}</button></div></div></section></div>}
    {search&&<div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search dashboards"><section className="search-panel"><div className="search-input"><Icon name="search"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search dashboards, metrics, owners, or systems…"/><kbd>ESC</kbd></div><header><span>{query?`${results.length} results`:"Suggested intelligence"}</span><button onClick={()=>setSearch(false)}>Close</button></header><div className="results">{results.map(item=><button key={item.id} onClick={()=>{setSearch(false);setDetail(item)}}><i className={`result-art tone-${item.tone}`}><span/></i><span><small>{item.domain}</small><strong>{item.title}</strong><em>{item.owner} · {item.updated}</em></span><Icon name="arrow"/></button>)}{!results.length&&<p className="empty"><strong>No dashboards found</strong><span>Try a system, owner, metric, or operating domain.</span></p>}</div></section></div>}
    {toast&&<div className="toast" role="status"><b>✓</b>{toast}</div>}
  </main>;
}
