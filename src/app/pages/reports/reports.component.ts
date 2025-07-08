import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTableModule,
    NzStatisticModule,
    NzProgressModule,
    NzTabsModule,
    NzGridModule
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsComponent implements OnInit {
  selectedReportType = 'sales';
  selectedPeriod = 'month';
  selectedDateRange: any[] = [];
  
  // Données simulées pour les rapports
  salesData = [
    { month: 'Janvier', sales: 15000, orders: 45 },
    { month: 'Février', sales: 18000, orders: 52 },
    { month: 'Mars', sales: 22000, orders: 68 },
    { month: 'Avril', sales: 19500, orders: 58 },
    { month: 'Mai', sales: 25000, orders: 75 },
    { month: 'Juin', sales: 28000, orders: 82 }
  ];

  topProducts = [
    { name: 'Ordinateur portable Dell', sales: 25, revenue: 22475 },
    { name: 'Souris sans fil Logitech', sales: 45, revenue: 2025 },
    { name: 'Clavier mécanique', sales: 32, revenue: 2848 },
    { name: 'Écran 24" Samsung', sales: 18, revenue: 5382 },
    { name: 'Casque audio', sales: 28, revenue: 1400 }
  ];

  topClients = [
    { name: 'Jean Dupont', orders: 12, total: 8500 },
    { name: 'Marie Martin', orders: 8, total: 4200 },
    { name: 'Pierre Durand', orders: 15, total: 12300 },
    { name: 'Sophie Bernard', orders: 6, total: 3100 },
    { name: 'Michel Leroy', orders: 10, total: 6800 }
  ];

  financialData = {
    totalRevenue: 127500,
    totalExpenses: 89500,
    netProfit: 38000,
    profitMargin: 29.8,
    monthlyGrowth: 12.5
  };

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    // Initialiser avec la période actuelle
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    this.selectedDateRange = [startOfMonth, now];
  }

  generateReport(): void {
    this.message.info('Génération du rapport en cours...');
    // Ici on pourrait appeler une API pour générer le rapport
  }

  exportReport(format: string): void {
    this.message.success(`Export du rapport en ${format.toUpperCase()} en cours...`);
    // Ici on pourrait intégrer une bibliothèque d'export
  }

  getTotalSales(): number {
    return this.salesData.reduce((total, item) => total + item.sales, 0);
  }

  getTotalOrders(): number {
    return this.salesData.reduce((total, item) => total + item.orders, 0);
  }

  getAverageOrderValue(): number {
    const totalSales = this.getTotalSales();
    const totalOrders = this.getTotalOrders();
    return totalOrders > 0 ? totalSales / totalOrders : 0;
  }

  getSalesGrowth(): number {
    if (this.salesData.length < 2) return 0;
    const current = this.salesData[this.salesData.length - 1].sales;
    const previous = this.salesData[this.salesData.length - 2].sales;
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  }

  getTopProductRevenue(): number {
    return this.topProducts.reduce((total, product) => total + product.revenue, 0);
  }

  getTopClientRevenue(): number {
    return this.topClients.reduce((total, client) => total + client.total, 0);
  }
} 