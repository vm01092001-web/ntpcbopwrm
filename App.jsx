const { useState, useEffect, useCallback } = React;

function App() {
  const [authState, setAuthState] = useState("LOGIN");
  const [loginForm, setLoginForm] = useState({ userId: "", password: "" });
  const [role, setRole] = useState("NTPC");
  const [tab, setTab] = useState("DASHBOARD");
  const [weekNo, setWeekNo] = useState(35);
  const [availableWeeks, setAvailableWeeks] = useState([35]);
  const [isLocked, setIsLocked] = useState(false);
  const [activeDiscipline, setActiveDiscipline] = useState("Civil_Execution");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  
  // Modals
  const [showLogModal, setShowLogModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [newWeekInput, setNewWeekInput] = useState(36);
  const [viewImageId, setViewImageId] = useState(null);
  const [viewImageData, setViewImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [logForm, setLogForm] = useState({ type: "Safety", category: "Unsafe Condition", desc: "", file: null });

  // Data
  const [teamData, setTeamData] = useState([]);
  const [attendees, setAttendees] = useState({ ntpc: [{ name: "", desig: "" }], tpl: [{ name: "", desig: "" }] });
  const [siteStats, setSiteStats] = useState({ manpower: 0, trained: 0 });
  const [l2Schedule, setL2Schedule] = useState([]);
  const [civilTasks, setCivilTasks] = useState([]);
  const [mechTasks, setMechTasks] = useState([]);
  const [elecTasks, setElecTasks] = useState([]);
  const [civilHistory, setCivilHistory] = useState({});
  const [drawings, setDrawings] = useState([]);
  const [safetyLogs, setSafetyLogs] = useState([]);
  const [qualityLogs, setQualityLogs] = useState([]);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const savedRole = localStorage.getItem("wrm_role"); const savedUser = localStorage.getItem("wrm_userId");
    if (savedRole && savedUser) { setRole(savedRole); setAuthState("PORTAL"); }
  }, []);

  const loadData = useCallback(async (targetWeek) => {
    if (authState !== "PORTAL") return;
    setLoading(true); setStatusMsg("Synchronizing...");
    const w = targetWeek || weekNo;
    try {
      const data = await window.apiPost({ action: "GET_DATA_SIMULATION", weekNo: w }); // Fallback mapped in doGet
      const res = await fetch(`${window.SCRIPT_URL}?week=${w}`);
      const j = await res.json();
      if (j.status === 200) {
        setIsLocked(Boolean(j.weekMeta?.isLocked));
        setTeamData(j.teamData || []);
        setSiteStats({ manpower: j.weekMeta?.manpower || 0, trained: j.weekMeta?.trained || 0 });
        try {
          const pNtpc = typeof j.weekMeta?.ntpc === 'string' ? JSON.parse(j.weekMeta.ntpc) : j.weekMeta?.ntpc;
          const pTpl = typeof j.weekMeta?.tpl === 'string' ? JSON.parse(j.weekMeta.tpl) : j.weekMeta?.tpl;
          setAttendees({ ntpc: Array.isArray(pNtpc) && pNtpc.length ? pNtpc : [{ name: "", desig: "" }], tpl: Array.isArray(pTpl) && pTpl.length ? pTpl : [{ name: "", desig: "" }] });
        } catch (e) { setAttendees({ ntpc: [{ name: "", desig: "" }], tpl: [{ name: "", desig: "" }] }); }
        if (j.allWeeks?.length) setAvailableWeeks(j.allWeeks);
        setL2Schedule((j.l2Data || []).filter(r => r.Work_Description).map(r => ({ id: r.L2_ID || "", discipline: r.Discipline || "Civil", desc: r.Work_Description || "", l2Start: window.formatDate(r.L2_Start), actStart: window.formatDate(r.Act_Start), l2End: window.formatDate(r.L2_End), actEnd: window.formatDate(r.Act_End) })));
        const mapExec = (r) => ({ id: r.Task_ID || "", l2Ref: r.L2_Reference || "", taskName: r.Task_Name || "", unit: r.Unit || "m³", plan: parseFloat(r.Wk_Plan) || 0, act: parseFloat(r.Wk_Act) || 0, next: parseFloat(r.Next_Plan) || 0, cumBacklog: parseFloat(r.Cum_Backlog) || 0, hindrance: r.Hindrance || "", tplRemarks: r.TPL_Remarks || "", ntpcDirectives: r.NTPC_Directives || "", milestone: r.Milestone_Status || "None" });
        setCivilTasks((j.civilData || []).filter(r => r.L2_Reference || r.Task_Name).map(mapExec));
        setMechTasks((j.mechData || []).filter(r => r.L2_Reference || r.Task_Name).map(mapExec));
        setElecTasks((j.elecData || []).filter(r => r.L2_Reference || r.Task_Name).map(mapExec));
        setCivilHistory(j.civilHistory || {});
        setDrawings((j.drawingData || []).filter(r => r.Drawing_No).map(r => ({ id: r.Dwg_ID || "", discipline: r.Discipline || "Civil", drawingNo: r.Drawing_No || "", desc: r.Description || "", priority: r.Priority || "Moderate", targetDate: window.formatDate(r.Target_Date), expectedDate: window.formatDate(r.Expected_Date), status: r.Status || "Pending", frontImpact: r.Front_Impact || "", remarks: r.Remarks || "" })));
        setSafetyLogs((j.safetyData || []).filter(s => s.Description).map(s => ({ id: s.Log_ID, weekNo: s.Week_No || w, category: s.Category || "Unsafe Condition", desc: s.Description, status: s.Status || "Open", photoUrl: s.Photo_URL || "" })));
        setQualityLogs((j.qualityData || []).filter(q => q.Description).map(q => ({ id: q.Log_ID, weekNo: q.Week_No || w, category: q.Category || "Civil NCR", desc: q.Description, status: q.Status || "Open", photoUrl: q.Photo_URL || "" })));
        setActions((j.actionData || []).filter(a => a.Description).map(a => ({ id: a.Action_ID || "", weekNo: a.Week_No || w, category: a.Category || "Execution", desc: a.Description, responsibility: a.Responsibility || "TPL", targetDate: window.formatDate(a.Target_Date), revisedDate: window.formatDate(a.Revised_Date), status: a.Status || "Pending", ntpcRemarks: a.NTPC_Remarks || "" })));
        setStatusMsg("Synced");
      }
    } catch (e) {} finally { setLoading(false); }
  }, [weekNo, authState]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogin = async () => {
    setLoading(true); setStatusMsg("Authenticating...");
    const res = await window.apiPost({ action: "LOGIN", userId: loginForm.userId, password: loginForm.password });
    if (res.status === 200) { setRole(res.role); localStorage.setItem("wrm_role", res.role); localStorage.setItem("wrm_userId", loginForm.userId); setAuthState("PORTAL"); } 
    else alert("Login failed");
    setLoading(false);
  };

  const saveActiveSheet = async (sheetName, rows) => {
    setLoading(true); setStatusMsg(`Saving...`);
    const res = await window.apiPost({ action: "SAVE_DATA", weekNo, role, sheetName, rows });
    if (res.status === 200) { setStatusMsg("Saved"); loadData(); } else alert("Save Failed");
    setLoading(false);
  };

  const handleRowChange = (arr, setArr, idx, field, val) => { const copy = [...arr]; copy[idx][field] = val; setArr(copy); };
  
  const fetchAndShowImage = async (url) => {
    if(!url) return; let fileId = url; const match = url.match(/(?:id=|d\/)([a-zA-Z0-9_-]{25,})/); if(match) fileId=match[1];
    setViewImageId(fileId); setImageLoading(true); setViewImageData(null);
    const res = await window.apiPost({ action: "GET_IMAGE", fileId });
    if(res.status===200) setViewImageData(res.base64); else { alert("Image fetch failed."); setViewImageId(null); }
    setImageLoading(false);
  };

  const toggleStatus = async (sheetName, logId, currentStatus) => {
    const newStatus = (currentStatus === "Open" || currentStatus === "Pending") ? "Complied" : "Open";
    setLoading(true); await window.apiPost({ action: "UPDATE_LOG_STATUS", role, sheetName, logId, status: newStatus }); loadData();
  };

  const saveWeekMeta = async () => {
    setLoading(true); await window.apiPost({ action: "UPDATE_WEEK_META", weekNo, ntpcAttendees: attendees.ntpc, tplAttendees: attendees.tpl, manpower: siteStats.manpower, trained: siteStats.trained });
    setStatusMsg("Meta Saved"); setLoading(false);
  };

  const submitLog = async () => {
    if (!logForm.desc) return alert("Description required.");
    setLoading(true); let b64 = "", fName = "", mType = "";
    if (logForm.file) { fName = logForm.file.name; mType = logForm.file.type; b64 = await new Promise((res) => { const rd = new FileReader(); rd.onload = () => res(rd.result.split(',')[1]); rd.readAsDataURL(logForm.file); }); }
    const res = await window.apiPost({ action: "SAVE_LOG", weekNo, logType: logForm.type, category: logForm.category, desc: logForm.desc, photoBase64: b64, fileName: fName, mimeType: mType });
    if (res.status === 200) { setShowLogModal(false); setLogForm({ type: "Safety", category: "Unsafe Condition", desc: "", file: null }); loadData(); }
    setLoading(false);
  };

  if (authState === "LOGIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="bg-white p-10 rounded-3xl max-w-md w-full shadow-2xl fade-in">
          <div className="flex items-center gap-3 justify-center mb-8"><div className="w-12 h-12 bg-ntpc-blue text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border-2 border-orange-500">N</div><div><h1 className="text-base font-black text-ntpc-blue uppercase tracking-tight">NTPC Nabinagar</h1><p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest">Stage-II Review Portal</p></div></div>
          <div className="space-y-4"><input type="text" value={loginForm.userId} onChange={e => setLoginForm({ ...loginForm, userId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold outline-none" placeholder="Username" /><input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold outline-none" placeholder="Password" /><button onClick={handleLogin} disabled={loading} className="w-full bg-ntpc-blue text-white py-3.5 rounded-xl font-extrabold text-xs uppercase shadow-lg">Secure Access</button></div>
        </div>
      </div>
    );
  }

  const isTplDisabled = role === "TPL" && isLocked;
  const currentTasks = activeDiscipline === "Civil_Execution" ? civilTasks : activeDiscipline === "Mech_Execution" ? mechTasks : elecTasks;
  const setCurrentTasks = (u) => { if (activeDiscipline === "Civil_Execution") setCivilTasks(u); else if (activeDiscipline === "Mech_Execution") setMechTasks(u); else setElecTasks(u); };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      <window.Sidebar tab={tab} setTab={setTab} role={role} handleLogout={() => { localStorage.clear(); setAuthState("LOGIN"); }} />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {loading && (<div className="absolute top-4 right-4 z-50 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-3 fade-in"><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div><span className="text-[10px] font-bold">{statusMsg}</span></div>)}

        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-30 no-print">
           <div><h2 className="text-sm font-black text-ntpc-blue uppercase tracking-wider">Project Control Engine</h2></div>
           <div className="flex items-center gap-3">
              <select value={weekNo} onChange={e => { setWeekNo(parseInt(e.target.value)); loadData(parseInt(e.target.value)); }} className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border outline-none">
                {availableWeeks.map(w => <option key={w} value={w}>Review Wk {w}</option>)}
              </select>
              {role === "NTPC" && <button onClick={() => setShowWeekModal(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase shadow">+ New Wk</button>}
              <button onClick={() => window.print()} className="bg-ntpc-blue text-white px-4 py-1.5 rounded-lg text-xs font-black uppercase shadow">Print MoM</button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 custom-scroll no-print relative">
           {tab === "DASHBOARD" && <window.Dashboard {...{civilTasks, mechTasks, elecTasks, drawings, actions, safetyLogs, siteStats, attendees, setAttendees, teamData, weekNo, l2Schedule, civilHistory }} />}
           {tab === "L2 SCHEDULE" && <window.L2Schedule {...{l2Schedule, setL2Schedule, role, saveActiveSheet, handleRowChange}} />}
           {tab === "EXECUTION" && <window.Execution {...{currentTasks, setCurrentTasks, activeDiscipline, setActiveDiscipline, l2Schedule, isTplDisabled, role, handleRowChange, saveActiveSheet, isLocked, toggleLock: async () => { await window.apiPost({ action: "TOGGLE_LOCK", weekNo, role, isLocked: !isLocked }); loadData(); } }} />}
           {tab === "DRAWINGS" && <window.Drawings {...{drawings, setDrawings, isTplDisabled, role, handleRowChange, saveActiveSheet}} />}
           {tab === "HSE & QA" && <window.HseQa {...{siteStats, setSiteStats, saveWeekMeta, setShowLogModal, isTplDisabled, safetyLogs, qualityLogs, toggleStatus, role, fetchAndShowImage}} />}
           {tab === "ACTIONS" && <window.Actions {...{actions, setActions, isTplDisabled, role, handleRowChange, saveActiveSheet, weekNo}} />}
        </main>

        {/* MODALS */}
        {viewImageId && (<div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 fade-in"><div className="bg-white rounded-3xl p-6 w-full max-w-2xl relative"><button onClick={() => setViewImageId(null)} className="absolute top-4 right-4 text-xl">✕</button>{imageLoading ? <div className="p-10 text-center text-xs font-bold text-slate-500">Decrypting...</div> : viewImageData ? <img src={viewImageData} className="max-h-[60vh] mx-auto rounded" /> : <p className="p-10 text-center text-red-500">Failed.</p>}</div></div>)}
        
        {showWeekModal && (<div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 fade-in"><div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"><h3 className="text-xs font-black uppercase text-ntpc-blue mb-4">Initialize Next Week</h3><input type="number" value={newWeekInput} onChange={e => setNewWeekInput(e.target.value)} className="w-full border p-2 rounded mb-4" /><div className="flex gap-2"><button onClick={() => setShowWeekModal(false)} className="flex-1 bg-slate-100 p-2 rounded text-xs font-black">Cancel</button><button onClick={async () => { setLoading(true); await window.apiPost({ action: "CREATE_WEEK", newWeekNo: parseInt(newWeekInput) }); setShowWeekModal(false); setWeekNo(parseInt(newWeekInput)); loadData(parseInt(newWeekInput)); }} className="flex-1 bg-ntpc-blue text-white p-2 rounded text-xs font-black">Create</button></div></div></div>)}

        {showLogModal && (<div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 fade-in"><div className="bg-white rounded-2xl p-6 w-full max-w-sm"><h3 className="text-xs font-black uppercase text-ntpc-blue mb-4">Log Observation</h3><select value={logForm.type} onChange={e => setLogForm({...logForm, type: e.target.value})} className="w-full border p-2 mb-2 rounded text-xs"><option value="Safety">Safety</option><option value="Quality">Quality NCR</option></select><textarea value={logForm.desc} onChange={e => setLogForm({...logForm, desc: e.target.value})} className="w-full border p-2 mb-2 rounded text-xs" placeholder="Desc..."></textarea><input type="file" accept="image/*" onChange={e => setLogForm({...logForm, file: e.target.files[0]})} className="mb-4 text-xs" /><div className="flex gap-2"><button onClick={() => setShowLogModal(false)} className="flex-1 bg-slate-100 p-2 rounded text-xs font-black">Cancel</button><button onClick={submitLog} className="flex-1 bg-ntpc-orange text-white p-2 rounded text-xs font-black">Submit</button></div></div></div>)}

        {/* PRINTABLE MOM */}
        <div id="printable-mom" className="hidden print:block font-serif bg-white text-black">
            <div className="flex items-center justify-between mb-4 mt-2 border-b border-black pb-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/NTPC_Logo.svg" alt="NTPC Logo" className="h-[55px]" />
              <div className="text-right">
                <h1 className="ntpc-header-text">Nabinagar Super Thermal Power Project</h1>
                <div className="header-gradient-line"></div>
                <h2 className="ntpc-header-sub">1980 MW (Stage-I:3X660) & 2400 MW (Stage-II:3X800) under construction</h2>
              </div>
            </div>
            <div className="flex justify-between items-end mb-4 pb-1">
              <h2 className="text-xs font-bold uppercase">Minutes of Weekly Review Meeting (WRM) — Week #{weekNo}</h2>
              <div className="text-[8px] font-bold text-right">REF: NTPC/NSTPP-II/WRM/{weekNo}<br />Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
            <h3 className="text-[9px] font-bold uppercase mb-1">1. Meeting Participants & Site Statistics</h3>
            <table className="mb-4"><thead><tr><th className="w-[35%]">Employer (NTPC)</th><th className="w-[35%]">Contractor (M/s TPL)</th><th className="w-[30%]">Site KPI</th></tr></thead><tbody><tr><td className="align-top"><ul className="list-disc pl-4 m-0">{attendees.ntpc.filter(a => a.name).map((a, i) => <li key={i}><strong>{a.name}</strong> — {a.desig}</li>)}</ul></td><td className="align-top"><ul className="list-disc pl-4 m-0">{attendees.tpl.filter(a => a.name).map((a, i) => <li key={i}><strong>{a.name}</strong> — {a.desig}</li>)}</ul></td><td className="align-top font-bold bg-[#f1f5f9]">Deployed Manpower: {siteStats.manpower}<br/>Trained Personnel: {siteStats.trained}</td></tr></tbody></table>
            <h3 className="text-[9px] font-bold uppercase mb-1">2. Execution Performance</h3>
            <table className="mb-4"><thead><tr><th>Work Front & Task</th><th className="text-center">Plan</th><th className="text-center">Actual</th><th className="text-center">Var.</th><th className="text-center">Cum. BL</th><th>Hindrance</th><th>TPL Remarks</th><th>NTPC Directives</th></tr></thead><tbody>{[...civilTasks, ...mechTasks, ...elecTasks].map((c, i) => (<tr key={i}><td><strong>{c.l2Ref}</strong><br/>{c.taskName} ({c.unit})</td><td className="text-center">{c.plan}</td><td className="text-center">{c.act}</td><td className="text-center font-bold">{(parseFloat(c.act) || 0) - (parseFloat(c.plan) || 0)}</td><td className="text-center font-bold">{c.cumBacklog}</td><td>{c.hindrance}</td><td>{c.tplRemarks}</td><td className="font-bold">{c.ntpcDirectives}</td></tr>))}</tbody></table>
            <h3 className="text-[9px] font-bold uppercase mb-1">3. Actions & Bottlenecks</h3>
            <table className="mb-6"><thead><tr><th>Action Point</th><th>Resp.</th><th className="text-center">Target</th><th className="text-center">Status</th><th>Review Comments</th></tr></thead><tbody>{actions.map((a, i) => (<tr key={i}><td><strong>{a.desc}</strong></td><td>{a.responsibility}</td><td className="text-center">{a.revisedDate || a.targetDate}</td><td className="text-center uppercase">{a.status}</td><td>{a.ntpcRemarks}</td></tr>))}</tbody></table>
            <div className="mt-12 flex justify-between text-[9px] font-bold uppercase px-8"><div className="text-center">__________________________<br/><br/>Employer Rep. (NTPC)</div><div className="text-center">__________________________<br/><br/>Contractor Rep. (M/s TPL)</div></div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
