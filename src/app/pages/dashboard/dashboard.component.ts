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
import { ReportService } from '../../services/report.service';

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
  chiffreAffaires: number = 0;
  ventesMois: number = 0;
  clientsActifs: number = 0;
  produitsEnStock: number = 0;
  recentSales: any[] = [];
  topProducts: any[] = [];
  stockAlerts: any[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.reportService.getDashboardReport().subscribe((data) => {
      this.chiffreAffaires = data.chiffre_affaires || 0;
      this.ventesMois = data.ventes_mois || 0;
      this.clientsActifs = data.clients_actifs || 0;
      this.produitsEnStock = data.produits_en_stock || 0;
      this.recentSales = data.recent_sales || [];
      this.topProducts = data.top_products || [];
      this.stockAlerts = data.stock_alerts || [];
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

  getStockStatusColor(status: string): string {
    switch (status) {
      case 'low': return 'orange';
      case 'critical': return 'red';
      default: return 'green';
    }
  }
} 