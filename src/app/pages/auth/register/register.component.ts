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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
    NzSelectModule,
    NzCheckboxModule
  ],
  standalone: true
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService,
    private companyService: CompanyService
  ) {
    this.registerForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      companyAddress: [null, [Validators.required]],
      companyPhone: [null],
      companySiret: [null],
      role: ['admin', [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null : { passwordMismatch: true };
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      // Création de l'utilisateur via l'API
      this.authService.register({
        first_name: this.registerForm.value.firstName,
        last_name: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role
      }).subscribe({
        next: (res) => {
          if (res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            // Création de l'entreprise via l'API
            this.companyService.createCompany({
              nom: this.registerForm.value.companyName,
              adresse: this.registerForm.value.companyAddress,
              numtel: this.registerForm.value.companyPhone,
              numImmatriculation: this.registerForm.value.companySiret,
              email: this.registerForm.value.email
            }).subscribe({
              next: (companyRes) => {
                // Mise à jour du user localStorage avec l'entreprise
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.company = companyRes;
                localStorage.setItem('user', JSON.stringify(user));
                this.isLoading = false;
                this.message.success('Compte et entreprise créés avec succès !');
                this.router.navigate(['/dashboard']);
              },
              error: (err) => {
                this.isLoading = false;
                this.message.error('Erreur lors de la création de l\'entreprise.');
              }
            });
          } else {
            this.isLoading = false;
            this.message.error('Erreur lors de l\'inscription.');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.message.error('Erreur lors de l\'inscription.');
        }
      });
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
} 