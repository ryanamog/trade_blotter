import React, { useState, useEffect } from 'react';
import { ENV } from '../config/env';

import {type TradeForm, 
        type ApiResponse, 
        type TickerOption, 
        type BooksOption, 
        type ApiBooksResponse,
        type CounterpartiesOption,
        type ApiCounterpartiesResponse,
        type TradersOption,
        type ApiTradersResponse 
       } from '../types/trade_modal';


// capture user inputs
export type TradeInputFields = Omit<TradeForm, 'tradeId' | 'tradeTimestamp' | 'notionalValue' | 'status'>;

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM_STATE: TradeInputFields = {
  symbol: '',
  company_name: '',
  side: 'BUY',
  quantity: 0,
  price: '',
  trader: '',
  book: '',
  counterparty: '',
};

export const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<TradeInputFields>(INITIAL_FORM_STATE);
  const [notional, setNotional] = useState<string>('0.00');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Instruments
  const [tickerOptions, setTickerOptions] = useState<TickerOption[]>([]);
  const [isLoadingTickers, setIsLoadingTickers] = useState<boolean>(false);
  // Books
  const [booksOptions, setBooksOptions] = useState<BooksOption[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(false);
  // Counterparties
  const [counterpartiesOptions, setCounterpartiesOptions] = useState<CounterpartiesOption[]>([]);
  const [isLoadingCounterparties, setIsLoadingCounterparties] = useState<boolean>(false);
  // Traders  
  const [tradersOptions, setTradersOptions] = useState<TradersOption[]>([]);
  const [isLoadingTraders, setIsLoadingTraders] = useState<boolean>(false);

  const token = localStorage.getItem('trader_token');

  // Fetch Instruments
  useEffect(() => {
    if (!isOpen) return;

    const fetchTickers = async () => {
      setIsLoadingTickers(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`${ENV.API_URL}/api/instruments`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch token metadata references.');
      
        const result: ApiResponse = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setTickerOptions(result.data);
        } else {
          throw new Error('API reported successful connection but unexpected data payload structure.');
        }
      } catch (err: any) {
        console.error('Ticker source fetch error:', err);
      } finally {
        setIsLoadingTickers(false);
      }
    };

    fetchTickers();
  }, [isOpen]);

  // Fetch Books
  useEffect(() => {
    if (!isOpen) return;

    const fetchBooks = async () => {
      setIsLoadingBooks(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`${ENV.API_URL}/api/books`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch token metadata references.');
      
        const result: ApiBooksResponse = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setBooksOptions(result.data);
        } else {
          throw new Error('API reported successful connection but unexpected data payload structure.');
        }
      } catch (err: any) {
        console.error('Books source fetch error:', err);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    fetchBooks();
  }, [isOpen]);

  // Fetch Counterparties
  useEffect(() => {
    if (!isOpen) return;

    const fetchCounterparties = async () => {
      setIsLoadingCounterparties(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`${ENV.API_URL}/api/counterparties`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch token metadata references.');
        
        const result: ApiCounterpartiesResponse = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setCounterpartiesOptions(result.data);
        } else {
          throw new Error('API reported successful connection but unexpected data payload structure.');
        }
      } catch (err: any) {
        console.error('Counterparties source fetch error:', err);
      } finally {
        setIsLoadingCounterparties(false);
      }
    };

    fetchCounterparties();
  }, [isOpen]);

  // Fetch Traders
  useEffect(() => {
    if (!isOpen) return;

    const fetchTraders = async () => {
      setIsLoadingTraders(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`${ENV.API_URL}/api/traders`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch token metadata references.');
        
        const result: ApiTradersResponse = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setTradersOptions(result.data);
        } else {
          throw new Error('API reported successful connection but unexpected data payload structure.');
        }
      } catch (err: any) {
        console.error('Traders source fetch error:', err);
      } finally {
        setIsLoadingTraders(false);
      }
    };

    fetchTraders();
  }, [isOpen]);

  // Calculate Notional Value
  useEffect(() => {
    const qty = Number(formData.quantity) || 0;
    const prc = Number(formData.price) || 0;
    const calcNotional = qty * prc;
    
    setNotional(calcNotional.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }, [formData.quantity, formData.price]);

  if (!isOpen) return null;

  // Handle Symbol change
  const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSymbol = e.target.value;
    const matchedTicker = tickerOptions.find(t => t.symbol === selectedSymbol);

    setFormData((prev) => ({
      ...prev,
      symbol: selectedSymbol,
      company_name: matchedTicker ? matchedTicker.company_name : ''
    }));
  };

  // Handle Books change
  const handleBooksChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBook = e.target.value;

    setFormData((prev) => ({
      ...prev,
      book: selectedBook
    }));
  };

  // Handle Counterparties change
  const handleCounterpartiesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCounterparty = e.target.value;

    setFormData((prev) => ({
      ...prev,
      counterparty: selectedCounterparty
    }));
  };

  // Handle Traders change 
  const handleTadersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTraders = e.target.value;
    
    setFormData((prev) => ({
      ...prev,
      trader: selectedTraders
    }));
  };

  // Handles Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!formData.symbol.trim() || formData.quantity <= 0 || Number(formData.price) <= 0) {
      alert('Please confirm all trade metrics are positive and nonzero values.');
      return;
    }

    // Prepare payload draft 
    const outboundDraftPayload = {
      ...formData,
      trade_id: `TDR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      symbol: formData.symbol.toUpperCase(),
      book: formData.book,
      trader: formData.trader,
      counterparty: formData.counterparty,
      side: formData.side,
      quantity: formData.quantity,
      price: Number(formData.price).toFixed(2),
      timestamp: new Date().toISOString(),
      status: 'ACTIVE'
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(`${ENV.API_URL}/api/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(outboundDraftPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status code: ${response.status}`);
      }

      const data = await response.json();

      onSuccess();       
      setFormData(INITIAL_FORM_STATE);
      onClose();
    } catch (error: any) {
      console.error('API submission transaction pipe broken:', error);
      setErrorMessage(error.message || 'Network layer timeout error. Order transmission terminated.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <small className="text-cyan-light tracking-widest text-uppercase" style={{ fontSize: '0.78rem' }}>
              CREATE A TRADE
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

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column h-100 justify-content-between">
            <div className="modal-body p-4 d-flex flex-column gap-3 overflow-y-auto blotter-scroll">
              
              {errorMessage && (
                <div className="p-2 border rounded font-mono" style={{ backgroundColor: 'rgba(255, 77, 109, 0.05)', borderColor: 'rgba(255, 0, 47, 0.3)', color: '#ff5353', fontSize: '0.68rem' }}>
                  ⚠️ ERROR: {errorMessage}
                </div>
              )}

              {/* Inputs */}
              <div className="row g-2">
                <div className="col-5 d-flex flex-column gap-1">
                  <label className="text-secondary font-mono" style={{ fontSize: '0.75rem' }}>Symbol</label>
                  <select
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleSymbolChange}
                    className="form-select blotter-select w-full text-uppercase"
                    required
                    disabled={isSubmitting || isLoadingTickers}
                  >
                    <option style={{ color: '#272728'}} value="" disabled>{isLoadingTickers ? 'Loading...' : '--- SELECT ---'}</option>
                    {tickerOptions.map((opt) => (
                      <option key={opt.symbol} value={opt.symbol}>
                        {opt.symbol}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-7 d-flex flex-column gap-1">
                  <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Company Name</label>
                  <input 
                    type="text" 
                    name="company_name" 
                    value={formData.company_name} 
                    className="form-control blotter-input w-full" 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    readOnly
                    placeholder="Auto-populated"
                  />
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Side</label>
                <select
                  name="side"
                  value={formData.side}
                  onChange={handleInputChange}
                  className="form-select blotter-select w-full"
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div className="row g-2">
                <div className="col-6 d-flex flex-column gap-1">
                  <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    step="1"
                    value={formData.quantity || ''}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="form-control blotter-input font-mono w-full"
                    required
                  />
                </div>
                <div className="col-6 d-flex flex-column gap-1">
                  <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    min="0.01"
                    step="0.0001"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="form-control blotter-input font-mono w-full"
                    required
                  />
                </div>
              </div>

              <div className="p-2 border rounded border-secondary d-flex justify-content-between align-items-center" style={{ backgroundColor: '#05080c' }}>
                <span className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>NOTIONAL</span>
                <span className="font-mono text-white font-weight-bold" style={{ fontSize: '0.85rem' }}>$ {notional}</span>
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Book</label>
                <select
                    name="book"
                    value={formData.book}
                    onChange={handleBooksChange}
                    className="form-select blotter-select w-full text-uppercase"
                    required
                    disabled={isSubmitting || isLoadingBooks}
                  >
                    <option style={{ color: '#272728'}} value="" disabled>{isLoadingBooks ? 'Loading...' : '--- SELECT ---'}</option>
                    {booksOptions.map((opt) => (
                      <option key={opt.book_name} value={opt.book_name}>
                        {opt.book_name}
                      </option>
                    ))}
                  </select>
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Counterparty</label>
                <select
                    name="counterparty"
                    value={formData.counterparty}
                    onChange={handleCounterpartiesChange}
                    className="form-select blotter-select w-full text-uppercase"
                    required
                    disabled={isSubmitting || isLoadingCounterparties}
                  >
                    <option style={{ color: '#272728'}} value="" disabled>{isLoadingBooks ? 'Loading...' : '--- SELECT ---'}</option>
                    {counterpartiesOptions.map((opt) => (
                      <option key={opt.name} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Trader</label>
                <select
                    name="trader"
                    value={formData.trader}
                    onChange={handleTadersChange}
                    className="form-select blotter-select w-full text-uppercase"
                    required
                    disabled={isSubmitting || isLoadingTraders}
                  >
                    <option  style={{ color: '#272728'}} value="" disabled>{isLoadingTraders ? 'Loading...' : '--- SELECT ---'}</option>
                    {tradersOptions.map((opt) => (
                      <option key={opt.username} value={opt.username}>
                        {opt.username}
                      </option>
                    ))}
                  </select>
              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer border-0 pt-3 pb-4 px-4 d-flex justify-content-end gap-2 bg-transparent">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="submit-btn text-uppercase"
              >
                Create Trade
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
