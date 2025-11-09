import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-card">
      <h2>Créer un compte</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Nom d'utilisateur</label>
        <input formControlName="username" />
        <div *ngIf="form.controls.username.invalid && form.controls.username.touched">Requis</div>

        <label>Prénom</label>
        <input formControlName="firstname" />
        <div *ngIf="form.controls.firstname.invalid && form.controls.firstname.touched">Requis</div>

        <label>Email</label>
        <input formControlName="email" type="email" />
        <div *ngIf="form.controls.email.invalid && form.controls.email.touched">Email invalide</div>

        <label>Mot de passe</label>
        <input formControlName="password" type="password" />
        <div *ngIf="form.controls.password.invalid && form.controls.password.touched">Requis</div>

        <button type="submit" [disabled]="form.invalid">Créer</button>
      </form>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="ok" class="ok">Compte créé. Connectez-vous.</div>
    </div>
  `,
  styles: [
    `
    .login-card { max-width: 400px; margin: 24px auto; padding: 16px; border: 1px solid #ccc; border-radius: 6px }
    label { display:block; margin-top:8px }
    input { width:100%; padding:6px; margin-top:4px }
    button { margin-top:12px }
    .error { color: red; margin-top:8px }
    .ok { color: green; margin-top:8px }
    `,
  ],
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', [Validators.required]],
    firstname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  error: string | null = null;
  ok = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.error = null;
    this.ok = false;
    const payload = {
      username: this.form.get('username')!.value as string,
      firstname: this.form.get('firstname')!.value as string,
      email: this.form.get('email')!.value as string,
      password: this.form.get('password')!.value as string,
    };
    this.auth.register(payload).subscribe({
      next: () => {
        // auto-login after successful registration
        this.auth.login({ email: payload.email, password: payload.password }).subscribe({
          next: () => {
            this.ok = true;
            this.router.navigate(['/home']);
          },
          error: (err) => {
            // registration succeeded but auto-login failed: show message and redirect to login
            console.error('auto-login failed', err);
            this.ok = true;
            setTimeout(() => this.router.navigate(['/login']), 800);
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la création du compte';
      }
    });
  }
}
