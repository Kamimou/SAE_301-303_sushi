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
    <div class="row mb-4">
      <div class="col-12">
        <h1>Notre menu</h1>
        <p class="text-muted">Découvre nos délicieuses recettes</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6 col-lg-4" *ngFor="let product of products">
        <app-product-card 
          [product]="product"
          (onAdd)="addToCart($event)">
        </app-product-card>
      </div>
    </div>

    <div class="alert alert-info mt-5" *ngIf="products.length === 0">
      Aucun produit disponible pour le moment.
    </div>
  `,
  styles: []
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
