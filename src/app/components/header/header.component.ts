import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div class="container">

        <!-- LOGO -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
      <img
          src="assets/products/logo-sushii.png"
          alt="Sushii"
          class="navbar-logo"/>
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
            
          <!-- RGPD -->
            <a
            class="nav-link"
            routerLink="/rgpd"
            routerLinkActive="active"
            >
            RGPD
            </a>

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

            <!-- PROFIL: affichage selon état -->
            <div *ngIf="user; else loggedOut" class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Mon compte"
              >
                <img *ngIf="user?.avatar" [src]="user.avatar" class="rounded-circle me-2" width="32" height="32" alt="avatar">
                <span class="me-1">{{ user?.first_name }} {{ user?.last_name }}</span>
              </a>

              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" routerLink="/profile">
                    Profil
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" (click)="logout()">
                    Se déconnecter
                  </a>
                </li>
              </ul>

            </div>

            <ng-template #loggedOut>
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
            </ng-template>

          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
    .navbar {
  background-color: #ffffff !important;
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 0;
}

.navbar-brand {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ff4b5c !important;
  letter-spacing: 0.5px;
}

.navbar-logo {
  height: 100px;
  width: auto;
  transition: transform 0.2s ease;
}

.navbar-logo:hover {
  transform: scale(1.05);
}

.nav-link {
  font-weight: 600;
  color: #1f2937 !important;
  position: relative;
  padding: 6px 10px;
}

.nav-link:hover {
  color: #ff4b5c !important;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 3px;
  background-color: #ff4b5c;
  border-radius: 999px;
}

.badge.bg-primary {
  background-color: #ff4b5c !important;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.7rem;
  padding: 4px 8px;
}

.navbar img.rounded-circle {
  border: 2px solid #ff4b5c;
  object-fit: cover;
}

.dropdown-menu {
  border: none;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  padding: 10px;
}

.dropdown-item {
  border-radius: 12px;
  font-weight: 500;
  padding: 10px 14px;
}

.dropdown-item:hover {
  background-color: #fff1f2;
  color: #ff4b5c;
}

.navbar-toggler {
  border: none;
}

.navbar-toggler:focus {
  box-shadow: none;
}

    
  `]
})
export class HeaderComponent implements OnInit {

  cartCount = 0;
  user: User | null = null;

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getTotalItems();
    });

    this.auth.user$.subscribe(u => {
      this.user = u;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
