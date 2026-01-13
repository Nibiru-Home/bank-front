import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [],
  templateUrl: './balance-card.html',
  styleUrl: './balance-card.scss'
})
export class BalanceCardComponent {
  @Input() label: string = 'Saldo total disponible';
  @Input() amount: string = '12.540,80 EUR';
}
