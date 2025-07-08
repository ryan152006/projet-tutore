import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-clients-list',
  imports: [],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent implements OnInit {
  clients: any[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  selectedClient: any = null;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des clients';
        this.loading = false;
      }
    });
  }

  editClient(client: any) {
    this.selectedClient = client;
    this.showForm = true;
  }

  deleteClient(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.loadClients(),
        error: () => this.error = 'Erreur lors de la suppression'
      });
    }
  }

  onFormSubmit() {
    this.showForm = false;
    this.selectedClient = null;
    this.loadClients();
  }

  onFormClose() {
    this.showForm = false;
    this.selectedClient = null;
  }
}
