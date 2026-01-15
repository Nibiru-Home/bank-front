import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreditCard {
    id: number;
    number: string;
    expirationDate: string;
    cvv: number;
    name: string;
    pan: string;
    balance: number;
    holder: string;
}

export interface BankMovement {
    id: number;
    amount: number;
    concept: string;
    timestamp: string;
    // Add other fields as necessary from backend response
}

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private apiUrl = '/api/credit-cards';
    private movementsUrl = '/api/bank-movements';

    constructor(private http: HttpClient) {}

    getCard(id: number): Observable<CreditCard> {
        return this.http.get<CreditCard>(`${this.apiUrl}/${id}`);
    }

    getMovements(cardId: number): Observable<BankMovement[]> {
        return this.http.get<BankMovement[]>(`${this.movementsUrl}/card/${cardId}`);
    }
}
