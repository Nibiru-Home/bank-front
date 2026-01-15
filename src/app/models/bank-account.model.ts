import { Client } from './client.model';
import { BankMovement } from './bank-movement.model';
import { CreditCard } from './credit-card.model';

export interface BankAccount {
    id: number;
    balance: number;
    iban: string;
    client: Client | null; // Nullable to avoid infinite recursion in JSON if not handled, though typically reference
    movements: BankMovement[];
    creditCards: CreditCard[];
}
