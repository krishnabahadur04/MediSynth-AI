import React, { useState, useEffect } from 'react';
import { Clock, FileText, ChevronRight, Calendar, Trash2, Inbox } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 1, patient: "Patient #8492 - Smith, J.", date: "Oct 24, 2023", type: "Full Synthesis", status: "Complete" },
  { id: 2, patient: "Patient #3321 - Doe, A.", date: "Oct 22, 2023", type: "Lab Analysis", status: "Complete" },
  { id: 3, patient: "Patient #9921 - Ray, M.", date: "Oct 18, 2023", type: "Discharge Summary", status: "Complete" },
  { id: 4, patient: "Patient #1102 - T.L.", date: "Sep 30, 2023", type: "Consultation Notes", status: "Review Needed" },
  { id: 5, patient: "Patient #1105 - B.K.", date: "Sep 29, 2023", type: "Full Synthesis", status: "Complete" },
  { id: 6, patient: "Patient #2201 - M.S.", date: "Sep 28, 2023", type: "Lab Analysis", status: "Complete" },
  { id: 7, patient: "Patient #4402 - R.J.", date: "Sep 25, 2023", type: "Consultation Notes", status: "Complete" },
];

export const HistoryView: React.FC = () => {
  // Initialize state from localStorage or fallback to mock data
  const [historyItems, setHistoryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('medisynth_history');
      // If 'saved' exists (even as empty array "[]"), use it. Only use MOCK_HISTORY if null/undefined.
      return saved ? JSON.parse(saved) : MOCK_HISTORY;
    } catch (e) {
      console.error("Failed to parse history from local storage", e);
      return MOCK_HISTORY;
    }
  });

  // Save to localStorage whenever historyItems changes
  useEffect(() => {
    localStorage.setItem('medisynth_history', JSON.stringify(historyItems));
  }, [historyItems]);

  const handleRemoveItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistoryItems((prev: any[]) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" />
            Analysis History
          </h2>
          <p className="text-slate-500 mt-1">Recent synthesized reports and document batches.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-0">
        {historyItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No History Available</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Your analysis history has been cleared or no analyses have been performed yet.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto custom-scrollbar flex-1">
            <div className="divide-y divide-slate-100">
              {historyItems.map((item: any) => (
                <div key={item.id} className="relative p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{item.patient}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Complete' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                    
                    <div className="flex items-center gap-2">
                        {/* Delete Button (Visible on Hover) */}
                        <button 
                            onClick={(e) => handleRemoveItem(item.id, e)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            title="Remove item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};