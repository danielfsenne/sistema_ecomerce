import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatBadgeModule],
  styles: [`
    nav {
      background: linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #24243e 100%);
      padding: 0 40px;
      display: flex;
      align-items: center;
      height: 68px;
      gap: 2px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #fff;
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-right: 32px;
      flex-shrink: 0;
    }
    .logo-badge {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #e91e63 0%, #ff5722 100%);
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      box-shadow: 0 4px 14px rgba(233,30,99,0.4);
    }
    .logo .accent { color: #e91e63; }

    /* Divisor vertical */
    .vdivider {
      width: 1px;
      height: 22px;
      background: rgba(255,255,255,0.1);
      margin: 0 10px;
      flex-shrink: 0;
    }

    /* Nav links */
    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 14px;
      border-radius: 10px;
      text-decoration: none;
      color: rgba(255,255,255,0.65);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.18s ease;
      white-space: nowrap;
      cursor: pointer;
      background: none;
      border: none;
      font-family: inherit;
    }
    .nav-link mat-icon {
      font-size: 1.05rem;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .nav-link:hover {
      background: rgba(255,255,255,0.09);
      color: #fff;
    }
    .nav-link.active-link {
      background: rgba(255,255,255,0.12);
      color: #fff;
      font-weight: 600;
    }

    /* Carrinho */
    .cart-wrap {
      position: relative;
      display: inline-flex;
    }
    .cart-bubble {
      position: absolute;
      top: 3px;
      right: 3px;
      background: #e91e63;
      color: #fff;
      font-size: 0.6rem;
      font-weight: 800;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #1a1a2e;
      line-height: 1;
    }

    /* Spacer */
    .spacer { flex: 1; }

    /* Botão Entrar */
    .btn-login {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 18px;
      border-radius: 10px;
      border: 1.5px solid rgba(255,255,255,0.2);
      background: transparent;
      color: rgba(255,255,255,0.8);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.18s ease;
      font-family: inherit;
    }
    .btn-login:hover {
      border-color: rgba(255,255,255,0.5);
      background: rgba(255,255,255,0.07);
      color: #fff;
    }
    .btn-login mat-icon {
      font-size: 1rem;
      width: 16px;
      height: 16px;
    }

    /* Botão Cadastrar */
    .btn-register {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 20px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #e91e63, #c2185b);
      color: #fff;
      font-size: 0.875rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.18s ease;
      margin-left: 6px;
      font-family: inherit;
      box-shadow: 0 4px 14px rgba(233,30,99,0.35);
    }
    .btn-register:hover {
      background: linear-gradient(135deg, #f06292, #e91e63);
      box-shadow: 0 6px 18px rgba(233,30,99,0.45);
      transform: translateY(-1px);
    }
    .btn-register mat-icon {
      font-size: 1rem;
      width: 16px;
      height: 16px;
    }

    /* Badge admin */
    .admin-badge {
      font-size: 0.65rem;
      background: rgba(233,30,99,0.2);
      color: #e91e63;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-left: -4px;
    }
  `],
  template: `
    <nav class="app-navbar">

      <!-- Logo -->
      <a class="logo" routerLink="/">
        Vor<span class="accent">tex</span>
      </a>

      <!-- Produtos -->
      <a class="nav-link" routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:true}">
        <mat-icon>storefront</mat-icon> Loja
      </a>

      <div class="spacer"></div>

      <!-- Autenticado -->
      <ng-container *ngIf="isLoggedIn">
        <a class="nav-link" routerLink="/orders" routerLinkActive="active-link">
          <mat-icon>receipt_long</mat-icon> Pedidos
        </a>

        <ng-container *ngIf="isAdmin">
          <div class="vdivider"></div>
          <a class="nav-link" routerLink="/admin" routerLinkActive="active-link">
            <mat-icon>admin_panel_settings</mat-icon> Admin
            <span class="admin-badge">ADM</span>
          </a>
        </ng-container>

        <div class="vdivider"></div>

        <!-- Carrinho -->
        <a class="nav-link cart-wrap" routerLink="/cart">
          <mat-icon>shopping_bag</mat-icon>
          <span *ngIf="cartCount > 0" class="cart-bubble">{{ cartCount > 9 ? '9+' : cartCount }}</span>
        </a>

        <!-- Sair -->
        <button class="nav-link" (click)="logout()" style="color:rgba(255,255,255,0.5)">
          <mat-icon>logout</mat-icon>
        </button>
      </ng-container>

      <!-- Não autenticado -->
      <ng-container *ngIf="!isLoggedIn">
        <a class="btn-login" routerLink="/login">
          <mat-icon>login</mat-icon> Entrar
        </a>
        <a class="btn-register" routerLink="/register">
          <mat-icon>person_add</mat-icon> Cadastrar
        </a>
      </ng-container>

    </nav>
  `
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  cartCount = 0;

  constructor(private auth: AuthService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe(logged => {
      this.isLoggedIn = logged;
      this.isAdmin = this.auth.isAdmin();
    });
    this.cartService.cartState$.subscribe(cart => {
      this.cartCount = cart?.items?.length ?? 0;
    });
  }

  logout(): void {
    this.auth.logout();
    this.cartService.clear();
    this.router.navigate(['/']);
  }
}
