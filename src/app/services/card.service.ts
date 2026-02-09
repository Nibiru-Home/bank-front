import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankMovement } from '../models/bank-movement.model';
import { CreditCard, CreditCardCreateRequest } from '../models/credit-card.model';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private readonly apiUrl = '/api/credit-cards';
    private readonly movementsUrl = '/api/bank-movements';

    constructor(private readonly http: HttpClient) { }

    getCard(id: number): Observable<CreditCard> {
        return this.http.get<CreditCard>(`${this.apiUrl}/${id}`);
    }

    findAll(): Observable<CreditCard[]> {
        return this.http.get<CreditCard[]>(this.apiUrl);
    }

    create(card: CreditCardCreateRequest): Observable<CreditCard> {
        return this.http.post<CreditCard>(this.apiUrl, card);
    }

    update(id: number, card: CreditCard): Observable<CreditCard> {
        return this.http.put<CreditCard>(`${this.apiUrl}/${id}`, card);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getMovements(cardId: number): Observable<BankMovement[]> {
        return this.http.get<BankMovement[]>(`${this.movementsUrl}/card/${cardId}`);
    }

    findByClientId(id: string): Observable<CreditCard[]> {
        return this.http.get<CreditCard[]>(`${this.apiUrl}/client/${id}`);
    }
}
