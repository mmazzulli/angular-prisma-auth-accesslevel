import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from './roles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // ===== API =====
  register(
    name: string, 
    email: string, 
    password: string, 
    role: 'superadmin' | 'empresa' | 'funcionarios' | 'clientes'): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, 
      { 
        name, 
        email, 
        password,
        role });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // ===== Token =====
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  logout() {
    localStorage.removeItem('token');
    this.clearDevRole(); // limpa fallback de DEV, se houver
  }

  // ===== Decodificação JWT e expiração =====
  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getPayload(): any | null {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  isTokenExpired(): boolean {
    const payload = this.getPayload();
    if (!payload?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  // ===== Roles (papéis) =====
  /**
   * Busca o role preferencialmente do token (quando o backend já envia),
   * e usa um fallback de DEV salvo no localStorage enquanto o backend não envia.
   */
  getRole(): Role | null {
    const payload = this.getPayload();
    if (payload?.role) return payload.role as Role;

    // Fallback de desenvolvimento até o backend incluir "role" no JWT
    const dev = localStorage.getItem('role') as Role | null;
    return dev ?? null;
  }

  hasRole(required: Role): boolean {
    const role = this.getRole();
    return role === required;
  }

  hasAnyRole(roles: Role[]): boolean {
    const role = this.getRole();
    return role ? roles.includes(role) : false;
    }

  // ===== Auxiliares DEV (remover quando o backend já enviar role no token) =====
  setDevRole(role: Role) {
    localStorage.setItem('role', role);
  }

  clearDevRole() {
    localStorage.removeItem('role');
  }
}