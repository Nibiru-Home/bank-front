import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { LocalAccountView, LocalDataService } from '../../../services/local-data.service';
import { BankAccount, BankAccountCreateRequest } from '../../../models/bank-account.model';

@Component({
    selector: 'app-account-create',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './account-create.html',
    styleUrl: './account-create.scss'
})
export class AccountCreateComponent {
    holderName = '';

    constructor(
        private router: Router,
        private authService: AuthService,
        private bankAccountService: BankAccountService,
        private localDataService: LocalDataService
    ) {
        const user = this.authService.getCurrentUser();
        this.holderName = [user?.firstName, user?.lastName, user?.secondLastName]
            .filter(Boolean)
            .join(' ');
    }

    createAccount(event: Event) {
        event.preventDefault();

        const currentUser = this.authService.getCurrentUser();
        if (!currentUser?.id) {
            alert('No se pudo identificar al usuario');
            return;
        }

        const payload: BankAccountCreateRequest = {
            id: null,
            balance: 0,
            iban: this.generateIban()
        };

        this.bankAccountService.create(payload).subscribe({
            next: (created) => {
                const holderName = this.holderName
                    || this.buildHolderName(currentUser.firstName, currentUser.lastName, currentUser.secondLastName)
                    || 'Titular';
                const accountView = this.toLocalAccountView(created, holderName);
                this.localDataService.upsertAccount(currentUser.id, accountView);
                alert('Cuenta creada con éxito');
                this.router.navigate(['/accounts']);
            },
            error: () => {
                alert('No se pudo crear la cuenta');
            }
        });
    }

    private toLocalAccountView(account: BankAccount, holder: string): LocalAccountView {
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

    private formatCurrency(amount: number): string {
        return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    }

    private buildHolderName(firstName?: string | null, lastName?: string | null, secondLastName?: string | null): string {
        return [firstName, lastName, secondLastName].filter(Boolean).join(' ');
    }

    private generateIban(): string {
        const digits = Array.from({ length: 22 }, () => Math.floor(Math.random() * 10)).join('');
        return `ES${digits}`;
    }
}
