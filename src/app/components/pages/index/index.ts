import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { QuickActionComponent } from '../../ui/quick-action/quick-action';
import { BalanceCardComponent } from '../../ui/balance-card/balance-card';
import { InsightsCardComponent } from '../../ui/insights-card/insights-card';
import { BankAccountService } from '../../../services/bank-account.service';
import { AuthService } from '../../../services/auth.service';
import { CardService } from '../../../services/card.service';
import { RouterModule } from '@angular/router';
import { LocalAccountView, LocalDataService } from '../../../services/local-data.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    QuickActionComponent,
    BalanceCardComponent,
    InsightsCardComponent,
    RouterModule
  ],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class IndexComponent implements OnInit {
  totalBalance: number = 0;
  accounts: Array<{ id: string; name: string; iban: string; balance: string }> = [];
  cards: Array<{ id: string; name: string; pan: string; type: string }> = [];
  currentUserName = 'Usuario';

  constructor(
    private bankAccountService: BankAccountService,
    private cardService: CardService,
    private authService: AuthService,
    private localDataService: LocalDataService
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      const fullName = [currentUser.firstName, currentUser.lastName, currentUser.secondLastName]
        .filter(Boolean)
        .join(' ')
        .trim();
      if (fullName) {
        this.currentUserName = fullName;
      }
      // Fetch Accounts
      this.bankAccountService.findByClientId(currentUser.id).subscribe({
        next: (accounts) => {
          const remoteTotal = accounts.reduce((sum, account) => sum + account.balance, 0);
          const remoteAccounts = accounts.map(account => ({
            id: String(account.id),
            name: `Cuenta *${account.iban.slice(-4)}`,
            iban: `**** **** **** ${account.iban.slice(-4)}`,
            balance: this.formatCurrency(account.balance)
          }));
          const mergeResult = this.mergeLocalAccounts(currentUser.id, remoteAccounts);
          this.accounts = mergeResult.merged;
          this.totalBalance = remoteTotal + this.sumLocalAccountAmounts(mergeResult.pendingLocal);
        },
        error: () => {
          const localAccounts = this.localDataService.getAccounts(currentUser.id);
          this.accounts = localAccounts.map(account => ({
            id: account.id,
            name: account.name,
            iban: account.iban,
            balance: account.amount
          }));
          this.totalBalance = this.sumLocalAccountAmounts(localAccounts);
        }
      });

      // Fetch Cards
      this.cardService.findByClientId(currentUser.id).subscribe({
        next: (cards) => {
          const remoteCards = cards.map(card => ({
            id: String(card.id),
            name: card.name,
            pan: `**** **** **** ${card.number.slice(-4)}`,
            type: 'Debito'
          }));
          this.cards = this.mergeLocalCards(currentUser.id, remoteCards);
        },
        error: () => {
          const localCards = this.localDataService.getCards(currentUser.id);
          this.cards = localCards.map(card => ({
            id: card.id,
            name: card.name,
            pan: card.pan,
            type: 'Debito'
          }));
        }
      });
    }
  }

  private mergeLocalAccounts(
    userId: string,
    remoteAccounts: Array<{ id: string; name: string; iban: string; balance: string }>
  ): { merged: Array<{ id: string; name: string; iban: string; balance: string }>; pendingLocal: LocalAccountView[] } {
    const localAccounts = this.localDataService.getAccounts(userId);
    if (!localAccounts.length) {
      return { merged: remoteAccounts, pendingLocal: [] };
    }
    const remoteIds = new Set(remoteAccounts.map(account => account.id));
    const pendingLocal = localAccounts.filter(account => !remoteIds.has(account.id));
    if (pendingLocal.length !== localAccounts.length) {
      this.localDataService.setAccounts(userId, pendingLocal);
    }
    const pendingMapped = pendingLocal.map(account => ({
      id: account.id,
      name: account.name,
      iban: account.iban,
      balance: account.amount
    }));
    return { merged: [...pendingMapped, ...remoteAccounts], pendingLocal };
  }

  private mergeLocalCards(
    userId: string,
    remoteCards: Array<{ id: string; name: string; pan: string; type: string }>
  ): Array<{ id: string; name: string; pan: string; type: string }> {
    const localCards = this.localDataService.getCards(userId);
    if (!localCards.length) {
      return remoteCards;
    }
    const remoteIds = new Set(remoteCards.map(card => card.id));
    const pendingLocal = localCards.filter(card => !remoteIds.has(card.id));
    if (pendingLocal.length !== localCards.length) {
      this.localDataService.setCards(userId, pendingLocal);
    }
    const pendingMapped = pendingLocal.map(card => ({
      id: card.id,
      name: card.name,
      pan: card.pan,
      type: 'Debito'
    }));
    return [...pendingMapped, ...remoteCards];
  }

  private sumLocalAccountAmounts(accounts: LocalAccountView[]): number {
    return accounts.reduce((sum, account) => sum + this.parseCurrency(account.amount), 0);
  }

  private parseCurrency(value: string): number {
    const normalized = value.replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private formatCurrency(amount: number): string {
    return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  }
}
