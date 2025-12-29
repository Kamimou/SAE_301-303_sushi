import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'sushii_cart_v2';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  constructor() {}

  private loadCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.cartKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  addToCart(productId: number, quantity: number = 1): boolean {
    const cart = [...this.getCart()];
    const currentTotal = cart.reduce((s, it) => s + it.quantity, 0);
    if (currentTotal + quantity > 10) {
      // refuse l'ajout si on dépasse la limite globale
      return false;
    }
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      const available = 10 - (currentTotal - existing.quantity);
      existing.quantity = Math.min(existing.quantity + quantity, Math.max(available, 1));
    } else {
      cart.push({ productId, quantity });
    }
    this.saveCart(cart);
    return true;
  }

  updateQuantity(productId: number, delta: number): boolean {
    const cart = this.getCart();
    const existing = cart.find(item => item.productId === productId);
    if (!existing) return false;
    const currentTotal = cart.reduce((s, it) => s + it.quantity, 0);
    const newQuantity = Math.min(Math.max(existing.quantity + delta, 1), 25);
    const proposedTotal = currentTotal - existing.quantity + newQuantity;
    if (proposedTotal > 10) {
      const allowed = 10 - (currentTotal - existing.quantity);
      if (allowed <= 0) return false;
      existing.quantity = Math.min(Math.max(allowed, 1), 25);
    } else {
      existing.quantity = newQuantity;
    }
    const nextCart = cart.map(it => it.productId === productId ? existing : it).filter(it => it.quantity > 0);
    this.saveCart(nextCart);
    return true;
  }

  removeFromCart(productId: number): void {
    const cart = this.getCart().filter(item => item.productId !== productId);
    this.saveCart(cart);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotalItems(): number {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }
}
