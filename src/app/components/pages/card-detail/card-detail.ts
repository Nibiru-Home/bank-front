import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-card-detail',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent],
    templateUrl: './card-detail.html',
    styleUrl: './card-detail.scss'
})
export class CardDetailComponent {
    // Mock data
    card = {
        name: 'TARJETA VISA',
        number: '**** 1234',
        pan: '4548 **** **** 1234',
        amount: '1.250,50 €',
        holder: 'ALBERTO SANCHEZ RUIZ',
        expiry: '12/28'
    };

    movements = [
        { concept: 'Starbucks', date: '14/01/2026', amount: '-5,50 €' },
        { concept: 'Uber Ride', date: '13/01/2026', amount: '-12,30 €' },
        { concept: 'ZARA', date: '10/01/2026', amount: '-89,95 €' },
        { concept: 'Gasolinera Repsol', date: '08/01/2026', amount: '-45,00 €' },
        { concept: 'Cine Yelmo', date: '05/01/2026', amount: '-18,00 €' }
    ];

    constructor(private route: ActivatedRoute) {
        // Here we would fetch data based on ID
    }
}
