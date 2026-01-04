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
                <img [src]="'assets/products/' + item.product.image + '.jpg'" [alt]="item.product.nom"
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
            <div *ngIf="discountPercent > 0" class="d-flex justify-content-between text-success" [attr.title]="getIsStudent() ? 'Remise étudiante appliquée' : ''">
              <span>{{ getIsStudent() ? 'Remise étudiante' : 'Remise' }} ({{ discountPercent }}%):</span>
              <strong>-{{ discountAmount | number:'1.2-2' }} €</strong>
            </div>
            <div *ngIf="getIsStudent()" class="small text-muted mb-2">Remise étudiante appliquée</div>
            <div class="d-flex justify-content-between"><span><strong>Total:</strong></span><strong>{{ finalTotal | number:'1.2-2' }} €</strong></div>
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
  styles: [`
  
  h1 {
  font-size: 2.4rem;
  font-weight: 900;
  color: #ff0000ff;
  position: relative;
}

h1::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: #ff4b5c;
  border-radius: 999px;
  margin-top: 10px;
}

.card {
  border: none;
  border-radius: 22px;
  background-color: #ffffff;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
}

.card-title {
  color : #f70921ff;
  font-weight: 800;
}

.card.mb-3 {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card.mb-3:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 65px rgba(5, 5, 5, 0.12);
}

.card img {
  max-height: 90px;
  object-fit: contain;
  border-radius: 14px;
  background-color: #fff;
  padding: 8px;
}
.btn.btn-primary {
  background-color: #ff4b5c;
  border: none;
  }
`
  ]
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
  ) { }

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
    const ok = this.cartService.updateQuantity(productId, delta);
    if (!ok) {
      this.toastService.show('Limite de 10 boxes atteinte', 'error');
    }
  }

  removeFromCart(productId: number) {
    const product = this.products.find(p => p.id === productId);
    this.cartService.removeFromCart(productId);
    this.toastService.show(`${product?.nom} retiré du panier`, 'success');
  }

  get discountPercent(): number {
    let p = 0;
    if (this.getIsStudent()) p += 9.5;
    if (this.total > 50) p += 1.5;
    if (p > 9.5) p = 9.5;
    return p;
  }

  get discountAmount(): number {
    return +(this.total * (this.discountPercent / 100)).toFixed(2);
  }

  get finalTotal(): number {
    return +(this.total - this.discountAmount).toFixed(2);
  }

  getIsStudent(): boolean {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const u = JSON.parse(userStr);
    const val = u?.is_student ?? u?.isStudent;
    if (val === 1 || val === true) return true;
    if (typeof val === 'string') {
      const s = val.toLowerCase();
      return s === '1' || s === 'true';
    }
    return false;
  }

  checkout() {
    if (this.cartItems.length === 0) {
      this.toastService.show('Ton panier est vide', 'error');
      return;
    }

    if (this.cartService.getTotalItems() > 10) {
      this.toastService.show('La commande dépasse la limite de 10 boxes', 'error');
      return;
    }

    this.submitting = true;

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isStudent = !!(user && (user.is_student === 1 || user.is_student === true || user.isStudent === true));

    const order = {
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      customer: {
        id: user.id,
        isStudent,
        email: user?.email,
        name: user ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() : undefined
      }
    };

    this.apiService.submitOrder(order).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.toastService.show(`Commande enregistrée ! Ref: ${response.orderRef}`, 'success');
        this.submitting = false;
      },
      error: (error) => {
        console.error('Erreur', error);
        const msg = error?.error?.error ?? 'Erreur lors de la commande';
        this.toastService.show(msg, 'error');
        this.submitting = false;
      }
    });
  }
}
