import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { Client } from '../models/client.model';
import { Observable, map, of, catchError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser: Client | null = null;
    private readonly USER_KEY = 'currentUser';

    constructor(private clientService: ClientService) {
        const savedUser = localStorage.getItem(this.USER_KEY);
        if (!savedUser) {
            return;
        }

        try {
            this.currentUser = JSON.parse(savedUser);
        } catch {
            this.currentUser = null;
            localStorage.removeItem(this.USER_KEY);
        }
    }

    login(dni: string, password: string): Observable<boolean> {
        return this.clientService.login(dni, password).pipe(
            map(user => {
                if (user) {
                    this.currentUser = user;
                    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                    return true;
                }
                return false;
            }),
            catchError((error: any) => {
                console.error('Login failed', error);
                return of(false);
            })
        );
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem(this.USER_KEY);
    }

    getCurrentUser(): Client | null {
        return this.currentUser;
    }
}
