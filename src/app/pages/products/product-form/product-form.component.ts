import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  @Input() product: any = null; // Pour édition
  productForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      nom: [this.product?.nom || '', Validators.required],
      description: [this.product?.description || ''],
      categorie: [this.product?.categorie || ''],
      prix: [this.product?.prix || '', Validators.required],
      quantity: [this.product?.quantity || '', Validators.required],
      stock_alert_threshold: [this.product?.stock_alert_threshold || '']
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.success = null;
    if (this.product) {
      // Edition
      this.productService.updateProduct(this.product.id, this.productForm.value).subscribe({
        next: () => {
          this.success = 'Produit modifié avec succès';
          this.loading = false;
        },
        error: () => {
          this.error = 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      // Création
      this.productService.createProduct(this.productForm.value).subscribe({
        next: () => {
          this.success = 'Produit ajouté avec succès';
          this.loading = false;
          this.productForm.reset();
        },
        error: () => {
          this.error = 'Erreur lors de l\'ajout';
          this.loading = false;
        }
      });
    }
  }
}
