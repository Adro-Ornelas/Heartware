import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    constructor(private http: HttpClient) { }

    login(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, data);
    }
    signup(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/signup`, data);
    }
    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }
    getToken(): string | null {
        return localStorage.getItem('token');
    }
    isLoggedIn(): boolean {
        return !!this.getToken();
    }
    saveUserId(id: number): void {
        localStorage.setItem('id_user', id.toString());
    }
    saveUserType(type: string): void {
        localStorage.setItem('user_type', type);
    }
    

    getUserId(): number | null {
        const id = localStorage.getItem('id_user');
        return id ? Number(id) : null;
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('id_user');
    }
}