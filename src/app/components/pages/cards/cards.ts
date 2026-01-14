import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { CardRowComponent } from '../../ui/card-row/card-row';

@Component({
    selector: 'app-cards',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent, CardRowComponent],
    templateUrl: './cards.html',
    styleUrl: './cards.scss'
})
export class CardsComponent {
    cards = [
        {
            id: '1',
            name: 'VISA *1234',
            pan: '4548 **** **** 1234',
            holder: 'ALBERTO SANCHEZ RUIZ',
            amount: '1.250,50 €'
        },
        {
            id: '2',
            name: 'MASTERCARD *5678',
            pan: '5412 **** **** 5678',
            holder: 'ALBERTO SANCHEZ RUIZ',
            amount: '430,20 €'
        },
        {
            id: '3',
            name: 'VISA *9012',
            pan: '4916 **** **** 9012',
            holder: 'ALBERTO SANCHEZ RUIZ',
            amount: '5.000,00 €'
        },
        {
            id: '4',
            name: 'AMEX *3456',
            pan: '3782 ****** 34565',
            holder: 'ALBERTO SANCHEZ RUIZ',
            amount: '2.345,75 €'
        },
        {
            id: '5',
            name: 'VISA *7890',
            pan: '4000 **** **** 7890',
            holder: 'ALBERTO SANCHEZ RUIZ',
            amount: '89,99 €'
        }
    ];
}
