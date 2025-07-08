import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzIconModule,
    NzCheckboxModule
  ],
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      remember: [true]
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.message.success('Connexion réussie !');
            this.router.navigate(['/dashboard']);
          } else {
            this.message.error('Erreur lors de la connexion.');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.message.error('Email ou mot de passe incorrect.');
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  loginWithGoogle(): void {
    this.message.info('Connexion avec Google en cours...');
  }

  loginWithFacebook(): void {
    this.message.info('Connexion avec Facebook en cours...');
  }
} 