import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { AccountRowComponent } from '../../ui/account-row/account-row';
import { BankAccountService } from '../../../services/bank-account.service';
import { AuthService } from '../../../services/auth.service';
import { BankAccount } from '../../../models/bank-account.model';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent, AccountRowComponent],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss'
})
export class AccountsComponent implements OnInit {
    accounts: any[] = []; // Using any[] to map to view expectation for now

    constructor(
        private bankAccountService: BankAccountService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
            this.bankAccountService.findByClientId(currentUser.id).subscribe(data => {
                this.accounts = data.map(account => ({
                    id: account.id,
                    name: `CUENTA *${account.iban.slice(-4)}`, // Generating a name
                    holder: account.client ? `${account.client.firstName} ${account.client.lastName}` : 'Desconocido',
                    iban: account.iban,
                    amount: account.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
                    isTitular: true // Defaulted
                }));
            });
        }
    }
}
