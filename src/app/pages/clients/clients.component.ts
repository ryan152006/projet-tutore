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
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
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
    NzTagModule
  ],
  standalone: true
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  isModalVisible = false;
  isEditMode = false;
  currentClient: any = null;
  clientForm: FormGroup;
  searchValue = '';

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      company: [null],
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
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: () => {
        this.message.error('Erreur lors du chargement des clients');
      }
    });
  }

  showModal(client?: any): void {
    this.isEditMode = !!client;
    this.currentClient = client;
    
    if (client) {
      this.clientForm.patchValue(client);
    } else {
      this.clientForm.reset();
    }
    
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.clientForm.valid) {
      const formData = this.clientForm.value;
      if (this.isEditMode && this.currentClient) {
        this.clientService.updateClient(this.currentClient.id, formData).subscribe({
          next: () => {
            this.message.success('Client mis à jour avec succès !');
            this.loadClients();
          },
          error: () => this.message.error('Erreur lors de la mise à jour')
        });
      } else {
        this.clientService.createClient(formData).subscribe({
          next: () => {
            this.message.success('Client ajouté avec succès !');
            this.loadClients();
          },
          error: () => this.message.error('Erreur lors de l\'ajout')
        });
      }
      this.isModalVisible = false;
      this.clientForm.reset();
    } else {
      Object.values(this.clientForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.clientForm.reset();
  }

  deleteClient(client: any): void {
    this.clientService.deleteClient(client.id).subscribe({
      next: () => {
        this.message.success('Client supprimé avec succès !');
        this.loadClients();
      },
      error: () => this.message.error('Erreur lors de la suppression')
    });
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'green' : 'red';
  }
} 