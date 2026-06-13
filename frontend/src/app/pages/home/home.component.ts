import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category, Product } from '../../models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule, ProductCardComponent],
  template: `
    <!-- Hero -->
    <div class="hero">
      <div class="container">
        <div style="position:relative;z-index:1">
          <p style="font-size:0.8rem;font-weight:600;letter-spacing:2px;color:#e91e63;text-transform:uppercase;margin-bottom:12px">
            ✦ Ofertas especiais todo dia
          </p>
          <h1>Descubra produtos<br>incríveis para você</h1>
          <p>Os melhores preços com entrega rápida e segurança garantida.</p>
          <div class="hero-search">
            <input
              type="text"
              placeholder="O que você está procurando?"
              [(ngModel)]="searchName"
              (keyup.enter)="search()">
            <button (click)="search()">
              <span>Buscar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo principal -->
    <div class="container" style="padding-bottom:64px">

      <!-- Filtros de categoria -->
      <div class="section-header">
        <h2>{{ totalElements > 0 ? totalElements + ' Produtos' : 'Produtos' }}</h2>
        <span *ngIf="searchName || selectedCategory" style="font-size:0.85rem;color:#999;cursor:pointer" (click)="clearFilters()">
          Limpar filtros ×
        </span>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px">
        <button class="cat-chip" [class.active]="!selectedCategory" (click)="filterByCategory(null)">
          🛒 Todos
        </button>
        <button class="cat-chip" *ngFor="let c of categories"
          [class.active]="selectedCategory === c.id"
          (click)="filterByCategory(c.id)">
          {{ c.name }}
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" style="text-align:center;padding:80px">
        <div style="display:inline-flex;flex-direction:column;align-items:center;gap:16px">
          <mat-spinner diameter="48"></mat-spinner>
          <span style="color:#999;font-size:0.9rem">Carregando produtos...</span>
        </div>
      </div>

      <!-- Empty -->
      <div *ngIf="!loading && products.length === 0" style="text-align:center;padding:80px 24px">
        <div style="font-size:4rem;margin-bottom:16px">🔍</div>
        <h3 style="color:#333;margin-bottom:8px">Nenhum produto encontrado</h3>
        <p style="color:#999">Tente buscar por outro termo ou categoria.</p>
      </div>

      <!-- Grid de produtos -->
      <div *ngIf="!loading && products.length > 0"
           style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:24px">
        <app-product-card *ngFor="let p of products; let i = index"
          [product]="p"
          class="fade-in"
          [style.animation-delay]="(i % 8 * 50) + 'ms'">
        </app-product-card>
      </div>

      <!-- Paginação -->
      <div *ngIf="totalElements > pageSize" style="display:flex;justify-content:center;margin-top:40px">
        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageSizeOptions]="[8,12,24]"
          (page)="onPage($event)"
          style="border-radius:12px;overflow:hidden">
        </mat-paginator>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchName = '';
  selectedCategory: number | null = null;
  loading = false;
  totalElements = 0;
  pageSize = 12;
  currentPage = 0;

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(c => this.categories = c);
    this.loadProducts();
  }

  search(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  filterByCategory(id: number | null): void {
    this.selectedCategory = id;
    this.currentPage = 0;
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchName = '';
    this.selectedCategory = null;
    this.currentPage = 0;
    this.loadProducts();
  }

  onPage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getAll(
      this.searchName || undefined,
      this.selectedCategory ?? undefined,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: page => {
        this.products = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
