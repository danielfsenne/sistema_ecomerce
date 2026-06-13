import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a class="product-card-wrap" [routerLink]="['/products', product.id]" style="text-decoration:none">
      <div class="img-wrap">
        <img [src]="getImage()" [alt]="product.name" (error)="onImgError($event)">
        <div class="img-overlay">
          <span style="background:#fff;color:#1a1a2e;padding:10px 24px;border-radius:24px;font-size:0.875rem;font-weight:700;letter-spacing:0.3px">
            Ver Produto →
          </span>
        </div>
        <div *ngIf="product.stock === 0" style="position:absolute;top:12px;left:12px">
          <span class="badge-out">Esgotado</span>
        </div>
        <div *ngIf="product.stock > 0 && product.stock <= 5" style="position:absolute;top:12px;left:12px">
          <span class="badge-low">Últimas unidades</span>
        </div>
      </div>

      <div style="padding:16px 18px 18px;flex:1;display:flex;flex-direction:column;gap:8px">
        <div *ngIf="product.categoryName" style="display:flex;align-items:center;gap:6px">
          <span style="font-size:0.72rem;font-weight:600;color:#3f51b5;text-transform:uppercase;letter-spacing:0.8px">
            {{ product.categoryName }}
          </span>
        </div>
        <h3 style="font-size:0.95rem;font-weight:600;color:#1a1a2e;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
          {{ product.name }}
        </h3>
        <p *ngIf="product.description" style="font-size:0.8rem;color:#777;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
          {{ product.description }}
        </p>
        <div style="margin-top:auto;padding-top:10px;display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:1.3rem;font-weight:800;color:#3f51b5;letter-spacing:-0.5px">
            {{ product.price | currency:'BRL' }}
          </span>
          <span class="badge-ok" *ngIf="product.stock > 5">{{ product.stock }} em estoque</span>
          <span class="badge-low" *ngIf="product.stock > 0 && product.stock <= 5">{{ product.stock }} restantes</span>
        </div>
      </div>
    </a>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;

  getImage(): string {
    if (this.product.imageUrl) return this.product.imageUrl;
    return `https://picsum.photos/seed/${this.product.id + 10}/400/300`;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src =
      `https://picsum.photos/seed/${this.product.id}/400/300`;
  }
}
