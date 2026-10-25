import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TactileCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  // Days of the week
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="tactile-calendar-container">
      {/* Mac-style Window Container */}
      <div className="calendar-window">
        {/* Window Header */}
        <div className="window-header">
          <div className="window-controls">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>

          <div className="window-title font-mono">
            PAYGUARD DELIVERY SCHEDULE &amp; ESCROW TIMELOCK
          </div>

          <div className="window-nav">
            <button
              type="button"
              className="nav-btn"
              onClick={() => setCurrentMonth('September 2026')}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="month-label font-bold">{currentMonth}</span>
            <button
              type="button"
              className="nav-btn"
              onClick={() => setCurrentMonth('November 2026')}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="calendar-grid-wrapper">
          {/* Weekday Header */}
          <div className="weekdays-row">
            {weekDays.map((day) => (
              <div key={day} className="weekday-cell font-mono">
                {day}
              </div>
            ))}
          </div>

          {/* Dates Grid with Pinned Post-its */}
          <div className="dates-grid">
            {/* Row 1 */}
            <div className="date-cell date-dim">28</div>
            <div className="date-cell date-dim">29</div>
            <div className="date-cell date-dim">30</div>
            <div className="date-cell">1</div>
            <div className="date-cell">2</div>
            <div className="date-cell">3</div>
            <div className="date-cell">4</div>

            {/* Row 2 */}
            <div className="date-cell">5</div>
            <div className="date-cell cell-with-pin">
              <span className="day-number">6</span>
              {/* Sticky Note 1: Kickoff */}
              <div className="pinned-postit postit-blue rotate-neg">
                <div className="pushpin-3d" />
                <span className="postit-text">Project Kick-off (Client Call)</span>
              </div>
            </div>
            <div className="date-cell">7</div>
            <div className="date-cell">8</div>
            <div className="date-cell">9</div>
            <div className="date-cell">10</div>
            <div className="date-cell">11</div>

            {/* Row 3 */}
            <div className="date-cell">12</div>
            <div className="date-cell cell-with-pin">
              <span className="day-number">13</span>
              {/* Sticky Note 2: Submit v1 */}
              <div className="pinned-postit postit-yellow rotate-pos">
                <div className="pushpin-3d" />
                <span className="postit-text font-bold">Submit v1 for approval</span>
              </div>
            </div>
            <div className="date-cell">14</div>

            {/* Center Doodle Cell */}
            <div className="date-cell center-doodle-cell">
              <div className="doodle-rocket">🚀</div>
              <div className="doodle-text font-hand">AUTUMN DELIVERY</div>
            </div>

            <div className="date-cell">16</div>
            <div className="date-cell cell-with-pin">
              <span className="day-number">17</span>
              {/* Sticky Note 3: 48h Review */}
              <div className="pinned-postit postit-yellow rotate-neg">
                <div className="pushpin-3d" />
                <span className="postit-text">Client 48h review window</span>
              </div>
            </div>
            <div className="date-cell">18</div>

            {/* Row 4 */}
            <div className="date-cell">19</div>
            <div className="date-cell cell-with-pin">
              <span className="day-number">20</span>
              {/* Sticky Note 4: Auto-Release */}
              <div className="pinned-postit postit-blue rotate-pos">
                <div className="pushpin-3d" />
                <span className="postit-text">Escrow funds auto-release</span>
              </div>
            </div>
            <div className="date-cell">21</div>
            <div className="date-cell">22</div>
            <div className="date-cell">23</div>
            <div className="date-cell">24</div>
            <div className="date-cell">25</div>

            {/* Row 5 */}
            <div className="date-cell">26</div>
            <div className="date-cell cell-with-pin">
              <span className="day-number">27</span>
              {/* Sticky Note 5: Final Handoff */}
              <div className="pinned-postit postit-yellow rotate-neg">
                <div className="pushpin-3d" />
                <span className="postit-text font-bold">Final Handoff &amp; Launch</span>
              </div>
            </div>
            <div className="date-cell">28</div>
            <div className="date-cell">29</div>
            <div className="date-cell">30</div>
            <div className="date-cell">31</div>
            <div className="date-cell date-dim">1</div>
          </div>
        </div>
      </div>

      <style>{`
        .tactile-calendar-container {
          margin-bottom: 28px;
        }
        .calendar-window {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 20px 40px -8px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .window-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #fafafa;
          border-bottom: 1px solid #eeeeee;
          flex-wrap: wrap;
          gap: 12px;
        }
        .window-controls {
          display: flex;
          gap: 7px;
        }
        .dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
        }
        .dot-red { background: #ff5f56; }
        .dot-yellow { background: #ffbd2e; }
        .dot-green { background: #27c93f; }

        .window-title {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.06em;
        }
        .window-nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-btn {
          background: transparent;
          border: none;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }
        .nav-btn:hover { color: #0f172a; }
        .month-label {
          font-size: 14px;
          color: #1e293b;
        }

        .calendar-grid-wrapper {
          padding: 16px 20px 24px 20px;
          background: #fdfdfd;
        }
        .weekdays-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 10px;
        }
        .weekday-cell {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          padding: 6px 0;
        }
        .dates-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-auto-rows: 92px;
          border-top: 1px solid #f1f5f9;
          border-left: 1px solid #f1f5f9;
        }
        .date-cell {
          border-right: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          padding: 8px;
          font-size: 12px;
          color: #334155;
          position: relative;
          background: #ffffff;
        }
        .date-dim {
          color: #cbd5e1;
          background: #fbfbfc;
        }
        .day-number {
          font-weight: 600;
        }
        .cell-with-pin {
          overflow: visible;
        }

        /* Tactile Sticky Note with 3D Purple Pushpin */
        .pinned-postit {
          position: absolute;
          top: 12px;
          left: 10px;
          right: 6px;
          bottom: 6px;
          padding: 10px 8px 6px 8px;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 10;
          transition: transform 0.15s ease;
          cursor: pointer;
        }
        .pinned-postit:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 20;
        }
        .postit-yellow {
          background: #fef08a;
          color: #713f12;
        }
        .postit-blue {
          background: #bae6fd;
          color: #0369a1;
        }
        .rotate-neg { transform: rotate(-3deg); }
        .rotate-pos { transform: rotate(2.5deg); }

        .postit-text {
          font-size: 10px;
          line-height: 1.25;
          font-family: var(--font-sans);
        }

        /* 3D Purple Pushpin */
        .pushpin-3d {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #c084fc 0%, #7e22ce 65%, #581c87 100%);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        /* Center Doodle */
        .center-doodle-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fafbfc;
          user-select: none;
        }
        .doodle-rocket { font-size: 24px; }
        .doodle-text {
          font-size: 15px;
          color: #64748b;
          transform: rotate(-3deg);
        }
      `}</style>
    </div>
  );
};
