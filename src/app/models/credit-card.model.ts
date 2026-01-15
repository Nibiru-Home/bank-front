export interface CreditCard {
    id: number;
    number: string;
    expirationDate: string; // LocalDate is usually string in JSON
    cvv: number;
    name: string;
}
