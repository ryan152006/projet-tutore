import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzIconModule,
    NzTableModule,
    NzProgressModule,
    NzTagModule,
    NzButtonModule
  ],
  standalone: true
})
export class DashboardComponent implements OnInit {
  recentSales: any[] = [];
  topProducts: any[] = [];
  stockAlerts: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Données simulées pour le tableau de bord
    this.recentSales = [
      { id: 1, client: 'Jean Dupont', product: 'Ordinateur portable', amount: 1200, date: '2024-01-15', status: 'completed' },
      { id: 2, client: 'Marie Martin', product: 'Souris sans fil', amount: 45, date: '2024-01-14', status: 'pending' },
      { id: 3, client: 'Pierre Durand', product: 'Clavier mécanique', amount: 89, date: '2024-01-13', status: 'completed' },
      { id: 4, client: 'Sophie Bernard', product: 'Écran 24"', amount: 299, date: '2024-01-12', status: 'cancelled' }
    ];

    this.topProducts = [
      { name: 'Ordinateur portable', sales: 45, revenue: 54000, stock: 12 },
      { name: 'Souris sans fil', sales: 120, revenue: 5400, stock: 8 },
      { name: 'Clavier mécanique', sales: 67, revenue: 5963, stock: 15 },
      { name: 'Écran 24"', sales: 23, revenue: 6877, stock: 5 }
    ];

    this.stockAlerts = [
      { product: 'Souris sans fil', currentStock: 8, minStock: 10, status: 'low' },
      { product: 'Écran 24"', currentStock: 5, minStock: 8, status: 'critical' },
      { product: 'Câbles HDMI', currentStock: 3, minStock: 15, status: 'critical' }
    ];
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  }

  getStockStatusColor(status: string): string {
    switch (status) {
      case 'low': return 'orange';
      case 'critical': return 'red';
      default: return 'green';
    }
  }
} 