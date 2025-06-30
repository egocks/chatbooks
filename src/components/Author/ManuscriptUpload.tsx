import React, { useState, useRef } from 'react';
import { Upload, FileText, Book, AlertCircle, CheckCircle, X } from 'lucide-react';
import { manuscriptService, ManuscriptUploadResult } from '../../services/manuscript.service';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

interface ManuscriptUploadProps {
  onUploadComplete: (result: ManuscriptUploadResult) => void;
  onClose: () => void;
}

export function ManuscriptUpload({ onUploadComplete, onClose }: ManuscriptUploadProps) {
  const { user } = useSupabaseAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = [
      'application/epub+zip',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
      'text/plain'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload an EPUB, DOCX, or Markdown file.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      setUploading(true);
      setError(null);

      const result = await manuscriptService.uploadManuscript(file, user.id);
      onUploadComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/epub+zip') return <Book className="h-8 w-8 text-accent-500" />;
    return <FileText className="h-8 w-8 text-primary-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-primary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-900">Upload Manuscript</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <X size={20} className="text-primary-600" />
            </button>
          </div>
          <p className="text-primary-600 mt-2">
            Upload your book in EPUB, DOCX, or Markdown format
          </p>
        </div>

        <div className="p-6">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-accent-500 bg-accent-50'
                  : 'border-primary-300 hover:border-accent-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Drop your manuscript here
              </h3>
              <p className="text-primary-600 mb-4">
                or click to browse your files
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".epub,.docx,.md,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <div className="mt-4 text-sm text-primary-500">
                <p>Supported formats: EPUB, DOCX, Markdown</p>
                <p>Maximum file size: 50MB</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-primary-900">{file.name}</h4>
                    <p className="text-sm text-primary-600">
                      {formatFileSize(file.size)} • {file.type.split('/').pop()?.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1 hover:bg-primary-200 rounded transition-colors"
                  >
                    <X size={16} className="text-primary-600" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-900">Upload Error</h4>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-accent-900">What happens next?</h4>
                    <ul className="text-accent-700 text-sm mt-1 space-y-1">
                      <li>• Your manuscript will be processed and converted to EPUB format</li>
                      <li>• Chapters will be automatically extracted</li>
                      <li>• You can then configure chat and audio settings</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setFile(null)}
                  className="flex-1 border border-primary-300 text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  Choose Different File
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload & Process'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}