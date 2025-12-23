import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MessageSquare, 
  Camera, 
  Wifi, 
  WifiOff, 
  MapPin, 
  AlertTriangle, 
  Plus, 
  ChevronRight, 
  X,
  Send,
  FileText,
  CloudRain,
  Sun,
  Cloud,
  Check,
  Navigation,
  Menu,
  Settings,
  LogOut
} from 'lucide-react';

// --- MOCK DATABASE (Project Execution Data) ---
const INITIAL_TASKS = [
  { id: 't1', title: 'Column Casting - 4th Floor', status: 'In Progress', priority: 'High', deadline: 'Today' },
  { id: 't2', title: 'Electrical Conduit Layout', status: 'Pending', priority: 'Medium', deadline: 'Today' },
  { id: 't3', title: 'Plastering - Wing A', status: 'Pending', priority: 'Low', deadline: 'Tomorrow' },
  { id: 't4', title: 'External Painting Prep', status: 'Pending', priority: 'Low', deadline: 'In 2 days' }
];

const INITIAL_MATERIALS = [
  { id: 'm1', item: 'OPC 53 Cement', qty: '200 Bags', status: 'Pending', reason: 'Slab Work' },
  { id: 'm2', item: 'TMT 12mm Steel', qty: '2 Tons', status: 'Approved', reason: 'Column reinforcement' },
  { id: 'm3', item: 'Sand (Fine)', qty: '3 Brass', status: 'Rejected', reason: 'High moisture', comment: 'Re-request with dry batch' }
];

const DOCS_DB = [
  { id: 'd1', type: 'Purchase Order', name: 'PO-2024-081', date: '22 Oct' },
  { id: 'd2', type: 'GST Invoice', name: 'INV-SS-992', date: '20 Oct' },
  { id: 'd3', type: 'Quotation', name: 'QUO-SKY-001', date: '15 Oct' }
];

export default function EngineerDashboard() {
  // --- CORE STATES ---
  const [activeTab, setActiveTab] = useState('home');
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('Just now');
  const [syncQueue, setSyncQueue] = useState([]); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- SITE DATA ---
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [attendance, setAttendance] = useState({ self: false, workers: 0, absent: 0 });
  const [dprSubmitted, setDprSubmitted] = useState(false);

  // --- MODALS ---
  const [showDprModal, setShowDprModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // --- OFFLINE & SYNC LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isOffline && syncQueue.length > 0) {
        setIsSyncing(true);
        setTimeout(() => {
          setSyncQueue([]);
          setIsSyncing(false);
          setLastSynced('Just now');
        }, 2000);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isOffline, syncQueue]);

  const addToSyncQueue = (action) => {
    if (isOffline) {
      setSyncQueue(prev => [...prev, action]);
    } else {
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setLastSynced('Just now');
      }, 800);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Execution Dashboard' },
    { id: 'tasks', icon: CheckCircle2, label: 'Site Tasks' },
    { id: 'materials', icon: Truck, label: 'Material Requests' },
    { id: 'chat', icon: MessageSquare, label: 'Site Comm' },
    { id: 'docs', icon: FileText, label: 'Documents' }
  ];

  // --- SUB-COMPONENTS ---



  const HomeView = () => (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Attendance & Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Attendance Status</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { setAttendance({...attendance, self: !attendance.self}); addToSyncQueue('attendance'); }}
                className={`flex-1 p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${attendance.self ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                <CheckCircle2 size={32} />
                <span className="text-sm font-black uppercase">Self Check-in</span>
              </button>
              <div className="flex-1 p-6 rounded-2xl bg-[#0B3C5D] text-white flex flex-col items-center justify-center gap-1">
                 <span className="text-4xl font-black">{attendance.workers}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Workers Present</span>
              </div>
            </div>
          </div>
          <div className="md:w-px bg-slate-100 hidden md:block"></div>
          <div className="flex-1 flex flex-col justify-center gap-4">
             <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                <p className="text-[11px] font-bold text-orange-800 leading-relaxed uppercase tracking-tight">
                  {!attendance.self ? "Unlock Daily Reporting by marking attendance" : "Attendance logged. DPR is now accessible."}
                </p>
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
               <Navigation size={14} className="text-blue-500" />
               GPS Status: <span className="text-emerald-600 uppercase">Verified (18.9N, 72.8E)</span>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Execution Summary</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-2xl font-black text-blue-700">{tasks.filter(t => t.status !== 'Completed').length}</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase">Tasks Pending</p>
             </div>
             <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-2xl font-black text-amber-700">{materials.filter(m => m.status === 'Pending').length}</p>
                <p className="text-[10px] font-bold text-amber-500 uppercase">Wait Material</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task List Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Today's Priority Tasks</h3>
             <button onClick={() => setActiveTab('tasks')} className="text-[10px] font-black text-blue-600 uppercase">Full Taskboard</button>
          </div>
          <div className="divide-y divide-slate-100">
            {tasks.slice(0, 4).map(task => (
              <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-amber-400'}`}></span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">{task.title}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{task.priority} Priority • Due Today</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Submission Tools */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-[#0B3C5D] to-[#07243b] rounded-2xl p-8 text-white flex items-center justify-between shadow-xl">
             <div className="space-y-1">
                <h3 className="text-xl font-black uppercase tracking-tighter">Daily Site Progress</h3>
                <p className="text-xs text-slate-400 font-medium">Capture work done and site photos</p>
                <button 
                  disabled={!attendance.self || dprSubmitted}
                  onClick={() => setShowDprModal(true)}
                  className={`mt-6 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${dprSubmitted ? 'bg-emerald-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 active:scale-95'}`}
                >
                  {dprSubmitted ? 'Report Completed' : 'Start DPR Entry'}
                </button>
             </div>
             <div className="hidden sm:block opacity-20">
                <Camera size={100} />
             </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Urgent Resources</h3>
              <p className="text-xs text-slate-500 mb-4">Low on cement, rebar, or sand? Submit an indent request to the main office.</p>
              <button 
                onClick={() => setShowMaterialModal(true)}
                className="w-full py-4 rounded-xl bg-slate-100 text-[#0B3C5D] font-black text-xs uppercase tracking-widest hover:bg-blue-50 border border-blue-100 flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Raise Material Request
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800">

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

        {/* Sync Status Banner */}
        {isOffline && (
          <div className="bg-amber-500 text-white text-[10px] font-black py-2 px-6 flex items-center justify-center gap-2 uppercase tracking-widest z-30 shadow-md">
            <WifiOff size={14} /> Site Offline • Changes queued for local storage
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-24 md:pb-8 bg-slate-50/30">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} addToSyncQueue={addToSyncQueue} />}
          {activeTab === 'materials' && <MaterialsView materials={materials} onAdd={() => setShowMaterialModal(true)} />}
          {activeTab === 'docs' && <DocsView docs={DOCS_DB} />}
          {activeTab === 'chat' && <ChatView syncQueue={syncQueue} setSyncQueue={setSyncQueue} />}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 md:hidden flex items-center justify-around z-50">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-orange-500' : 'text-slate-300'}`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'scale-110' : ''} />
              <span className="text-[9px] font-black uppercase">{item.id === 'home' ? 'Home' : item.id}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Modals remain essentially the same but with responsive sizing */}
      {showDprModal && <DprModal onClose={() => setShowDprModal(false)} onSave={() => { setDprSubmitted(true); setShowDprModal(false); addToSyncQueue('dpr'); }} attendance={attendance} setAttendance={setAttendance} isOffline={isOffline} />}
      {showMaterialModal && <MaterialModal onClose={() => setShowMaterialModal(false)} onSave={() => { setShowMaterialModal(false); addToSyncQueue('material-request'); }} />}
    </div>
  );
}

// --- VIEW COMPONENTS (Tasks, Materials, Docs, Chat) ---

const TasksView = ({ tasks, setTasks, addToSyncQueue }) => (
  <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in">
    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Site Taskboard</h2>
    {tasks.map(task => (
      <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${task.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {task.status === 'Completed' ? <Check /> : task.id.split('t')[1]}
          </div>
          <div>
            <h4 className={`font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${task.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{task.priority} Priority</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Due: {task.deadline}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none p-3 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 hover:bg-slate-100 transition-colors"><Plus size={18} /></button>
          <button 
            disabled={task.status === 'Completed'}
            onClick={() => { setTasks(tasks.map(t => t.id === task.id ? {...t, status: 'Completed'} : t)); addToSyncQueue('task-update'); }}
            className={`flex-[2] sm:flex-none px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#0B3C5D] text-white hover:bg-slate-700 active:scale-95'}`}
          >
            {task.status === 'Completed' ? 'Finished' : 'Mark Done'}
          </button>
        </div>
      </div>
    ))}
  </div>
);

const MaterialsView = ({ materials, onAdd }) => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Supply Requests</h2>
      <button onClick={onAdd} className="bg-[#0B3C5D] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
        <Plus size={18} /> New Request
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {materials.map(m => (
        <div key={m.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-orange-500 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-slate-800">{m.item}</h4>
            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${m.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : m.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
              {m.status}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Required Quantity:</span>
              <span className="text-slate-800">{m.qty}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Reason:</span>
              <span className="text-slate-800">{m.reason}</span>
            </div>
          </div>
          {m.comment && <p className="text-[10px] bg-rose-50 text-rose-600 p-3 rounded-lg border border-rose-100 font-medium italic">"{m.comment}"</p>}
        </div>
      ))}
    </div>
  </div>
);

const DocsView = ({ docs }) => (
  <div className="max-w-4xl mx-auto space-y-4">
    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Site Repository</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {docs.map(doc => (
        <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 mb-4 transition-colors">
            <FileText size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{doc.type}</p>
          <h4 className="font-bold text-slate-800 mb-4">{doc.name}</h4>
          <div className="flex justify-between items-center border-t border-slate-50 pt-4">
            <span className="text-[10px] font-bold text-slate-400">{doc.date}</span>
            <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Download PDF</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChatView = ({ syncQueue, setSyncQueue }) => (
  <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
       <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">VR</div>
       <div>
         <p className="text-sm font-black text-slate-800">Vivek Rathore</p>
         <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
         </p>
       </div>
    </div>
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/20">
      <div className="flex flex-col gap-1">
        <div className="max-w-[70%] bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
          <p className="text-xs text-slate-700 leading-relaxed">
            Arjun, start columns for the 4th floor only after checking rebar grade. I've sent the inspection docs to your app.
          </p>
          <p className="text-[9px] text-slate-400 mt-2 text-right">09:12 AM</p>
        </div>
      </div>
      {syncQueue.filter(q => q === 'chat').map((_, i) => (
        <div key={i} className="flex justify-end gap-1 opacity-60">
          <div className="max-w-[70%] bg-[#0B3C5D] text-white p-4 rounded-2xl rounded-tr-none shadow-sm">
            <p className="text-xs">Message queued for sync...</p>
            <p className="text-[9px] mt-2 text-right italic uppercase font-black tracking-widest">Local Cache</p>
          </div>
        </div>
      ))}
    </div>
    <div className="p-4 border-t border-slate-100">
      <div className="flex gap-2 p-2 bg-slate-100 rounded-2xl">
        <button className="p-3 text-slate-400 hover:bg-white rounded-xl transition-colors"><Camera size={20} /></button>
        <input 
          type="text" 
          placeholder="Type site update for office..." 
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
          onKeyPress={(e) => { if(e.key === 'Enter') setSyncQueue(prev => [...prev, 'chat']); }}
        />
        <button 
          onClick={() => setSyncQueue(prev => [...prev, 'chat'])}
          className="bg-orange-500 text-white p-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  </div>
);

// --- MODALS (Enhanced for Desktop) ---

const DprModal = ({ onClose, onSave, attendance, setAttendance, isOffline }) => (
  <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Daily Execution Report</h3>
        <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 shadow-sm"><X size={20} /></button>
      </div>
      <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Manual Labor Count</label>
              <input type="number" onChange={(e) => setAttendance({...attendance, workers: e.target.value})} placeholder="Total workers today" className="w-full bg-transparent border-none p-0 text-2xl font-black text-slate-800 focus:ring-0" />
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Today's Weather</label>
              <div className="flex gap-4 mt-2">
                <button className="text-orange-500 bg-white p-2 rounded-lg shadow-sm"><Sun size={20} /></button>
                <button className="text-slate-300 hover:text-slate-500 p-2 rounded-lg"><Cloud size={20} /></button>
                <button className="text-slate-300 hover:text-slate-500 p-2 rounded-lg"><CloudRain size={20} /></button>
              </div>
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Progress Description</label>
           <textarea rows="4" placeholder="Be detailed: e.g., Finished 200sqft plastering, slab ready for inspection..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-[#0B3C5D] outline-none font-medium"></textarea>
        </div>

        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Documentation (Photos)</label>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                  <Camera size={24} />
                  <span className="text-[8px] font-black uppercase mt-2">Snap {i}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
      <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
        <button onClick={onClose} className="flex-1 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:bg-white rounded-2xl transition-all">Discard</button>
        <button onClick={onSave} className="flex-2 px-10 py-4 bg-[#0B3C5D] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
          Finish & Submit {isOffline ? '(Queue)' : ''}
        </button>
      </div>
    </div>
  </div>
);

const MaterialModal = ({ onClose, onSave }) => (
  <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Resource Indent</h3>
        <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 shadow-sm"><X size={20} /></button>
      </div>
      <div className="p-8 space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Required</label>
          <input type="text" placeholder="e.g. Bricks (Red) / 20mm Aggregate" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#0B3C5D]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
            <input type="text" placeholder="e.g. 5000 units" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#0B3C5D]" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgency</label>
            <select className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#0B3C5D] appearance-none">
              <option>Normal (3-5 days)</option>
              <option className="text-rose-600">Urgent (ASAP)</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason / Site Area</label>
          <input type="text" placeholder="e.g. 4th floor slab rebaring" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#0B3C5D]" />
        </div>
      </div>
      <div className="p-8 bg-slate-50 border-t border-slate-100">
        <button 
          onClick={onSave}
          className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/30 active:scale-95 transition-all"
        >
          Send to Purchase Office
        </button>
      </div>
    </div>
  </div>
);