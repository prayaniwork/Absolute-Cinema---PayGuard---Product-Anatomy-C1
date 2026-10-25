import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Plus, X } from 'lucide-react';
import { Buddy } from './buddy/Buddy';

interface CreateMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMilestoneModal: React.FC<CreateMilestoneModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createMilestone, project, addToast } = useProject();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(50000);
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [revisionLimit, setRevisionLimit] = useState<number>(2);
  const [scopeText, setScopeText] = useState(
    'Figma master designs\nProduction React component specs\nResponsive viewports documentation'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Title Required', 'Please enter a title for the milestone.', 'warning');
      return;
    }

    const scopeItems = scopeText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    createMilestone({
      title,
      description,
      amount: Number(amount),
      dueDate,
      scopeItems,
      revisionLimit: Number(revisionLimit),
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center gap-2">
            <Buddy name="project" height={56} tone="light" />
            <div>
              <h3 className="modal-title">Define New Milestone</h3>
              <p className="modal-subtitle">
                Establish scope, price, and revision boundaries upfront
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
          {/* Milestone Title */}
          <div className="form-group">
            <label className="form-label">Milestone Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. High-Fidelity Interactive App UI Kit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Objective &amp; Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Provide a clear 1-2 sentence overview of what this milestone achieves..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Amount & Due Date Grid */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Milestone Amount ({project.currency})
              </label>
              <div className="input-with-icon">
                <span className="currency-prefix">₹</span>
                <input
                  type="number"
                  className="form-input with-prefix font-mono"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  min={1000}
                  step={500}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Completion Date</label>
              <input
                type="date"
                className="form-input font-mono"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Revision Limit Selector */}
          <div className="form-group">
            <label className="form-label">
              Free Revisions Included
              <span className="label-tip">PRD Default: 2 revisions</span>
            </label>
            <div className="revision-limit-chips">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRevisionLimit(num)}
                  className={`limit-chip ${
                    revisionLimit === num ? 'limit-chip-active' : ''
                  }`}
                >
                  {num} {num === 1 ? 'Round' : 'Rounds'}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Checklist Items */}
          <div className="form-group">
            <label className="form-label">
              Scope Items (1 item per line)
              <span className="label-tip">Forms the explicit deliverable criteria</span>
            </label>
            <textarea
              className="form-textarea font-mono"
              rows={3}
              value={scopeText}
              onChange={(e) => setScopeText(e.target.value)}
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
              <Plus size={15} /> Create &amp; Add to Project
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .currency-prefix {
          position: absolute;
          left: 12px;
          color: var(--accent-cyan);
          font-weight: 700;
          font-family: var(--font-mono);
        }
        .with-prefix {
          padding-left: 28px !important;
        }
        .revision-limit-chips {
          display: flex;
          gap: 8px;
        }
        .limit-chip {
          flex: 1;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-card);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .limit-chip:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }
        .limit-chip-active {
          background: rgba(0, 242, 254, 0.15);
          border-color: var(--accent-cyan);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};
