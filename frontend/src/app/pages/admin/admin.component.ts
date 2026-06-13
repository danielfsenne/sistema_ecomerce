import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category, Product } from '../../models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatTableModule, MatIconModule,
    MatSnackBarModule, MatTabsModule, MatTooltipModule],
  styles: [`
    .admin-wrap {
      background: #f0f2f5;
      min-height: 100vh;
      padding-bottom: 64px;
    }
    .admin-header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #3f51b5 100%);
      padding: 36px 0 32px;
      margin-bottom: 32px;
    }
    .admin-header h1 {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .admin-header p {
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .card-header {
      padding: 20px 24px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 18px;
      margin-bottom: 4px;
    }
    .card-header .icon-box {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-header h2 {
      font-size: 1rem;
      font-weight: 700;
      color: #1a1a2e;
    }
    .card-body { padding: 20px 24px 24px; }

    /* Tabela */
    .prod-table { width: 100%; border-collapse: collapse; }
    .prod-table th {
      text-align: left;
      padding: 12px 14px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 2px solid #f0f0f0;
    }
    .prod-table td {
      padding: 14px;
      border-bottom: 1px solid #f5f5f5;
      font-size: 0.88rem;
      color: #333;
      vertical-align: middle;
    }
    .prod-table tr:last-child td { border-bottom: none; }
    .prod-table tr:hover td { background: #fafafa; }

    /* Botões de ação */
    .btn-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      font-size: 1rem;
    }
    .btn-edit {
      background: #e8eaf6;
      color: #3f51b5;
      margin-right: 6px;
    }
    .btn-edit:hover { background: #3f51b5; color: #fff; }
    .btn-delete {
      background: #ffebee;
      color: #e53935;
    }
    .btn-delete:hover { background: #e53935; color: #fff; }

    /* Categorias */
    .cat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .cat-row:last-child { border-bottom: none; }
    .cat-name {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      color: #333;
    }
  `],
  template: `
    <div class="admin-wrap">

      <!-- Header de administração -->
      <div class="admin-header">
        <div class="container">
          <div style="display:flex;align-items:center;gap:14px">
            <div style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,0.12);
                        display:flex;align-items:center;justify-content:center">
              <mat-icon style="color:#fff;font-size:1.5rem;width:24px;height:24px">admin_panel_settings</mat-icon>
            </div>
            <div>
              <h1>Painel de Administração</h1>
              <p>Gerencie produtos e categorias da loja</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <mat-tab-group animationDuration="200ms">

          <!-- ABA PRODUTOS -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon style="margin-right:6px;font-size:1rem;width:18px;height:18px">inventory_2</mat-icon>
              Produtos
            </ng-template>

            <div style="padding-top:24px;display:grid;gap:24px">

              <!-- Formulário -->
              <div class="card">
                <div class="card-header">
                  <div class="icon-box" [style.background]="editingProduct ? '#fff3e0' : '#e8f5e9'">
                    <mat-icon [style.color]="editingProduct ? '#e65100' : '#2e7d32'" style="font-size:1.1rem;width:20px;height:20px">
                      {{ editingProduct ? 'edit' : 'add_circle' }}
                    </mat-icon>
                  </div>
                  <div>
                    <h2>{{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}</h2>
                  </div>
                </div>
                <div class="card-body">
                  <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                      <mat-form-field appearance="outline">
                        <mat-label>Nome do produto</mat-label>
                        <input matInput formControlName="name">
                        <mat-icon matSuffix style="color:#bbb">label</mat-icon>
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Preço (R$)</mat-label>
                        <input matInput type="number" formControlName="price" step="0.01">
                        <mat-icon matSuffix style="color:#bbb">attach_money</mat-icon>
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Estoque</mat-label>
                        <input matInput type="number" formControlName="stock">
                        <mat-icon matSuffix style="color:#bbb">inventory</mat-icon>
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Categoria</mat-label>
                        <mat-select formControlName="categoryId">
                          <mat-option [value]="null">— Sem categoria —</mat-option>
                          <mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <mat-form-field appearance="outline" style="grid-column:1/-1">
                        <mat-label>Descrição</mat-label>
                        <textarea matInput formControlName="description" rows="3"></textarea>
                      </mat-form-field>
                      <mat-form-field appearance="outline" style="grid-column:1/-1">
                        <mat-label>URL da Imagem (opcional)</mat-label>
                        <input matInput formControlName="imageUrl" placeholder="https://...">
                        <mat-icon matSuffix style="color:#bbb">image</mat-icon>
                      </mat-form-field>
                    </div>
                    <div style="display:flex;gap:10px;margin-top:4px">
                      <button mat-flat-button color="primary" type="submit"
                              [disabled]="productForm.invalid || saving"
                              style="border-radius:10px;font-weight:600;padding:0 24px">
                        <mat-icon style="margin-right:6px;font-size:1rem;width:18px;height:18px">
                          {{ saving ? 'hourglass_empty' : (editingProduct ? 'save' : 'add') }}
                        </mat-icon>
                        {{ saving ? 'Salvando...' : (editingProduct ? 'Salvar Alterações' : 'Criar Produto') }}
                      </button>
                      <button mat-stroked-button type="button" *ngIf="editingProduct"
                              (click)="cancelEdit()" style="border-radius:10px">
                        <mat-icon style="margin-right:6px;font-size:1rem;width:18px;height:18px">close</mat-icon>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Tabela de produtos -->
              <div class="card">
                <div class="card-header">
                  <div class="icon-box" style="background:#e8eaf6">
                    <mat-icon style="color:#3f51b5;font-size:1.1rem;width:20px;height:20px">table_rows</mat-icon>
                  </div>
                  <div style="flex:1">
                    <h2>Produtos Cadastrados</h2>
                  </div>
                  <span style="font-size:0.8rem;color:#bbb;font-weight:600">
                    {{ products.length }} produto{{ products.length !== 1 ? 's' : '' }}
                  </span>
                </div>
                <div style="overflow-x:auto">
                  <table class="prod-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Categoria</th>
                        <th style="text-align:center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let p of products">
                        <td style="color:#bbb;font-size:0.8rem">{{ p.id }}</td>
                        <td>
                          <div style="display:flex;align-items:center;gap:10px">
                            <img [src]="p.imageUrl || 'https://picsum.photos/seed/' + p.id + '/40/40'"
                                 style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0">
                            <span style="font-weight:600;color:#1a1a2e">{{ p.name }}</span>
                          </div>
                        </td>
                        <td style="font-weight:700;color:#3f51b5">{{ p.price | currency:'BRL' }}</td>
                        <td>
                          <span [class]="p.stock === 0 ? 'badge-out' : p.stock <= 5 ? 'badge-low' : 'badge-ok'">
                            {{ p.stock }}
                          </span>
                        </td>
                        <td style="color:#888">{{ p.categoryName || '—' }}</td>
                        <td style="text-align:center">
                          <button class="btn-icon btn-edit" (click)="editProduct(p)"
                                  matTooltip="Editar produto" matTooltipPosition="above">
                            <mat-icon style="font-size:1rem;width:18px;height:18px">edit</mat-icon>
                          </button>
                          <button class="btn-icon btn-delete" (click)="deleteProduct(p.id)"
                                  matTooltip="Excluir produto" matTooltipPosition="above">
                            <mat-icon style="font-size:1rem;width:18px;height:18px">delete</mat-icon>
                          </button>
                        </td>
                      </tr>
                      <tr *ngIf="products.length === 0">
                        <td colspan="6" style="text-align:center;color:#bbb;padding:32px">
                          Nenhum produto cadastrado ainda.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </mat-tab>

          <!-- ABA CATEGORIAS -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon style="margin-right:6px;font-size:1rem;width:18px;height:18px">category</mat-icon>
              Categorias
            </ng-template>

            <div style="padding-top:24px;display:grid;grid-template-columns:380px 1fr;gap:24px;align-items:start">

              <!-- Formulário nova categoria -->
              <div class="card">
                <div class="card-header">
                  <div class="icon-box" style="background:#e8f5e9">
                    <mat-icon style="color:#2e7d32;font-size:1.1rem;width:20px;height:20px">add_circle</mat-icon>
                  </div>
                  <h2>Nova Categoria</h2>
                </div>
                <div class="card-body">
                  <mat-form-field appearance="outline" style="width:100%">
                    <mat-label>Nome da categoria</mat-label>
                    <input matInput [(ngModel)]="newCategoryName" [ngModelOptions]="{standalone:true}"
                           (keyup.enter)="createCategory()">
                    <mat-icon matSuffix style="color:#bbb">category</mat-icon>
                  </mat-form-field>
                  <button mat-flat-button color="primary" (click)="createCategory()"
                          [disabled]="!newCategoryName.trim()"
                          style="width:100%;border-radius:10px;font-weight:600;margin-top:4px">
                    <mat-icon style="margin-right:6px;font-size:1rem;width:18px;height:18px">add</mat-icon>
                    Criar Categoria
                  </button>
                </div>
              </div>

              <!-- Lista de categorias -->
              <div class="card">
                <div class="card-header">
                  <div class="icon-box" style="background:#e8eaf6">
                    <mat-icon style="color:#3f51b5;font-size:1.1rem;width:20px;height:20px">list</mat-icon>
                  </div>
                  <div style="flex:1">
                    <h2>Categorias Cadastradas</h2>
                  </div>
                  <span style="font-size:0.8rem;color:#bbb;font-weight:600">
                    {{ categories.length }} categori{{ categories.length !== 1 ? 'as' : 'a' }}
                  </span>
                </div>
                <div class="card-body" style="padding-top:8px">
                  <div class="cat-row" *ngFor="let c of categories">
                    <div class="cat-name">
                      <div style="width:32px;height:32px;border-radius:8px;background:#e8eaf6;
                                  display:flex;align-items:center;justify-content:center;flex-shrink:0">
                        <mat-icon style="color:#3f51b5;font-size:0.95rem;width:16px;height:16px">sell</mat-icon>
                      </div>
                      {{ c.name }}
                    </div>
                    <button class="btn-icon btn-delete" (click)="deleteCategory(c.id)"
                            matTooltip="Excluir categoria" matTooltipPosition="above">
                      <mat-icon style="font-size:1rem;width:18px;height:18px">delete</mat-icon>
                    </button>
                  </div>
                  <div *ngIf="categories.length === 0"
                       style="text-align:center;color:#bbb;padding:24px;font-size:0.9rem">
                    Nenhuma categoria cadastrada.
                  </div>
                </div>
              </div>

            </div>
          </mat-tab>

        </mat-tab-group>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  newCategoryName = '';
  editingProduct: Product | null = null;
  saving = false;

  productForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: [null as number | null],
    imageUrl: ['']
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAll(undefined, undefined, 0, 100).subscribe(p => this.products = p.content);
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(c => this.categories = c);
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;
    this.saving = true;
    const data = this.productForm.value;
    const obs = this.editingProduct
      ? this.productService.update(this.editingProduct.id, data)
      : this.productService.createJson(data);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.productForm.reset({ stock: 0 });
        this.editingProduct = null;
        this.loadProducts();
        this.snack.open('Produto salvo com sucesso!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.saving = false;
        this.snack.open(err.error?.message || 'Erro ao salvar', 'OK', { duration: 3000 });
      }
    });
  }

  editProduct(p: Product): void {
    this.editingProduct = p;
    this.productForm.patchValue({
      name: p.name, description: p.description, price: p.price,
      stock: p.stock, categoryId: p.categoryId, imageUrl: p.imageUrl ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.productForm.reset({ stock: 0 });
  }

  deleteProduct(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    this.productService.delete(id).subscribe(() => {
      this.loadProducts();
      this.snack.open('Produto removido', 'OK', { duration: 2000 });
    });
  }

  createCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.create(this.newCategoryName.trim()).subscribe(() => {
      this.newCategoryName = '';
      this.loadCategories();
      this.snack.open('Categoria criada!', 'OK', { duration: 2000 });
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    this.categoryService.delete(id).subscribe(() => {
      this.loadCategories();
      this.snack.open('Categoria removida', 'OK', { duration: 2000 });
    });
  }
}
