import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { QuickActionComponent } from '../../ui/quick-action/quick-action';
import { BalanceCardComponent } from '../../ui/balance-card/balance-card';
import { InsightsCardComponent } from '../../ui/insights-card/insights-card';

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
export class IndexComponent {}
