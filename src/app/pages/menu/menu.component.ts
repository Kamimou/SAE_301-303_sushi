import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Product } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <section class="menu-title text-center my-5">
  <span class="menu-badge">🍣 Notre sélection</span>
  <h2 class="menu-heading">Notre Menu Délicieux</h2>
  <p class="menu-subtitle">
    Sushis frais préparés chaque jour avec passion
  </p>
</section>

    <section class="container">
  <div class="row g-4">
    <div class="col-md-6 col-lg-4" *ngFor="let product of products">
      <app-product-card
        [product]="product"
        (onAdd)="addToCart($event)">
      </app-product-card>
    </div>
  </div>

  <div class="alert alert-light text-center mt-5" *ngIf="products.length === 0">
    Aucun produit disponible pour le moment.
  </div>
</section>

  `,
  styles: [`
    .menu-hero {
  background: linear-gradient(
    135deg,
    #e63950 0%,
    #f4a8a8 50%,
    #fdebd3 100%
  );
  padding: 4rem 0;
  border-radius: 0 0 2rem 2rem;
}

.menu-title {
  max-width: 600px;
  margin: 0 auto 60px;
}

.menu-badge {
  display: inline-block;
  background-color: #f33a3aff;
  color: #ffffffff;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.menu-heading {
  font-size: 2.6rem;
  font-weight: 700;
  color: #1f2937;
  margin: 10px 0;
}

.menu-subtitle {
  font-size: 1rem;
  color: #6b7280;
}  

`]

})
export class MenuComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (response) => {
        this.products = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur', error);
        this.loading = false;
        this.toastService.show('Impossible de charger le menu', 'error');
      }
    });
  }

  addToCart(productId: number) {
    const product = this.products.find(p => p.id === productId);
    const ok = this.cartService.addToCart(productId, 1);
    if (ok) {
      this.toastService.show(`${product?.nom} ajouté au panier`, 'success');
    } else {
      this.toastService.show('Vous ne pouvez pas commander plus de 10 boxes à la fois', 'error');
    }
  }
}
