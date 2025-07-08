import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  @Input() client: any = null; // Pour édition
  clientForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      nom: [this.client?.nom || '', Validators.required],
      email: [this.client?.email || '', [Validators.email]],
      telephone: [this.client?.telephone || ''],
      adresse: [this.client?.adresse || '']
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.success = null;
    if (this.client) {
      // Edition
      this.clientService.updateClient(this.client.id, this.clientForm.value).subscribe({
        next: () => {
          this.success = 'Client modifié avec succès';
          this.loading = false;
        },
        error: () => {
          this.error = 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      // Création
      this.clientService.createClient(this.clientForm.value).subscribe({
        next: () => {
          this.success = 'Client ajouté avec succès';
          this.loading = false;
          this.clientForm.reset();
        },
        error: () => {
          this.error = 'Erreur lors de l\'ajout';
          this.loading = false;
        }
      });
    }
  }
}
