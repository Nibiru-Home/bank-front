import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { QuickActionComponent } from '../../ui/quick-action/quick-action';
import { BalanceCardComponent } from '../../ui/balance-card/balance-card';
import { InsightsCardComponent } from '../../ui/insights-card/insights-card';
import { BankAccountService } from '../../../services/bank-account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
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

  constructor(private bankAccountService: BankAccountService) { }

  ngOnInit() {
    this.bankAccountService.findAll().subscribe(accounts => {
      this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    });
  }
}
