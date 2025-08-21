import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
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
    role: Role
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, role });
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // ===== Status =====
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  // ===== Decodificação JWT =====
  getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<any>(token);
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.getPayload();
    if (!payload?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  // ===== Roles =====
  getRole(): Role | null {
    const payload = this.getPayload();
    return payload?.role as Role ?? null;
  }

  hasRole(required: Role): boolean {
    const role = this.getRole();
    return role === required;
  }

  hasAnyRole(roles: Role[]): boolean {
    const role = this.getRole();
    return role ? roles.includes(role) : false;
  }

  // ===== Helper: chamada autenticada =====
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
}
