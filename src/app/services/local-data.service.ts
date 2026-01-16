import { Injectable } from '@angular/core';

export interface LocalAccountView {
    id: string;
    name: string;
    iban: string;
    holder: string;
    amount: string;
    isTitular: boolean;
}

export interface LocalCardView {
    id: string;
    name: string;
    pan: string;
    holder: string;
    amount: string;
    type?: 'debit' | 'credit';
}

@Injectable({
    providedIn: 'root'
})
export class LocalDataService {
    private getAccountsKey(clientId: string): string {
        return `localAccounts:${clientId}`;
    }

    private getCardsKey(clientId: string): string {
        return `localCards:${clientId}`;
    }

    getAccounts(clientId: string): LocalAccountView[] {
        return this.readList<LocalAccountView>(this.getAccountsKey(clientId)).map(account => ({
            ...account,
            id: String(account.id)
        }));
    }

    setAccounts(clientId: string, accounts: LocalAccountView[]): void {
        this.writeList(this.getAccountsKey(clientId), accounts);
    }

    upsertAccount(clientId: string, account: LocalAccountView): void {
        const accounts = this.getAccounts(clientId);
        const id = account.id;
        const index = accounts.findIndex(item => item.id === id);
        if (index >= 0) {
            accounts[index] = account;
        } else {
            accounts.unshift(account);
        }
        this.setAccounts(clientId, accounts);
    }

    getCards(clientId: string): LocalCardView[] {
        return this.readList<LocalCardView>(this.getCardsKey(clientId)).map(card => ({
            ...card,
            id: String(card.id)
        }));
    }

    setCards(clientId: string, cards: LocalCardView[]): void {
        this.writeList(this.getCardsKey(clientId), cards);
    }

    upsertCard(clientId: string, card: LocalCardView): void {
        const cards = this.getCards(clientId);
        const id = card.id;
        const index = cards.findIndex(item => item.id === id);
        if (index >= 0) {
            cards[index] = card;
        } else {
            cards.unshift(card);
        }
        this.setCards(clientId, cards);
    }

    private readList<T>(key: string): T[] {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return [];
        }
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    private writeList<T>(key: string, list: T[]): void {
        localStorage.setItem(key, JSON.stringify(list));
    }
}
