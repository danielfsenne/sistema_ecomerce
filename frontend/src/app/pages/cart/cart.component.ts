import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule],
  styles: [`
    .cart-item {
      display: flex;
      align-items: center;
      gap: 20px;
      background: #fff;
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: box-shadow 0.2s;
    }
    .cart-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .cart-img {
      width: 88px;
      height: 88px;
      object-fit: cover;
      border-radius: 12px;
      flex-shrink: 0;
    }
    .btn-checkout {
      width: 100%;
      padding: 16px;
      border-radius: 14px;
      border: none;
      background: linear-gradient(135deg, #3f51b5, #303f9f);
      color: #fff;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: opacity 0.2s;
      font-family: inherit;
      box-shadow: 0 6px 20px rgba(63,81,181,0.35);
    }
    .btn-checkout:disabled { opacity: 0.6; cursor: not-allowed; }
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #bbb;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.15s;
      display: flex;
      align-items: center;
    }
    .remove-btn:hover { background: #ffebee; color: #e53935; }
  `],
  template: `
    <div style="background:#f0f2f5;min-height:100vh;padding-bottom:64px">
      <div class="container" style="padding-top:40px;max-width:860px">

        <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
          <h1 style="font-size:1.8rem;font-weight:800;color:#1a1a2e">Meu Carrinho</h1>
          <span *ngIf="cart && cart.items.length > 0"
                style="background:#e8eaf6;color:#3f51b5;font-size:0.8rem;font-weight:700;padding:4px 12px;border-radius:20px">
            {{ cart.items.length }} {{ cart.items.length === 1 ? 'item' : 'itens' }}
          </span>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" style="text-align:center;padding:80px">
          <mat-spinner diameter="48" style="margin:0 auto"></mat-spinner>
        </div>

        <!-- Vazio -->
        <div *ngIf="!loading && (!cart || cart.items.length === 0)"
             style="text-align:center;padding:80px 24px;background:#fff;border-radius:20px">
          <div style="font-size:5rem;margin-bottom:20px">🛒</div>
          <h2 style="color:#333;margin-bottom:8px;font-weight:700">Seu carrinho está vazio</h2>
          <p style="color:#999;margin-bottom:28px">Adicione produtos para continuar comprando</p>
          <a routerLink="/"
             style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;
                    border-radius:12px;background:#3f51b5;color:#fff;text-decoration:none;
                    font-weight:600;font-size:0.95rem">
            <mat-icon>storefront</mat-icon> Explorar Produtos
          </a>
        </div>

        <!-- Itens + Resumo -->
        <div *ngIf="!loading && cart && cart.items.length > 0"
             style="display:grid;grid-template-columns:1fr 340px;gap:28px;align-items:start">

          <!-- Lista de itens -->
          <div>
            <div class="cart-item" *ngFor="let item of cart.items">
              <img [src]="item.productImageUrl || 'https://picsum.photos/seed/' + item.productId + '/200/200'"
                   [alt]="item.productName" class="cart-img"
                   onerror="this.src='https://picsum.photos/seed/1/200/200'">
              <div style="flex:1;min-width:0">
                <p style="font-weight:700;color:#1a1a2e;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  {{ item.productName }}
                </p>
                <p style="color:#888;font-size:0.85rem;margin-top:4px">
                  {{ item.productPrice | currency:'BRL' }} × {{ item.quantity }}
                </p>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <p style="font-weight:800;color:#3f51b5;font-size:1.1rem">{{ item.subtotal | currency:'BRL' }}</p>
              </div>
              <button class="remove-btn" (click)="remove(item.id)" title="Remover">
                <mat-icon style="font-size:1.1rem;width:20px;height:20px">delete_outline</mat-icon>
              </button>
            </div>
          </div>

          <!-- Resumo do pedido -->
          <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.07);position:sticky;top:84px">
            <h3 style="font-size:1.1rem;font-weight:700;color:#1a1a2e;margin-bottom:20px">Resumo do Pedido</h3>

            <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem;color:#666">
              <span>Subtotal</span>
              <span>{{ cart.total | currency:'BRL' }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem;color:#2e7d32;font-weight:500">
              <span>Frete</span>
              <span>Grátis</span>
            </div>

            <div style="border-top:1px solid #eee;margin:16px 0;padding-top:16px;display:flex;justify-content:space-between;align-items:baseline">
              <span style="font-size:1rem;font-weight:600;color:#333">Total</span>
              <span style="font-size:1.5rem;font-weight:800;color:#3f51b5">{{ cart.total | currency:'BRL' }}</span>
            </div>

            <button class="btn-checkout" (click)="checkout()" [disabled]="checkingOut">
              <mat-icon>lock</mat-icon>
              {{ checkingOut ? 'Processando...' : 'Finalizar Compra' }}
            </button>

            <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px">
              <div style="display:flex;align-items:center;gap:8px;font-size:0.8rem;color:#888">
                <mat-icon style="font-size:1rem;width:16px;height:16px;color:#4caf50">verified_user</mat-icon>
                Pagamento 100% seguro
              </div>
              <div style="display:flex;align-items:center;gap:8px;font-size:0.8rem;color:#888">
                <mat-icon style="font-size:1rem;width:16px;height:16px;color:#4caf50">local_shipping</mat-icon>
                Entrega para todo o Brasil
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  checkingOut = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cartService.load().subscribe({
      next: c => { this.cart = c; this.loading = false; },
      error: () => this.loading = false
    });
    this.cartService.cartState$.subscribe(c => this.cart = c);
  }

  remove(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe();
  }

  checkout(): void {
    this.checkingOut = true;
    this.orderService.checkout().subscribe({
      next: () => {
        this.checkingOut = false;
        this.snack.open('Pedido realizado com sucesso! 🎉', 'Ver Pedidos', { duration: 5000 })
          .onAction().subscribe(() => this.router.navigate(['/orders']));
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.checkingOut = false;
        this.snack.open(err.error?.message || 'Erro ao finalizar', 'OK', { duration: 3000 });
      }
    });
  }
}
