import React from 'react';
import { Settings, Shield, Zap, ChevronDown, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto" role="main" aria-label="Settings Page">
      {/* Page Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight" id="settings-heading">Settings</h2>
          <p className="text-slate-500 mt-2 text-lg">Manage your synthesis preferences and security controls.</p>
        </div>
        <button 
          type="button"
          aria-label="Save changes to settings"
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-slate-300"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8" role="form" aria-labelledby="settings-heading">
        
        {/* Model Configuration Card */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden" aria-labelledby="model-config-heading">
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600" aria-hidden="true">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 id="model-config-heading" className="text-xl font-bold text-slate-800">Model Configuration</h3>
                <p className="text-slate-500 mt-1">Fine-tune the clinical synthesis engine.</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
               <div>
                  <label htmlFor="model-select" className="block text-sm font-semibold text-slate-700 mb-2">Default AI Model</label>
                  <p id="model-select-desc" className="text-sm text-slate-500 mb-3">Select the underlying Gemini model for processing.</p>
               </div>
               <div className="relative">
                  <select 
                    id="model-select"
                    aria-describedby="model-select-desc"
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-100"
                  >
                    <option>Gemini 3 Pro (Preview)</option>
                    <option>Gemini 2.5 Flash</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
               </div>
            </div>

            <hr className="border-slate-100" aria-hidden="true" />

            <div className="flex items-center justify-between">
               <div className="pr-8">
                 <p id="enhanced-terms-label" className="font-semibold text-slate-800">Enhanced Medical Terminology</p>
                 <p id="enhanced-terms-desc" className="text-sm text-slate-500 mt-1">Enforce strict adherence to SNOMED CT and ICD-10 standards.</p>
               </div>
               <ToggleSwitch 
                  defaultChecked 
                  ariaLabelledBy="enhanced-terms-label" 
                  ariaDescribedBy="enhanced-terms-desc"
               />
            </div>
          </div>
        </section>

        {/* Security & Privacy Card */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden" aria-labelledby="privacy-heading">
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="bg-teal-100 p-3 rounded-2xl text-teal-600" aria-hidden="true">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 id="privacy-heading" className="text-xl font-bold text-slate-800">Privacy & Retention</h3>
                <p className="text-slate-500 mt-1">Control how patient data is handled and stored.</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-50/80">
               <div>
                 <p id="auto-delete-label" className="font-semibold text-slate-800">Auto-delete Uploads</p>
                 <p id="auto-delete-desc" className="text-sm text-slate-500 mt-0.5">Purge source files immediately after synthesis</p>
               </div>
               <ToggleSwitch 
                  defaultChecked 
                  ariaLabelledBy="auto-delete-label"
                  ariaDescribedBy="auto-delete-desc"
               />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-50/80">
               <div>
                 <p id="pii-redaction-label" className="font-semibold text-slate-800">PII Redaction Mode</p>
                 <p id="pii-redaction-desc" className="text-sm text-slate-500 mt-0.5">Aggressively mask names and dates in output</p>
               </div>
               <ToggleSwitch 
                  ariaLabelledBy="pii-redaction-label"
                  ariaDescribedBy="pii-redaction-desc"
               />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

interface ToggleSwitchProps {
  defaultChecked?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ defaultChecked, ariaLabelledBy, ariaDescribedBy }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      defaultChecked={defaultChecked} 
      className="sr-only peer" 
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-blue-600 transition-all"></div>
  </label>
);