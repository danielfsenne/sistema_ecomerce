import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="container" style="max-width:420px;padding-top:64px">
      <mat-card>
        <mat-card-header><mat-card-title>Criar Conta</mat-card-title></mat-card-header>
        <mat-card-content style="padding-top:16px">
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Nome</mat-label>
              <input matInput formControlName="name">
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Senha (mín. 6 caracteres)</mat-label>
              <input matInput formControlName="password" type="password">
            </mat-form-field>
            <p *ngIf="error" class="error-message" style="margin-bottom:8px">{{ error }}</p>
            <button mat-flat-button color="primary" type="submit" style="width:100%" [disabled]="loading">
              {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions style="padding:16px">
          <p>Já tem conta? <a routerLink="/login">Entrar</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class RegisterComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.register(this.form.value as { name: string; email: string; password: string }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erro ao cadastrar';
      }
    });
  }
}
