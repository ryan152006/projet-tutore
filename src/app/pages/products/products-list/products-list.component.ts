import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
  imports: []
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  selectedProduct: any = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des produits';
        this.loading = false;
      }
    });
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.showForm = true;
  }

  deleteProduct(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: () => this.error = 'Erreur lors de la suppression'
      });
    }
  }

  onFormSubmit() {
    this.showForm = false;
    this.selectedProduct = null;
    this.loadProducts();
  }

  onFormClose() {
    this.showForm = false;
    this.selectedProduct = null;
  }
}
