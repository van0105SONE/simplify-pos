export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  available: boolean;
}

export interface CartItem {
  id: number,
  menuItem: MenuItem;
  price: number;
  quantity: number;
  is_checkout: boolean;
  notes?: string;
}

export interface OrderEntity {
  id?: string;
  serial: string;
  items: CartItem[];
  total: number;
  tax: number;
  subtotal: number;
  table_id: number;
  change: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  cash_recieve: number,
  payment_method: string,
  is_checkout: boolean;
  createdAt: Date;
  customerName?: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  users?: UserEntity
}

export interface TableEntity {
  id: number,
  name: string,
  seat: number
  status: boolean
  users: UserEntity
}

export interface ProductEntity {
  id?: string;
  name: string
  price: number,
  description: string,
  image: string
  category_id: string
  stock: number
  unitType: string;
  category?: Category;
  users: UserEntity
}

export interface SupplierEntity {
  id: string;
  name: string;
  stock: number;
  import_price: number;
  status: string;
  users: UserEntity
}


export interface Category {
  id: string;
  name: string;
  icon?: string;
  users: UserEntity
}

export interface UnitType {
  id: string;
  name: string;
  users: UserEntity
}


// export interface UserEntity {
//   id: number;
//   name: string;
//   username: string;
//   password: string;
//   phone: string;
//   address?: string;
//   role: 'admin' | 'staff';
//   createdAt: Date;
// }

export interface CurrencyEntity {
  id: number;
  code: string;
  symbol: string;
  currency_name: string;
  is_main: boolean;
}
export interface LogIn {
  username: string,
  password: string
}


export interface Settings {
  currency: string;
  currencySymbol: string;
  currencyPosition: string;
  decimalPlaces: number;
  thousandSeparator: string;
  decimalSeparator: string;
  autoUpdateRates: boolean;
  exchangeRateApiKey: string;
  taxRate: number,
  taxName: string,
  taxInclusive: boolean,
  showTaxSeparately: boolean,
  taxNumber: string,
  showTaxNumberOnReceipts: boolean
}


export interface UserEntity {
  id: string;
  name: string;
  username: string;
  password: string;
  address: string;
  phone: string;
  role: string;
  createdAt:Date;
  token: string;

}

