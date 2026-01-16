import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

        const currentUser = this.authService.getCurrentUser();
        if (!currentUser?.id) {
            alert('No se pudo identificar al usuario');
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
                const amount = this.getSelectedAccountAmount() ?? 'No disponible';
                const cardView = this.toLocalCardView(created, amount);
                this.localDataService.upsertCard(currentUser.id, cardView);
                alert('Solicitud de tarjeta enviada con éxito');
                this.router.navigate(['/cards']);
            },
            error: () => {
                alert('No se pudo solicitar la tarjeta');
            }
        });
    }

    private toAccountOption(account: { id: number | string; iban: string; balance: number }): AccountOption {
        return {
            id: String(account.id),
            label: `Cuenta *${account.iban.slice(-4)} - ${this.formatCurrency(account.balance)}`,
            amount: this.formatCurrency(account.balance)
        };
    }

    private toAccountOptionFromLocal(account: LocalAccountView): AccountOption {
        return {
            id: String(account.id),
            label: `${account.name} - ${account.amount}`,
            amount: account.amount
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

    private getSelectedAccountAmount(): string | null {
        if (!this.selectedAccountId) {
            return null;
        }
        const selected = this.accountOptions.find(option => option.id === this.selectedAccountId);
        return selected ? selected.amount : null;
    }

    private toLocalCardView(card: CreditCard, amount: string): LocalCardView {
        return {
            id: String(card.id),
            name: card.name,
            pan: `**** **** **** ${card.number.slice(-4)}`,
            holder: card.name,
            amount
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
}
