import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule
  ],
  standalone: true
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  submitForm(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.message.success('Un email de récupération a été envoyé à votre adresse !');
        this.router.navigate(['/auth/login']);
      }, 2000);
    } else {
      Object.values(this.forgotPasswordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
} 