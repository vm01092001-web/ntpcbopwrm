const ProgressRing = ({ pct, color, label, subtext }) => {
  const radius = 32; const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex items-center gap-3.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
      <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
        <svg className="transform -rotate-90 w-full h-full"><circle cx="32" cy="32" r={radius} stroke="#e2e8f0" strokeWidth="5" fill="transparent" /><circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={circumference} strokeDashoffset={circumference - (Math.min(100, Math.max(0, pct)) / 100) * circumference} strokeLinecap="round" className={`transition-all duration-700 ease-out ${color}`} /></svg>
        <span className="absolute text-xs font-black tracking-tight">{pct}%</span>
      </div>
      <div><div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</div><div className="text-sm font-black text-slate-800 mt-0.5">{subtext}</div></div>
    </div>
  );
};

const DelayTracker = ({ title, tasks, discipline, l2Schedule }) => {
  const delayedTasks = tasks.map(t => {
    if (!t.l2Ref) return null;
    const l2 = l2Schedule.find(l => l.desc === t.l2Ref && l.discipline === discipline);
    if (!l2) return null;
    const endL2 = l2.l2End ? new Date(l2.l2End) : null; const endAct = l2.actEnd ? new Date(l2.actEnd) : null;
    const startL2 = l2.l2Start ? new Date(l2.l2Start) : null; const startAct = l2.actStart ? new Date(l2.actStart) : null;
    const today = new Date();
    let delayType = null, targetDisplay = "", actualDisplay = "";

    if (endL2) {
      endL2.setHours(0,0,0,0); if (endAct) endAct.setHours(0,0,0,0); today.setHours(0,0,0,0);
      if (endAct && endAct > endL2) { delayType = "Finish Delayed"; targetDisplay = l2.l2End; actualDisplay = l2.actEnd; } 
      else if (!endAct && today > endL2) { delayType = "Finish Overdue"; targetDisplay = l2.l2End; actualDisplay = "Not Finished"; }
    }
    if (!delayType && startL2) {
      startL2.setHours(0,0,0,0); if (startAct) startAct.setHours(0,0,0,0); today.setHours(0,0,0,0);
      if (startAct && startAct > startL2) { delayType = "Start Delayed"; targetDisplay = l2.l2Start; actualDisplay = l2.actStart; } 
      else if (!startAct && today > startL2) { delayType = "Start Overdue"; targetDisplay = l2.l2Start; actualDisplay = "Not Started"; }
    }
    if (!delayType) return null;
    return { taskName: t.taskName, l2Ref: t.l2Ref, targetDisplay, actualDisplay, hindrance: t.hindrance || "No hindrance reported.", delayType };
  }).filter(Boolean);

  if (delayedTasks.length === 0) return (<div className="mt-4 p-3 border border-emerald-200 bg-emerald-50/50 rounded-xl flex items-center justify-between"><h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-800">{title}</h4><span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">✓ On Schedule</span></div>);

  return (
      <div className="mt-4 border border-rose-200 bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="bg-rose-50 px-4 py-2 border-b border-rose-200 flex justify-between items-center"><h4 className="text-[11px] font-black uppercase tracking-wider text-rose-800">{title} Delays</h4><span className="text-[9px] font-bold text-rose-600 bg-rose-200 px-2 py-0.5 rounded-full">{delayedTasks.length} Identified Slips</span></div>
          <table className="w-full text-left text-[10px]"><thead className="bg-rose-50/50"><tr className="text-rose-900/60 uppercase"><th className="py-1.5 px-4 w-[15%] font-bold">Delay Type</th><th className="py-1.5 px-4 w-[20%] font-bold">L2 Front & Task</th><th className="py-1.5 px-4 w-[12%] font-bold">L2 Target</th><th className="py-1.5 px-4 w-[13%] font-bold text-rose-600">Actual/Status</th><th className="py-1.5 px-4 w-[40%] font-bold">Reported Hindrance</th></tr></thead><tbody className="divide-y divide-rose-100">{delayedTasks.map((d, i) => (<tr key={i} className="text-rose-950 font-bold hover:bg-rose-50/30"><td className="py-2 px-4 text-[9px] uppercase"><span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">{d.delayType}</span></td><td className="py-2 px-4"><strong>{d.l2Ref}</strong><br/><span className="text-slate-500">{d.taskName}</span></td><td className="py-2 px-4 text-slate-600">{d.targetDisplay}</td><td className="py-2 px-4"><span className="text-white bg-rose-500 px-2 py-1 rounded shadow-sm inline-block">{d.actualDisplay}</span></td><td className="py-2 px-4 text-rose-700">{d.hindrance}</td></tr>))}</tbody></table>
      </div>
  );
};

window.Dashboard = function Dashboard(props) {
  const { civilTasks, mechTasks, elecTasks, drawings, actions, safetyLogs, siteStats, attendees, setAttendees, teamData, apiPost, setLoading, setStatusMsg, weekNo, l2Schedule } = props;
  
  const calcProgress = (tasks) => {
    if (!tasks.length) return 0;
    const p = tasks.reduce((a, t) => a + (parseFloat(t.plan) || 0), 0);
    const a = tasks.reduce((a, t) => a + (parseFloat(t.act) || 0), 0);
    return p === 0 ? 0 : Math.min(100, Math.round((a / p) * 100));
  };

  const handleTeamSelect = (team, index, empId) => {
    const member = teamData.find(t => t.Emp_ID === empId);
    if (member) {
      const u = [...attendees[team]];
      u[index] = { name: member.Name, desig: member.Designation };
      setAttendees({ ...attendees, [team]: u });
    }
  };

  return (
    <div className="space-y-6 fade-in pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProgressRing pct={calcProgress(civilTasks)} color="text-blue-600" label="Civil Engineering" subtext={`${civilTasks.filter(t=>t.act>=t.plan&&t.plan>0).length}/${civilTasks.length} Targets Hit`} />
        <ProgressRing pct={calcProgress(mechTasks)} color="text-amber-500" label="Mechanical Erection" subtext={`${mechTasks.filter(t=>t.act>=t.plan&&t.plan>0).length}/${mechTasks.length} Targets Hit`} />
        <ProgressRing pct={calcProgress(elecTasks)} color="text-emerald-500" label="Electrical & C&I" subtext={`${elecTasks.filter(t=>t.act>=t.plan&&t.plan>0).length}/${elecTasks.length} Targets Hit`} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Drawings</span><div className="text-2xl font-black text-amber-500 mt-1">{drawings.filter(d => d.status !== "Cat-1 Approved").length}</div></div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unresolved Bottlenecks</span><div className="text-2xl font-black text-red-600 mt-1">{actions.filter(a => a.status !== "Completed").length}</div></div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Unsafe Conditions</span><div className="text-2xl font-black text-ntpc-orange mt-1">{safetyLogs.filter(s => s.status === "Open" && s.category === "Unsafe Condition").length}</div></div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Site Manpower Deployed</span><div className="text-2xl font-black text-blue-800 mt-1">{siteStats.manpower}</div></div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <h3 className="text-xs font-black text-ntpc-blue uppercase tracking-wider mb-2">Critical L2 Schedule Variance & Hindrance Diagnostics</h3>
         <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">Auto-crosschecked against L2 Master Target Dates</p>
         <DelayTracker title="Civil" tasks={civilTasks} discipline="Civil" l2Schedule={l2Schedule} />
         <DelayTracker title="Mechanical" tasks={mechTasks} discipline="Mechanical" l2Schedule={l2Schedule} />
         <DelayTracker title="Electrical" tasks={elecTasks} discipline="Electrical" l2Schedule={l2Schedule} />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-black text-ntpc-blue uppercase tracking-wider mb-3">WRM Representatives Database</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1 custom-scroll grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-[9px] font-black uppercase text-blue-600 block mb-2 border-b pb-1">NTPC Leadership Team</span>
              {attendees.ntpc.map((a, i) => (
                <div key={i} className="flex gap-2 mb-1.5">
                  <select onChange={e => handleTeamSelect("ntpc", i, e.target.value)} className="w-[40%] bg-slate-50 border border-slate-200 p-1.5 rounded text-[10px] font-bold outline-none"><option value="">Lookup...</option>{teamData.filter(t => t.Organization === 'NTPC').map(t => <option key={t.Emp_ID} value={t.Emp_ID}>{t.Name}</option>)}</select>
                  <input type="text" value={a.name || ""} onChange={e => { const u = [...attendees.ntpc]; u[i].name = e.target.value; setAttendees({ ...attendees, ntpc: u }); }} placeholder="Name" className="w-[30%] bg-slate-50 border border-slate-200 p-1.5 rounded text-[10px] font-bold outline-none" />
                  <input type="text" value={a.desig || ""} onChange={e => { const u = [...attendees.ntpc]; u[i].desig = e.target.value; setAttendees({ ...attendees, ntpc: u }); }} placeholder="Desig." className="w-[30%] bg-slate-50 border border-slate-200 p-1.5 rounded text-[10px] font-bold outline-none" />
                </div>
              ))}
              <button onClick={() => setAttendees({ ...attendees, ntpc: [...attendees.ntpc, { name: "", desig: "" }] })} className="text-[9px] font-black text-blue-600 hover:underline uppercase">+ Add Official</button>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-orange-600 block mb-2 border-b pb-1">M/s TPL Leadership Team</span>
              {attendees.tpl.map((a, i) => (
                <div key={i} className="flex gap-2 mb-1.5">
                  <select onChange={e => handleTeamSelect("tpl", i, e.target.value)} className="w-[40%] bg-slate-50 border border-slate-200 p-1.5 rounded text-[10px] font-bold outline-none"><option value="">Lookup...</option>{teamData.filter(t => t.Organization === 'TPL').map(t => <option key={t.Emp_ID} value={t.Emp_ID}>{t.Name}</option>)}</select>
                  <input type="text" value={a.name || ""} onChange={e => { const u = [...attendees.tpl]; u[i].name = e.target.value; setAttendees({ ...attendees, tpl: u }); }} placeholder="Name" className="w-[30%] bg-slate-50 border border-slate-200 p-1.5 rounded text-[10px] font-bold outline-none" />
                  <input type="text" value={a.desig || ""} onChange={e => { const u = [...attendees.tpl]; u[i].desig = e.target.value; setAttendees({ ...attendees, tpl: u }); }} placeholder="Desig." className="w-[30%] bg-slate-50 border border-slate-200 p-1.5 rounded text-[10px] font-bold outline-none" />
                </div>
              ))}
              <button onClick={() => setAttendees({ ...attendees, tpl: [...attendees.tpl, { name: "", desig: "" }] })} className="text-[9px] font-black text-orange-600 hover:underline uppercase">+ Add Executive</button>
            </div>
          </div>
        </div>
        <button onClick={async () => { setLoading(true); await apiPost({ action: "UPDATE_ATTENDEES", weekNo, ntpcAttendees: attendees.ntpc, tplAttendees: attendees.tpl }); setStatusMsg("Roster Recorded"); setLoading(false); }} className="w-[300px] mx-auto mt-6 bg-ntpc-blue hover:bg-slate-900 text-white font-extrabold py-2 rounded-xl text-xs uppercase tracking-wider transition-all">Save Representatives</button>
      </div>
    </div>
  );
};
