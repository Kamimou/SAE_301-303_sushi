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
  styles: []
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
