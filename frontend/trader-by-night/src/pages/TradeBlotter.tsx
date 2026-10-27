import React, { useState, useEffect, useMemo, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ENV } from '../config/env';
import logo from '../assets/TPICAP_Master_logo_RGB.png';

// Import modal forms
import { TradeModal } from './TradeModal'; 
import { EditTradeModal } from './EditTradeModal'; 
import { CancelTradeModal } from './CancelTradeModal'; 
// Import components
import LiveClock from '../components/LiveClock';
// Import hooks
import { useServerSentEvents } from '../hooks/useServerSentEvents';
// Import types
import {type Trade, type SortOrder, type ApiResponse } from '../types/trade_blotter';

// Define the shape of our column filters state
type TradeFilters = Partial<Record<keyof Trade, string>>;

// For the Toast 
interface ToastConfig {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface TradeBlotterProps {
  onLogout: () => void;
}

export const TradeBlotter: React.FC<TradeBlotterProps> = ({ onLogout }) => {
  const [filters, setFilters] = useState<TradeFilters>({});
  const [toast, setToast] = useState<ToastConfig>({
    show: false,
    message: '',
    type: 'success',
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<keyof Trade | null>('tradeTimestamp'); // Default sorting
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedTradeForEdit, setSelectedTradeForEdit] = useState<Trade | null>(null);
  const [selectedTradeForCancel, setSelectedTradeForCancel] = useState<Trade | null>(null);

  const token = localStorage.getItem('trader_token');
  
  // Trigger Server-Sent Events Live Stream
  const { data, error, connectionStatus } = useServerSentEvents<ApiResponse>(
    `${ENV.API_URL}/api/trades/live-stream`,
    token ?? ''
  );

  const isLoading = connectionStatus === 'connecting' && !data;
  const streamError = error || connectionStatus === 'disconnected' ? 'Live stream disconnected.' : null;

  // Extract trades
  const trades = useMemo(() => {
    return data?.success && Array.isArray(data.data) ? data.data : [];
  }, [data]);

  // Triggered by a successful Registration
  const handleRegistrationSuccess = () => {
    setIsModalOpen(false);   
    // Show toaster
    setToast({
      show: true,
      message: `Create trade successfully. Streaming synchronization active.`,
      type: 'success',
    });
  };

  // Triggered by a successful Update
  const handleUpdateSuccess = () => {
    setSelectedTradeForEdit(null); 
    // Show toaster
    setToast({
      show: true,
      message: 'Update trade successful. Streaming synchronization active.',
      type: 'success',
    });
  };
  
  // Auto-dismiss toaster
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000); // 3 seconds
      
      return () => clearTimeout(timer); 
    }
  }, [toast.show]);

  // Filtering Logic
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      // Loop over every column filter that has a value typed into it
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        
        const tradeValue = trade[key as keyof Trade];
        
        // Exact matching or partial string search
        return String(tradeValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    });
  }, [trades, filters]);

  // Reset pagination indexes back to 1 when a column sort triggers
  const handleSort = (key: keyof Trade) => {
    setCurrentPage(1);
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Perform sorting operations
  const sortedTrades = useMemo(() => {
    const dataCopy = [...filteredTrades];
    if (!sortKey) return dataCopy;

    return dataCopy.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      // Parse string digits to actual floating numbers
      if (sortKey === 'price' || sortKey === 'notionalValue') {
        const numA = parseFloat(valA as string);
        const numB = parseFloat(valB as string);
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
      if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTrades, sortKey, sortOrder]);
  
  // Pagination Boundaries
  const totalPages = Math.ceil(sortedTrades.length / rowsPerPage);

  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedTrades.slice(startIndex, endIndex);
  }, [sortedTrades, currentPage, rowsPerPage]);
    
  const SortIndicator = ({ columnKey }: { columnKey: keyof Trade }) => {
    if (sortKey !== columnKey) return <span className="text-slate-600 ml-1">↕</span>;
    return sortOrder === 'asc' ? <span className="text-emerald-400 ml-1">▲</span> : <span className="text-emerald-400 ml-1">▼</span>;
  };

  // Handle typing input changes safely per column
  const handleFilterChange = (columnKey: keyof Trade, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
    setCurrentPage(1);
  };

  if (isLoading) {
    <div className="loading-container">
      Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
    </div>
  };
 
  return (
    <div className="blotter-wrapper min-vh-100 text-light py-3">
       {/* Toaster */}
      {toast.show && (
        <div style={{
          ...toastOverlayStyle,
          backgroundColor: toast.type === 'success' ? '#0a0e14' : '#0a0e14'
        }}>
          <span style={{ marginRight: '8px' }}>✓</span> {toast.message}
        </div>
      )}

      {/* Top Navigation / Status Bar */}
      <header className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-dark px-3">
        <div className="d-flex align-items-center gap-3">
          <div className="brand-logo d-flex align-items-center justify-content-center fw-bold">
            <img src={logo} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} />
          </div>
          <div  style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h1 className="h6 mb-0 fw-bold letter-spacing-1 text-white">TP ICAP</h1>
            <small className="text-secondary tracking-widest text-uppercase font-mono" style={{ fontSize: '0.68rem' }}>
              BROKER DASHBOARD &middot; Trade Blotter
            </small>
          </div>
        </div>
        <div className="d-flex">
          <LiveClock />
          <button 
            type="button" 
            className="logout-btn font-mono" 
            onClick={onLogout}
            style={{ height: '38px', padding: '0 10px', fontWeight: 600 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-power" viewBox="0 0 16 16">
              <path d="M7.5 1v7h1V1z"/>
              <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Blotter Container */}
      <main className="blotter-card border rounded p-3 ms-4 me-4">
        <div className="mb-3 d-flex flex-row justify-content-between align-items-center">
          <small className="text-secondary tracking-widest text-uppercase" style={{ fontSize: '0.78rem'}}>
            TRADE HISTORY
          </small>
          {/* Create a Trade */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="submit-btn"
          >
            + &nbsp;Create A Trade
          </button>
        </div>

        {/* Table view */}
        <div className="sale-panel table-responsive blotter-scroll">
          <table className="table table-dark table-borderless align-middle mb-0 font-mono small">
            <thead>
              <tr className="border-secondary-subtle header-labels text-secondary">
                <th onClick={() => handleSort('tradeTimestamp')} className="cursor-pointer hover:bg-slate-800/50 transition-colors">TIME <SortIndicator columnKey="tradeTimestamp" /></th>
                <th onClick={() => handleSort('tradeId')} className="cursor-pointer hover:bg-slate-800/50 transition-colors">TRADE ID <SortIndicator columnKey="tradeId" /></th>
                <th onClick={() => handleSort('status')} className="cursor-pointer hover:bg-slate-800/50 transition-colors">STATUS <SortIndicator columnKey="status" /></th>
                <th onClick={() => handleSort('symbol')} className="cursor-pointer hover:bg-slate-800/50 transition-colors">SYMBOL <SortIndicator columnKey="symbol" /></th>
                <th onClick={() => handleSort('side')} className="cursor-pointer hover:bg-slate-800/50 transition-colors">SIDE <SortIndicator columnKey="side" /></th>
                <th onClick={() => handleSort('quantity')} className="cursor-pointer hover:bg-slate-800/50 transition-colors text-end">QUANTITY <SortIndicator columnKey="quantity" /></th>
                <th onClick={() => handleSort('price')} className="cursor-pointer hover:bg-slate-800/50 transition-colors text-end">PRICE <SortIndicator columnKey="price" /></th>
                <th onClick={() => handleSort('notionalValue')} className="cursor-pointer hover:bg-slate-800/50 transition-colors text-end">NOTIONAL <SortIndicator columnKey="notionalValue" /></th>
                <th onClick={() => handleSort('book')} className="cursor-pointer hover:bg-slate-800/50 transition-colors">BOOK <SortIndicator columnKey="book" /></th>
                <th onClick={() => handleSort('counterparty')} className="cursor-pointer hover:bg-slate-800/50 transition-colors">COUNTERPARTY <SortIndicator columnKey="counterparty" /></th>
                <th onClick={() => handleSort('trader')} className="cursor-pointer hover:bg-slate-800/50 transition-colors">TRADER <SortIndicator columnKey="trader" /></th>
                <th className="cursor-pointer hover:bg-slate-800/50 transition-colors">OPTIONS</th>
              </tr>
              {/* Filter row */}
              <tr className="filter-row">
                <td>
                  <input
                    type="text"
                    placeholder="Filter time..."
                    className="blotter-input w-100"
                    value={filters.tradeTimestamp || ''}
                    onChange={(e) => handleFilterChange('tradeTimestamp', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Filter ID..."
                    className="blotter-input w-100"
                    value={filters.tradeId || ''}
                    onChange={(e) => handleFilterChange('tradeId', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="blotter-select w-100"
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="AMENDED">AMENDED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Filter ticker..."
                    className="blotter-input w-100"
                    value={filters.symbol || ''}
                    onChange={(e) => handleFilterChange('symbol', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="blotter-select w-100"
                    value={filters.side || ''}
                    onChange={(e) => handleFilterChange('side', e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Filter quantity..."
                    className="blotter-input w-100"
                    value={filters.quantity || ''}
                    onChange={(e) => handleFilterChange('quantity', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Filter price..."
                    className="blotter-input w-100"
                    value={filters.price || ''}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Filter notional..."
                    className="blotter-input w-100"
                    value={filters.notionalValue || ''}
                    onChange={(e) => handleFilterChange('notionalValue', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Filter book..."
                    className="blotter-input w-100"
                    value={filters.book || ''}
                    onChange={(e) => handleFilterChange('book', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Filter counterparty..."
                    className="blotter-input w-100"
                    value={filters.counterparty || ''}
                    onChange={(e) => handleFilterChange('counterparty', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Filter trader..."
                    className="blotter-input w-100"
                    value={filters.trader || ''}
                    onChange={(e) => handleFilterChange('trader', e.target.value)}
                  />
                </td>
              </tr>
            </thead>
            <tbody>
               {paginatedTrades.map((trade) => (
                <tr key={trade.tradeId} className="blotter-row">
                  <td className="text-secondary">{trade.tradeTimestamp}</td>
                  <td className="text-light">
                    {trade.tradeId}
                  </td>
                  <td>
                    <span className={`status ${trade.status.toLowerCase()}`}>
                      {trade.status}
                    </span>
                  </td>
                  <td>
                    <span className="fw-semibold text-light me-1">{trade.symbol}</span>
                    <span className="text-secondary small">{trade.company_name}</span>
                  </td>
                  <td>
                    <span className={`side ${trade.side.toLowerCase()}`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="text-end text-light">{trade.quantity.toLocaleString()}</td>
                  <td className="text-end text-light">
                    {parseFloat(trade.price).toFixed(2)}
                  </td>
                  <td className="text-end fw-medium text-light">
                    {parseFloat(trade.notionalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td> 
                  <td className="text-secondary">{trade.book}</td>
                  <td className="text-secondary">{trade.counterparty}</td>
                  <td className="text-secondary">{trade.trader}</td>
                  <td>
                    {/* Options control */}
                    {(trade.status === 'ACTIVE' || trade.status === 'AMENDED') && (
                      <button
                        className="me-2"
                        title="Amend"
                        type="button"
                        onClick={() => setSelectedTradeForEdit(trade)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff9800',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          textAlign: 'left',
                          fontWeight: 500
                          
                        }}
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-folder2-open" viewBox="0 0 16 16">
    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z"/>
  </svg>
                      </button>
                    )}
 
                    {(trade.status === 'ACTIVE' || trade.status === 'AMENDED') && (
                      <button
                        className="me-2"
                        title="Cancel"
                        type="button"
                        onClick={() => setSelectedTradeForCancel(trade)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f2002c',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          textAlign: 'left',
                          fontWeight: 500
                        }}
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
  </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls Footer */}
        <div className="blotter-footer d-flex justify-content-end flex-row justify-between items-center mt-4 p-3 rounded gap-4" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="blotter-select focus:outline-none ms-2"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="font-mono text-cyan-light">
            Showing <span className="text-white">{(currentPage - 1) * rowsPerPage + 1}</span> to{' '}
            <span className="text-white">{Math.min(currentPage * rowsPerPage, sortedTrades.length)}</span> of{' '}
            <span className="text-cyan">{sortedTrades.length}</span> records
          </div>

          <div className="flex items-center gap-3" style={{ display: 'flex'}}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              PREV
            </button>
            
            <div className="page-indicator text-xs mt-1">
              PAGE <strong>{currentPage}</strong> / {totalPages || 1}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="pagination-btn"
            >
              NEXT
            </button>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      <TradeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />

      {/* Amend Modal */}
      <EditTradeModal
        trade={selectedTradeForEdit}
        onClose={() => setSelectedTradeForEdit(null)}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Cancel Modal */}
      <CancelTradeModal
        trade={selectedTradeForCancel}
        onClose={() => setSelectedTradeForCancel(null)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

// Toaster alert layouts
const toastOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: '24px',          
  left: '50%',         
  transform: 'translateX(-50%)', 
  color: '#fff',
  padding: '16px 24px',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 2000,
  fontWeight: '500',
  whiteSpace: 'nowrap', 
  animation: 'slideDown 0.3s ease-out',
};