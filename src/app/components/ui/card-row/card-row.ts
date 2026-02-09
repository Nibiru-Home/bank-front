import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-card-row',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './card-row.html',
    styleUrl: './card-row.scss'
})
export class CardRowComponent {
    @Input() name: string = '';
    @Input() id: string = '';
    @Input() pan: string = '';
    @Input() holder: string = '';
    @Input() amount: string = '';
    @Input() cardType: 'debit' | 'credit' = 'debit';

    hasInsufficientFunds(): boolean {
        const parsedAmount = this.parseAmount(this.amount);
        return parsedAmount !== null && parsedAmount < 0;
    }

    private parseAmount(value: string): number | null {
        const cleaned = value
            .replace(/[^\d,.-]/g, '')
            .replace(/\./g, '')
            .replace(',', '.');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : null;
    }
}
