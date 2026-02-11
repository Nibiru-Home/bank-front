import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { API_BASE_URL } from '../api-base-url';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private readonly apiUrl = `${API_BASE_URL}/api/clients`;

    constructor(private http: HttpClient) { }

    findAll(): Observable<Client[]> {
        return this.http.get<Client[]>(this.apiUrl);
    }

    findById(id: string): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    create(client: Client): Observable<Client> {
        return this.http.post<Client>(this.apiUrl, client);
    }

    update(id: string, client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    login(login: string, password: string): Observable<Client> {
        return this.http.post<Client>(`${this.apiUrl}/login`, { login, password });
    }
}
