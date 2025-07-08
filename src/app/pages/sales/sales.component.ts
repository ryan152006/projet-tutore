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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SaleService } from '../../services/sale.service';
import { ClientService } from '../../services/client.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
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
    NzInputNumberModule,
    NzDatePickerModule,
    NzDividerModule
  ],
  standalone: true,
  providers: [SaleService, ClientService, ProductService]
})
export class SalesComponent implements OnInit {
  sales: any[] = [];
  clients: any[] = [];
  products: any[] = [];
  isModalVisible = false;
  isEditMode = false;
  currentSale: any = null;
  saleForm: FormGroup;
  searchValue = '';
  selectedStatus = '';
  selectedDateRange: any[] = [];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private saleService: SaleService,
    private clientService: ClientService,
    private productService: ProductService
  ) {
    this.saleForm = this.fb.group({
      clientId: [null, [Validators.required]],
      items: this.fb.array([]),
      totalAmount: [0],
      discount: [0],
      tax: [20], // TVA 20%
      notes: [null],
      paymentMethod: ['card', [Validators.required]],
      status: ['pending', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => { this.clients = data; },
      error: () => { this.message.error('Erreur lors du chargement des clients'); }
    });
    this.productService.getAllProducts().subscribe({
      next: (data) => { this.products = data; },
      error: () => { this.message.error('Erreur lors du chargement des produits'); }
    });
    this.saleService.getAllSales().subscribe({
      next: (data) => { this.sales = data; },
      error: () => { this.message.error('Erreur lors du chargement des ventes'); }
    });
  }

  showModal(sale?: any): void {
    this.isEditMode = !!sale;
    this.currentSale = sale;
    
    if (sale) {
      this.saleForm.patchValue(sale);
    } else {
      this.saleForm.reset({
        paymentMethod: 'card',
        status: 'pending',
        tax: 20
      });
    }
    
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.saleForm.valid) {
      const formData = this.saleForm.value;
      if (this.isEditMode && this.currentSale) {
        this.saleService.updateSale(this.currentSale.id, formData).subscribe({
          next: () => {
            this.message.success('Vente mise à jour avec succès !');
            this.loadData();
          },
          error: () => this.message.error('Erreur lors de la mise à jour')
        });
      } else {
        this.saleService.createSale(formData).subscribe({
          next: () => {
            this.message.success('Vente créée avec succès !');
            this.loadData();
          },
          error: () => this.message.error('Erreur lors de la création')
        });
      }
      this.isModalVisible = false;
      this.saleForm.reset();
    } else {
      Object.values(this.saleForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.saleForm.reset();
  }

  deleteSale(sale: any): void {
    this.saleService.deleteSale(sale.id).subscribe({
      next: () => {
        this.message.success('Vente supprimée avec succès !');
        this.loadData();
      },
      error: () => this.message.error('Erreur lors de la suppression')
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En cours';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }

  getPaymentMethodText(method: string): string {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'cash': return 'Espèces';
      case 'transfer': return 'Virement';
      default: return method;
    }
  }

  generateInvoice(sale: any): void {
    this.message.info('Génération de la facture PDF...');
    // Ici on pourrait intégrer une bibliothèque PDF comme jsPDF
  }

  sendInvoice(sale: any): void {
    this.message.info('Envoi de la facture par email...');
  }

  getFilteredSales(): any[] {
    let filtered = this.sales;
    
    if (this.searchValue) {
      filtered = filtered.filter(s => 
        s.invoiceNumber.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        s.client.name.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
    
    if (this.selectedStatus) {
      filtered = filtered.filter(s => s.status === this.selectedStatus);
    }
    
    if (this.selectedDateRange && this.selectedDateRange.length === 2) {
      filtered = filtered.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate >= this.selectedDateRange[0] && saleDate <= this.selectedDateRange[1];
      });
    }
    
    return filtered;
  }

  getTotalSales(): number {
    return this.sales.reduce((total, sale) => total + sale.totalWithTax, 0);
  }

  getCompletedSales(): number {
    return this.sales.filter(sale => sale.status === 'completed').length;
  }

  getAverageSale(): number {
    const completedSales = this.sales.filter(sale => sale.status === 'completed');
    if (completedSales.length === 0) return 0;
    return completedSales.reduce((total, sale) => total + sale.totalWithTax, 0) / completedSales.length;
  }
} 