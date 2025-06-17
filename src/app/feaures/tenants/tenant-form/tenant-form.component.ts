import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators'; 
import { CommonModule } from '@angular/common'; 
import { LoadTenant, CreateTenant, UpdateTenant } from '../../../state/tenant/tenant.actions';
import { TenantState } from '../../../state/tenant/tenant.state';
import { Tenant } from '../../../shared/models/tenant.model';

@Component({
  selector: 'app-tenant-form',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './tentant-form.component.html',
})
export class TenantFormComponent implements OnInit {
  tenantForm!: FormGroup;
  isEditMode = false;
  tenantId: number | null = null;
  
  @Select(TenantState.loading) loading$!: Observable<boolean>;
  @Select(TenantState.error) error$!: Observable<string | null>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.tenantId = Number(id);
      this.loadTenantForEditing(this.tenantId);
    }
  }

  initForm(): void {
    this.tenantForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  loadTenantForEditing(id: number): void {
    // Despachamos la acción para cargar el tenant en el estado
    this.store.dispatch(new LoadTenant(id));

    // Nos suscribimos al selector para rellenar el formulario UNA SOLA VEZ
    this.store.select(TenantState.selectedTenant).pipe(
        filter((tenant): tenant is Tenant => tenant !== null && tenant.id === id), // Nos aseguramos de que no sea nulo y sea el correcto
        take(1) // Tomamos el primer valor y nos desuscribimos automáticamente
      )
      .subscribe((tenant) => {
        this.tenantForm.patchValue(tenant);
      });
  }

  onSubmit(): void {
    if (this.tenantForm.invalid) {
      return;
    }

    const formData = this.tenantForm.value;

    if (this.isEditMode && this.tenantId) {
      this.store.dispatch(new UpdateTenant(this.tenantId, formData))
        .subscribe(() => {
          this.router.navigate(['/tenants']);
        });
    } else {
      this.store.dispatch(new CreateTenant(formData))
        .subscribe(() => {
          this.router.navigate(['/tenants']);
        });
    }
  }
}