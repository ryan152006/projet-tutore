import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterModule } from '@angular/router';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    NzDropDownModule,
    NzAvatarModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    RouterModule,
    NzCheckboxModule,
    NzCardModule
  ],
  standalone: true
})
export class AppComponent {
  isCollapsed = false;
  notifications: any[] = [];
  unreadNotifications = 0;
  showNotifications = false;

  constructor(private router: Router, private notificationService: NotificationService) {
    // Pour le développement uniquement :
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getAllNotifications().subscribe((data) => {
      this.notifications = data;
      this.unreadNotifications = this.notifications.filter(n => !n.read).length;
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    // Marquer toutes comme lues à l'ouverture
    if (this.showNotifications && this.unreadNotifications > 0) {
      this.notifications.forEach(n => n.read = true);
      this.unreadNotifications = 0;
      // Ici, tu pourrais appeler une API pour marquer comme lues côté backend
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
