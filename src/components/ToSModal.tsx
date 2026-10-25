import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Buddy } from './buddy/Buddy';

interface ToSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToSModal: React.FC<ToSModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center gap-2">
            <Buddy name="holding-document" height={56} tone="light" />
            <div>
              <h3 className="modal-title">Platform Clickwrap Terms of Service</h3>
              <p className="modal-subtitle">
                Absolute Cinema Milestone Trust &amp; Escrow Mediation Rails
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

        <div className="modal-body tos-body">
          <div className="tos-section">
            <h4>1. Role of Absolute Cinema</h4>
            <p>
              Absolute Cinema is a technological project mediation platform and workspace, not a bank, escrow agent, or money transmitter. All financial transactions are processed directly via authorized third-party payment infrastructure (e.g. Razorpay Route or Stripe Connect) under merchant sub-accounts. Absolute Cinema does not hold, store, or commingle client funds on its balance sheet.
            </p>
          </div>

          <div className="tos-section">
            <h4>2. Deliverable Preview &amp; Anti-Extraction Protection (Choke Point 2)</h4>
            <p>
              Deliverables staged by the Freelancer are displayed for evaluation purposes only under a protective, tamper-resistant watermark layer. The Client agrees not to extract, reverse engineer, scrape, screen-capture, or use the unreleased work in any commercial or personal capacity prior to authorizing final milestone release. All intellectual property remains 100% with the Freelancer until funds are released.
            </p>
          </div>

          <div className="tos-section">
            <h4>3. Milestone Funding &amp; Work Commencement (Choke Point 1)</h4>
            <p>
              Prior to work commencing on any defined milestone, the Client deposits funds into the dedicated payment gateway escrow route. Funds remain allocated to the specific milestone scope items agreed upon during milestone definition.
            </p>
          </div>

          <div className="tos-section">
            <h4>4. Approval, Irrevocable Release &amp; Chargeback Waiver (Choke Point 3)</h4>
            <p>
              Upon explicit click of &ldquo;Approve Deliverable &amp; Release Funds&rdquo; by the Client, the payment gateway releases net funds to the Freelancer. Because the Client has had the opportunity to inspect the watermarked preview and request revisions within the agreed revision limit, this approval is <strong>final and irrevocable</strong>. The Client explicitly waives the right to initiate credit card chargebacks, reversals, or dispute claims once approval is issued.
            </p>
          </div>

          <div className="tos-section">
            <h4>5. Intellectual Property Assignment</h4>
            <p>
              Upon verified settlement of the milestone funds into the Freelancer&apos;s account, the Freelancer automatically and unconditionally assigns all worldwide moral, commercial, and copyright interests in the final deliverable files to the Client. An official Certificate of IP Assignment is digitally generated and logged.
            </p>
          </div>

          <div className="tos-section">
            <h4>6. Revisions &amp; Scope Amendments</h4>
            <p>
              Each milestone specifies an included revision limit (standard default: 2 rounds). Revisions must pertain strictly to the defined scope. Iterations requested beyond the limit require a mutual Scope Amendment with additional milestone compensation.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-primary">
            <CheckCircle2 size={15} /> Acknowledge Terms
          </button>
        </div>
      </div>

      <style>{`
        .tos-body {
          max-height: 60vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .tos-section h4 {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .tos-section strong {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};
