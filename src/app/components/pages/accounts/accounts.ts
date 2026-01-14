import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { AccountRowComponent } from '../../ui/account-row/account-row';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent, AccountRowComponent],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss'
})
export class AccountsComponent {
    accounts = [
        {
            name: 'CUENTA *3270',
            holder: 'ALBERTO SANCHEZ RUIZ',
            iban: 'ES4801825319700205983270',
            amount: '211,47 €',
            isTitular: true
        },
        {
            name: 'CUENTA *1234',
            holder: 'ALBERTO SANCHEZ RUIZ',
            iban: 'ES9900491827462910384756',
            amount: '1.450,22 €',
            isTitular: true
        },
        {
            name: 'CUENTA *5678',
            holder: 'ALBERTO SANCHEZ RUIZ',
            iban: 'ES1200491827462910384756',
            amount: '50,00 €',
            isTitular: true
        },
        {
            name: 'CUENTA *9012',
            holder: 'ALBERTO SANCHEZ RUIZ',
            iban: 'ES3400491827462910384756',
            amount: '12.345,67 €',
            isTitular: true
        },
        {
            name: 'CUENTA *3456',
            holder: 'ALBERTO SANCHEZ RUIZ',
            iban: 'ES5600491827462910384756',
            amount: '0,99 €',
            isTitular: true
        }
    ];
}
