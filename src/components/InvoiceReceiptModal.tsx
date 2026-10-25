import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { formatCurrency } from '../utils/watermark';
import {
  FileText,
  Receipt,
  Printer,
  X,
  CheckCircle2,
  ShieldCheck,
  Building,
  User,
} from 'lucide-react';

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeMilestone, project } = useProject();
  const [activeTab, setActiveTab] = useState<'invoice' | 'receipt'>('invoice');

  if (!isOpen || !activeMilestone) return null;

  const payment = activeMilestone.payment;
  const invoiceNum = payment?.invoiceNumber || 'INV-AC-2026-0042';
  const receiptNum = payment?.receiptNumber || 'REC-AC-2026-0042';
  const txnId = payment?.transactionId || 'TXN_AC_9482103';
  const paymentDate = payment?.paymentDate
    ? new Date(payment.paymentDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '20 Sep 2026';

  const amount = activeMilestone.amount;
  const gstRate = 0.18;
  const taxableAmount = Math.round(amount / (1 + gstRate));
  const gstAmount = amount - taxableAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content invoice-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Controls */}
        <div className="modal-header no-print">
          <div className="tab-pill-group">
            <button
              type="button"
              onClick={() => setActiveTab('invoice')}
              className={`doc-tab ${activeTab === 'invoice' ? 'doc-tab-active' : ''}`}
            >
              <FileText size={15} /> GST Tax Invoice
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('receipt')}
              className={`doc-tab ${activeTab === 'receipt' ? 'doc-tab-active' : ''}`}
            >
              <Receipt size={15} /> IP Transfer &amp; Settlement Receipt
            </button>
          </div>

          <div className="flex-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              title="Print / Save as PDF"
            >
              <Printer size={15} /> Print / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-close"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="document-container">
          {activeTab === 'invoice' ? (
            /* TAB 1: GST TAX INVOICE */
            <div className="printable-doc invoice-paper">
              <div className="invoice-header">
                <div>
                  <div className="company-logo-text">KINETIC STUDIOS</div>
                  <div className="company-sub-text">
                    Autonomous Creative &amp; Design Engineering Studio
                  </div>
                </div>

                <div className="invoice-meta-badge">
                  <div className="badge-title">TAX INVOICE</div>
                  <div className="badge-status-paid">PAID &amp; SETTLED</div>
                </div>
              </div>

              <div className="invoice-meta-grid">
                <div>
                  <div className="doc-label">Invoice Number</div>
                  <div className="doc-value font-mono font-bold">{invoiceNum}</div>
                </div>
                <div>
                  <div className="doc-label">Date of Issue</div>
                  <div className="doc-value">{paymentDate}</div>
                </div>
                <div>
                  <div className="doc-label">Payment Transaction</div>
                  <div className="doc-value font-mono">{txnId}</div>
                </div>
                <div>
                  <div className="doc-label">Settlement Rails</div>
                  <div className="doc-value">
                    {payment?.paymentGateway || 'Razorpay Route (Escrow)'}
                  </div>
                </div>
              </div>

              <div className="parties-row">
                <div className="party-box">
                  <div className="party-header">
                    <User size={13} /> BILLED BY (FREELANCER)
                  </div>
                  <div className="party-name">{project.freelancerName}</div>
                  <div className="party-detail">{project.freelancerTitle}</div>
                  <div className="party-detail">
                    Kinetic Studios, Bandra West, Mumbai, MH - 400050
                  </div>
                  <div className="party-detail font-mono">
                    GSTIN: {project.freelancerGstin || '27AAPCA1234F1Z5'}
                  </div>
                  <div className="party-detail">Email: {project.freelancerEmail}</div>
                </div>

                <div className="party-box">
                  <div className="party-header">
                    <Building size={13} /> BILLED TO (CLIENT)
                  </div>
                  <div className="party-name">{project.clientName}</div>
                  <div className="party-detail">{project.clientCompany}</div>
                  <div className="party-detail">
                    Koramangala 4th Block, Bengaluru, KA - 560034
                  </div>
                  <div className="party-detail font-mono">
                    GSTIN: {project.clientGstin || '27AACCN9876K1Z2'}
                  </div>
                  <div className="party-detail">Email: {project.clientEmail}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>SAC Code</th>
                    <th>Qty</th>
                    <th>Unit Rate</th>
                    <th className="text-right">Taxable Amt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{activeMilestone.title}</strong>
                      <div className="table-subtext">
                        Scope includes:{' '}
                        {activeMilestone.scopeItems.slice(0, 2).join(' • ')}
                      </div>
                    </td>
                    <td className="font-mono">998314</td>
                    <td>1</td>
                    <td className="font-mono font-bold">
                      {formatCurrency(taxableAmount, activeMilestone.currency)}
                    </td>
                    <td className="text-right font-mono font-bold">
                      {formatCurrency(taxableAmount, activeMilestone.currency)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tax & Total Calculation */}
              <div className="calculation-row">
                <div className="invoice-compliance-note">
                  <strong>Compliance Note:</strong> Facilitated via Absolute Cinema Milestone Escrow Rails. TDS applicability under Section 194-O (0.1% on e-commerce participants) verified.
                </div>

                <div className="calc-table">
                  <div className="calc-row">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-bold">
                      {formatCurrency(taxableAmount, activeMilestone.currency)}
                    </span>
                  </div>
                  <div className="calc-row">
                    <span>CGST (9.0%):</span>
                    <span className="font-mono">
                      {formatCurrency(cgst, activeMilestone.currency)}
                    </span>
                  </div>
                  <div className="calc-row">
                    <span>SGST (9.0%):</span>
                    <span className="font-mono">
                      {formatCurrency(sgst, activeMilestone.currency)}
                    </span>
                  </div>
                  <div className="calc-divider" />
                  <div className="calc-row font-bold total-invoice-value">
                    <span>Total Invoice Amount (INR):</span>
                    <span className="font-mono text-cyan">
                      {formatCurrency(amount, activeMilestone.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Seal */}
              <div className="doc-seal-row">
                <div className="seal-badge">
                  <ShieldCheck size={20} className="text-emerald" />
                  <div>
                    <div className="seal-title">ABSOLUTE CINEMA VERIFIED</div>
                    <div className="seal-sub font-mono">HASH: {txnId}-VERIFIED-RELEASE</div>
                  </div>
                </div>
                <div className="signature-box">
                  <div className="sign-line">Aryan Sharma</div>
                  <div className="sign-title">Authorized Signatory (Digital)</div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: CERTIFICATE OF DELIVERY & IP TRANSFER */
            <div className="printable-doc receipt-paper">
              <div className="receipt-certificate-banner">
                <ShieldCheck size={36} className="text-emerald" />
                <h2 className="receipt-title">
                  CERTIFICATE OF MILESTONE SETTLEMENT &amp; INTELLECTUAL PROPERTY ASSIGNMENT
                </h2>
                <div className="receipt-id font-mono">
                  CERTIFICATE REF: {receiptNum}
                </div>
              </div>

              <div className="receipt-body">
                <p className="legal-paragraph">
                  This Certificate serves as definitive legal verification that <strong>Milestone #{activeMilestone.id}</strong> (<em>&ldquo;{activeMilestone.title}&rdquo;</em>) has been completed, formally approved by the Client, and funded in full through the Absolute Cinema escrow settlement mechanism.
                </p>

                <div className="legal-covenant-box">
                  <h4 className="covenant-heading">
                    UNCONDITIONAL INTELLECTUAL PROPERTY ASSIGNMENT
                  </h4>
                  <p>
                    Effective upon the verified disbursement of settlement funds under Transaction ID{' '}
                    <strong className="font-mono">{txnId}</strong>, the Freelancer (<strong>{project.freelancerName}</strong>) hereby irrevocably grants, assigns, and transfers to the Client (<strong>{project.clientName} / {project.clientCompany}</strong>) all worldwide copyright, trademarks, design rights, and commercial ownership in the deliverable assets listed below:
                  </p>
                  <ul className="deliverable-list">
                    {activeMilestone.deliverables.map((d) => (
                      <li key={d.id}>
                        <strong>{d.fileName}</strong> ({d.title}) — Master High-Resolution Asset (Version {d.version})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="receipt-audit-grid">
                  <div className="audit-item">
                    <span className="audit-label">Milestone Value</span>
                    <span className="audit-value font-mono">
                      {formatCurrency(amount, activeMilestone.currency)}
                    </span>
                  </div>
                  <div className="audit-item">
                    <span className="audit-label">Client Platform Fee</span>
                    <span className="audit-value font-mono">
                      {formatCurrency(payment?.clientFeeAmount || 2475, activeMilestone.currency)}
                    </span>
                  </div>
                  <div className="audit-item">
                    <span className="audit-label">Freelancer Net Payout</span>
                    <span className="audit-value font-mono text-emerald">
                      {formatCurrency(payment?.freelancerNetPayout || 43425, activeMilestone.currency)}
                    </span>
                  </div>
                  <div className="audit-item">
                    <span className="audit-label">Release Timestamp</span>
                    <span className="audit-value font-mono">{paymentDate}</span>
                  </div>
                </div>

                <div className="chargeback-covenant">
                  <strong>Irrevocability of Release:</strong> Pursuant to Absolute Cinema Terms of Service Section 4.3, having inspected the watermarked deliverable and authorized release, the Client waives all chargeback and recall rights against the milestone transaction.
                </div>
              </div>

              <div className="receipt-footer">
                <div className="seal-badge">
                  <CheckCircle2 size={24} className="text-emerald" />
                  <div>
                    <div className="seal-title">CHAIN OF CUSTODY VERIFIED</div>
                    <div className="seal-sub font-mono">Zero Off-Platform Steps • Absolute Cinema Rails</div>
                  </div>
                </div>
                <div className="signature-box">
                  <div className="sign-line">{project.clientName}</div>
                  <div className="sign-title">Confirmed by Client Release Authorization</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .invoice-modal-content {
          max-width: 820px;
          background: #090d16;
          border-radius: var(--radius-xl);
        }
        .tab-pill-group {
          display: flex;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: var(--radius-md);
        }
        .doc-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: transparent;
          color: var(--text-secondary);
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .doc-tab-active {
          background: rgba(0, 242, 254, 0.15);
          color: #ffffff;
          border: 1px solid rgba(0, 242, 254, 0.35);
        }
        .document-container {
          padding: 24px;
        }
        .printable-doc {
          background: #0f1422;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 32px;
          color: var(--text-primary);
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid var(--border-subtle);
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .company-logo-text {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--accent-cyan);
        }
        .company-sub-text {
          font-size: 12px;
          color: var(--text-muted);
        }
        .invoice-meta-badge {
          text-align: right;
        }
        .badge-title {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .badge-status-paid {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.18);
          color: #34d399;
          margin-top: 4px;
        }
        .invoice-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          padding: 14px 18px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }
        .doc-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .doc-value {
          font-size: 13px;
          font-weight: 600;
        }
        .parties-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }
        .party-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          padding: 16px;
          border-radius: var(--radius-md);
        }
        .party-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--accent-cyan);
          margin-bottom: 8px;
        }
        .party-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .party-detail {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        .invoice-table th {
          text-align: left;
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-subtle);
          padding: 10px 12px;
        }
        .invoice-table td {
          padding: 14px 12px;
          font-size: 13px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .table-subtext {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .text-right { text-align: right; }
        .calculation-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          margin-bottom: 28px;
        }
        .invoice-compliance-note {
          flex: 1;
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.5;
          background: rgba(255, 255, 255, 0.02);
          padding: 12px;
          border-radius: var(--radius-sm);
        }
        .calc-table {
          width: 300px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
        }
        .calc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .calc-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 4px 0;
        }
        .total-invoice-value {
          font-size: 15px;
          padding-top: 4px;
        }
        .doc-seal-row, .receipt-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
        }
        .seal-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .seal-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .seal-sub {
          font-size: 10px;
          color: var(--text-muted);
        }
        .signature-box {
          text-align: right;
        }
        .sign-line {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sign-title {
          font-size: 11px;
          color: var(--text-muted);
        }
        /* Receipt Styles */
        .receipt-certificate-banner {
          text-align: center;
          padding: 24px 0;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .receipt-title {
          font-size: 18px;
          font-weight: 800;
          max-width: 600px;
          letter-spacing: 0.02em;
        }
        .receipt-id {
          font-size: 12px;
          color: var(--accent-emerald);
        }
        .receipt-body {
          padding: 24px 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .legal-paragraph {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .legal-covenant-box {
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 16px 20px;
          border-radius: var(--radius-md);
          font-size: 13px;
          line-height: 1.6;
        }
        .covenant-heading {
          font-size: 13px;
          font-weight: 700;
          color: #34d399;
          margin-bottom: 6px;
        }
        .deliverable-list {
          margin-top: 8px;
          margin-left: 20px;
          font-size: 12px;
        }
        .receipt-audit-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          padding: 14px;
          border-radius: var(--radius-md);
        }
        .audit-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .audit-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .audit-value {
          font-size: 13px;
          font-weight: 700;
        }
        .chargeback-covenant {
          font-size: 11px;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.03);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
        }
        @media print {
          .printable-doc {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #cccccc !important;
          }
          .doc-value, .party-name, .sign-line, .covenant-heading {
            color: #000000 !important;
          }
          .party-detail, .table-subtext, .audit-label, .doc-label {
            color: #555555 !important;
          }
        }
      `}</style>
    </div>
  );
};
