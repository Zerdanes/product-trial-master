import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-card">
      <h2>Connexion</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Email</label>
        <input formControlName="email" type="email" />
        <div *ngIf="form.controls.email.invalid && form.controls.email.touched">Email requis</div>

        <label>Mot de passe</label>
        <input formControlName="password" type="password" />
        <div *ngIf="form.controls.password.invalid && form.controls.password.touched">Mot de passe requis</div>

        <button type="submit" [disabled]="form.invalid">Se connecter</button>
      </form>
      <div *ngIf="error" class="error">{{ error }}</div>
    </div>
  `,
  styles: [
    `
    .login-card { max-width: 400px; margin: 24px auto; padding: 16px; border: 1px solid #ccc; border-radius: 6px }
    label { display:block; margin-top:8px }
    input { width:100%; padding:6px; margin-top:4px }
    button { margin-top:12px }
    .error { color: red; margin-top:8px }
    `,
  ],
})
export class LoginComponent {
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required]] });
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.error = null;
  const creds = { email: this.form.get('email')!.value as string, password: this.form.get('password')!.value as string };
    this.auth.login(creds).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur de connexion';
      },
    });
  }
}
