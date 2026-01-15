import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { CardRowComponent } from '../../ui/card-row/card-row';
import { CardService } from '../../../services/card.service';
import { BankAccountService } from '../../../services/bank-account.service';

@Component({
    selector: 'app-cards',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, CardRowComponent],
    templateUrl: './cards.html',
    styleUrl: './cards.scss'
})
export class CardsComponent implements OnInit {
    cards: any[] = []; 

    constructor(
        private cardService: CardService,
        private bankAccountService: BankAccountService
    ) { }

    ngOnInit() {
        this.cardService.findAll().subscribe(data => {
            this.cards = data.map(card => {
                const cardView = {
                    id: card.id,
                    name: card.name,
                    pan: card.number, 
                    holder: card.name,
                    amount: 'Cargando...' 
                };

                
                if (card.id) {
                    this.bankAccountService.findByCreditCardId(Number(card.id)).subscribe({
                        next: (account) => {
                            cardView.amount = account.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
                        },
                        error: () => {
                            cardView.amount = 'No disponible';
                        }
                    });
                }

                return cardView;
            });
        });
    }
}
