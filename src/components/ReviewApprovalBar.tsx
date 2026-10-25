import React from 'react';
import { useProject } from '../context/ProjectContext';
import { formatCurrency } from '../utils/watermark';
import {
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock,
  FileText,
  RotateCcw,
  Sparkles,
  Receipt,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { Buddy } from './buddy/Buddy';
import type { BuddyName } from './buddy/buddyMeta';

interface ReviewApprovalBarProps {
  onOpenPaymentModal: () => void;
  onOpenUploadModal: () => void;
  onOpenRevisionDrawer: () => void;
  onOpenInvoiceModal: () => void;
}

export const ReviewApprovalBar: React.FC<ReviewApprovalBarProps> = ({
  onOpenPaymentModal,
  onOpenUploadModal,
  onOpenRevisionDrawer,
  onOpenInvoiceModal,
}) => {
  const {
    activeMilestone,
    role,
    submitMilestoneForApproval,
    approveAndReleaseMilestone,
  } = useProject();

  if (!activeMilestone) return null;

  const isReleased = activeMilestone.status === 'RELEASED';
  const isSubmitted = activeMilestone.status === 'SUBMITTED';
  const isChangesRequested = activeMilestone.status === 'CHANGES_REQUESTED';
  const isFunded = activeMilestone.status === 'FUNDED';
  const isDraft = activeMilestone.status === 'DRAFT';
  const isInProgress = activeMilestone.status === 'IN_PROGRESS';

  const revisionsRemaining =
    activeMilestone.revisionLimit - activeMilestone.revisionsUsed;
  const isRevisionLimitReached = revisionsRemaining <= 0;

  const isFreelancer = role === 'freelancer';
  const buddy: BuddyName = isReleased
    ? 'celebrating'
    : isSubmitted
      ? (isFreelancer ? 'thinking' : 'pointing')
      : isChangesRequested
        ? (isFreelancer ? 'focused' : 'thinking')
        : isInProgress
          ? (isFreelancer ? 'holding-document' : 'thinking')
          : isFunded
            ? (isFreelancer ? 'excited' : 'thumbs-up')
            : isDraft
              ? (isFreelancer ? 'thinking' : 'holding-shield')
              : 'worried';

  return (
    <div className="review-bar-wrapper glass-panel">
      <Buddy
        key={activeMilestone.status}
        name={buddy}
        height={isReleased ? 92 : 72}
        tone="light"
        pop
        className="bar-buddy"
      />
      {/* State 1: DRAFT */}
      {isDraft && (
        <div className="bar-flex-row">
          <div className="bar-info-col">
            <div className="bar-state-label text-muted">
              <Lock size={14} /> CHOKE POINT 1: ESCROW FUNDING REQUIRED
            </div>
            <p className="bar-state-desc">
              To protect the freelancer from unpaid labor, funds must be pre-authorized into escrow before work begins.
            </p>
          </div>
          <div className="bar-cta-col">
            {role === 'client' ? (
              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="btn btn-primary"
              >
                <Lock size={15} /> Fund Milestone ({formatCurrency(activeMilestone.amount, activeMilestone.currency)})
              </button>
            ) : (
              <div className="role-wait-pill">
                Waiting for client to fund milestone
              </div>
            )}
          </div>
        </div>
      )}

      {/* State 2: FUNDED (Escrow held, ready for freelancer to work) */}
      {isFunded && (
        <div className="bar-flex-row">
          <div className="bar-info-col">
            <div className="bar-state-label text-cyan">
              <ShieldCheck size={14} /> FUNDS SECURED IN ESCROW
            </div>
            <p className="bar-state-desc">
              {formatCurrency(activeMilestone.amount, activeMilestone.currency)} is committed on payment rails. Freelancer is safe to begin production.
            </p>
          </div>
          <div className="bar-cta-col">
            {role === 'freelancer' ? (
              <button
                type="button"
                onClick={onOpenUploadModal}
                className="btn btn-primary"
              >
                <FileText size={15} /> Upload &amp; Stage Deliverable
              </button>
            ) : (
              <div className="role-wait-pill text-cyan">
                ✓ Funds held safely. Freelancer is working.
              </div>
            )}
          </div>
        </div>
      )}

      {/* State 3: IN_PROGRESS (Deliverable staged, ready to submit) */}
      {isInProgress && (
        <div className="bar-flex-row">
          <div className="bar-info-col">
            <div className="bar-state-label text-cyan">
              <FileText size={14} /> DELIVERABLE STAGED FOR SUBMISSION
            </div>
            <p className="bar-state-desc">
              Deliverable has been processed with the Absolute Cinema watermark. Ready for client inspection.
            </p>
          </div>
          <div className="bar-cta-col">
            {role === 'freelancer' ? (
              <button
                type="button"
                onClick={() => submitMilestoneForApproval(activeMilestone.id)}
                className="btn btn-primary"
              >
                <Send size={15} /> Submit for Client Approval
              </button>
            ) : (
              <div className="role-wait-pill">
                Freelancer is preparing final submission
              </div>
            )}
          </div>
        </div>
      )}

      {/* State 4: SUBMITTED (Under Client Inspection) */}
      {isSubmitted && (
        <div className="bar-flex-row highlight-review-bar">
          <div className="bar-info-col">
            <div className="bar-state-label text-amber">
              <span className="pulse-dot" /> FORMAL APPROVAL GATEWAY (CHOKE POINT 3)
            </div>
            <p className="bar-state-desc">
              Client must inspect the watermarked preview. Approving releases escrow funds and instantly unlocks master files.
            </p>
          </div>
          <div className="bar-cta-col">
            {role === 'client' ? (
              <div className="action-button-group">
                <button
                  type="button"
                  onClick={onOpenRevisionDrawer}
                  className="btn btn-secondary"
                >
                  <RotateCcw size={15} />
                  <span>
                    Request Changes ({revisionsRemaining}/{activeMilestone.revisionLimit} left)
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => approveAndReleaseMilestone(activeMilestone.id)}
                  className="btn btn-success"
                >
                  <CheckCircle2 size={16} /> Approve &amp; Release Funds ({formatCurrency(activeMilestone.amount, activeMilestone.currency)})
                </button>
              </div>
            ) : (
              <div className="role-wait-pill text-amber">
                <span>Client is reviewing watermarked preview. (Awaiting Approval or Changes)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* State 5: CHANGES_REQUESTED */}
      {isChangesRequested && (
        <div className="bar-flex-row border-amber">
          <div className="bar-info-col">
            <div className="bar-state-label text-amber">
              <AlertTriangle size={14} /> REVISION REQUESTED BY CLIENT
            </div>
            <p className="bar-state-desc">
              {activeMilestone.revisions[0]?.feedback
                ? `"${activeMilestone.revisions[0].feedback}"`
                : 'Client has requested adjustments to the deliverable.'}
            </p>
            {isRevisionLimitReached && (
              <div className="revision-limit-warning font-mono">
                ⚠️ Revision limit ({activeMilestone.revisionLimit}/{activeMilestone.revisionLimit}) reached. Subsequent revisions require a Scope Amendment.
              </div>
            )}
          </div>
          <div className="bar-cta-col">
            {role === 'freelancer' ? (
              <button
                type="button"
                onClick={onOpenUploadModal}
                className="btn btn-primary"
              >
                <FileText size={15} /> Upload Revised Deliverable (v{activeMilestone.deliverables.length + 1})
              </button>
            ) : (
              <div className="role-wait-pill text-amber">
                Revision feedback logged. Waiting for revised deliverable.
              </div>
            )}
          </div>
        </div>
      )}

      {/* State 6: RELEASED (Milestone Complete!) */}
      {isReleased && (
        <div className="bar-flex-row highlight-released-bar">
          <div className="bar-info-col">
            <div className="bar-state-label text-emerald">
              <Sparkles size={14} /> MILESTONE OFFICIALLY SETTLED &amp; UNLOCKED
            </div>
            <p className="bar-state-desc">
              All deliverables unlocked for commercial use. Payout authorized to freelancer. Compliant tax invoice and IP assignment receipt ready.
            </p>
          </div>
          <div className="bar-cta-col">
            <button
              type="button"
              onClick={onOpenInvoiceModal}
              className="btn btn-secondary"
            >
              <FileCheck size={15} /> Tax Invoice
            </button>
            <button
              type="button"
              onClick={onOpenInvoiceModal}
              className="btn btn-secondary"
            >
              <Receipt size={15} /> IP Transfer Receipt
            </button>
          </div>
        </div>
      )}

      <style>{`
        .review-bar-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 18px 24px;
          border-radius: var(--radius-lg);
          background: rgba(14, 19, 31, 0.95);
          border: 1px solid var(--border-card);
        }
        .bar-flex-row {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .bar-info-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 680px;
        }
        .bar-state-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .bar-state-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.45;
        }
        .bar-cta-col {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .action-button-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .role-wait-pill {
          font-size: 12px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }
        .highlight-review-bar {
          border-left: 4px solid var(--accent-amber);
        }
        .highlight-released-bar {
          border-left: 4px solid var(--accent-emerald);
        }
        .border-amber {
          border-left: 4px solid var(--accent-rose);
        }
        .revision-limit-warning {
          font-size: 11px;
          color: #fb7185;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};
