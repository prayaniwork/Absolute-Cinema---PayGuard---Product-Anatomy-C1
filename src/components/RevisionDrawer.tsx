import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { Buddy } from './buddy/Buddy';

interface RevisionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RevisionDrawer: React.FC<RevisionDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeMilestone, requestChanges, addToast } = useProject();
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState<
    'layout' | 'typography' | 'colors' | 'copy' | 'scope_tweak'
  >('layout');

  if (!isOpen || !activeMilestone) return null;

  const currentRevisionCount = activeMilestone.revisionsUsed + 1;
  const isFinalRevision =
    currentRevisionCount === activeMilestone.revisionLimit;
  const isExceeded = currentRevisionCount > activeMilestone.revisionLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      addToast(
        'Feedback Required',
        'Please enter specific actionable revision instructions.',
        'warning'
      );
      return;
    }

    requestChanges(activeMilestone.id, feedback, category);
    setFeedback('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center gap-2">
            <Buddy name="thinking" height={56} tone="light" />
            <div>
              <h3 className="modal-title">Request Milestone Revision</h3>
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
          {/* Revision Counter Meter */}
          <div className="rev-counter-card">
            <div className="rev-counter-header">
              <span className="font-mono text-secondary">
                REVISION {currentRevisionCount} OF {activeMilestone.revisionLimit}
              </span>
              <span
                className={`rev-status-tag ${
                  isFinalRevision ? 'tag-final' : isExceeded ? 'tag-exceeded' : ''
                }`}
              >
                {isExceeded
                  ? 'LIMIT EXCEEDED'
                  : isFinalRevision
                  ? 'FINAL FREE REVISION'
                  : 'INCLUDED IN SCOPE'}
              </span>
            </div>

            {isFinalRevision && (
              <div className="rev-warning-box">
                <AlertTriangle size={15} />
                <span>
                  <strong>Note:</strong> This is your last included revision under the agreed contract. Subsequent changes require an agreed Scope Amendment.
                </span>
              </div>
            )}
          </div>

          {/* Feedback Category */}
          <div className="form-group">
            <label className="form-label">Feedback Focus Category</label>
            <div className="category-chips-grid">
              {(
                [
                  { id: 'layout', label: 'Layout & Hierarchy' },
                  { id: 'typography', label: 'Typography & Sizing' },
                  { id: 'colors', label: 'Color & Contrast' },
                  { id: 'copy', label: 'Copy & Content' },
                  { id: 'scope_tweak', label: 'Refinement / Polish' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`category-chip ${
                    category === cat.id ? 'category-chip-active' : ''
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="form-group">
            <label className="form-label">
              Detailed Revision Instructions
              <span className="label-tip">Be specific and consolidated</span>
            </label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="e.g. Please increase the primary contrast ratio on the overview metrics card, make the release CTA more prominent, and adjust mobile screen spacing..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <RotateCcw size={15} /> Submit Formal Revision
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .modal-title {
          font-size: 18px;
          font-weight: 700;
        }
        .modal-subtitle {
          font-size: 13px;
          color: var(--text-muted);
        }
        .icon-badge-amber {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: rgba(245, 158, 11, 0.15);
          color: var(--accent-amber);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
        }
        .btn-close:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.1);
        }
        .modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .rev-counter-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .rev-counter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
        }
        .rev-status-tag {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-emerald);
          font-family: var(--font-mono);
        }
        .tag-final {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }
        .tag-exceeded {
          background: rgba(244, 63, 94, 0.2);
          color: #fb7185;
        }
        .rev-warning-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #fcd34d;
          background: rgba(245, 158, 11, 0.1);
          padding: 8px 12px;
          border-radius: var(--radius-xs);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          justify-content: space-between;
        }
        .label-tip {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 400;
        }
        .category-chips-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .category-chip {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-card);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .category-chip:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }
        .category-chip-active {
          background: rgba(0, 242, 254, 0.15);
          border-color: var(--accent-cyan);
          color: #ffffff;
        }
        .form-textarea {
          width: 100%;
          background: #080b12;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--text-primary);
          resize: vertical;
          outline: none;
        }
        .form-textarea:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 12px rgba(0, 242, 254, 0.2);
        }
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </div>
  );
};
