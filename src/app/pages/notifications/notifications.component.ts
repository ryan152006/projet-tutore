import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzTagModule],
  template: `
    <div class="notifications-page-container">
      <nz-card nzTitle="Toutes les notifications">
        <div *ngIf="notifications.length === 0" class="notification-empty">Aucune notification</div>
        <div *ngFor="let notif of notifications" class="notification-item">
          <span [ngClass]="{'notification-unread': !notif.read}">{{ notif.message }}</span>
          <span class="notification-date">{{ notif.date | date:'short' }}</span>
          <nz-tag *ngIf="!notif.read" nzColor="blue">Non lu</nz-tag>
        </div>
      </nz-card>
    </div>
  `,
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getAllNotifications().subscribe((data) => {
      this.notifications = data;
    });
  }
} 