export interface CartItem {
  sku: string;
  name: string;
  sizeLabel: string;
  priceJmd: number;
  image: string;
  qty: number;
}

const STORAGE_KEY = 'heyhon_harvest_bag_v2';

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('heyhon:cart-updated', { detail: items }));
}

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1): void {
  const current = readCart();
  const existing = current.find((i) => i.sku === item.sku);
  if (existing) {
    existing.qty += qty;
  } else {
    current.push({ ...item, qty });
  }
  writeCart(current);
  window.dispatchEvent(new CustomEvent('heyhon:open-cart'));
}

export function openCartDrawer(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('heyhon:open-cart'));
}

export function openAskModal(initialQuery = ''): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('heyhon:open-ask', { detail: { query: initialQuery } }));
}
