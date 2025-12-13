import React, { useEffect, useState } from 'react';
import { Brain, FileSearch, Sparkles } from 'lucide-react';

export const ProcessingState: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    { label: "Scanning documents...", icon: FileSearch, color: "text-blue-500" },
    { label: "Extracting clinical entities...", icon: Brain, color: "text-purple-500" },
    { label: "Synthesizing timeline...", icon: Sparkles, color: "text-amber-500" },
  ];

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        // Slow down as we get higher
        const increment = Math.max(1, (100 - prev) / 10 * Math.random());
        return Math.min(prev + increment, 98);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress > 30 && stage === 0) setStage(1);
    if (progress > 75 && stage === 1) setStage(2);
  }, [progress, stage]);

  const CurrentIcon = stages[stage].icon;

  return (
    <div className="w-full max-w-xl mx-auto py-12 flex flex-col items-center justify-center animate-fade-in-up">
      <div className="relative w-32 h-32 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        
        {/* Center Icon with Pulse */}
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-2 shadow-sm">
           <CurrentIcon className={`w-10 h-10 ${stages[stage].color} animate-pulse`} />
        </div>
      </div>
      
      <div className="w-full text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-800 transition-all duration-300">
          {stages[stage].label}
        </h3>
        <p className="text-slate-500">MediSynth AI is processing your patient data.</p>
        
        {/* Progress Bar Container */}
        <div className="max-w-xs mx-auto w-full">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                <span>Analysis</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* Steps visualization */}
      <div className="flex gap-2 mt-10">
        {[0, 1, 2].map((s) => (
            <div key={s} className={`h-1.5 w-12 rounded-full transition-colors duration-500 ${s <= stage ? 'bg-blue-500' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  );
};