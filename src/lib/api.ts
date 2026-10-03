import type {
  Address,
  Brand,
  Cart,
  CartItem,
  Category,
  Order,
  Paginated,
  Product,
  Review,
  User,
} from "./types";

const BASE = "https://ecommerce.routemisr.com/api/v1";
const BASE_V2 = "https://ecommerce.routemisr.com/api/v2";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let json: unknown = undefined;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    const j = (json ?? {}) as Record<string, unknown>;
    const msg =
      (j.message as string) ||
      (j.errorsMsg as string) ||
      (j.error as string) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, res.status);
  }
  return json as T;
}

type Payload = Record<string, unknown> | FormData;

async function http<T>(
  url: string,
  opts: { method?: string; body?: Payload; token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body && !(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (opts.token) headers["token"] = opts.token;

  const res = await fetch(url, {
    method: opts.method || "GET",
    headers,
    body:
      opts.body instanceof FormData
        ? opts.body
        : opts.body
          ? JSON.stringify(opts.body)
          : undefined,
    cache: typeof window === "undefined" ? "force-cache" : "no-store",
  });
  return parse<T>(res);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fc_token");
}

/**
 * Build-time helpers used by `generateStaticParams`. The static export has to know every
 * dynamic route up front, so these run once during `next build` and hit the API with a
 * long-lived cache instead of the per-request behaviour used at runtime.
 */
async function staticIds(path: string, limit: number) {
  const res = await fetch(`${BASE}/${path}?limit=${limit}`, { cache: "force-cache" });
  const json = await parse<{ data?: { _id?: string }[] }>(res);
  return (json.data ?? [])
    .map((row) => row?._id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}

export const getStaticProductIds = () => staticIds("products", 200);
export const getStaticCategoryIds = () => staticIds("categories", 100);

/**
 * The live API returns pagination as `{ results, metadata: { currentPage, numberOfPages, limit } }`
 * (older docs used `page` / `totalDocs` / `totalPages`). Normalize both into the flat shape the
 * app relies on so pagination, counts and "Load more" keep working regardless of API version.
 */
function normalizePage<T>(res: Paginated<T>): Paginated<T> {
  const meta = res.metadata;
  const page = meta?.currentPage ?? res.page ?? 1;
  const totalPages = meta?.numberOfPages ?? res.totalPages ?? 1;
  const limit = meta?.limit ?? res.limit ?? res.data.length;
  const results = typeof res.results === "number" ? res.results : res.totalDocs ?? res.data.length;
  return {
    ...res,
    data: Array.isArray(res.data) ? res.data : [],
    page,
    limit,
    totalPages,
    totalDocs: results,
    results,
    metadata: meta,
  };
}

export const api = {
  // ---------- Categories ----------
  getCategories: async (page = 1, limit = 20) =>
    normalizePage(await http<Paginated<Category>>(`${BASE}/categories?page=${page}&limit=${limit}`)),
  getCategory: (id: string) => http<{ data: Category }>(`${BASE}/categories/${id}`),

  // ---------- Brands ----------
  getBrands: async (page = 1, limit = 24) =>
    normalizePage(await http<Paginated<Brand>>(`${BASE}/brands?page=${page}&limit=${limit}`)),

  // ---------- Products ----------
  getProducts: async (qs = "") => normalizePage(await http<Paginated<Product>>(`${BASE}/products?${qs}`)),
  getProduct: (id: string) => http<{ data: Product }>(`${BASE}/products/${id}`),

  // ---------- Auth ----------
  signup: (body: { name: string; email: string; password: string; rePassword: string; phone: string }) =>
    http<{ message: string; token: string; user: User }>(`${BASE}/auth/signup`, {
      method: "POST",
      body,
    }),
  signin: (body: { email: string; password: string }) =>
    http<{ message: string; token: string; user: User }>(`${BASE}/auth/signin`, {
      method: "POST",
      body,
    }),
  verifyToken: (token: string) =>
    http<{ status?: string; message?: string }>(`${BASE}/auth/verifyToken`, { token }),

  // ---------- Wishlist ----------
  getWishlist: (token: string) =>
    http<{ status: string; count: number; data: Product[] }>(`${BASE}/wishlist`, { token }),
  addToWishlist: (token: string, productId: string) =>
    http<{ status: string; message: string; data: string[] }>(
      `${BASE}/wishlist`,
      { method: "POST", body: { productId }, token }
    ),
  removeFromWishlist: (token: string, productId: string) =>
    http<{ status: string; message: string; data: string[] }>(
      `${BASE}/wishlist/${productId}`,
      { method: "DELETE", token }
    ),

  // ---------- Cart (v2) ----------
  getCart: (token: string) => http<Cart & { data?: Cart }>(`${BASE_V2}/cart`, { token }),
  addToCart: (token: string, productId: string) =>
    http<{ status: string; message: string; numOfCartItems: number; data: CartItem[] }>(
      `${BASE_V2}/cart`,
      { method: "POST", body: { productId }, token }
    ),
  updateCartItem: (token: string, productId: string, count: number) =>
    http<Cart & { data?: Cart }>(`${BASE_V2}/cart/${productId}`, {
      method: "PUT",
      body: { count },
      token,
    }),
  removeCartItem: (token: string, productId: string) =>
    http<Cart & { data?: Cart }>(`${BASE_V2}/cart/${productId}`, {
      method: "DELETE",
      token,
    }),
  clearCart: (token: string) =>
    http<{ status: string; message: string }>(`${BASE_V2}/cart`, { method: "DELETE", token }),
  applyCoupon: (token: string, couponName: string) =>
    http<Cart & { data?: Cart }>(`${BASE_V2}/cart/applyCoupon`, {
      method: "PUT",
      body: { couponName },
      token,
    }),

  // ---------- Orders ----------
  checkoutSession: (token: string, cartId: string, shippingAddress: Record<string, unknown>, url: string) =>
    http<{ status: string; session: { url: string } }>(
      `${BASE}/orders/checkout-session/${cartId}?url=${encodeURIComponent(url)}`,
      { method: "POST", body: { shippingAddress }, token }
    ),
  createCashOrder: (token: string, cartId: string, shippingAddress: Record<string, unknown>) =>
    http<{ status: string; data: Order }>(`${BASE_V2}/orders/${cartId}`, {
      method: "POST",
      body: { shippingAddress },
      token,
    }),
  getUserOrders: (token: string, userId: string) =>
    http<Order[]>(`${BASE}/orders/user/${userId}`, { token }),

  // ---------- Addresses ----------
  getAddresses: (token: string) =>
    http<{ status: string; count: number; data: Address[] }>(`${BASE}/addresses`, { token }),
  addAddress: (token: string, body: Record<string, string>) =>
    http<{ status: string; message: string; data: Address[] }>(`${BASE}/addresses`, {
      method: "POST",
      body,
      token,
    }),
  removeAddress: (token: string, id: string) =>
    http<{ status: string; message: string; data: Address[] }>(`${BASE}/addresses/${id}`, {
      method: "DELETE",
      token,
    }),

  // ---------- Reviews ----------
  getProductReviews: (productId: string) =>
    http<{ data: Review[] }>(`${BASE}/products/${productId}/reviews`),
  addReview: (token: string, productId: string, body: { review: string; rating: number }) =>
    http<{ status: string; message: string; data: Review }>(
      `${BASE}/products/${productId}/reviews`,
      { method: "POST", body, token }
    ),
};

export function cartShape(res: {
  status?: string;
  message?: string;
  numOfCartItems?: number;
  cartId?: string;
  data?:
    | {
        _id?: string;
        cartOwner?: string;
        totalCartPrice?: number;
        totalAfterDiscount?: number;
        products?: CartItem[];
      }
    | CartItem[]
    | null;
}): Cart {
  const data = res.data;
  if (data && !Array.isArray(data) && !("products" in data)) {
    return {
      _id: res.cartId || data._id,
      products: [],
      totalCartPrice: data.totalCartPrice ?? 0,
      totalAfterDiscount: data.totalAfterDiscount,
      numOfCartItems: res.numOfCartItems ?? 0,
      status: res.status,
    };
  }
  if (data && !Array.isArray(data)) {
    return {
      _id: res.cartId || data._id,
      products: data.products ?? [],
      cartOwner: data.cartOwner,
      totalCartPrice: data.totalCartPrice ?? 0,
      totalAfterDiscount: data.totalAfterDiscount,
      numOfCartItems: res.numOfCartItems ?? 0,
      status: res.status,
    };
  }
  return res as unknown as Cart;
}

export function productImage(img?: string): string | null {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `https://ecommerce.routemisr.com/${img.replace(/^\/+/, "")}`;
}

export const img = productImage;

export function errMsg(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong";
}

export function isUnauthorized(err: unknown): boolean {
  return err instanceof ApiError && err.status === 401;
}