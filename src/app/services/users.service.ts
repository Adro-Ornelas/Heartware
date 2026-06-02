import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UpdateUserPayload, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private http = inject(HttpClient);
    private base = this.resolveApiBase();

    getCurrentUserId(): number {
        const storedUserId = localStorage.getItem('id_user') || localStorage.getItem('userId');
        const idUser = Number(storedUserId);

        return Number.isInteger(idUser) && idUser > 0 ? idUser : 1;
    }

    setCurrentUserId(idUser: number) {
        localStorage.setItem('id_user', String(idUser));
    }

    getUser(idUser: number): Observable<User> {
        return this.http.get<User>(`${this.base}/users/${idUser}`).pipe(tap((user) => this.setCurrentUserId(user.id_user)));
    }

    updateUser(idUser: number, payload: UpdateUserPayload): Observable<User> {
        return this.http.put<User>(`${this.base}/users/${idUser}`, payload).pipe(tap((user) => this.setCurrentUserId(user.id_user)));
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
}
