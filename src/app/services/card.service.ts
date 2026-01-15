import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditCard } from '../models/credit-card.model';
import { BankMovement } from '../models/bank-movement.model';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private apiUrl = '/api/credit-cards';
    private movementsUrl = '/api/bank-movements';

    constructor(private http: HttpClient) { }

    getCard(id: number): Observable<CreditCard> {
        return this.http.get<CreditCard>(`${this.apiUrl}/${id}`);
    }

    findAll(): Observable<CreditCard[]> {
        return this.http.get<CreditCard[]>(this.apiUrl);
    }

    create(card: CreditCard): Observable<CreditCard> {
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
}
