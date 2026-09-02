window.Actions = function Actions(props) {
  const { actions, setActions, isTplDisabled, role, handleRowChange, saveActiveSheet, weekNo } = props;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-in">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div><h2 className="text-xs font-black text-ntpc-blue uppercase tracking-wider">Action Tracker</h2></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActions([...actions, { id: "", category: "Execution", desc: "", responsibility: "TPL", targetDate: "", revisedDate: "", status: "Pending", ntpcRemarks: "" }])} disabled={isTplDisabled} className="bg-ntpc-orange text-white px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase disabled:opacity-40">+ Add Point</button>
          <button onClick={() => saveActiveSheet("Action_Tracker", actions)} className="bg-ntpc-blue text-white px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase">Save</button>
        </div>
      </div>
      <div className="table-container max-h-[calc(100vh-180px)] overflow-y-auto custom-scroll">
        <table className="w-full text-left text-xs">
          <thead><tr className="bg-ntpc-navy text-white text-[9px] uppercase tracking-wider sticky-th"><th className="p-3 w-[10%]">Category</th><th className="p-3 w-[26%]">Description</th><th className="p-3 w-[10%]">Resp.</th><th className="p-3 w-[10%] text-center">Target Date</th><th className="p-3 w-[10%] text-center">Revised Target</th><th className="p-3 w-[10%] text-center">Status</th><th className="p-3 w-[24%]">NTPC Remarks</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {actions.map((a, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="p-2"><select disabled={isTplDisabled} value={a.category || "Execution"} onChange={e => handleRowChange(actions, setActions, idx, "category", e.target.value)} className="w-full bg-slate-100 rounded p-1 font-bold text-[10px] outline-none"><option>Execution</option><option>Engineering</option><option>Procurement</option><option>Clearance</option></select></td>
                <td className="p-2"><span className="text-[8px] font-black text-rose-500 uppercase block">{a.weekNo && a.weekNo != weekNo ? `Carried from Wk ${a.weekNo}` : ''}</span><input type="text" disabled={isTplDisabled} value={a.desc || ""} onChange={e => handleRowChange(actions, setActions, idx, "desc", e.target.value)} className="w-full bg-transparent font-bold border-b border-slate-200 outline-none text-[11px]" /></td>
                <td className="p-2"><input type="text" disabled={isTplDisabled} value={a.responsibility || ""} onChange={e => handleRowChange(actions, setActions, idx, "responsibility", e.target.value)} className="w-full bg-slate-100 font-bold p-1 rounded text-[10px] outline-none" /></td>
                <td className="p-2 text-center"><input type="date" disabled={isTplDisabled} value={a.targetDate || ""} onChange={e => handleRowChange(actions, setActions, idx, "targetDate", e.target.value)} className="bg-slate-100 p-1 rounded text-[9.5px] font-bold outline-none" /></td>
                <td className="p-2 text-center"><input type="date" disabled={role === "TPL"} value={a.revisedDate || ""} onChange={e => handleRowChange(actions, setActions, idx, "revisedDate", e.target.value)} className="bg-amber-50 text-amber-800 p-1 rounded text-[9.5px] font-bold outline-none" /></td>
                <td className="p-2 text-center"><button onClick={() => { if (role !== "NTPC") return; const ns = a.status === "Pending" ? "In Progress" : a.status === "In Progress" ? "Completed" : "Pending"; handleRowChange(actions, setActions, idx, "status", ns); }} className={`px-2 py-1 rounded text-[9px] font-black uppercase w-full ${a.status === "Completed" ? "bg-emerald-100 text-emerald-800" : a.status === "In Progress" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>{a.status || "Pending"}</button></td>
                <td className="p-2"><textarea rows="1" disabled={role === "TPL"} value={a.ntpcRemarks || ""} onChange={e => handleRowChange(actions, setActions, idx, "ntpcRemarks", e.target.value)} className="w-full bg-rose-50/20 border border-slate-200 rounded p-1 text-[9.5px] outline-none text-rose-950 font-bold" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
