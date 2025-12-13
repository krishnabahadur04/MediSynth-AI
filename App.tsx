import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadCard } from './components/UploadCard';
import { ReportView } from './components/ReportView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { ProcessingState } from './components/ProcessingState';
import { generatePatientSummary } from './services/geminiService';
import { UploadedFile, AnalysisStatus, PatientAnalysisResult, ViewType } from './types';
import { AlertCircle, Sparkles } from 'lucide-react';

const MOCK_HISTORY_FALLBACK = [
  { id: 1, patient: "Patient #8492 - Smith, J.", date: "Oct 24, 2023", type: "Full Synthesis", status: "Complete" },
  { id: 2, patient: "Patient #3321 - Doe, A.", date: "Oct 22, 2023", type: "Lab Analysis", status: "Complete" },
  { id: 3, patient: "Patient #9921 - Ray, M.", date: "Oct 18, 2023", type: "Discharge Summary", status: "Complete" },
  { id: 4, patient: "Patient #1102 - T.L.", date: "Sep 30, 2023", type: "Consultation Notes", status: "Review Needed" },
  { id: 5, patient: "Patient #1105 - B.K.", date: "Sep 29, 2023", type: "Full Synthesis", status: "Complete" },
  { id: 6, patient: "Patient #2201 - M.S.", date: "Sep 28, 2023", type: "Lab Analysis", status: "Complete" },
  { id: 7, patient: "Patient #4402 - R.J.", date: "Sep 25, 2023", type: "Consultation Notes", status: "Complete" },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('analysis');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysisResult, setAnalysisResult] = useState<PatientAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (newFiles: UploadedFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleReset = () => {
    setFiles([]);
    setAnalysisResult(null);
    setStatus('idle');
    setError(null);
  };

  const handleSynthesize = async () => {
    if (files.length === 0) return;

    setStatus('analyzing');
    setError(null);

    try {
      const result = await generatePatientSummary(files);
      setAnalysisResult(result);
      setStatus('complete');

      // Save to History
      try {
        const savedHistoryStr = localStorage.getItem('medisynth_history');
        let history = savedHistoryStr ? JSON.parse(savedHistoryStr) : MOCK_HISTORY_FALLBACK;
        
        const newEntry = {
          id: Date.now(),
          patient: `Patient Analysis #${Math.floor(Math.random() * 10000)}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: "Full Synthesis",
          status: "Complete"
        };
        
        const updatedHistory = [newEntry, ...history];
        localStorage.setItem('medisynth_history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save history", e);
      }

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message || "An unexpected error occurred during synthesis.");
    }
  };

  const renderAnalysisView = () => (
    <>
      {/* Hero Section - Only visible when idle */}
      {status === 'idle' && (
         <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide mb-4">
               <Sparkles className="w-3 h-3" />
               <span>Clinical Intelligence Engine</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
              Medical Data, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Synthesized.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Transform raw patient documents, lab reports, and handwritten notes into comprehensive, timeline-based clinical summaries.
            </p>
         </div>
      )}

      {status === 'analyzing' && (
         <ProcessingState />
      )}

      {status === 'complete' && analysisResult ? (
        <ReportView result={analysisResult} onReset={handleReset} />
      ) : (
        status !== 'analyzing' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Top decorative gradient line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400"></div>

            <div className="p-8 sm:p-12">
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Start Analysis</h2>
                  <p className="text-slate-500 mt-2">Upload data sources.</p>
                </div>
                {files.length > 0 && (
                   <button
                    onClick={handleReset}
                    className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <UploadCard 
                files={files} 
                onUpload={handleFileUpload} 
                onRemove={handleRemoveFile} 
              />

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 animate-fade-in-up">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleSynthesize}
                  disabled={files.length === 0}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300
                    ${files.length > 0 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  Synthesize Patient Summary
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs font-medium text-slate-400 tracking-wider uppercase">
                  Encrypted • HIPAA Compliant Design
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentView === 'analysis' && renderAnalysisView()}
        {currentView === 'history' && <HistoryView />}
        {currentView === 'settings' && <SettingsView />}
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200/50 bg-white/50">
        <p>&copy; {new Date().getFullYear()} MediSynth AI. For demo purposes only.</p>
      </footer>
    </div>
  );
};

export default App;