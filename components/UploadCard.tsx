import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, File, Plus, Eye } from 'lucide-react';
import { UploadedFile } from '../types';

interface UploadCardProps {
  files: UploadedFile[];
  onUpload: (files: UploadedFile[]) => void;
  onRemove: (id: string) => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({ files, onUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const processedFiles: Promise<UploadedFile>[] = Array.from(fileList).map(file => {
      return new Promise<UploadedFile>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            type: file.type,
            content: base64String,
            preview: file.type.startsWith('image/') ? base64String : undefined
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(processedFiles).then(newFiles => {
      onUpload(newFiles);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/*,application/pdf,.txt"
      />

      {/* Main Drag & Drop Area */}
      <div 
        className={`
          relative group transition-all duration-300 rounded-3xl
          ${files.length === 0 ? 'min-h-[300px]' : 'min-h-[auto]'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Overlay when dragging */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-blue-50/90 border-2 border-blue-500 border-dashed rounded-3xl flex items-center justify-center animate-fade-in-up">
             <div className="text-center">
                <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                  <UploadCloud className="w-10 h-10 text-blue-500 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600">Drop files to analyze</h3>
             </div>
          </div>
        )}

        {files.length === 0 ? (
          /* Empty State */
          <div 
            onClick={triggerFileInput}
            className={`
              h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-colors
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
            `}
          >
            <div className="bg-blue-100 p-5 rounded-2xl text-blue-600 mb-6 shadow-sm">
              <UploadCloud className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Upload Patient Data</h3>
            <p className="text-slate-500 mt-2 text-center max-w-md">
              Drag & drop medical documents, images, or notes here.
              <br/>
              <span className="text-xs text-slate-400 mt-2 block">Supports JPG, PNG, PDF</span>
            </p>
          </div>
        ) : (
          /* File Grid with "Add More" card */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="group relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center aspect-[4/3] justify-center overflow-hidden"
              >
                {/* Actions - Always visible for better UX */}
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                   <button 
                    onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                    className="p-1.5 bg-white text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full shadow-sm border border-slate-100 transition-colors"
                    title="Preview file"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(file.id); }}
                    className="p-1.5 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm border border-slate-100 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-3 transform group-hover:scale-105 transition-transform duration-300">
                  {file.preview ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                      <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center">
                        {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                
                <div className="w-full px-2">
                   <p className="text-sm font-semibold text-slate-700 truncate w-full" title={file.name}>{file.name}</p>
                   <p className="text-xs text-slate-400 truncate mt-0.5">{file.type.split('/')[1]?.toUpperCase() || 'FILE'}</p>
                </div>
              </div>
            ))}

            {/* Add More Button (acts as Drop Zone) */}
            <div 
              onClick={triggerFileInput}
              className={`
                border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer aspect-[4/3] hover:border-blue-400 hover:bg-slate-50 transition-colors group
                ${isDragging ? 'bg-blue-50 border-blue-500' : ''}
              `}
            >
               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors mb-2">
                 <Plus className="w-6 h-6" />
               </div>
               <span className="text-sm font-medium text-slate-500 group-hover:text-blue-600">Add File</span>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in-up" 
          onClick={() => setPreviewFile(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
             <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  {getFileIcon(previewFile.type)}
                  <div>
                    <h3 className="font-bold text-slate-800">{previewFile.name}</h3>
                    <p className="text-xs text-slate-500">{previewFile.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="flex-1 overflow-auto bg-slate-100 p-6 flex items-center justify-center">
                {previewFile.type.startsWith('image/') ? (
                   <img 
                     src={previewFile.content} 
                     alt={previewFile.name} 
                     className="max-w-full max-h-full object-contain rounded-lg shadow-sm" 
                   />
                ) : previewFile.type === 'application/pdf' ? (
                   <iframe 
                     src={previewFile.content} 
                     className="w-full h-full min-h-[500px] rounded-lg shadow-sm bg-white" 
                     title="PDF Preview"
                   />
                ) : (
                   <div className="text-center p-12">
                     <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                     <p className="text-slate-500 font-medium">Preview not available for this file type.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};