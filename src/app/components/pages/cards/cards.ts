import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { CardRowComponent } from '../../ui/card-row/card-row';
import { CardService } from '../../../services/card.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-cards',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent, CardRowComponent],
    templateUrl: './cards.html',
    styleUrl: './cards.scss'
})
export class CardsComponent implements OnInit {
    cards: any[] = []; // Using any[] to map to view expectation for now

    constructor(
        private cardService: CardService,
        private bankAccountService: BankAccountService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
            this.cardService.findByClientId(currentUser.id).subscribe(data => {
                this.cards = data.map(card => {
                    const cardView = {
                        id: card.id,
                        name: card.name,
                        pan: `**** **** **** ${card.number.slice(-4)}`, // Masked PAN
                        holder: card.name,
                        amount: 'Cargando...' // Placeholder
                    };

                    // Fetch balance for this card
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
}
