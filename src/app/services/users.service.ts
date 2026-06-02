import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UpdateUserPayload, User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private http = inject(HttpClient);
    private base = this.resolveApiBase();
    private router = inject(Router);

    getCurrentUserId(): number | null {
        const storedUserId =
            localStorage.getItem('id_user') ||
            localStorage.getItem('userId');
        
        const idUser = Number(storedUserId);

        return Number.isInteger(idUser) && idUser > 0
            ? idUser
            : null;
    }

    setCurrentUserId(idUser: number) {
        localStorage.setItem('id_user', String(idUser));
    }
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.base}/users`);
    }
    createUser(payload: UpdateUserPayload): Observable<User> {
        return this.http.post<User>(`${this.base}/users`, payload);
    }

    getUser(idUser: number): Observable<User> {
        return this.http.get<User>(`${this.base}/users/${idUser}`).pipe(
            tap((user) => {
                // Protección: Solo actualiza el localStorage si te estás consultando a ti mismo
                if (idUser === this.getCurrentUserId()) {
                    this.setCurrentUserId(user.id_user);
                }
            })
        );
    }

    updateUser(idUser: number, payload: UpdateUserPayload): Observable<User> {
        return this.http.put<User>(`${this.base}/users/${idUser}`, payload).pipe(
            tap((user) => {
                // Protección: Evita que el Admin pierda su sesión al editar a otros usuarios del CRUD
                if (idUser === this.getCurrentUserId()) {
                    this.setCurrentUserId(user.id_user);
                }
            })
        );
    }
    deleteUser(idUser: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/users/${idUser}`);
    }
    

    private resolveApiBase(): string {
        try {
            const host = window.location.hostname;

            if (host === 'localhost' || host === '127.0.0.1') {
                return 'http://localhost:3000/api';
            }
        } catch {
            return '/api';
        }

        return '/api';
    }

    logout(): void {
        localStorage.removeItem('id_user');
        localStorage.removeItem('userId');
        this.router.navigate(['/auth/login']);
    }

    isLoggedIn(): boolean {
        const id = Number(localStorage.getItem('id_user'));
        return Number.isInteger(id) && id > 0;
    }
}
