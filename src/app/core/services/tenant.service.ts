import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, of } from "rxjs"
import { environment } from "../../../enviroments/environment"
import  { Tenant } from "../../shared/models/tenant.model"

@Injectable({
  providedIn: "root",
})
export class TenantService {
  private apiUrl = environment.apiUrl

  // Tenants para la prueba
  private mockTenants: Tenant[] = [
    { id: 1, name: "Acme Corporation", description: "A global conglomerate" },
    { id: 2, name: "Stark Industries", description: "Technology and innovation leader" },
    { id: 3, name: "Wayne Enterprises", description: "Multinational conglomerate" },
  ]

  constructor(private http: HttpClient) {}

  getTenants(): Observable<Tenant[]> {
    // // En una app real esto es una llamada a la api
    return of([...this.mockTenants])
  }

  getTenant(id: number): Observable<Tenant> {
    // // En una app real esto es una llamada a la api
    const tenant = this.mockTenants.find((t) => t.id === id)
    if (!tenant) {
      throw new Error("Tenant no encontrados")
    }
    return of({...tenant})
  }

  getAllTenants(): Observable<Tenant[]> {
    return of([...this.mockTenants]);
  }

  createTenant(tenantData: Partial<Tenant>): Observable<Tenant> {
    // En una app real esto es una llamada a la api
    const newTenant: Tenant = {
      id: (this.mockTenants.length > 0 ? Math.max(...this.mockTenants.map(t => t.id)) : 0) + 1,
      name: tenantData.name || "",
      description: tenantData.description || "",
    }
    this.mockTenants = [...this.mockTenants, newTenant];
    return of(newTenant);
  }

  updateTenant(id: number, tenantData: Partial<Tenant>): Observable<Tenant> {
    let updatedTenant: Tenant | undefined;
    this.mockTenants = this.mockTenants.map((tenant) => {
      if (tenant.id === id) {
        updatedTenant = { ...tenant, ...tenantData };
        return updatedTenant;
      }
      return tenant;
    });

    if (!updatedTenant) {
      throw new Error("Tenant no encontrados para actualizar");
    }
    return of(updatedTenant);
  }

  deleteTenant(id: number): Observable<boolean> {
    const initialLength = this.mockTenants.length;
    this.mockTenants = this.mockTenants.filter((tenant) => tenant.id !== id);

    return of(this.mockTenants.length < initialLength);
  }
}