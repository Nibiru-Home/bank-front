import { BankAccount } from './bank-account.model';

export interface Client {
    id: string; 
    login: string;
    firstName: string;
    lastName: string | null;
    secondLastName: string | null;
    DNI: string;
    apiToken: string | null;
    bankAccounts: BankAccount[];
}
