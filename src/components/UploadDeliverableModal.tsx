import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Upload, X, Image as ImageIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { generateMockDeliverableArt } from '../utils/watermark';
import { Buddy } from './buddy/Buddy';

interface UploadDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadDeliverableModal: React.FC<UploadDeliverableModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeMilestone, uploadDeliverable } = useProject();
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const fileType = 'image' as const;
  const [mockStyle, setMockStyle] = useState<'brand' | 'app'>('brand');
  const [customDataUrl, setCustomDataUrl] = useState<string>('');

  if (!isOpen || !activeMilestone) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomDataUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deliverableUrl =
      customDataUrl || generateMockDeliverableArt(mockStyle);

    uploadDeliverable(
      activeMilestone.id,
      title || `Deliverable v${activeMilestone.deliverables.length + 1}`,
      fileName || `NexusCloud_${mockStyle}_spec.png`,
      fileType,
      deliverableUrl
    );

    setTitle('');
    setFileName('');
    setCustomDataUrl('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center gap-2">
            <Buddy name="carrying-files" height={56} tone="light" />
            <div>
              <h3 className="modal-title">Upload &amp; Stage Deliverable</h3>
              <p className="modal-subtitle">
                Milestone: <strong>{activeMilestone.title}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-close"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Choke Point Protection Callout */}
          <div className="protection-notice-box">
            <ShieldCheck size={16} className="text-cyan" />
            <span>
              <strong>Automatic Watermark Layer:</strong> Your upload will be shielded by Absolute Cinema&apos;s dynamic diagonal watermark, right-click blocker, and locked download rail until client payment release.
            </span>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Deliverable Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Master Design Tokens & Screen Architecture Spec"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* File Picker or Pre-loaded Generator */}
          <div className="form-group">
            <label className="form-label">Select File to Upload</label>
            <div className="file-dropzone">
              <input
                type="file"
                id="file-upload-input"
                className="file-hidden-input"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload-input" className="dropzone-label">
                <Upload size={24} className="text-cyan" />
                <span className="dropzone-primary">
                  {fileName ? (
                    <strong>Selected: {fileName}</strong>
                  ) : (
                    'Click to browse image or document from your device'
                  )}
                </span>
                <span className="dropzone-hint">
                  Supports PNG, JPG, WebP, SVG, PDF (Up to 50MB)
                </span>
              </label>
            </div>
          </div>

          {/* Or Select Sample High-Res Art */}
          <div className="form-group">
            <label className="form-label">
              Or use Pre-rendered Specimen Asset
            </label>
            <div className="specimen-selector">
              <button
                type="button"
                onClick={() => {
                  setMockStyle('brand');
                  setFileName('NexusCloud_BrandTokens_VectorSpec.png');
                  if (!title) setTitle('Brand Identity & Vector Token Guide');
                }}
                className={`specimen-card ${
                  mockStyle === 'brand' && !customDataUrl ? 'specimen-active' : ''
                }`}
              >
                <ImageIcon size={18} className="text-cyan" />
                <div>
                  <div className="specimen-name">Brand Tokens &amp; Logomark</div>
                  <div className="specimen-meta">High-Res Vector Design Spec</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMockStyle('app');
                  setFileName('NexusCloud_AppUI_CoreScreens.png');
                  if (!title) setTitle('Mobile App UI Architecture Spec');
                }}
                className={`specimen-card ${
                  mockStyle === 'app' && !customDataUrl ? 'specimen-active' : ''
                }`}
              >
                <Sparkles size={18} className="text-emerald" />
                <div>
                  <div className="specimen-name">Mobile UI Screen Kit</div>
                  <div className="specimen-meta">Interactive App Mockup</div>
                </div>
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Upload size={15} /> Stage &amp; Watermark Asset
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .protection-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(0, 242, 254, 0.06);
          border: 1px solid rgba(0, 242, 254, 0.25);
          padding: 12px 14px;
          border-radius: var(--radius-md);
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.45;
        }
        .protection-notice-box strong {
          color: var(--text-primary);
        }
        .form-input {
          background: #080b12;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
        }
        .form-input:focus {
          border-color: var(--accent-cyan);
        }
        .file-dropzone {
          border: 2px dashed var(--border-card);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.2s ease;
        }
        .file-dropzone:hover {
          border-color: var(--accent-cyan);
          background: rgba(0, 242, 254, 0.03);
        }
        .file-hidden-input {
          display: none;
        }
        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          gap: 8px;
          cursor: pointer;
          text-align: center;
        }
        .dropzone-primary {
          font-size: 13px;
          color: var(--text-primary);
        }
        .dropzone-hint {
          font-size: 11px;
          color: var(--text-muted);
        }
        .specimen-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .specimen-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .specimen-card:hover {
          background: rgba(255, 255, 255, 0.07);
        }
        .specimen-active {
          border-color: var(--accent-cyan);
          background: rgba(0, 242, 254, 0.08);
        }
        .specimen-name {
          font-size: 12px;
          font-weight: 700;
        }
        .specimen-meta {
          font-size: 10px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
