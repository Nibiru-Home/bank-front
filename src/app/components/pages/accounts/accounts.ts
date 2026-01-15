import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { AccountRowComponent } from '../../ui/account-row/account-row';
import { BankAccountService } from '../../../services/bank-account.service';
import { BankAccount } from '../../../models/bank-account.model';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, AccountRowComponent],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss'
})
export class AccountsComponent implements OnInit {
    accounts: any[] = []; 

    constructor(private bankAccountService: BankAccountService) { }

    ngOnInit() {
        this.bankAccountService.findAll().subscribe(data => {
            this.accounts = data.map(account => ({
                id: account.id,
                name: `CUENTA *${account.iban.slice(-4)}`, 
                holder: account.client ? `${account.client.firstName} ${account.client.lastName}` : 'Desconocido',
                iban: account.iban,
                amount: account.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
                isTitular: true 
            }));
        });
    }
}
