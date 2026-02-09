import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { CardService } from '../../../services/card.service';
import { CreditCard, CreditCardCreateRequest } from '../../../models/credit-card.model';
import { LocalAccountView, LocalCardView, LocalDataService } from '../../../services/local-data.service';

interface AccountOption {
    id: string;
    label: string;
    amount: string;
    balance: number | null;
}

@Component({
    selector: 'app-card-create',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, FormsModule],
    templateUrl: './card-create.html',
    styleUrl: './card-create.scss'
})
export class CardCreateComponent implements OnInit {
    cardType: 'debit' | 'credit' = 'debit';
    holderName = '';
    accountOptions: AccountOption[] = [];
    selectedAccountId = '';
    cardError = '';

    constructor(
        private router: Router,
        private authService: AuthService,
        private bankAccountService: BankAccountService,
        private cardService: CardService,
        private localDataService: LocalDataService
    ) {
        const user = this.authService.getCurrentUser();
        this.holderName = [user?.firstName, user?.lastName, user?.secondLastName]
            .filter(Boolean)
            .join(' ');
    }

    ngOnInit() {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser?.id) {
            return;
        }

        this.bankAccountService.findByClientId(currentUser.id).subscribe({
            next: (data) => {
                const remoteOptions = data.map(account => this.toAccountOption(account));
                const localOptions = this.localDataService
                    .getAccounts(currentUser.id)
                    .map(account => this.toAccountOptionFromLocal(account));
                this.accountOptions = this.mergeAccountOptions(localOptions, remoteOptions);
                this.selectedAccountId = this.accountOptions[0]?.id ?? '';
            },
            error: () => {
                this.accountOptions = this.localDataService
                    .getAccounts(currentUser.id)
                    .map(account => this.toAccountOptionFromLocal(account));
                this.selectedAccountId = this.accountOptions[0]?.id ?? '';
            }
        });
    }

    createCard(event: Event) {
        event.preventDefault();
        this.cardError = '';

        const currentUser = this.authService.getCurrentUser();
        if (!currentUser?.id) {
            this.cardError = 'Error de tarjeta. No se pudo identificar al usuario.';
            return;
        }

        const selectedAccount = this.getSelectedAccountOption();
        if (!selectedAccount) {
            this.cardError = 'Selecciona una cuenta vinculada.';
            return;
        }

        if (selectedAccount.balance !== null && selectedAccount.balance <= 0) {
            this.cardError = 'Error de tarjeta: saldo insuficiente en la cuenta vinculada.';
            return;
        }

        const holderName = this.holderName
            || this.buildHolderName(currentUser.firstName, currentUser.lastName, currentUser.secondLastName)
            || 'Titular';
        const payload: CreditCardCreateRequest = {
            id: null,
            number: this.generateCardNumber(),
            expirationDate: this.generateExpirationDate(),
            cvv: this.generateCvv(),
            name: holderName
        };

        this.cardService.create(payload).subscribe({
            next: (created) => {
                const amount = selectedAccount.amount;
                const cardView = this.toLocalCardView(created, amount);
                this.localDataService.upsertCard(currentUser.id, cardView);
                this.router.navigate(['/cards']);
            },
            error: (err: unknown) => {
                this.cardError = this.resolveCardError(err);
                console.error('No se pudo solicitar la tarjeta', err);
            }
        });
    }

    private toAccountOption(account: { id: number | string; iban: string; balance: number }): AccountOption {
        return {
            id: String(account.id),
            label: `Cuenta *${account.iban.slice(-4)} - ${this.formatCurrency(account.balance)}`,
            amount: this.formatCurrency(account.balance),
            balance: account.balance
        };
    }

    private toAccountOptionFromLocal(account: LocalAccountView): AccountOption {
        return {
            id: String(account.id),
            label: `${account.name} - ${account.amount}`,
            amount: account.amount,
            balance: this.parseCurrency(account.amount)
        };
    }

    private mergeAccountOptions(localOptions: AccountOption[], remoteOptions: AccountOption[]): AccountOption[] {
        if (!localOptions.length) {
            return remoteOptions;
        }
        const remoteIds = new Set(remoteOptions.map(option => option.id));
        const pendingLocal = localOptions.filter(option => !remoteIds.has(option.id));
        return [...pendingLocal, ...remoteOptions];
    }

    clearCardError(): void {
        if (this.cardError) {
            this.cardError = '';
        }
    }

    private toLocalCardView(card: CreditCard, amount: string): LocalCardView {
        return {
            id: String(card.id),
            name: card.name,
            pan: `**** **** **** ${card.number.slice(-4)}`,
            holder: card.name,
            amount,
            type: this.cardType
        };
    }

    private generateCardNumber(): string {
        const digits = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
        return `4${digits}`;
    }

    private generateExpirationDate(): string {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 3);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${date.getFullYear()}-${month}-01`;
    }

    private generateCvv(): number {
        return Math.floor(100 + Math.random() * 900);
    }

    private formatCurrency(amount: number): string {
        return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    }

    private buildHolderName(firstName?: string | null, lastName?: string | null, secondLastName?: string | null): string {
        return [firstName, lastName, secondLastName].filter(Boolean).join(' ');
    }

    private getSelectedAccountOption(): AccountOption | null {
        if (!this.selectedAccountId) {
            return null;
        }
        return this.accountOptions.find(option => option.id === this.selectedAccountId) ?? null;
    }

    private resolveCardError(error: unknown): string {
        if (error instanceof HttpErrorResponse) {
            const backendMessage = this.extractBackendMessage(error.error);
            const isInsufficientFunds = backendMessage.includes('insufficient funds')
                || backendMessage.includes('saldo insuficiente');

            if (isInsufficientFunds) {
                return 'Error de tarjeta: saldo insuficiente en la cuenta vinculada.';
            }
        }

        return 'Error de tarjeta al solicitarla. Intentalo de nuevo.';
    }

    private extractBackendMessage(payload: unknown): string {
        if (typeof payload === 'string') {
            return payload.toLowerCase();
        }

        if (payload && typeof payload === 'object') {
            const errorObj = payload as { message?: unknown; error?: unknown };

            if (typeof errorObj.message === 'string') {
                return errorObj.message.toLowerCase();
            }

            if (typeof errorObj.error === 'string') {
                return errorObj.error.toLowerCase();
            }
        }

        return '';
    }

    private parseCurrency(value: string): number | null {
        const cleaned = value
            .replace(/[^\d,.-]/g, '')
            .replace(/\./g, '')
            .replace(',', '.');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : null;
    }
}
