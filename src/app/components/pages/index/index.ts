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

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    QuickActionComponent,
    BalanceCardComponent,
    InsightsCardComponent
  ],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class IndexComponent implements OnInit {
  totalBalance: number = 0;
  accounts: any[] = [];
  cards: any[] = [];

  constructor(
    private bankAccountService: BankAccountService,
    private cardService: CardService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      // Fetch Accounts (Limit 2)
      this.bankAccountService.findByClientId(currentUser.id).subscribe(accounts => {
        this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
        this.accounts = accounts.slice(0, 2).map(account => ({
          name: `Cuenta *${account.iban.slice(-4)}`,
          iban: `**** **** **** ${account.iban.slice(-4)}`,
          balance: account.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
        }));
      });

      // Fetch Cards (Limit 1)
      this.cardService.findByClientId(currentUser.id).subscribe(cards => {
        this.cards = cards.slice(0, 1).map(card => ({
          name: card.name,
          pan: `**** **** **** ${card.number.slice(-4)}`,
          type: 'Debito' // Hardcoded for now as per design
        }));
      });
    }
  }
}
