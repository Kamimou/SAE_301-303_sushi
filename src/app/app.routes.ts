import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { CartComponent } from './pages/cart/cart.component';
import { RegisterComponent } from './pages/inscription/inscription.component';
import { LoginComponent } from './pages/connexion/login/login.component';
import { RgpdComponent} from './pages/rgpd/rgpd.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'inscription', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'rgpd', component: RgpdComponent },
  { path: '**', redirectTo: '' }
];
