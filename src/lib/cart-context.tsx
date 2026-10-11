'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

export interface CartLine {
  product_id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
  anti_tarnish?: boolean;
}

interface CartState {
  lines: CartLine[];
  hydrated: boolean;
}

type CartAction =
  | { type: 'hydrate'; lines: CartLine[] }
  | { type: 'add'; line: CartLine }
  | { type: 'remove'; product_id: string; size?: string }
  | { type: 'setQty'; product_id: string; size?: string; qty: number }
  | { type: 'clear' };

const STORAGE_KEY = 'allure_cart_v1';

function lineKey(product_id: string, size?: string): string {
  return `${product_id}::${size ?? ''}`;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'hydrate':
      return { lines: action.lines, hydrated: true };
    case 'add': {
      const idx = state.lines.findIndex(
        (l) => lineKey(l.product_id, l.size) === lineKey(action.line.product_id, action.line.size),
      );
      if (idx >= 0) {
        const lines = [...state.lines];
        lines[idx] = { ...lines[idx], qty: lines[idx].qty + action.line.qty };
        return { ...state, lines };
      }
      return { ...state, lines: [...state.lines, action.line] };
    }
    case 'remove':
      return {
        ...state,
        lines: state.lines.filter(
          (l) => lineKey(l.product_id, l.size) !== lineKey(action.product_id, action.size),
        ),
      };
    case 'setQty': {
      const lines = state.lines
        .map((l) =>
          lineKey(l.product_id, l.size) === lineKey(action.product_id, action.size)
            ? { ...l, qty: Math.max(0, action.qty) }
            : l,
        )
        .filter((l) => l.qty > 0);
      return { ...state, lines };
    }
    case 'clear':
      return { ...state, lines: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, 'qty'> & { qty?: number }) => void;
  remove: (product_id: string, size?: string) => void;
  setQty: (product_id: string, size: string | undefined, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const lines = raw ? (JSON.parse(raw) as CartLine[]) : [];
      dispatch({ type: 'hydrate', lines: Array.isArray(lines) ? lines : [] });
    } catch {
      dispatch({ type: 'hydrate', lines: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // ignore quota errors
    }
  }, [state.lines, state.hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = state.lines.reduce((n, l) => n + l.qty * l.price, 0);
    return {
      lines: state.lines,
      hydrated: state.hydrated,
      count,
      subtotal,
      add: (line) =>
        dispatch({ type: 'add', line: { ...line, qty: line.qty ?? 1 } }),
      remove: (product_id, size) => dispatch({ type: 'remove', product_id, size }),
      setQty: (product_id, size, qty) =>
        dispatch({ type: 'setQty', product_id, size, qty }),
      clear: () => dispatch({ type: 'clear' }),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [state, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
