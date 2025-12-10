import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/api.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100">
      <img [src]="product.image" [alt]="product.nom" class="card-img-top" loading="lazy">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ product.nom }}</h5>
        <p class="card-text text-muted flex-grow-1">{{ product.description }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <span class="h6 mb-0">{{ product.prix | number:'1.2-2' }} €</span>
          <button class="btn btn-primary btn-sm" (click)="onAdd.emit(product.id)">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() onAdd = new EventEmitter<number>();
}
