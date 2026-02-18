import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { CardRowComponent } from '../../ui/card-row/card-row';
import { CardService } from '../../../services/card.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { AuthService } from '../../../services/auth.service';
import { CreditCard } from '../../../models/credit-card.model';
import { LocalCardView, LocalDataService } from '../../../services/local-data.service';

@Component({
    selector: 'app-cards',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, CardRowComponent],
    templateUrl: './cards.html',
    styleUrl: './cards.scss'
})
export class CardsComponent implements OnInit {
    cards: LocalCardView[] = [];

    constructor(
        private cardService: CardService,
        private bankAccountService: BankAccountService,
        private authService: AuthService,
        private localDataService: LocalDataService
    ) { }

    ngOnInit() {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
            this.cardService.findByClientId(currentUser.id).subscribe({
                next: (data) => {
                    const remoteCards = data.map(card => this.toLocalCardView(card));
                    const mergedCards = this.mergeLocalCards(currentUser.id, remoteCards);
                    this.cards = mergedCards;
                    this.populateCardBalances(mergedCards);
                },
                error: () => {
                    this.cards = this.localDataService.getCards(currentUser.id);
                }
            });
        }
    }

    private toLocalCardView(card: CreditCard): LocalCardView {
        return {
            id: String(card.id),
            name: card.name,
            pan: `**** **** **** ${card.number.slice(-4)}`,
            holder: card.name,
            amount: 'Cargando...',
            type: 'debit'
        };
    }

    private mergeLocalCards(userId: string, remoteCards: LocalCardView[]): LocalCardView[] {
        const localCards = this.localDataService.getCards(userId);
        if (!localCards.length) {
            return remoteCards;
        }
        const remoteIds = new Set(remoteCards.map(card => card.id));
        const localById = new Map(localCards.map(card => [card.id, card]));
        const pendingLocal = localCards.filter(card => !remoteIds.has(card.id));
        const mergedRemote = remoteCards.map(card => {
            const local = localById.get(card.id);
            if (local?.type) {
                return { ...card, type: local.type };
            }
            return card;
        });
        return [...pendingLocal, ...mergedRemote];
    }

    private populateCardBalances(cards: LocalCardView[]): void {
        cards.forEach(card => {
            if (card.amount !== 'Cargando...') {
                return;
            }
            const cardId = Number(card.id);
            if (!Number.isFinite(cardId)) {
                card.amount = 'No disponible';
                return;
            }
            this.bankAccountService.findByCreditCardId(cardId).subscribe({
                next: (account) => {
                    card.amount = this.formatCurrency(account.balance);
                },
                error: () => {
                    card.amount = 'No disponible';
                }
            });
        });
    }

    private formatCurrency(amount: number): string {
        return amount.toLocaleString('es-es', { style: 'currency', currency: 'EUR' });
    }
}
