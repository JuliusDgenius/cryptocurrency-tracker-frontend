export interface Asset {
    name: string;
    symbol: string;
    percentage: number;
    value: number;
  }
  
  export interface Transaction {
    date: string;
    type: 'Buy' | 'Sell' | 'Receive';
    asset: string;
    amount: number;
    value: number;
  }