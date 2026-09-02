window.Sidebar = function Sidebar({ tab, setTab, role, handleLogout }) {
  const menu = [
    { id: "DASHBOARD", icon: "📊", label: "Executive Summary" },
    { id: "L2 SCHEDULE", icon: "📅", label: "L2 Master Fronts" },
    { id: "EXECUTION", icon: "🏗️", label: "Discipline Execution" },
    { id: "DRAWINGS", icon: "📐", label: "Engineering & DCI" },
    { id: "HSE & QA", icon: "🛡️", label: "HSE & Quality NCR" },
    { id: "ACTIONS", icon: "⚡", label: "Bottlenecks Tracker" }
  ];

  return (
    <aside className="w-64 bg-ntpc-navy text-white flex flex-col h-screen shadow-2xl flex-shrink-0 z-50 no-print">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-ntpc-orange text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md border border-white/20">N</div>
        <div>
          <h1 className="text-xs font-black uppercase tracking-wider leading-none">Nabinagar STPP</h1>
          <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest mt-1">Stage-II Portal</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scroll">
        {menu.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${tab === t.id ? "bg-ntpc-orange text-white shadow-lg" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
            <span className="text-lg">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Logged in as: {role}</div>
        <button onClick={handleLogout} className="w-full bg-white/10 hover:bg-rose-600 hover:text-white text-slate-300 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors">
          Secure Logout
        </button>
      </div>
    </aside>
  );
};
