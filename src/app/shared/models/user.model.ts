export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;      
  image: string;

  // --- Campos que añadimos nosotros y que no vienen de la API ---
  token?: string;      
  roles: string[];     
  tenantIds: number[]; 
}