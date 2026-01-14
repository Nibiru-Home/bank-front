import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-account-row',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './account-row.html',
    styleUrl: './account-row.scss'
})
export class AccountRowComponent {
    @Input() name: string = '';
    @Input() iban: string = '';
    @Input() holder: string = '';
    @Input() type: string = '';
    @Input() amount: string = '';
    @Input() isTitular: boolean = false;

    // Helper to format currency if not using a pipe
    // Using Angular's currency pipe in template is better.
}
