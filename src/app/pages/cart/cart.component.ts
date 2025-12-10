import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ApiService, Product } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

interface CartItemWithProduct extends CartItem {
  product: Product;
  lineTotal: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row mb-4">
      <div class="col-12">
        <h1>Ton panier</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div *ngIf="cartItems.length === 0" class="alert alert-info">
          Ton panier est vide. <a href="/menu" routerLink="/menu">Ajoute quelques plats !</a>
        </div>

        <div *ngFor="let item of cartItems" class="card mb-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-3">
                <img [src]="item.product.image" [alt]="item.product.nom"
                     class="img-fluid" loading="lazy">
              </div>
              <div class="col-md-5">
                <h5 class="card-title">{{ item.product.nom }}</h5>
                <p class="text-muted mb-0">{{ item.product.prix | number:'1.2-2' }} € / pièce</p>
              </div>
              <div class="col-md-2">
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-outline-secondary" 
                          (click)="updateQuantity(item.productId, -1)">−</button>
                  <span class="btn btn-outline-secondary" style="pointer-events: none;">
                    {{ item.quantity }}
                  </span>
                  <button type="button" class="btn btn-outline-secondary" 
                          (click)="updateQuantity(item.productId, 1)">+</button>
                </div>
              </div>
              <div class="col-md-2 text-end">
                <strong>{{ item.lineTotal | number:'1.2-2' }} €</strong>
                <br>
                <button type="button" class="btn btn-sm btn-danger mt-2"
                        (click)="removeFromCart(item.productId)">
                  Retirer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Récapitulatif</h5>
            <hr>
            <div class="d-flex justify-content-between mb-3">
              <span>Sous-total:</span>
              <strong>{{ total | number:'1.2-2' }} €</strong>
            </div>
            <button type="button" class="btn btn-primary w-100" 
                    (click)="checkout()"
                    [disabled]="cartItems.length === 0 || submitting">
              {{ submitting ? 'Traitement...' : 'Passer la commande' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CartComponent implements OnInit {
  cartItems: CartItemWithProduct[] = [];
  total = 0;
  submitting = false;
  products: Product[] = [];

  constructor(
    private cartService: CartService,
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.cartService.cart$.subscribe(() => this.calculateTotal());
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (response) => {
        this.products = response;
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Erreur', error);
        this.toastService.show('Erreur au chargement', 'error');
      }
    });
  }

  calculateTotal() {
    const cart = this.cartService.getCart();
    this.cartItems = cart
      .map(item => {
        const product = this.products.find(p => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: item.quantity * product.prix
        };
      })
      .filter((item): item is CartItemWithProduct => item !== null);
    
    this.total = this.cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }

  updateQuantity(productId: number, delta: number) {
    this.cartService.updateQuantity(productId, delta);
  }

  removeFromCart(productId: number) {
    const product = this.products.find(p => p.id === productId);
    this.cartService.removeFromCart(productId);
    this.toastService.show(`${product?.nom} retiré du panier`, 'success');
  }

  checkout() {
    if (this.cartItems.length === 0) {
      this.toastService.show('Ton panier est vide', 'error');
      return;
    }

    this.submitting = true;
    const order = {
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.apiService.submitOrder(order).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.toastService.show(`Commande enregistrée ! Ref: ${response.orderRef}`, 'success');
        this.submitting = false;
      },
      error: (error) => {
        console.error('Erreur', error);
        this.toastService.show('Erreur lors de la commande', 'error');
        this.submitting = false;
      }
    });
  }
}
