window.HseQa = function HseQa(props) {
  const { siteStats, setSiteStats, saveWeekMeta, setShowLogModal, isTplDisabled, safetyLogs, qualityLogs, toggleStatus, role, fetchAndShowImage } = props;

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div><label className="text-[10px] font-bold uppercase text-slate-400 block">Total Site Manpower</label><input type="number" value={siteStats.manpower} onChange={e=>setSiteStats({...siteStats, manpower: parseInt(e.target.value)||0})} className="font-black text-xl text-ntpc-blue bg-slate-50 border rounded p-1 w-24 outline-none"/></div>
          <div><label className="text-[10px] font-bold uppercase text-slate-400 block">Total Persons Trained</label><input type="number" value={siteStats.trained} onChange={e=>setSiteStats({...siteStats, trained: parseInt(e.target.value)||0})} className="font-black text-xl text-emerald-600 bg-slate-50 border rounded p-1 w-24 outline-none"/></div>
          <button onClick={saveWeekMeta} className="mt-4 bg-ntpc-blue text-white px-4 py-2 rounded text-[10px] font-black uppercase shadow">Save Stats</button>
        </div>
        <button onClick={() => setShowLogModal(true)} disabled={isTplDisabled} className="bg-ntpc-orange text-white px-4 py-2 rounded-xl text-xs font-black uppercase shadow">+ Log Observation</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"><h3 className="text-xs font-black text-orange-600 uppercase tracking-wider mb-3">HSE Safety Violations Log</h3><div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scroll">{safetyLogs.length === 0 ? <p className="text-xs text-slate-400">No logs.</p> : safetyLogs.map((s, i) => (<div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200"><div className="flex items-center justify-between"><span className="text-xs font-black text-ntpc-blue">{s.id} (Wk {s.weekNo}) • {s.category}</span><button onClick={() => toggleStatus("Safety_Logs", s.id, s.status)} disabled={role !== "NTPC"} className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${s.status === 'Complied' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{s.status === 'Complied' ? '✓ Complied' : '⚠ Open'}</button></div><p className="text-slate-700 text-xs mt-2 font-medium">{s.desc}</p>{s.photoUrl && (<button onClick={() => fetchAndShowImage(s.photoUrl)} className="text-blue-600 font-bold text-[10px] mt-2 flex items-center gap-1 uppercase">📷 View Photo</button>)}</div>))}</div></div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"><h3 className="text-xs font-black text-blue-600 uppercase tracking-wider mb-3">Quality Assurance NCRs</h3><div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scroll">{qualityLogs.length === 0 ? <p className="text-xs text-slate-400">No NCRs.</p> : qualityLogs.map((q, i) => (<div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200"><div className="flex items-center justify-between"><span className="text-xs font-black text-ntpc-blue">{q.id} (Wk {q.weekNo}) • {q.category}</span><button onClick={() => toggleStatus("Quality_Logs", q.id, q.status)} disabled={role !== "NTPC"} className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${q.status === 'Complied' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{q.status === 'Complied' ? '✓ Complied' : '⚠ Open'}</button></div><p className="text-slate-700 text-xs mt-2 font-medium">{q.desc}</p>{q.photoUrl && (<button onClick={() => fetchAndShowImage(q.photoUrl)} className="text-blue-600 font-bold text-[10px] mt-2 flex items-center gap-1 uppercase">📷 View Photo</button>)}</div>))}</div></div>
      </div>
    </div>
  );
};
