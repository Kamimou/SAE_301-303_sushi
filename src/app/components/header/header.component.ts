import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div class="container">

        <!-- LOGO -->
        <a class="navbar-brand" routerLink="/">
          <strong>Sushii</strong>
        </a>

        <!-- BURGER MOBILE -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- MENU -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <nav class="navbar-nav ms-auto align-items-center flex-row gap-3">

            <!-- MENU -->
            <a
              class="nav-link"
              routerLink="/menu"
              routerLinkActive="active"
            >
              Menu
            </a>

            <!-- PANIER -->
            <a
              class="nav-link position-relative"
              routerLink="/cart"
              routerLinkActive="active"
            >
              Panier
              <span
                class="badge bg-primary ms-2"
                *ngIf="cartCount > 0"
              >
                {{ cartCount }}
              </span>
            </a>

            <!-- PROFIL -->
            <div class="nav-item dropdown">

              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Mon compte"
              >
                <i class="bi bi-person fs-4"></i>
              </a>

              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" routerLink="/login">
                    Connexion
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" routerLink="/inscription">
                    Inscription
                  </a>
                </li>
              </ul>

            </div>

          </nav>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {

  cartCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getTotalItems();
    });
  }
}
