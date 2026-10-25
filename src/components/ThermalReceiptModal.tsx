import React from 'react';
import { useProject } from '../context/ProjectContext';
import { formatCurrency } from '../utils/watermark';
import { X, Printer, Shield } from 'lucide-react';

interface ThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { project } = useProject();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalContract = project.milestones.reduce((acc, m) => acc + m.amount, 0);
  const clientFee = Math.round(totalContract * 0.055);
  const totalSettlement = totalContract + clientFee;

  return (
    <div className="receipt-modal-backdrop" onClick={onClose}>
      <div className="receipt-modal-frame" onClick={(e) => e.stopPropagation()}>
        {/* Controls Bar */}
        <div className="receipt-top-controls no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="btn-tactile btn-tactile-secondary"
          >
            <Printer size={15} /> Print Thermal Receipt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="close-circle-btn"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Meadow Environment Background */}
        <div className="meadow-stage">
          {/* Printer Machine Dispenser Head */}
          <div className="printer-dispenser-machine">
            <div className="machine-casing">
              <div className="machine-slot">
                {/* Paper Feeding Ejection Shadow */}
                <div className="slot-depth" />
              </div>
            </div>

            {/* Emerging Thermal Paper Receipt */}
            <div className="emerging-receipt printable-receipt">
              {/* Receipt Header */}
              <div className="receipt-brand-row">
                <div className="receipt-logo">
                  <Shield size={28} className="shield-icon" strokeWidth={2.5} />
                  <span>PayGuard</span>
                </div>
                <div className="receipt-type font-mono">
                  FREELANCE MILESTONES INVOICE
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="receipt-meta-block font-mono">
                <div>Date: {new Date().toLocaleDateString('en-GB')}</div>
                <div>Invoice #: PG-FL-2026-084</div>
                <div>Client: {project.clientName} ({project.clientCompany})</div>
                <div>Freelancer: {project.freelancerName} — Design Services</div>
              </div>

              <div className="dotted-rule">
                ......................................................
              </div>

              {/* Purchased Deliverables */}
              <div className="section-title font-mono font-bold">
                PURCHASED DELIVERABLES
              </div>

              <div className="deliverables-itemized">
                {project.milestones.map((m, idx) => (
                  <div key={m.id} className="deliverable-entry">
                    <div className="entry-header">
                      <span className="entry-num font-mono">0{idx + 1}</span>
                      <strong className="entry-name">{m.title}</strong>
                      <span className="entry-price font-mono font-bold">
                        {formatCurrency(m.amount, project.currency)}
                      </span>
                    </div>
                    <div className="entry-desc font-mono">
                      - {m.scopeItems[0] || 'Completed milestone scope'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="dotted-rule">
                ......................................................
              </div>

              {/* Financial Calculation & 55/45 Split */}
              <div className="receipt-financial-table font-mono">
                <div className="receipt-calc-row">
                  <span>ORIGINAL MILESTONE SUBTOTAL:</span>
                  <span>{formatCurrency(totalContract, project.currency)}</span>
                </div>
                <div className="receipt-calc-row fee-row">
                  <span>55/45 FREELANCER ADVANTAGE (+5.5% Client Platform Fee):</span>
                  <span>+{formatCurrency(clientFee, project.currency)}</span>
                </div>
                <div className="receipt-calc-row">
                  <span>GST (18% SAC 998314):</span>
                  <span>INCLUDED</span>
                </div>
                <div className="receipt-calc-row total-settlement-row font-bold">
                  <span>TOTAL SETTLEMENT:</span>
                  <span>{formatCurrency(totalSettlement, project.currency)}</span>
                </div>
              </div>

              <div className="dotted-rule">
                ......................................................
              </div>

              {/* Timestamp & Barcode */}
              <div className="barcode-stamp-row font-mono">
                <div className="receipt-timestamp">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })} • TAMPER-SEALED
                </div>

                {/* SVG Thermal Barcode */}
                <div className="thermal-barcode">
                  <svg viewBox="0 0 280 44" className="barcode-svg">
                    <rect x="0" y="0" width="3" height="36" fill="#1D4ED8"/>
                    <rect x="5" y="0" width="1.5" height="36" fill="#1D4ED8"/>
                    <rect x="9" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="16" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="20" y="0" width="5" height="36" fill="#1D4ED8"/>
                    <rect x="28" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="33" y="0" width="3" height="36" fill="#1D4ED8"/>
                    <rect x="39" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="43" y="0" width="6" height="36" fill="#1D4ED8"/>
                    <rect x="52" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="57" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="64" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="68" y="0" width="5" height="36" fill="#1D4ED8"/>
                    <rect x="76" y="0" width="3" height="36" fill="#1D4ED8"/>
                    <rect x="82" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="86" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="93" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="98" y="0" width="6" height="36" fill="#1D4ED8"/>
                    <rect x="107" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="112" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="119" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="123" y="0" width="5" height="36" fill="#1D4ED8"/>
                    <rect x="131" y="0" width="3" height="36" fill="#1D4ED8"/>
                    <rect x="137" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="141" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="148" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="153" y="0" width="5" height="36" fill="#1D4ED8"/>
                    <rect x="161" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="166" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="173" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="177" y="0" width="6" height="36" fill="#1D4ED8"/>
                    <rect x="186" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="191" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="198" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="202" y="0" width="5" height="36" fill="#1D4ED8"/>
                    <rect x="210" y="0" width="3" height="36" fill="#1D4ED8"/>
                    <rect x="216" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="220" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="227" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="232" y="0" width="6" height="36" fill="#1D4ED8"/>
                    <rect x="241" y="0" width="2" height="36" fill="#1D4ED8"/>
                    <rect x="246" y="0" width="4" height="36" fill="#1D4ED8"/>
                    <rect x="253" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="257" y="0" width="5" height="36" fill="#1D4ED8"/>
                    <rect x="265" y="0" width="3" height="36" fill="#1D4ED8"/>
                    <rect x="271" y="0" width="1" height="36" fill="#1D4ED8"/>
                    <rect x="275" y="0" width="4" height="36" fill="#1D4ED8"/>
                  </svg>
                  <div className="barcode-code">PAYGUARD - TXN#94821-ESCROW</div>
                </div>

                {/* Circular Cobalt Stamp Seal */}
                <div className="cobalt-stamp-seal">
                  <div className="seal-outer-ring">
                    <div className="seal-text-top">PAYGUARD</div>
                    <div className="seal-text-center">ESCROW</div>
                    <div className="seal-text-bottom">VERIFIED</div>
                  </div>
                </div>
              </div>

              {/* Perforated bottom tear line */}
              <div className="receipt-bottom-tear" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .receipt-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }
        .receipt-modal-frame {
          position: relative;
          width: 100%;
          max-width: 580px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);
        }
        .receipt-top-controls {
          position: absolute;
          top: 18px;
          right: 18px;
          left: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 50;
        }
        .close-circle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }
        .close-circle-btn:hover {
          transform: scale(1.08);
        }

        /* Dreamy Sunny Wildflower Meadow Background */
        .meadow-stage {
          min-height: 820px;
          background: linear-gradient(180deg, #38bdf8 0%, #7dd3fc 35%, #86efac 65%, #22c55e 100%);
          background-image: 
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 20% 85%, #ec4899 0%, transparent 8%),
            radial-gradient(circle at 75% 82%, #f43f5e 0%, transparent 10%),
            radial-gradient(circle at 45% 92%, #db2777 0%, transparent 12%),
            radial-gradient(circle at 88% 95%, #ec4899 0%, transparent 10%);
          padding: 60px 24px 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        /* Printer Machine Dispenser */
        .printer-dispenser-machine {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .machine-casing {
          width: 100%;
          height: 52px;
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px 16px 6px 6px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), inset 0 2px 4px #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          position: relative;
          z-index: 20;
        }
        .machine-slot {
          width: 82%;
          height: 9px;
          background: #0f172a;
          border-radius: 4px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
          position: relative;
        }
        .slot-depth {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 100%);
        }

        /* The Printed Thermal Paper Receipt */
        .emerging-receipt {
          width: 90%;
          background: #ffffff;
          box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 24px 26px;
          color: #1e3a8a; /* Rich Cobalt Blue Ink */
          position: relative;
          margin-top: -3px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-radius: 0 0 4px 4px;
          animation: slideDownPaper 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDownPaper {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .receipt-brand-row {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .receipt-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 26px;
          font-weight: 800;
          color: #1d4ed8;
          letter-spacing: -0.02em;
        }
        .shield-icon {
          color: #1d4ed8;
        }
        .receipt-type {
          font-size: 11px;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.08em;
        }

        .receipt-meta-block {
          font-size: 11px;
          color: #1e3a8a;
          line-height: 1.45;
        }

        .dotted-rule {
          overflow: hidden;
          white-space: nowrap;
          font-size: 12px;
          letter-spacing: 2px;
          color: #3b82f6;
          user-select: none;
        }

        .section-title {
          font-size: 11px;
          color: #1d4ed8;
          letter-spacing: 0.05em;
        }

        .deliverables-itemized {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .deliverable-entry {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .entry-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: 12px;
        }
        .entry-num {
          font-size: 11px;
          color: #3b82f6;
          font-weight: 700;
        }
        .entry-name {
          flex: 1;
          color: #1e3a8a;
        }
        .entry-price {
          color: #1d4ed8;
        }
        .entry-desc {
          font-size: 10px;
          color: #60a5fa;
          padding-left: 20px;
        }

        .receipt-financial-table {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 11px;
        }
        .receipt-calc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .fee-row {
          color: #2563eb;
        }
        .total-settlement-row {
          font-size: 14px;
          color: #1d4ed8;
          padding-top: 4px;
        }

        .barcode-stamp-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          position: relative;
        }
        .receipt-timestamp {
          font-size: 10px;
          color: #60a5fa;
        }
        .thermal-barcode {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: 100%;
        }
        .barcode-svg {
          width: 80%;
          height: 32px;
        }
        .barcode-code {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #1d4ed8;
        }

        /* Circular Rubber Stamp Seal */
        .cobalt-stamp-seal {
          position: absolute;
          right: 0;
          bottom: 2px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 2px dashed #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-12deg);
          box-shadow: 0 1px 3px rgba(29, 78, 216, 0.15);
          background: rgba(239, 246, 255, 0.7);
        }
        .seal-outer-ring {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
        }
        .seal-text-top {
          font-size: 7px;
          font-weight: 800;
          color: #1d4ed8;
          letter-spacing: 0.05em;
        }
        .seal-text-center {
          font-size: 11px;
          font-weight: 900;
          color: #1e3a8a;
          margin: 2px 0;
        }
        .seal-text-bottom {
          font-size: 7px;
          font-weight: 800;
          color: #1d4ed8;
          letter-spacing: 0.05em;
        }

        .receipt-bottom-tear {
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 8px;
          background-image: radial-gradient(circle, transparent, transparent 50%, #ffffff 50%, #ffffff 100%);
          background-size: 12px 12px;
        }

        @media print {
          .no-print { display: none !important; }
          .meadow-stage { background: #ffffff !important; padding: 0 !important; }
          .machine-casing { display: none !important; }
          .emerging-receipt { box-shadow: none !important; width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
};
