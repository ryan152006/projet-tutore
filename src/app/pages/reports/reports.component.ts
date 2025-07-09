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
import { ReportService } from '../../services/report.service';

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

  salesReport: any = null;
  financeReport: any = null;
  clientsReport: any = null;

  loading = false;

  constructor(private message: NzMessageService, private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.reportService.getSalesReport().subscribe({
      next: (data) => { this.salesReport = data; },
      error: () => { this.message.error('Erreur lors du chargement du rapport ventes'); }
    });
    this.reportService.getFinanceReport().subscribe({
      next: (data) => { this.financeReport = data; },
      error: () => { this.message.error('Erreur lors du chargement du rapport finance'); }
    });
    this.reportService.getClientsReport().subscribe({
      next: (data) => { this.clientsReport = data; this.loading = false; },
      error: () => { this.message.error('Erreur lors du chargement du rapport clients'); this.loading = false; }
    });
  }

  generateReport(): void {
    this.message.info('Génération du rapport en cours...');
    this.loadReports();
  }

  exportReport(format: string): void {
    this.message.success(`Export du rapport en ${format.toUpperCase()} en cours...`);
    // À implémenter : export réel
  }
} 