window.L2Schedule = function L2Schedule(props) {
  const { l2Schedule, setL2Schedule, role, saveActiveSheet, handleRowChange } = props;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-in">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div><h2 className="text-xs font-black text-ntpc-blue uppercase tracking-wider">Level-2 Contract Master Schedule</h2></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setL2Schedule([...l2Schedule, { id: "", discipline: "Civil", desc: "", l2Start: "", actStart: "", l2End: "", actEnd: "" }])} disabled={role === "TPL"} className="bg-ntpc-orange text-white px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase disabled:opacity-40">+ Add Work Front</button>
          <button onClick={() => saveActiveSheet("L2_Schedule", l2Schedule)} disabled={role === "TPL"} className="bg-ntpc-blue text-white px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase disabled:opacity-40">Save Changes</button>
        </div>
      </div>
      <div className="table-container max-h-[calc(100vh-180px)] overflow-y-auto custom-scroll">
        <table className="w-full text-left text-xs">
          <thead><tr className="bg-ntpc-navy text-white text-[9px] uppercase tracking-wider sticky-th"><th className="p-3 w-[15%]">Discipline</th><th className="p-3 w-[35%]">L2 Work Front Description</th><th className="p-3 w-[12.5%] text-center">Baseline Start</th><th className="p-3 w-[12.5%] text-center">Actual Start</th><th className="p-3 w-[12.5%] text-center">Baseline Finish</th><th className="p-3 w-[12.5%] text-center">Actual Finish</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{l2Schedule.map((l2, idx) => (<tr key={idx} className="hover:bg-slate-50"><td className="p-2"><select disabled={role === "TPL"} value={l2.discipline || "Civil"} onChange={e => handleRowChange(l2Schedule, setL2Schedule, idx, "discipline", e.target.value)} className="w-full bg-slate-100 rounded-lg p-1.5 font-bold outline-none text-[10px]"><option>Civil</option><option>Mechanical</option><option>Electrical</option></select></td><td className="p-2"><input type="text" disabled={role === "TPL"} value={l2.desc || ""} onChange={e => handleRowChange(l2Schedule, setL2Schedule, idx, "desc", e.target.value)} className="w-full bg-transparent font-bold border-b border-slate-200 outline-none focus:border-ntpc-orange text-[11px]" /></td><td className="p-2 text-center"><input type="date" disabled={role === "TPL"} value={l2.l2Start || ""} onChange={e => handleRowChange(l2Schedule, setL2Schedule, idx, "l2Start", e.target.value)} className="bg-slate-100 p-1.5 rounded text-[10px] font-bold outline-none" /></td><td className="p-2 text-center"><input type="date" disabled={role === "TPL"} value={l2.actStart || ""} onChange={e => handleRowChange(l2Schedule, setL2Schedule, idx, "actStart", e.target.value)} className="bg-blue-50 text-blue-900 p-1.5 rounded text-[10px] font-bold outline-none" /></td><td className="p-2 text-center"><input type="date" disabled={role === "TPL"} value={l2.l2End || ""} onChange={e => handleRowChange(l2Schedule, setL2Schedule, idx, "l2End", e.target.value)} className="bg-slate-100 p-1.5 rounded text-[10px] font-bold outline-none" /></td><td className="p-2 text-center"><input type="date" disabled={role === "TPL"} value={l2.actEnd || ""} onChange={e => handleRowChange(l2Schedule, setL2Schedule, idx, "actEnd", e.target.value)} className="bg-blue-50 text-blue-900 p-1.5 rounded text-[10px] font-bold outline-none" /></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};
