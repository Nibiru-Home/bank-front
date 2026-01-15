import { MovementType, MovementOrigin } from './enums.model';
import { CreditCard } from './credit-card.model';
import { BankAccount } from './bank-account.model';

export interface BankMovement {
    id: number;
    amount: number; // BigDecimal in Java -> number in TS
    movementType: MovementType;
    movementOrigin: MovementOrigin;
    concept: string | null;
    timestamp: string; // LocalDateTime -> string
    originCreditCard: CreditCard | null;
    destinationBankAccount: BankAccount | null;
}
