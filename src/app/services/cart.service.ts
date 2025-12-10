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

  addToCart(productId: number, quantity: number = 1): void {
    const cart = [...this.getCart()];
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 25);
    } else {
      cart.push({ productId, quantity });
    }
    this.saveCart(cart);
  }

  updateQuantity(productId: number, delta: number): void {
    const cart = this.getCart()
      .map(item => item.productId === productId
        ? { ...item, quantity: Math.min(Math.max(item.quantity + delta, 1), 25) }
        : item
      )
      .filter(item => item.quantity > 0);
    this.saveCart(cart);
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
