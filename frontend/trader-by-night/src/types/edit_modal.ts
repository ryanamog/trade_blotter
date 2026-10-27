export interface Trade {
  tradeId: string;
  symbol: string;
  company_name: string;
  side: 'BUY' | 'SELL'; // strongly typing the side
  quantity: number;
  price: string;
  notionalValue: string;
  trader: string;
  book: string;
  counterparty: string;
  tradeTimestamp: string;
  status: string;
}

export interface BookAPIResponse {
  success: boolean;
  count: number;
  data: BookOption[];
}

export interface BookOption {
  book_id: number;     // Number type matching your response
  book_name: string;   // Upper-case snake string (e.g., "TECH GROWTH")
  description: string | null;
  created_at: string;
}

export interface CounterpartyAPIResponse {
  success: boolean;
  count: number;
  data: CounterpartyOption[];
}

export interface CounterpartyOption {
  counterparty_id: number;     // Number type matching your response
  name: string;   // Upper-case snake string (e.g., "TECH GROWTH")
  lei: string | null;
  created_at: string;
}

export interface TraderAPIResponse {
  success: boolean;
  count: number;
  data: TraderOption[];
}

export interface TraderOption {
  trader_id: number;     // Number type matching your response
  username: string;   // Upper-case snake string (e.g., "TECH GROWTH")
  full_name: string | null;
  created_at: string;
}