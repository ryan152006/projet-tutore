import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
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
    NzProgressModule
  ],
  standalone: true
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: string[] = ['Électronique', 'Informatique', 'Bureau', 'Accessoires', 'Services'];
  isModalVisible = false;
  isEditMode = false;
  currentProduct: any = null;
  productForm: FormGroup;
  searchValue = '';
  selectedCategory = '';

  // Propriétés calculées pour les statistiques
  get lowStockCount(): number {
    return this.products.filter(p => p.stock <= p.minStock).length;
  }

  get outOfStockCount(): number {
    return this.products.filter(p => p.stock === 0).length;
  }

  get normalStockCount(): number {
    return this.products.filter(p => p.stock > p.minStock).length;
  }

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      category: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      cost: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      minStock: [null, [Validators.required, Validators.min(0)]],
      sku: [null, [Validators.required]],
      supplier: [null],
      notes: [null]
    });
  }

  ngOnInit(): void {
    // Vérifie si l'utilisateur a une entreprise, sinon redirige
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user.company) {
      this.router.navigate(['/auth/register']);
      return;
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: () => {
        this.message.error('Erreur lors du chargement des produits');
      }
    });
  }

  showModal(product?: any): void {
    this.isEditMode = !!product;
    this.currentProduct = product;
    
    if (product) {
      this.productForm.patchValue(product);
    } else {
      this.productForm.reset();
    }
    
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      if (this.isEditMode && this.currentProduct) {
        this.productService.updateProduct(this.currentProduct.id, formData).subscribe({
          next: () => {
            this.message.success('Produit mis à jour avec succès !');
            this.loadProducts();
          },
          error: () => this.message.error('Erreur lors de la mise à jour')
        });
      } else {
        this.productService.createProduct(formData).subscribe({
          next: () => {
            this.message.success('Produit ajouté avec succès !');
            this.loadProducts();
          },
          error: () => this.message.error('Erreur lors de l\'ajout')
        });
      }
      this.isModalVisible = false;
      this.productForm.reset();
    } else {
      Object.values(this.productForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.productForm.reset();
  }

  deleteProduct(product: any): void {
    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.message.success('Produit supprimé avec succès !');
        this.loadProducts();
      },
      error: () => this.message.error('Erreur lors de la suppression')
    });
  }

  getStockStatus(stock: number, minStock: number): string {
    if (stock === 0) return 'rupture';
    if (stock <= minStock) return 'faible';
    return 'normal';
  }

  getStockStatusColor(stock: number, minStock: number): string {
    if (stock === 0) return 'red';
    if (stock <= minStock) return 'orange';
    return 'green';
  }

  getStockPercent(stock: number, minStock: number): number {
    const maxStock = minStock * 3; // Stock maximum recommandé
    return Math.min((stock / maxStock) * 100, 100);
  }

  calculateMargin(price: number, cost: number): number {
    return ((price - cost) / price) * 100;
  }

  getFilteredProducts(): any[] {
    let filtered = this.products;
    
    if (this.searchValue) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        p.sku.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    return filtered;
  }
} 