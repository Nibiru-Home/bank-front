import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount } from '../models/bank-account.model';

@Injectable({
    providedIn: 'root'
})
export class BankAccountService {
    private apiUrl = '/api/bank-accounts';

    constructor(private http: HttpClient) { }

    findAll(): Observable<BankAccount[]> {
        return this.http.get<BankAccount[]>(this.apiUrl);
    }

    findById(id: number): Observable<BankAccount> {
        return this.http.get<BankAccount>(`${this.apiUrl}/${id}`);
    }

    findByCreditCardId(id: number): Observable<BankAccount> {
        return this.http.get<BankAccount>(`${this.apiUrl}/card/${id}`);
    }

    findByClientId(id: string): Observable<BankAccount[]> {
        return this.http.get<BankAccount[]>(`${this.apiUrl}/client/${id}`);
    }

    create(account: BankAccount): Observable<BankAccount> {
        return this.http.post<BankAccount>(this.apiUrl, account);
    }

    update(id: number, account: BankAccount): Observable<BankAccount> {
        return this.http.put<BankAccount>(`${this.apiUrl}/${id}`, account);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
