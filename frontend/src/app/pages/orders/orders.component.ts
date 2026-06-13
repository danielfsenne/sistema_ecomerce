import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressSpinnerModule],
  styles: [`
    .order-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      overflow: hidden;
      margin-bottom: 16px;
      transition: box-shadow 0.2s;
    }
    .order-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .order-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      cursor: pointer;
      flex-wrap: wrap;
      gap: 12px;
    }
    .order-body {
      border-top: 1px solid #f0f0f0;
      padding: 16px 24px;
    }
    .order-item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
      font-size: 0.9rem;
    }
    .order-item-row:last-child { border-bottom: none; }
  `],
  template: `
    <div style="background:#f0f2f5;min-height:100vh;padding-bottom:64px">
      <div class="container" style="padding-top:40px;max-width:900px">

        <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
          <h1 style="font-size:1.8rem;font-weight:800;color:#1a1a2e">Meus Pedidos</h1>
          <span *ngIf="orders.length > 0"
                style="background:#e8eaf6;color:#3f51b5;font-size:0.8rem;font-weight:700;padding:4px 12px;border-radius:20px">
            {{ orders.length }} pedido{{ orders.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" style="text-align:center;padding:80px">
          <mat-spinner diameter="48" style="margin:0 auto"></mat-spinner>
        </div>

        <!-- Vazio -->
        <div *ngIf="!loading && orders.length === 0"
             style="text-align:center;padding:80px 24px;background:#fff;border-radius:20px">
          <div style="font-size:5rem;margin-bottom:20px">📦</div>
          <h2 style="color:#333;margin-bottom:8px;font-weight:700">Nenhum pedido ainda</h2>
          <p style="color:#999;margin-bottom:28px">Faça seu primeiro pedido agora mesmo</p>
          <a routerLink="/"
             style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;
                    border-radius:12px;background:#3f51b5;color:#fff;text-decoration:none;
                    font-weight:600;font-size:0.95rem">
            <mat-icon>storefront</mat-icon> Comprar Agora
          </a>
        </div>

        <!-- Lista de pedidos -->
        <div *ngIf="!loading">
          <div class="order-card" *ngFor="let order of orders">

            <!-- Header do pedido -->
            <div class="order-header" (click)="toggle(order.id)">
              <div style="display:flex;align-items:center;gap:14px">
                <div style="width:44px;height:44px;border-radius:12px;background:#e8eaf6;
                            display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <mat-icon style="color:#3f51b5;font-size:1.2rem;width:20px;height:20px">receipt_long</mat-icon>
                </div>
                <div>
                  <p style="font-weight:700;color:#1a1a2e;font-size:0.95rem">Pedido #{{ order.id }}</p>
                  <p style="color:#999;font-size:0.8rem;margin-top:2px">{{ order.date | date:'dd/MM/yyyy - HH:mm' }}</p>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:16px">
                <div [ngStyle]="statusStyle(order.status)"
                     style="padding:5px 14px;border-radius:20px;font-size:0.78rem;font-weight:700">
                  {{ statusLabel(order.status) }}
                </div>
                <div style="text-align:right">
                  <p style="font-size:1.15rem;font-weight:800;color:#3f51b5">{{ order.total | currency:'BRL' }}</p>
                  <p style="font-size:0.75rem;color:#bbb">{{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'itens' }}</p>
                </div>
                <mat-icon style="color:#bbb;transition:transform 0.2s"
                          [style.transform]="isOpen(order.id) ? 'rotate(180deg)' : ''">
                  expand_more
                </mat-icon>
              </div>
            </div>

            <!-- Detalhes -->
            <div class="order-body" *ngIf="isOpen(order.id)">
              <div class="order-item-row" *ngFor="let item of order.items">
                <div style="display:flex;align-items:center;gap:12px">
                  <div style="width:36px;height:36px;border-radius:8px;background:#f5f5f5;
                              display:flex;align-items:center;justify-content:center">
                    <mat-icon style="font-size:1rem;width:18px;height:18px;color:#bbb">inventory_2</mat-icon>
                  </div>
                  <span style="color:#333;font-weight:500">{{ item.productName }}</span>
                </div>
                <div style="display:flex;align-items:center;gap:24px">
                  <span style="color:#888">{{ item.quantity }}× {{ item.price | currency:'BRL' }}</span>
                  <span style="font-weight:700;color:#1a1a2e;min-width:80px;text-align:right">{{ item.subtotal | currency:'BRL' }}</span>
                </div>
              </div>

              <div style="display:flex;justify-content:flex-end;padding-top:14px;margin-top:4px;border-top:1px solid #f0f0f0">
                <div style="display:flex;align-items:baseline;gap:12px">
                  <span style="color:#888;font-size:0.9rem">Total do pedido</span>
                  <span style="font-size:1.2rem;font-weight:800;color:#3f51b5">{{ order.total | currency:'BRL' }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  openIds = new Set<number>();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: o => {
        this.orders = o;
        if (o.length > 0) this.openIds.add(o[0].id);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggle(id: number): void {
    if (this.openIds.has(id)) this.openIds.delete(id);
    else this.openIds.add(id);
  }

  isOpen(id: number): boolean {
    return this.openIds.has(id);
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: '⏳ Pendente', CONFIRMED: '✅ Confirmado', SHIPPED: '🚚 Enviado',
      DELIVERED: '🎉 Entregue', CANCELLED: '❌ Cancelado'
    };
    return map[status] ?? status;
  }

  statusStyle(status: string): Record<string, string> {
    const map: Record<string, Record<string, string>> = {
      PENDING:   { background: '#fff3e0', color: '#e65100' },
      CONFIRMED: { background: '#e3f2fd', color: '#1565c0' },
      SHIPPED:   { background: '#f3e5f5', color: '#6a1b9a' },
      DELIVERED: { background: '#e8f5e9', color: '#2e7d32' },
      CANCELLED: { background: '#ffebee', color: '#c62828' }
    };
    return map[status] ?? { background: '#f5f5f5', color: '#333' };
  }
}
