import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  // styleUrls: ['./company.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule]
})
export class CompanyComponent implements OnInit {
  companyForm: any;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      nom: ['', [Validators.required]],
      adresse: [''],
      numtel: [''],
      email: ['', [Validators.email]],
      raisonsociale: [''],
      numImmatriculation: ['']
    });
  }

  ngOnInit(): void {
    // Initialisation éventuelle si nécessaire
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      this.companyService.createCompany(formData).subscribe({
        next: (res) => {
          // Stocke l'entreprise si besoin
          localStorage.setItem('company', JSON.stringify(res));
          this.router.navigate(['/auth/register']);
        },
        error: () => {
          // Affiche une erreur (à personnaliser)
        }
      });
    }
  }
} 