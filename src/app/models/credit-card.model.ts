export interface CreditCard {
    id: number;
    number: string;
    expirationDate: string; 
    cvv: number;
    name: string;
}

export interface CreditCardCreateRequest {
    id: number | null;
    number: string;
    expirationDate: string;
    cvv: number;
    name: string;
}
