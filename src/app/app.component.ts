import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterModule } from '@angular/router';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    NzDropDownModule,
    NzAvatarModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    RouterModule,
    NzCheckboxModule
  ],
  standalone: true
})
export class AppComponent {
  isCollapsed = false;

  constructor(private router: Router) {}

  logout(): void {
    // Logique de déconnexion
    this.router.navigate(['/auth/login']);
  }
}
