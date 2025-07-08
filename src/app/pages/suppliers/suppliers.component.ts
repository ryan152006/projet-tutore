import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzPopconfirmModule,
    NzTagModule,
    NzSelectModule,
    NzInputNumberModule
  ],
  standalone: true
})
export class SuppliersComponent implements OnInit {
  suppliers: any[] = [];
  categories: string[] = ['Électronique', 'Informatique', 'Bureau', 'Services', 'Transport'];
  isModalVisible = false;
  isEditMode = false;
  currentSupplier: any = null;
  supplierForm: FormGroup;
  searchValue = '';

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private supplierService: SupplierService
  ) {
    this.supplierForm = this.fb.group({
      name: [null, [Validators.required]],
      contactPerson: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      category: [null, [Validators.required]],
      website: [null],
      siret: [null],
      paymentTerms: [30, [Validators.required]],
      notes: [null]
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: () => {
        this.message.error('Erreur lors du chargement des fournisseurs');
      }
    });
  }

  showModal(supplier?: any): void {
    this.isEditMode = !!supplier;
    this.currentSupplier = supplier;
    
    if (supplier) {
      this.supplierForm.patchValue(supplier);
    } else {
      this.supplierForm.reset({
        paymentTerms: 30
      });
    }
    
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.supplierForm.valid) {
      const formData = this.supplierForm.value;
      
      if (this.isEditMode && this.currentSupplier) {
        this.supplierService.updateSupplier(this.currentSupplier.id, formData).subscribe({
          next: () => {
            this.message.success('Fournisseur mis à jour avec succès !');
            this.loadSuppliers();
          },
          error: () => this.message.error('Erreur lors de la mise à jour')
        });
      } else {
        this.supplierService.createSupplier(formData).subscribe({
          next: () => {
            this.message.success('Fournisseur ajouté avec succès !');
            this.loadSuppliers();
          },
          error: () => this.message.error('Erreur lors de l\'ajout')
        });
      }
      
      this.isModalVisible = false;
      this.supplierForm.reset();
    } else {
      Object.values(this.supplierForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.supplierForm.reset();
  }

  deleteSupplier(supplier: any): void {
    this.supplierService.deleteSupplier(supplier.id).subscribe({
      next: () => {
        this.message.success('Fournisseur supprimé avec succès !');
        this.loadSuppliers();
      },
      error: () => this.message.error('Erreur lors de la suppression')
    });
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'green' : 'red';
  }

  getFilteredSuppliers(): any[] {
    let filtered = this.suppliers;
    
    if (this.searchValue) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        s.email.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
    
    return filtered;
  }

  contactSupplier(supplier: any): void {
    this.message.info(`Ouverture de l'email pour ${supplier.name}...`);
  }

  viewWebsite(supplier: any): void {
    if (supplier.website) {
      window.open(`https://${supplier.website}`, '_blank');
    }
  }
} 