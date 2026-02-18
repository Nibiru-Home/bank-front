import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { AccountRowComponent } from '../../ui/account-row/account-row';
import { BankAccountService } from '../../../services/bank-account.service';
import { AuthService } from '../../../services/auth.service';
import { BankAccount } from '../../../models/bank-account.model';
import { LocalAccountView, LocalDataService } from '../../../services/local-data.service';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, AccountRowComponent],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss'
})
export class AccountsComponent implements OnInit {
    accounts: LocalAccountView[] = [];

    constructor(
        private bankAccountService: BankAccountService,
        private authService: AuthService,
        private localDataService: LocalDataService
    ) { }

    ngOnInit() {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
            const fallbackHolder = this.buildHolderName(
                currentUser.firstName,
                currentUser.lastName,
                currentUser.secondLastName
            );
            this.bankAccountService.findByClientId(currentUser.id).subscribe({
                next: (data) => {
                    const remoteAccounts = data.map(account => this.toLocalAccountView(account, fallbackHolder));
                    this.accounts = this.mergeLocalAccounts(currentUser.id, remoteAccounts);
                },
                error: () => {
                    this.accounts = this.localDataService.getAccounts(currentUser.id);
                }
            });
        }
    }

    private toLocalAccountView(account: BankAccount, fallbackHolder: string): LocalAccountView {
        const holderFromClient = account.client
            ? this.buildHolderName(account.client.firstName, account.client.lastName, account.client.secondLastName)
            : '';
        const holder = holderFromClient || fallbackHolder || 'Desconocido';
        const last4 = account.iban.slice(-4);
        return {
            id: String(account.id),
            name: `CUENTA *${last4}`,
            holder,
            iban: `**** **** **** ${last4}`,
            amount: this.formatCurrency(account.balance),
            isTitular: true
        };
    }

    private mergeLocalAccounts(userId: string, remoteAccounts: LocalAccountView[]): LocalAccountView[] {
        const localAccounts = this.localDataService.getAccounts(userId);
        if (!localAccounts.length) {
            return remoteAccounts;
        }
        const remoteIds = new Set(remoteAccounts.map(account => account.id));
        const pendingLocal = localAccounts.filter(account => !remoteIds.has(account.id));
        if (pendingLocal.length !== localAccounts.length) {
            this.localDataService.setAccounts(userId, pendingLocal);
        }
        return [...pendingLocal, ...remoteAccounts];
    }

    private buildHolderName(firstName?: string | null, lastName?: string | null, secondLastName?: string | null): string {
        return [firstName, lastName, secondLastName].filter(Boolean).join(' ');
    }

    private formatCurrency(amount: number): string {
        return amount.toLocaleString('es-es', { style: 'currency', currency: 'EUR' });
    }
}
