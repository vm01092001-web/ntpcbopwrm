window.Drawings = function Drawings(props) {
  const { drawings, setDrawings, isTplDisabled, role, handleRowChange, saveActiveSheet } = props;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-in">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div><h2 className="text-xs font-black text-ntpc-blue uppercase tracking-wider">Drawings & Document Control Index</h2></div>
        <div className="flex items-center gap-2"><button onClick={() => setDrawings([...drawings, { id: "", discipline: "Civil", drawingNo: "", desc: "", priority: "Moderate", targetDate: "", expectedDate: "", status: "Pending", frontImpact: "", remarks: "" }])} disabled={isTplDisabled} className="bg-ntpc-orange text-white px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase disabled:opacity-40">+ Add</button><button onClick={() => saveActiveSheet("Drawings_Status", drawings)} className="bg-ntpc-blue text-white px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase">Save</button></div>
      </div>
      <div className="table-container max-h-[calc(100vh-180px)] overflow-y-auto custom-scroll">
        <table className="w-full text-left text-xs">
          <thead><tr className="bg-ntpc-navy text-white text-[9px] uppercase tracking-wider sticky-th"><th className="p-3 w-[8%]">Discipline</th><th className="p-3 w-[12%]">Drawing No.</th><th className="p-3 w-[18%]">Description</th><th className="p-3 w-[8%] text-center">Priority</th><th className="p-3 w-[9%] text-center">Target</th><th className="p-3 w-[9%] text-center">Expected</th><th className="p-3 w-[10%] text-center">Status</th><th className="p-3 w-[13%]">Impact</th><th className="p-3 w-[13%]">Remarks</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {drawings.map((d, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="p-2"><select disabled={isTplDisabled} value={d.discipline || "Civil"} onChange={e => handleRowChange(drawings, setDrawings, idx, "discipline", e.target.value)} className="w-full bg-slate-100 rounded p-1 font-bold text-[10px] outline-none"><option>Civil</option><option>Mechanical</option><option>Electrical</option><option>Architecture</option></select></td>
                <td className="p-2"><input type="text" disabled={isTplDisabled} value={d.drawingNo || ""} onChange={e => handleRowChange(drawings, setDrawings, idx, "drawingNo", e.target.value)} className="w-full bg-slate-100 font-bold p-1 rounded outline-none text-[10.5px]" /></td>
                <td className="p-2"><input type="text" disabled={isTplDisabled} value={d.desc || ""} onChange={e => handleRowChange(drawings, setDrawings, idx, "desc", e.target.value)} className="w-full bg-transparent font-bold border-b border-slate-200 outline-none focus:border-ntpc-orange text-[10.5px]" /></td>
                <td className="p-2"><select disabled={isTplDisabled} value={d.priority || "Moderate"} onChange={e => handleRowChange(drawings, setDrawings, idx, "priority", e.target.value)} className={`w-full rounded p-1 font-black text-[9px] text-center outline-none ${d.priority === 'High' ? 'bg-rose-100 text-rose-700' : d.priority === 'Low' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'}`}><option>High</option><option>Moderate</option><option>Low</option></select></td>
                <td className="p-2 text-center"><input type="date" disabled={isTplDisabled} value={d.targetDate || ""} onChange={e => handleRowChange(drawings, setDrawings, idx, "targetDate", e.target.value)} className="bg-slate-100 p-1 rounded text-[9.5px] font-bold outline-none" /></td>
                <td className="p-2 text-center"><input type="date" disabled={isTplDisabled} value={d.expectedDate || ""} onChange={e => handleRowChange(drawings, setDrawings, idx, "expectedDate", e.target.value)} className="bg-slate-100 p-1 rounded text-[9.5px] font-bold text-orange-600 outline-none" /></td>
                <td className="p-2 text-center"><button onClick={() => { if (role !== "NTPC") return; const next = d.status === "Pending" ? "Under Review" : d.status === "Under Review" ? "Cat-1 Approved" : "Pending"; handleRowChange(drawings, setDrawings, idx, "status", next); }} className={`px-2 py-1 rounded text-[9px] font-black uppercase w-full ${d.status === "Cat-1 Approved" ? "bg-emerald-100 text-emerald-800" : d.status === "Under Review" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>{d.status || "Pending"}</button></td>
                <td className="p-2"><textarea rows="1" disabled={isTplDisabled} value={d.frontImpact || ""} onChange={e => handleRowChange(drawings, setDrawings, idx, "frontImpact", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[9.5px] outline-none text-rose-950 font-bold" /></td>
                <td className="p-2"><textarea rows="1" disabled={isTplDisabled} value={d.remarks || ""} onChange={e => handleRowChange(drawings, setDrawings, idx, "remarks", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[9.5px] outline-none" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
