import React, { useState } from 'react';
import { ENV } from '../config/env';
import { type Trade } from '../types/cancel_modal';

interface CancelTradeModalProps {
  trade: Trade | null;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export const CancelTradeModal: React.FC<CancelTradeModalProps> = ({ trade, onClose, onUpdateSuccess }) => {
  const token = localStorage.getItem('trader_token');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trade) {
      setError("No active trade selected for update.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${ENV.API_URL}/api/trades/cancelled/${trade.tradeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to update trade: ${response.status}`);
      }

      onUpdateSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred updating the trade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!trade) return null;
 
  return (
     <div 
      className="modal fade show d-block overflow-hidden" 
      style={{ backgroundColor: 'rgba(5, 8, 11, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
      tabIndex={-1}
      onClick={onClose}
    >
      <div 
        className="modal-dialog m-0 ms-auto h-100 modal-drawer" 
        style={{ maxWidth: '420px' }}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="modal-content border-0 border-start blotter-card h-100 rounded-0 text-start">
          
          {/* Header */}
          <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <small className="text-secondary tracking-widest text-uppercase font-mono" style={{ fontSize: '0.78rem' }}>
              CANCEL A TRADE
            </small>
            <button 
              type="button" 
              className="pagination-btn border-0 p-0 d-flex align-items-center justify-content-center" 
              style={{ width: '24px', height: '24px', fontSize: '1.2rem', lineHeight: 1 }}
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column h-100 justify-content-between">
            <div className="modal-body p-4 d-flex flex-column gap-3 overflow-y-auto blotter-scroll">
              
              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Trade ID</label>
                <input 
                    type="text" 
                    name="trade_id" 
                    value={trade.tradeId} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
              </div>

              {/* Inputs */}
              <div className="row g-2">
                <div className="col-5 d-flex flex-column gap-1">
                  <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Symbol</label>
                  <input 
                    type="text" 
                    name="company_name" 
                    value={trade.symbol} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
                </div>
                
                <div className="col-7 d-flex flex-column gap-1">
                  <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Company Name</label>
                  <input 
                    type="text" 
                    name="company_name" 
                    value={trade.company_name} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Side</label>
                <input 
                    type="text" 
                    name="company_name" 
                    value={trade.side} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
              </div>

              <div className="row g-2">
                <div className="col-6 d-flex flex-column gap-1">
                  <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Quantity</label>
                  <input 
                    type="text" 
                    name="quantity" 
                    value={trade.quantity} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
                </div>
                <div className="col-6 d-flex flex-column gap-1">
                  <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Price ($)</label>
                  <input 
                    type="text" 
                    name="price" 
                    value={trade.price} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
                </div>
              </div> 

              <div className="p-2 border rounded border-secondary d-flex justify-content-between align-items-center" style={{ backgroundColor: '#05080c' }}>
                <span className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>NOTIONAL</span>
                <span className="font-mono text-white font-weight-bold" style={{ fontSize: '0.85rem' }}>$ {parseFloat(trade.notionalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
 
              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Book</label>
                <input 
                    type="text" 
                    name="book" 
                    value={trade.book} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Counterparties</label>
                <input 
                    type="text" 
                    name="book" 
                    value={trade.counterparty} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Traders</label>
                <input 
                    type="text" 
                    name="trader" 
                    value={trade.trader} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
              </div>

            </div>     

            {/* Footer */}
            <div className="modal-footer border-0 pt-3 pb-4 px-4 d-flex justify-content-end gap-2 bg-transparent">
              <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose} 
              disabled={isSubmitting}
              style={{ height: '32px', padding: '0 16px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn text-uppercase" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Cancel Trade'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
  );
};