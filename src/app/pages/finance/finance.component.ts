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
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css'],
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
    NzStatisticModule,
    NzProgressModule
  ],
  standalone: true
})
export class FinanceComponent implements OnInit {
  transactions: any[] = [];
  categories: string[] = ['Ventes', 'Achats', 'Salaires', 'Loyer', 'Électricité', 'Marketing', 'Autres'];
  isModalVisible = false;
  isEditMode = false;
  currentTransaction: any = null;
  transactionForm: FormGroup;
  searchValue = '';
  selectedType = '';
  selectedCategory = '';

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.fb.group({
      type: [null, [Validators.required]], // 'income' ou 'expense'
      category: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      description: [null, [Validators.required]],
      date: [null, [Validators.required]],
      reference: [null],
      notes: [null]
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: () => {
        this.message.error('Erreur lors du chargement des transactions');
      }
    });
  }

  showModal(transaction?: any): void {
    this.isEditMode = !!transaction;
    this.currentTransaction = transaction;
    
    if (transaction) {
      this.transactionForm.patchValue(transaction);
    } else {
      this.transactionForm.reset();
    }
    
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;
      if (this.isEditMode && this.currentTransaction) {
        this.transactionService.updateTransaction(this.currentTransaction.id, formData).subscribe({
          next: () => {
            this.message.success('Transaction mise à jour avec succès !');
            this.loadTransactions();
          },
          error: () => this.message.error('Erreur lors de la mise à jour')
        });
      } else {
        this.transactionService.createTransaction(formData).subscribe({
          next: () => {
            this.message.success('Transaction ajoutée avec succès !');
            this.loadTransactions();
          },
          error: () => this.message.error('Erreur lors de l\'ajout')
        });
      }
      this.isModalVisible = false;
      this.transactionForm.reset();
    } else {
      Object.values(this.transactionForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.transactionForm.reset();
  }

  deleteTransaction(transaction: any): void {
    this.transactionService.deleteTransaction(transaction.id).subscribe({
      next: () => {
        this.message.success('Transaction supprimée avec succès !');
        this.loadTransactions();
      },
      error: () => this.message.error('Erreur lors de la suppression')
    });
  }

  getTypeColor(type: string): string {
    return type === 'income' ? 'green' : 'red';
  }

  getTypeText(type: string): string {
    return type === 'income' ? 'Recette' : 'Dépense';
  }

  getTotalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  }

  getTotalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  }

  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  getFilteredTransactions(): any[] {
    let filtered = this.transactions;
    
    if (this.searchValue) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        t.reference?.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
    
    if (this.selectedType) {
      filtered = filtered.filter(t => t.type === this.selectedType);
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(t => t.category === this.selectedCategory);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
} 