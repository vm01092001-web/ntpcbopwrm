window.Execution = function Execution(props) {
  const { currentTasks, setCurrentTasks, activeDiscipline, setActiveDiscipline, l2Schedule, isTplDisabled, role, handleRowChange, saveActiveSheet, isLocked, toggleLock } = props;

  const handleTaskMetricChange = (idx, field, val) => {
    const copy = [...currentTasks]; copy[idx][field] = val;
    const plan = parseFloat(field === 'plan' ? val : copy[idx].plan) || 0; const act = parseFloat(field === 'act' ? val : copy[idx].act) || 0; const currentVariance = act - plan;
    if (field === 'act' || field === 'plan') { const prevBacklog = parseFloat(copy[idx].cumBacklog) || 0; copy[idx].computedBacklog = currentVariance < 0 ? prevBacklog + Math.abs(currentVariance) : Math.max(0, prevBacklog - currentVariance); }
    setCurrentTasks(copy);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-in">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-200 p-1 rounded-xl">{[{ key: "Civil_Execution", label: "Civil Works" }, { key: "Mech_Execution", label: "Mechanical" }, { key: "Elec_Execution", label: "Electrical & C&I" }].map(d => (<button key={d.key} onClick={() => setActiveDiscipline(d.key)} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${activeDiscipline === d.key ? "bg-ntpc-blue text-white shadow" : "text-slate-600 hover:text-slate-900"}`}>{d.label}</button>))}</div>
        <div className="flex items-center gap-2"><button onClick={() => setCurrentTasks([...currentTasks, { id: "", l2Ref: "", taskName: "", unit: "m³", plan: 0, act: 0, next: 0, cumBacklog: 0, hindrance: "", tplRemarks: "", ntpcDirectives: "", milestone: "None" }])} disabled={isTplDisabled} className="bg-ntpc-orange text-white px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase disabled:opacity-40">+ Add Item</button>{role === "NTPC" && (<button onClick={toggleLock} className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase text-white shadow ${isLocked ? "bg-emerald-600" : "bg-rose-600"}`}>{isLocked ? "Unlock Week" : "Lock Week"}</button>)}<button onClick={() => saveActiveSheet(activeDiscipline, currentTasks)} className="bg-ntpc-blue text-white px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase">Save Tracker</button></div>
      </div>
      <div className="table-container max-h-[calc(100vh-180px)] overflow-y-auto custom-scroll">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="bg-slate-900 text-white text-[8.5px] uppercase tracking-wider sticky-th"><th colSpan="3" className="p-2 text-center border-r border-slate-700">Milestone Front Identification</th><th colSpan="4" className="p-2 text-center border-r border-slate-700 bg-blue-950">Current Week Performance</th><th colSpan="4" className="p-2 text-center bg-slate-950">Forward Planning & Directives</th></tr>
            <tr className="bg-slate-100 text-slate-700 text-[8px] uppercase tracking-wider sticky-th-sub"><th className="p-2 w-[16%]">L2 Work Front</th><th className="p-2 w-[10%]">Task</th><th className="p-2 w-[4%] text-center border-r border-slate-300">Unit</th><th className="p-2 w-[6%] text-center text-blue-950">Target Plan</th><th className="p-2 w-[6%] text-center text-emerald-900">Actual Done</th><th className="p-2 w-[5%] text-center">Variance</th><th className="p-2 w-[6%] text-center border-r border-slate-300">Cum. Backlog</th><th className="p-2 w-[6%] text-center">Next Target</th><th className="p-2 w-[13%]">Identified Hindrance</th><th className="p-2 w-[14%]">M/s TPL Remarks</th><th className="p-2 w-[14%]">NTPC Directives</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTasks.map((t, idx) => {
              const variance = (parseFloat(t.act) || 0) - (parseFloat(t.plan) || 0);
              const varColor = variance < 0 ? "text-rose-600 bg-rose-50" : variance > 0 ? "text-emerald-700 bg-emerald-50" : "text-slate-400";
              const activeL2Options = l2Schedule.filter(x => x.discipline === (activeDiscipline === "Civil_Execution" ? "Civil" : activeDiscipline === "Mech_Execution" ? "Mechanical" : "Electrical"));
              return (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-1.5"><select disabled={isTplDisabled} value={t.l2Ref || ""} onChange={e => handleRowChange(currentTasks, setCurrentTasks, idx, "l2Ref", e.target.value)} className="w-full bg-slate-100 rounded p-1 outline-none font-bold text-ntpc-blue text-[9.5px]"><option value="">-- Reference L2 --</option>{activeL2Options.map(o => <option key={o.id} value={o.desc}>{o.desc}</option>)}</select></td>
                  <td className="p-1.5"><input type="text" list={activeDiscipline === "Civil_Execution" ? "preset-tasks" : ""} disabled={isTplDisabled} value={t.taskName || ""} onChange={e => handleRowChange(currentTasks, setCurrentTasks, idx, "taskName", e.target.value)} className="w-full bg-transparent font-bold border-b border-slate-200 outline-none focus:border-ntpc-orange text-[10px]" /></td>
                  <td className="p-1.5 border-r border-slate-200"><input type="text" disabled={isTplDisabled} value={t.unit || ""} onChange={e => handleRowChange(currentTasks, setCurrentTasks, idx, "unit", e.target.value)} className="w-full bg-slate-100 rounded p-1 outline-none text-center text-[10px]" /></td>
                  <td className="p-1.5"><input type="number" disabled={role === 'TPL'} value={t.plan} onChange={e => handleTaskMetricChange(idx, "plan", e.target.value)} className="w-full bg-blue-50/60 border border-blue-200 rounded p-1 outline-none text-center font-black text-ntpc-blue text-[10px]" /></td>
                  <td className="p-1.5"><input type="number" disabled={isTplDisabled} value={t.act} onChange={e => handleTaskMetricChange(idx, "act", e.target.value)} className="w-full bg-emerald-50/60 border border-emerald-200 rounded p-1 outline-none text-center font-black text-emerald-800 text-[10px]" /></td>
                  <td className={`p-1.5 text-center font-black text-[10px] rounded ${varColor}`}>{variance > 0 ? `+${variance}` : variance}</td>
                  <td className="p-1.5 border-r border-slate-200"><input type="number" disabled={isTplDisabled} value={t.computedBacklog !== undefined ? t.computedBacklog : t.cumBacklog} onChange={e => handleRowChange(currentTasks, setCurrentTasks, idx, "cumBacklog", e.target.value)} className="w-full bg-rose-50 border border-rose-200 rounded p-1 outline-none text-center font-black text-rose-700 text-[10px]" /></td>
                  <td className="p-1.5"><input type="number" disabled={isTplDisabled} value={t.next} onChange={e => handleRowChange(currentTasks, setCurrentTasks, idx, "next", e.target.value)} className="w-full bg-slate-100 rounded p-1 outline-none text-center text-[10px]" /></td>
                  <td className="p-1.5 bg-amber-50/30"><textarea rows="1" disabled={isTplDisabled} value={t.hindrance || ""} onChange={e => handleRowChange(currentTasks, setCurrentTasks, idx, "hindrance", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1 text-[9.5px] outline-none"></textarea></td>
                  <td className="p-1.5 bg-sky-50/20"><textarea rows="1" disabled={role === "NTPC" || isTplDisabled} value={t.tplRemarks || ""} onChange={e => handleRowChange(currentTasks, setCurrentTasks, idx, "tplRemarks", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1 text-[9.5px] outline-none"></textarea></td>
                  <td className="p-1.5 bg-rose-50/20"><textarea rows="1" disabled={role === "TPL"} value={t.ntpcDirectives || ""} onChange={e => handleRowChange(currentTasks, setCurrentTasks, idx, "ntpcDirectives", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1 text-[9.5px] outline-none text-rose-950 font-bold"></textarea></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
