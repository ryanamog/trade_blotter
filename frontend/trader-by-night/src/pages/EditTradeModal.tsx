import React, { useState, useEffect } from 'react';
import { ENV } from '../config/env';
import { type Trade,
        type BookAPIResponse,
        type BookOption,
        type CounterpartyAPIResponse,
        type CounterpartyOption,
        type TraderAPIResponse,
        type TraderOption
        } from '../types/edit_modal';

interface EditTradeModalProps {
  trade: Trade | null;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export const EditTradeModal: React.FC<EditTradeModalProps> = ({ trade, onClose, onUpdateSuccess }) => {
  const token = localStorage.getItem('trader_token');
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<string>('0.00');
  const [notionalValue, setNotionalValue] = useState<string>('0.00');  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Books
  const [book, setBook] = useState<string>(''); 
  const [bookOptions, setBookOptions] = useState<BookOption[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(false);
  // Counterparties
  const [counterparty, setCounterparty] = useState<string>(''); // Holds selected book value string
  const [counterpartyOptions, setCounterpartyOptions] = useState<CounterpartyOption[]>([]);
  const [isLoadingCounterparties, setIsLoadingCounterparties] = useState<boolean>(false)
  // Traders
  const [trader, setTrader] = useState<string>(''); // Holds selected book value string
  const [traderOptions, setTraderOptions] = useState<TraderOption[]>([]);
  const [isLoadingTraders, setIsLoadingTraders] = useState<boolean>(false)

  useEffect(() => {
    if (trade) {
      setQuantity(trade.quantity);
      setPrice(parseFloat(trade.price).toFixed(2));
      setBook(trade.book);
      setCounterparty(trade.counterparty);
      setTrader(trade.trader);
      setError(null);

      const matchingBook = bookOptions.find(
        (opt) => opt.book_name.toUpperCase() === trade.book.toUpperCase()
      );

      if (matchingBook) {
        setBook(matchingBook.book_id.toString());
      } else {
        setBook(""); 
      }

      const matchingCounterparty = counterpartyOptions.find(
        (opt) => opt.name.toUpperCase() === trade.counterparty.toUpperCase()
      );

      if (matchingCounterparty) {
        setCounterparty(matchingCounterparty.counterparty_id.toString());
      } else {
        setCounterparty(""); 
      }

      const matchingTrader = traderOptions.find(
        (opt) => opt.username.toUpperCase() === trade.trader.toUpperCase()
      );

      if (matchingTrader) {
        setTrader(matchingTrader.trader_id.toString());
      } else {
        setTrader("");
      }
    }
  }, [trade, bookOptions, counterpartyOptions, traderOptions]);

  // Listens to quantity and price
  useEffect(() => {
    const parsedPrice = parseFloat(price);

    // Check if input is a valid number 
    if (!isNaN(parsedPrice) && quantity > 0) {
      const calculated = quantity * parsedPrice;
      setNotionalValue(calculated.toFixed(2));
    } else {
      setNotionalValue('0.00');
    }
  }, [quantity, price]);

  // Books
  useEffect(() => {
    const fetchBooksLookup = async () => {
      setIsLoadingBooks(true);
      try {
        const response = await fetch(`${ENV.API_URL}/api/books`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load system book options.');
        
        const json: BookAPIResponse = await response.json();
        
        setBookOptions(json.data); 
      } catch (err) {
        console.error('Error fetching book lookups:', err);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    fetchBooksLookup();
  }, []);

   // Counterparties
  useEffect(() => {
    const fetchCounterpartiesLookup = async () => {
      setIsLoadingCounterparties(true);
      try {
        const response = await fetch(`${ENV.API_URL}/api/counterparties`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load system book options.');
        
        const json: CounterpartyAPIResponse = await response.json();
        
        setCounterpartyOptions(json.data); 
      } catch (err) {
        console.error('Error fetching counterparties lookups:', err);
      } finally {
        setIsLoadingCounterparties(false);
      }
    };

    fetchCounterpartiesLookup();
  }, []);

   // Counterparties
  useEffect(() => {
    const fetchTradersLookup = async () => {
      setIsLoadingTraders(true);
      try {
        const response = await fetch(`${ENV.API_URL}/api/traders`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load system traders options.');
        
        const json: TraderAPIResponse = await response.json();
        
        setTraderOptions(json.data); 
      } catch (err) {
        console.error('Error fetching traders lookups:', err);
      } finally {
        setIsLoadingTraders(false);
      }
    };

    fetchTradersLookup();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trade) {
      setError("No active trade selected for update.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const updatedPayload = {
      quantity: quantity,
      price: price,
      book: book,
      counterparty: counterparty,
      trader: trader
    };

    try {
      const response = await fetch(`${ENV.API_URL}/api/trades/amend/${trade.tradeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updatedPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update trade: ${response.status}`);
      }

      onUpdateSuccess();
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
              AMEND A TRADE
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
                    type="number"
                    name="quantity"
                    min="1"
                    step="1"
                    value={quantity === 0 ? '' : quantity} // Clears placeholder naturally if user wipes line
                    onChange={(e) => setQuantity(Number(e.target.value))}
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} // Keep string representation to allow decimals typing
                    placeholder="0.00"
                    className="form-control blotter-input font-mono w-full"
                    required
                  />
                </div>
              </div> 

              <div className="p-2 border rounded border-secondary d-flex justify-content-between align-items-center" style={{ backgroundColor: '#05080c' }}>
                <span className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>NOTIONAL</span>
                <span className="font-mono text-white font-weight-bold" style={{ fontSize: '0.85rem' }}>$ {parseFloat(notionalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
 
              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Book</label>
                <select
                    name="book"
                    value={book}
                    onChange={(e) => setBook(e.target.value)}
                    className="form-select blotter-select w-full text-uppercase"
                    required
                    disabled={isSubmitting || isLoadingBooks}
                  >
                    <option style={{ color: '#272728'}} value="" disabled>{isLoadingBooks ? 'Loading...' : '--- SELECT ---'}</option>
                    {bookOptions.map((opt) => (
                      <option key={opt.book_id} value={opt.book_id}>
                        {opt.book_name}
                      </option>
                    ))}
                  </select>
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Counterparties</label>
                <select
                    name="counterparty"
                    value={counterparty}
                    onChange={(e) => setCounterparty(e.target.value)}
                    className="form-select blotter-select w-full text-uppercase"
                    required
                    disabled={isSubmitting || isLoadingCounterparties}
                  >
                    <option style={{ color: '#272728'}} value="" disabled>{isLoadingCounterparties ? 'Loading...' : '--- SELECT ---'}</option>
                    {counterpartyOptions.map((opt) => (
                      <option key={opt.counterparty_id} value={opt.counterparty_id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="text-cyan-light font-mono" style={{ fontSize: '0.75rem' }}>Traders</label>
                <select
                    name="trader"
                    value={trader}
                    onChange={(e) => setTrader(e.target.value)}
                    className="form-select blotter-select w-full text-uppercase"
                    required
                    disabled={isSubmitting || isLoadingTraders}
                  >
                    <option style={{ color: '#272728'}} value="" disabled>{isLoadingTraders ? 'Loading...' : '--- SELECT ---'}</option>
                    {traderOptions.map((opt) => (
                      <option key={opt.trader_id} value={opt.trader_id}>
                        {opt.username}
                      </option>
                    ))}
                  </select>
              </div>

            </div>     

            {/* Actions Footer */}
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
              {isSubmitting ? 'Updating...' : 'Amend Trade'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
  );
};