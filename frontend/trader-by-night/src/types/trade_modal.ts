export interface TradeForm {
  tradeId: string;
  symbol: string;
  company_name: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: string;
  notionalValue: string;
  trader: string;
  book: string;
  counterparty: string;
  tradeTimestamp: string;
  status: string;
}

// Interface for symbol
export interface TickerOption {
  symbol: string;
  company_name: string;
  created_at: string;
}

export interface ApiResponse {
  success: boolean;
  count: number;
  data: TickerOption[];
}

// Interface for books
export interface BooksOption {
  book_id: string;
  book_name: string;
  description: string;
  created_at: string;
}

export interface ApiBooksResponse {
  success: boolean;
  count: number;
  data: BooksOption[];
}

// Interface for Counterparties
export interface CounterpartiesOption {
  counterpary_id: string;
  name: string;
  lei: string;
  created_at: string;
}

export interface ApiCounterpartiesResponse {
  success: boolean;
  count: number;
  data: CounterpartiesOption[];
}

// Interface for Traders
export interface TradersOption {
  trader_id: string;
  username: string;
  full_name: string;
  created_at: string;
}

export interface ApiTradersResponse {
  success: boolean;
  count: number;  
  data: TradersOption[];
}