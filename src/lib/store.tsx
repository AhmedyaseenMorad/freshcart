"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  api,
  cartShape,
  getToken,
  productImage,
} from "./api";
import type { Cart, CartItem, Product, User } from "./types";

// ---------------- Toast ----------------
interface Toast {
  id: number;
  type: "success" | "error";
  msg: string;
}
const ToastCtx = createContext<{ toast: (msg: string, type?: "success" | "error") => void }>({ toast: () => {} });
export const useToast = () => useContext(ToastCtx);

function ToastHost({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const toast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = ++idRef.current;
    setList((l) => [...l, { id, msg, type }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {list.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-card px-4 py-3 text-sm font-medium shadow-lg ${
              t.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-primary-100 bg-primary-50 text-primary-700"
            }`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
              {t.type === "error" ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            <span className="flex-1">{t.msg}</span>
            <button
              onClick={() => setList((l) => l.filter((x) => x.id !== t.id))}
              className="text-fg-subtle transition-colors hover:text-fg-muted"
              aria-label="Dismiss"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ---------------- Auth ----------------
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (body: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
}
const AuthCtx = createContext<AuthState>(null as unknown as AuthState);
export const useAuth = () => useContext(AuthCtx);

// ---------------- Cart ----------------
interface CartState {
  cart: Cart | null;
  count: number;
  refresh: () => Promise<void>;
  add: (productId: string) => Promise<boolean>;
  update: (productId: string, count: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  coupon: (name: string) => Promise<boolean>;
}
const CartCtx = createContext<CartState>(null as unknown as CartState);
export const useCart = () => useContext(CartCtx);

// ---------------- Wishlist ----------------
interface WishState {
  items: Product[];
  has: (id: string) => boolean;
  toggle: (p: Product) => Promise<void>;
  refresh: () => Promise<void>;
}
const WishCtx = createContext<WishState>(null as unknown as WishState);
export const useWishlist = () => useContext(WishCtx);

export function Providers({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<Cart | null>(null);
  const [wish, setWish] = useState<Product[]>([]);

  useEffect(() => {
    const t = getToken();
    if (t) {
      setToken(t);
      const saved = localStorage.getItem("fc_user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          /* ignore */
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;
    api
      .verifyToken(token)
      .then(() => {})
      .catch(() => {
        localStorage.removeItem("fc_token");
        localStorage.removeItem("fc_user");
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const persist = (t: string, u: User) => {
    localStorage.setItem("fc_token", t);
    localStorage.setItem("fc_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const auth: AuthState = {
    user,
    token,
    loading,
    login: async (email, password) => {
      const r = await api.signin({ email, password });
      persist(r.token, r.user);
    },
    signup: async (body) => {
      const r = await api.signup(body);
      persist(r.token, r.user);
    },
    logout: () => {
      localStorage.removeItem("fc_token");
      localStorage.removeItem("fc_user");
      setToken(null);
      setUser(null);
      setCart(null);
      setWish([]);
    },
  };

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.getCart(token);
      setCart(cartShape(res));
    } catch {
      setCart(null);
    }
  }, [token]);

  const refreshWish = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.getWishlist(token);
      setWish(res.data);
    } catch {
      setWish([]);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refresh();
      refreshWish();
    }
  }, [token, refresh, refreshWish]);

  const cartState: CartState = {
    cart,
    count: cart?.numOfCartItems ?? 0,
    refresh,
    add: async (productId) => {
      if (!token) return false;
      const res = await api.addToCart(token, productId);
      setCart(cartShape(res));
      await refresh();
      return true;
    },
    update: async (productId, count) => {
      if (!token) return;
      const res = await api.updateCartItem(token, productId, count);
      setCart(cartShape(res));
    },
    remove: async (productId) => {
      if (!token) return;
      const res = await api.removeCartItem(token, productId);
      setCart(cartShape(res));
    },
    clear: async () => {
      if (!token) return;
      await api.clearCart(token);
      setCart(null);
    },
    coupon: async (name) => {
      if (!token) return false;
      const res = await api.applyCoupon(token, name);
      setCart(cartShape(res));
      return true;
    },
  };

  const wishState: WishState = {
    items: wish,
    has: (id) => wish.some((w) => w._id === id),
    toggle: async (p) => {
      if (!token) return;
      const wished = wish.some((w) => w._id === p._id);
      if (wished) {
        await api.removeFromWishlist(token, p._id);
      } else {
        await api.addToWishlist(token, p._id);
      }
      await refreshWish();
    },
    refresh: refreshWish,
  };

  return (
    <ToastHost>
      <AuthCtx.Provider value={auth}>
        <CartCtx.Provider value={cartState}>
          <WishCtx.Provider value={wishState}>{children}</WishCtx.Provider>
        </CartCtx.Provider>
      </AuthCtx.Provider>
    </ToastHost>
  );
}

export const fmt = (n?: number) => (n ?? 0).toLocaleString("en-EG");
export const img = productImage;
export type { CartItem };