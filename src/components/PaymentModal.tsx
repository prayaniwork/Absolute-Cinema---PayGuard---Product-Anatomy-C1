import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { formatCurrency, calculateSplit } from '../utils/watermark';
import {
  Lock,
  X,
  CreditCard,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { Buddy } from './buddy/Buddy';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeMilestone, fundMilestone, addToast } = useProject();
  const [paymentGateway, setPaymentGateway] = useState<
    'Simulated Escrow' | 'Razorpay Route' | 'Stripe Connect'
  >('Simulated Escrow');
  const [acceptedToS, setAcceptedToS] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !activeMilestone) return null;

  const split = calculateSplit(activeMilestone.amount);

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedToS) {
      addToast(
        'Terms of Service Required',
        'Please acknowledge the escrow authorization and chargeback waiver clause.',
        'warning'
      );
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      fundMilestone(
        activeMilestone.id,
        paymentGateway === 'Razorpay Route'
          ? 'UPI / NetBanking (Razorpay)'
          : paymentGateway === 'Stripe Connect'
          ? 'Corporate Card (Stripe)'
          : 'Instant Sandbox Escrow',
        paymentGateway
      );
      setIsProcessing(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex-center gap-2">
            <Buddy name="payment" height={56} tone="light" />
            <div>
              <h3 className="modal-title">Fund Milestone in Escrow</h3>
              <p className="modal-subtitle">
                Choke Point 1: Pre-commit funds before freelancer starts work
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

        <form onSubmit={handleFundSubmit} className="modal-body">
          {/* Milestone Target Summary */}
          <div className="milestone-target-box">
            <div className="target-title font-mono text-cyan">TARGET MILESTONE</div>
            <h4 className="target-heading">{activeMilestone.title}</h4>
            <div className="target-amount font-mono">
              {formatCurrency(activeMilestone.amount, activeMilestone.currency)}
            </div>
          </div>

          {/* 55/45 Asymmetric Split Breakdown */}
          <div className="split-breakdown-card">
            <div className="split-header">
              <span className="font-mono text-secondary">
                TRANSPARENT 55/45 FEE SETTLEMENT
              </span>
              <span className="split-badge">
                <TrendingUp size={12} /> Freelancer-Advantage
              </span>
            </div>

            <div className="split-table">
              <div className="split-row">
                <span className="text-secondary">Agreed Milestone Scope Amount:</span>
                <span className="font-mono font-bold">
                  {formatCurrency(activeMilestone.amount, activeMilestone.currency)}
                </span>
              </div>

              <div className="split-row text-cyan">
                <span>Client Platform Fee ({split.clientFeePercentage}%):</span>
                <span className="font-mono">
                  +{formatCurrency(split.clientFeeAmount, activeMilestone.currency)}
                </span>
              </div>

              <div className="split-divider" />

              <div className="split-row total-row">
                <span>Total Charged to Client:</span>
                <span className="font-mono text-cyan total-amount">
                  {formatCurrency(split.clientTotalPaid, activeMilestone.currency)}
                </span>
              </div>

              <div className="split-divider" />

              <div className="split-row text-muted text-xs">
                <span>Freelancer Platform Deduction ({split.freelancerFeePercentage}%):</span>
                <span className="font-mono">
                  -{formatCurrency(split.freelancerFeeAmount, activeMilestone.currency)}
                </span>
              </div>

              <div className="split-row text-emerald font-bold">
                <span>Net Deposited to Freelancer on Release:</span>
                <span className="font-mono">
                  {formatCurrency(split.freelancerNetPayout, activeMilestone.currency)}
                </span>
              </div>
            </div>

            {/* Savings Callout vs 20% platform cut */}
            <div className="advantage-tip">
              <Zap size={15} className="text-emerald" />
              <span>
                <strong>Why 55/45?</strong> On Fiverr (20% fee), the freelancer would lose{' '}
                <strong>{formatCurrency(split.fiverrCut, activeMilestone.currency)}</strong>. With Absolute Cinema, the freelancer takes home{' '}
                <strong>+{formatCurrency(split.freelancerSavings, activeMilestone.currency)}</strong> more!
              </span>
            </div>
          </div>

          {/* Payment Gateway Selection */}
          <div className="form-group">
            <label className="form-label">Payment Channel</label>
            <div className="gateway-options-grid">
              <button
                type="button"
                onClick={() => setPaymentGateway('Simulated Escrow')}
                className={`gateway-option ${
                  paymentGateway === 'Simulated Escrow'
                    ? 'gateway-option-active'
                    : ''
                }`}
              >
                <div className="flex-center gap-2">
                  <Zap size={16} className="text-cyan" />
                  <strong>Simulated Escrow Sandbox</strong>
                </div>
                <span className="gateway-desc">Instant 1-click state authorization</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentGateway('Razorpay Route')}
                className={`gateway-option ${
                  paymentGateway === 'Razorpay Route'
                    ? 'gateway-option-active'
                    : ''
                }`}
              >
                <div className="flex-center gap-2">
                  <CreditCard size={16} className="text-emerald" />
                  <strong>Razorpay Route (India)</strong>
                </div>
                <span className="gateway-desc">UPI, NetBanking &amp; Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentGateway('Stripe Connect')}
                className={`gateway-option ${
                  paymentGateway === 'Stripe Connect'
                    ? 'gateway-option-active'
                    : ''
                }`}
              >
                <div className="flex-center gap-2">
                  <CreditCard size={16} className="text-cyan" />
                  <strong>Stripe Connect (Global)</strong>
                </div>
                <span className="gateway-desc">International Cards &amp; Apple Pay</span>
              </button>
            </div>
          </div>

          {/* Clickwrap ToS Checkbox */}
          <label className="tos-checkbox-label">
            <input
              type="checkbox"
              checked={acceptedToS}
              onChange={(e) => setAcceptedToS(e.target.checked)}
              className="tos-checkbox"
            />
            <span className="tos-text">
              I agree to fund this milestone. I authorize funds to be held under Absolute Cinema escrow rules. Funds will release to the freelancer upon my explicit approval or mutual settlement. Chargebacks waived per ToS Section 4.
            </span>
          </label>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span>Authorizing Escrow Rails...</span>
              ) : (
                <>
                  <Lock size={15} /> Confirm &amp; Fund Escrow (
                  {formatCurrency(split.clientTotalPaid, activeMilestone.currency)})
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .icon-badge-cyan {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: rgba(0, 242, 254, 0.15);
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .milestone-target-box {
          background: rgba(0, 242, 254, 0.04);
          border: 1px solid rgba(0, 242, 254, 0.2);
          padding: 16px;
          border-radius: var(--radius-md);
        }
        .target-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .target-heading {
          font-size: 16px;
          font-weight: 700;
          margin: 4px 0 6px 0;
        }
        .target-amount {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }
        .split-breakdown-card {
          background: rgba(14, 19, 31, 0.9);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .split-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
        }
        .split-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-emerald);
          padding: 2px 7px;
          border-radius: 4px;
          font-family: var(--font-mono);
        }
        .split-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
        }
        .split-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .split-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 4px 0;
        }
        .total-row {
          font-weight: 700;
          font-size: 15px;
        }
        .total-amount {
          font-size: 17px;
        }
        .text-xs { font-size: 11px; }
        .advantage-tip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.45;
        }
        .advantage-tip strong {
          color: #34d399;
        }
        .gateway-options-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gateway-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }
        .gateway-option:hover {
          background: rgba(255, 255, 255, 0.07);
        }
        .gateway-option-active {
          border-color: var(--accent-cyan);
          background: rgba(0, 242, 254, 0.08);
        }
        .gateway-desc {
          font-size: 11px;
          color: var(--text-muted);
        }
        .tos-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          line-height: 1.45;
          background: rgba(255, 255, 255, 0.02);
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }
        .tos-checkbox {
          margin-top: 3px;
          cursor: pointer;
          accent-color: var(--accent-cyan);
        }
      `}</style>
    </div>
  );
};
