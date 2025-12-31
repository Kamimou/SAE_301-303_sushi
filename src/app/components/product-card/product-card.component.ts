import { Component, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/api.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100">
      <img
        [src]="'assets/products/' + product().image + '.jpg'"
        [alt]="product().nom"
        class="card-img-top"
        loading="lazy"
      >

      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ product().nom }}</h5>

        <p class="card-text text-muted flex-grow-1">
          {{ product().description }}
        </p>

        <div class="d-flex justify-content-between align-items-center">
          <span class="mb-0">
            {{ product().prix | number:'1.2-2' }} €
          </span>

          <button
            class="btn btn-primary btn-sm"
            (click)="onAdd.emit(product().id)"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
  .card {
  border: none;
  border-radius: 22px;
  background-color: #ffffff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
}

.card-img-top {
  height: 190px;
  object-fit: contain;
  padding: 22px;
  background-color: #fff;
}

.card-body {
  padding: 20px 22px 22px;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 900;
  color: #ff4b5c;
  margin-bottom: 6px;
}

.card-text {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
}

.card-body span {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ff4b5c;
}

.btn-primary {
  background-color: #ff4b5c;
  border: none;
  border-radius: 14px;
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(255, 75, 92, 0.35);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background-color: #e63946;
  transform: translateY(-1px);
}



  
`]

})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  @Output() onAdd = new EventEmitter<number>();
}
