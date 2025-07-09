import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzTabsModule,
    NzDividerModule,
    NzUploadModule,
    NzGridModule
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsComponent implements OnInit {
  companyForm!: FormGroup;
  invoiceForm!: FormGroup;
  notificationForm!: FormGroup;
  securityForm!: FormGroup;
  
  currencies = [
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'USD', name: 'Dollar US ($)' },
    { code: 'GBP', name: 'Livre Sterling (£)' }
  ];

  languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  timezones = [
    { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)' },
    { value: 'UTC', label: 'UTC (UTC+0)' },
    { value: 'America/New_York', label: 'America/New_York (UTC-5)' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private companyService: CompanyService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Vérifie si l'utilisateur a une entreprise, sinon redirige
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user.company) {
      this.router.navigate(['/auth/register']);
      return;
    }
    this.initializeForms();
    this.loadSettings();
  }

  initializeForms(): void {
    this.companyForm = this.fb.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      website: [null],
      siret: [null],
      tvaNumber: [null],
      logo: [null]
    });

    this.invoiceForm = this.fb.group({
      prefix: ['FACT', [Validators.required]],
      nextNumber: [1, [Validators.required, Validators.min(1)]],
      currency: ['EUR', [Validators.required]],
      taxRate: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
      paymentTerms: [30, [Validators.required, Validators.min(0)]],
      footer: [null],
      logo: [true]
    });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      lowStockAlerts: [true],
      newOrderAlerts: [true],
      paymentReminders: [true],
      reportSchedule: ['weekly'],
      language: ['fr', [Validators.required]],
      timezone: ['Europe/Paris', [Validators.required]]
    });

    this.securityForm = this.fb.group({
      twoFactorAuth: [false],
      sessionTimeout: [30, [Validators.required, Validators.min(5)]],
      passwordExpiry: [90, [Validators.required, Validators.min(30)]],
      loginAttempts: [3, [Validators.required, Validators.min(1)]],
      backupFrequency: ['daily', [Validators.required]]
    });
  }

  loadSettings(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const company = data[0];
          this.companyForm.patchValue({
            name: company.nom,
            address: company.adresse,
            phone: company.numtel,
            email: company.email,
            website: company.raisonsociale,
            siret: company.numImmatriculation,
            tvaNumber: ''
          });
        }
      },
      error: () => {
        this.message.error('Erreur lors du chargement des infos entreprise');
      }
    });
  }

  saveCompanySettings(): void {
    if (this.companyForm.valid) {
      this.companyService.createCompany({
        nom: this.companyForm.value.name,
        adresse: this.companyForm.value.address,
        numtel: this.companyForm.value.phone,
        email: this.companyForm.value.email,
        raisonsociale: this.companyForm.value.website,
        numImmatriculation: this.companyForm.value.siret
      }).subscribe({
        next: () => {
          this.message.success('Paramètres de l\'entreprise sauvegardés !');
        },
        error: () => {
          this.message.error('Erreur lors de la sauvegarde des paramètres');
        }
      });
    } else {
      this.message.error('Veuillez corriger les erreurs dans le formulaire');
    }
  }

  saveInvoiceSettings(): void {
    if (this.invoiceForm.valid) {
      // Sauvegarder les paramètres de facturation
      console.log('Paramètres facturation:', this.invoiceForm.value);
      this.message.success('Paramètres de facturation sauvegardés !');
    } else {
      this.message.error('Veuillez corriger les erreurs dans le formulaire');
    }
  }

  saveNotificationSettings(): void {
    if (this.notificationForm.valid) {
      // Sauvegarder les paramètres de notification
      console.log('Paramètres notifications:', this.notificationForm.value);
      this.message.success('Paramètres de notification sauvegardés !');
    } else {
      this.message.error('Veuillez corriger les erreurs dans le formulaire');
    }
  }

  saveSecuritySettings(): void {
    if (this.securityForm.valid) {
      // Sauvegarder les paramètres de sécurité
      console.log('Paramètres sécurité:', this.securityForm.value);
      this.message.success('Paramètres de sécurité sauvegardés !');
    } else {
      this.message.error('Veuillez corriger les erreurs dans le formulaire');
    }
  }

  exportSettings(): void {
    this.message.info('Export des paramètres en cours...');
    // Ici on pourrait exporter les paramètres en JSON
  }

  importSettings(): void {
    this.message.info('Import des paramètres en cours...');
    // Ici on pourrait importer des paramètres depuis un fichier
  }

  resetSettings(): void {
    this.message.warning('Réinitialisation des paramètres...');
    this.loadSettings();
  }

  backupData(): void {
    this.message.info('Sauvegarde des données en cours...');
    // Ici on pourrait créer une sauvegarde complète
  }

  restoreData(): void {
    this.message.info('Restauration des données en cours...');
    // Ici on pourrait restaurer depuis une sauvegarde
  }
} 