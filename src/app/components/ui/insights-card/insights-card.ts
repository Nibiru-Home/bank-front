import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { BankMovement } from '../../../models/bank-movement.model';
import { BankAccount } from '../../../models/bank-account.model';

@Component({
  selector: 'app-insights-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './insights-card.html',
  styleUrl: './insights-card.scss'
})
export class InsightsCardComponent implements OnInit {
  private authService = inject(AuthService);
  private bankAccountService = inject(BankAccountService);

  totalExpenses = 0;
  atmExpenses = 0;
  leisureExpenses = 0;
  currentDate = new Date();

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.bankAccountService.findByClientId(user.id).subscribe({
        next: (accounts: BankAccount[]) => {
          const allMovements = accounts.flatMap((acc: BankAccount) => acc.movements || []);
          this.calculateExpenses(allMovements);
        }
      });
    }
  }

  private calculateExpenses(movements: BankMovement[]): void {
    const currentMonth = this.currentDate.getMonth();
    const currentYear = this.currentDate.getFullYear();

    const monthlyExpenses = movements.filter(m => {
      const date = new Date(m.timestamp);
      return date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        m.amount < 0; // Assuming expenses are negative
    });

    // Sum absolute values
    this.totalExpenses = monthlyExpenses.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

    // Requested fixed percentages
    this.atmExpenses = this.totalExpenses * 0.57;
    this.leisureExpenses = this.totalExpenses * 0.25;
  }
}
