import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount, BankAccountCreateRequest } from '../models/bank-account.model';
import { BankMovement } from '../models/bank-movement.model';

@Injectable({
    providedIn: 'root'
})
export class BankAccountService {
    private readonly apiUrl = '/api/bank-accounts';
    private readonly movementsUrl = '/api/bank-movements';

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

    getMovementsByAccountId(id: number): Observable<BankMovement[]> {
        return this.http.get<BankMovement[]>(`${this.movementsUrl}/account/${id}`);
    }

    create(account: BankAccountCreateRequest): Observable<BankAccount> {
        return this.http.post<BankAccount>(this.apiUrl, account);
    }

    update(id: number, account: BankAccount): Observable<BankAccount> {
        return this.http.put<BankAccount>(`${this.apiUrl}/${id}`, account);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
