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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
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
    NzTagModule,
    NzSelectModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzAvatarModule
  ],
  standalone: true
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  departments: string[] = ['Ventes', 'Marketing', 'Technique', 'Administration', 'RH'];
  positions: string[] = ['Manager', 'Vendeur', 'Développeur', 'Comptable', 'Assistant'];
  isModalVisible = false;
  isEditMode = false;
  currentEmployee: any = null;
  employeeForm: FormGroup;
  searchValue = '';

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      department: [null, [Validators.required]],
      position: [null, [Validators.required]],
      salary: [null, [Validators.required, Validators.min(0)]],
      hireDate: [null, [Validators.required]],
      address: [null, [Validators.required]],
      emergencyContact: [null],
      notes: [null]
    });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user.company) {
      this.router.navigate(['/auth/register']);
      return;
    }
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: () => {
        this.message.error('Erreur lors du chargement des employés');
      }
    });
  }

  showModal(employee?: any): void {
    this.isEditMode = !!employee;
    this.currentEmployee = employee;
    
    if (employee) {
      this.employeeForm.patchValue(employee);
    } else {
      this.employeeForm.reset();
    }
    
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      if (this.isEditMode && this.currentEmployee) {
        this.employeeService.updateEmployee(this.currentEmployee.id, formData).subscribe({
          next: () => {
        this.message.success('Employé mis à jour avec succès !');
            this.loadEmployees();
          },
          error: () => this.message.error('Erreur lors de la mise à jour')
        });
      } else {
        this.employeeService.createEmployee(formData).subscribe({
          next: () => {
        this.message.success('Employé ajouté avec succès !');
            this.loadEmployees();
          },
          error: () => this.message.error('Erreur lors de l\'ajout')
        });
      }
      this.isModalVisible = false;
      this.employeeForm.reset();
    } else {
      Object.values(this.employeeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.employeeForm.reset();
  }

  deleteEmployee(employee: any): void {
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
    this.message.success('Employé supprimé avec succès !');
        this.loadEmployees();
      },
      error: () => this.message.error('Erreur lors de la suppression')
    });
  }

  generatePayslip(employee: any): void {
    this.message.success(`Bulletin de paie généré pour ${this.getFullName(employee)} !`);
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'green' : 'red';
  }

  getFullName(employee: any): string {
    return `${employee.firstName} ${employee.lastName}`;
  }

  getFilteredEmployees(): any[] {
    if (!this.searchValue) {
      return this.employees;
    }
    const search = this.searchValue.toLowerCase();
    return this.employees.filter(emp =>
      this.getFullName(emp).toLowerCase().includes(search) ||
      (emp.email && emp.email.toLowerCase().includes(search)) ||
      (emp.phone && emp.phone.toLowerCase().includes(search)) ||
      (emp.department && emp.department.toLowerCase().includes(search)) ||
      (emp.position && emp.position.toLowerCase().includes(search))
    );
  }
} 