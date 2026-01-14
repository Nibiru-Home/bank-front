import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card-row',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card-row.html',
    styleUrl: './card-row.scss'
})
export class CardRowComponent {
    @Input() name: string = '';
    @Input() pan: string = '';
    @Input() holder: string = '';
    @Input() amount: string = '';
}
