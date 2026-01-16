import { Client } from './client.model';
import { BankMovement } from './bank-movement.model';
import { CreditCard } from './credit-card.model';

export interface BankAccount {
    id: number;
    balance: number;
    iban: string;
    client: Client | null; 
    movements: BankMovement[];
    creditCards: CreditCard[];
}

export interface BankAccountCreateRequest {
    id: number | null;
    balance: number;
    iban: string;
    clientId?: number | null;
}
