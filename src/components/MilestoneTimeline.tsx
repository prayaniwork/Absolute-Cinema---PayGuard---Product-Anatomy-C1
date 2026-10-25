import React from 'react';
import { useProject } from '../context/ProjectContext';
import type { MilestoneStatus } from '../types';
import { formatCurrency } from '../utils/watermark';
import {
  CheckCircle2,
  Clock,
  Lock,
  AlertTriangle,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MilestoneTimelineProps {
  onCreateMilestoneClick: () => void;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  onCreateMilestoneClick,
}) => {
  const { project, activeMilestone, setActiveMilestoneId, role } = useProject();

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'RELEASED':
        return (
          <span className="status-pill status-pill-released">
            <CheckCircle2 size={12} /> RELEASED &amp; PAID
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="status-pill status-pill-submitted">
            <span className="pulse-dot" /> IN CLIENT REVIEW
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="status-pill status-pill-changes-requested">
            <AlertTriangle size={12} /> REVISION REQUESTED
          </span>
        );
      case 'FUNDED':
        return (
          <span className="status-pill status-pill-funded">
            <Lock size={12} /> FUNDED IN ESCROW
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="status-pill status-pill-in-progress">
            <Clock size={12} /> WORK IN PROGRESS
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="status-pill status-pill-draft">
            <Clock size={12} /> AWAITING FUNDING
          </span>
        );
    }
  };

  return (
    <aside className="timeline-container">
      <div className="timeline-header">
        <div className="timeline-title-row">
          <div className="timeline-title">
            <Layers size={18} className="text-cyan" />
            <span>MILESTONES ({project.milestones.length})</span>
          </div>
          {role === 'freelancer' && (
            <button
              type="button"
              onClick={onCreateMilestoneClick}
              className="btn btn-secondary btn-sm"
              title="Create new milestone"
            >
              <Plus size={14} /> New Milestone
            </button>
          )}
        </div>
        <p className="timeline-subtitle">
          Sequential chain of custody: Fund $\rightarrow$ Deliver $\rightarrow$ Approve $\rightarrow$ Release
        </p>
      </div>

      <div className="milestones-scroll-list">
        {project.milestones.map((milestone, index) => {
          const isActive = activeMilestone?.id === milestone.id;
          const isReleased = milestone.status === 'RELEASED';
          const isSubmitted = milestone.status === 'SUBMITTED';

          return (
            <div
              key={milestone.id}
              onClick={() => setActiveMilestoneId(milestone.id)}
              className={`milestone-card glass-panel ${isActive ? 'milestone-card-active' : ''}`}
            >
              <div className="milestone-top-row">
                <div className="milestone-seq-badge font-mono">
                  M0{index + 1}
                </div>
                <div className="status-slot">{getStatusBadge(milestone.status)}</div>
              </div>

              <h4 className="milestone-card-title">{milestone.title}</h4>

              <div className="milestone-footer-row">
                <div className="milestone-amount font-mono">
                  {formatCurrency(milestone.amount, milestone.currency)}
                </div>

                <div className="milestone-revision-info">
                  <span
                    className={`rev-pill ${
                      milestone.revisionsUsed >= milestone.revisionLimit
                        ? 'rev-pill-max'
                        : ''
                    }`}
                  >
                    {milestone.revisionsUsed}/{milestone.revisionLimit} Revs
                  </span>
                </div>
              </div>

              {/* Progress Indicator Line */}
              <div className="milestone-progress-bar">
                <div
                  className={`progress-fill ${
                    isReleased
                      ? 'fill-released'
                      : isSubmitted
                      ? 'fill-submitted'
                      : milestone.status === 'FUNDED'
                      ? 'fill-funded'
                      : 'fill-draft'
                  }`}
                  style={{
                    width: isReleased
                      ? '100%'
                      : isSubmitted
                      ? '75%'
                      : milestone.status === 'IN_PROGRESS'
                      ? '50%'
                      : milestone.status === 'FUNDED'
                      ? '25%'
                      : '8%',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Guarantee Note */}
      <div className="timeline-escrow-tip">
        <Sparkles size={14} className="text-cyan" />
        <span>
          <strong>Zero Off-Platform Leakage:</strong> All files, revisions, and invoices remain cryptographically tied to each milestone.
        </span>
      </div>

      <style>{`
        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 380px;
          flex-shrink: 0;
        }
        .timeline-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .timeline-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .timeline-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }
        .timeline-subtitle {
          font-size: 12px;
          color: var(--text-muted);
        }
        .btn-sm {
          padding: 6px 10px;
          font-size: 12px;
        }
        .milestones-scroll-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: calc(100vh - 380px);
          overflow-y: auto;
          padding-right: 4px;
        }
        .milestone-card {
          padding: 16px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .milestone-card:hover {
          background: rgba(21, 28, 46, 0.85);
          transform: translateY(-1px);
        }
        .milestone-card-active {
          border-color: var(--accent-cyan);
          background: rgba(18, 25, 42, 0.95);
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.18);
        }
        .milestone-card-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--accent-cyan);
        }
        .milestone-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .milestone-seq-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: var(--radius-xs);
        }
        .milestone-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
          margin-bottom: 12px;
        }
        .milestone-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .milestone-amount {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
        }
        .rev-pill {
          font-size: 11px;
          font-family: var(--font-mono);
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
        }
        .rev-pill-max {
          background: rgba(244, 63, 94, 0.15);
          color: #fb7185;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
        .milestone-progress-bar {
          height: 3px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        .fill-released {
          background: var(--accent-emerald);
          box-shadow: 0 0 8px var(--accent-emerald);
        }
        .fill-submitted {
          background: var(--accent-amber);
          box-shadow: 0 0 8px var(--accent-amber);
        }
        .fill-funded {
          background: var(--accent-cyan);
          box-shadow: 0 0 8px var(--accent-cyan);
        }
        .fill-draft {
          background: var(--text-muted);
        }
        .timeline-escrow-tip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: rgba(0, 242, 254, 0.04);
          border: 1px dashed rgba(0, 242, 254, 0.25);
          border-radius: var(--radius-md);
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.45;
        }
        .timeline-escrow-tip strong {
          color: var(--text-primary);
        }
        @media (max-width: 1024px) {
          .timeline-container {
            width: 100%;
          }
          .milestones-scroll-list {
            max-height: none;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }
      `}</style>
    </aside>
  );
};
