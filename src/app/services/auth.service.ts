import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { Client } from '../models/client.model';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser: Client | null = null;
    private readonly USER_KEY = 'currentUser';

    constructor(private clientService: ClientService) {
        const savedUser = localStorage.getItem(this.USER_KEY);
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    login(dni: string): Observable<boolean> {
        return this.clientService.findAll().pipe(
            map(clients => {
                const user = clients.find(c => c.DNI === dni);
                if (user) {
                    this.currentUser = user;
                    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                    return true;
                }
                return false;
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
