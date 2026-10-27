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