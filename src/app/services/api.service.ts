import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Mise à jour de l'interface Produit pour correspondre EXACTEMENT au PHP
// (name -> nom, price -> prix, ajout de pieces, aliments, saveurs)
export interface Product {
  id: number;
  nom: string;          // Renommé car votre SQL fait "name AS nom"
  pieces: number;       // Nouveau champ
  prix: number;         // Renommé car votre SQL fait "price AS prix"
  description: string;
  image: string;        // Renommé car votre SQL fait "image_key AS image"
  aliments: { nom: string; quantite: number }[]; // Pour la composition
  saveurs: string[];    // Pour les tags
}

export interface Order {
  items: { productId: number; quantity: number }[];
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    isStudent?: boolean;
  };
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // 2. On pointe directement vers votre API PHP
  // Assurez-vous que le dossier s'appelle bien "php-api" dans htdocs
  private apiBase = 'http://localhost/php-api/index.php'; 

  constructor(private http: HttpClient) {}

  // 3. Modification de la méthode getProducts
  // L'API PHP renvoie maintenant un tableau direct [ ... ], et plus un objet { data: ... }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiBase}/products`);
  }

  // Ces méthodes seront utilisées plus tard quand on codera la partie commande en PHP
  submitOrder(order: Order): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/orders`, order);
  }

  submitContact(data: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/contact`, data);
  }

  // Enregistrement d'un utilisateur (inscription)
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/auth/register`, user);
  }
  
  // Connexion d'un utilisateur
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/auth/login`, credentials);
  }
}
