import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule, MatProgressSpinnerModule, MatIconModule],
  template: `
    <!-- Loading -->
    <div *ngIf="loading" style="display:flex;justify-content:center;align-items:center;height:60vh">
      <mat-spinner diameter="56"></mat-spinner>
    </div>

    <!-- Produto -->
    <div *ngIf="product && !loading" style="background:#f0f2f5;min-height:100vh;padding-bottom:64px">

      <!-- Breadcrumb -->
      <div style="background:#fff;border-bottom:1px solid #eee">
        <div class="container" style="padding-top:14px;padding-bottom:14px;display:flex;align-items:center;gap:8px;font-size:0.85rem;color:#888">
          <a routerLink="/" style="color:#3f51b5;text-decoration:none;font-weight:500">Produtos</a>
          <mat-icon style="font-size:1rem;width:16px;height:16px;color:#ccc">chevron_right</mat-icon>
          <span *ngIf="product.categoryName" style="color:#888">{{ product.categoryName }}</span>
          <mat-icon *ngIf="product.categoryName" style="font-size:1rem;width:16px;height:16px;color:#ccc">chevron_right</mat-icon>
          <span style="color:#333;font-weight:500;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
            {{ product.name }}
          </span>
        </div>
      </div>

      <div class="container" style="padding-top:40px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start">

          <!-- Imagem -->
          <div>
            <img [src]="getImage()" [alt]="product.name"
                 class="detail-img"
                 (error)="onImgError($event)">
          </div>

          <!-- Info -->
          <div style="padding-top:8px">
            <div *ngIf="product.categoryName" style="margin-bottom:14px">
              <span style="font-size:0.75rem;font-weight:700;color:#3f51b5;text-transform:uppercase;letter-spacing:1.5px;
                           background:#e8eaf6;padding:5px 14px;border-radius:20px">
                {{ product.categoryName }}
              </span>
            </div>

            <h1 style="font-size:2rem;font-weight:800;color:#1a1a2e;line-height:1.2;margin-bottom:20px;letter-spacing:-0.5px">
              {{ product.name }}
            </h1>

            <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:24px">
              <span class="detail-price">{{ product.price | currency:'BRL' }}</span>
            </div>

            <p *ngIf="product.description"
               style="font-size:0.95rem;color:#555;line-height:1.7;margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid #e0e0e0">
              {{ product.description }}
            </p>

            <!-- Estoque -->
            <div style="margin-bottom:28px">
              <div *ngIf="product.stock > 5" style="display:flex;align-items:center;gap:8px">
                <div style="width:8px;height:8px;border-radius:50%;background:#4caf50"></div>
                <span style="color:#2e7d32;font-weight:600;font-size:0.9rem">Em estoque — {{ product.stock }} unidades</span>
              </div>
              <div *ngIf="product.stock > 0 && product.stock <= 5" style="display:flex;align-items:center;gap:8px">
                <div style="width:8px;height:8px;border-radius:50%;background:#ff9800"></div>
                <span style="color:#e65100;font-weight:600;font-size:0.9rem">Últimas {{ product.stock }} unidades!</span>
              </div>
              <div *ngIf="product.stock === 0" style="display:flex;align-items:center;gap:8px">
                <div style="width:8px;height:8px;border-radius:50%;background:#f44336"></div>
                <span style="color:#c62828;font-weight:600;font-size:0.9rem">Produto esgotado</span>
              </div>
            </div>

            <!-- Quantidade -->
            <div *ngIf="product.stock > 0" style="margin-bottom:28px">
              <label style="font-size:0.85rem;font-weight:600;color:#333;display:block;margin-bottom:10px">Quantidade</label>
              <div style="display:flex;align-items:center;gap:12px">
                <button class="qty-btn" (click)="dec()" [disabled]="quantity <= 1">−</button>
                <span class="qty-display">{{ quantity }}</span>
                <button class="qty-btn" (click)="inc()" [disabled]="quantity >= product.stock">+</button>
                <span style="font-size:0.8rem;color:#999;margin-left:8px">máx. {{ product.stock }}</span>
              </div>
            </div>

            <!-- Botão adicionar -->
            <button
              *ngIf="product.stock > 0"
              (click)="addToCart()"
              [disabled]="adding"
              style="width:100%;padding:16px;border-radius:14px;border:none;
                     background:linear-gradient(135deg,#3f51b5,#303f9f);color:#fff;
                     font-size:1rem;font-weight:700;cursor:pointer;
                     display:flex;align-items:center;justify-content:center;gap:10px;
                     transition:all 0.2s;letter-spacing:0.3px;font-family:inherit;
                     box-shadow:0 6px 20px rgba(63,81,181,0.35)"
              [style.opacity]="adding ? '0.7' : '1'">
              <mat-icon>shopping_cart</mat-icon>
              {{ adding ? 'Adicionando...' : 'Adicionar ao Carrinho' }}
            </button>

            <button
              *ngIf="product.stock === 0"
              disabled
              style="width:100%;padding:16px;border-radius:14px;border:none;
                     background:#e0e0e0;color:#999;font-size:1rem;font-weight:700;cursor:not-allowed;
                     display:flex;align-items:center;justify-content:center;gap:10px;font-family:inherit">
              <mat-icon>remove_shopping_cart</mat-icon>
              Produto Esgotado
            </button>

            <!-- Info extras -->
            <div style="margin-top:28px;display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;align-items:center;gap:10px;font-size:0.85rem;color:#666">
                <mat-icon style="color:#4caf50;font-size:1.1rem;width:20px;height:20px">local_shipping</mat-icon>
                Entrega rápida para todo o Brasil
              </div>
              <div style="display:flex;align-items:center;gap:10px;font-size:0.85rem;color:#666">
                <mat-icon style="color:#4caf50;font-size:1.1rem;width:20px;height:20px">verified_user</mat-icon>
                Compra 100% segura
              </div>
              <div style="display:flex;align-items:center;gap:10px;font-size:0.85rem;color:#666">
                <mat-icon style="color:#4caf50;font-size:1.1rem;width:20px;height:20px">replay</mat-icon>
                30 dias para troca ou devolução
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  loading = false;
  adding = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/']); }
    });
  }

  getImage(): string {
    if (this.product?.imageUrl) return this.product.imageUrl;
    return `https://picsum.photos/seed/${(this.product?.id ?? 0) + 10}/800/600`;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src =
      `https://picsum.photos/seed/${this.product?.id ?? 0}/800/600`;
  }

  inc(): void {
    if (this.product && this.quantity < this.product.stock) this.quantity++;
  }

  dec(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.auth.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.adding = true;
    this.cartService.addItem(this.product!.id, this.quantity).subscribe({
      next: () => {
        this.adding = false;
        this.snack.open(`${this.quantity}x ${this.product!.name} adicionado ao carrinho!`, 'Ver Carrinho', { duration: 4000 })
          .onAction().subscribe(() => this.router.navigate(['/cart']));
      },
      error: (err) => {
        this.adding = false;
        this.snack.open(err.error?.message || 'Erro ao adicionar', 'OK', { duration: 3000 });
      }
    });
  }
}
