import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '../../../services/card.service';
import { CreditCard } from '../../../models/credit-card.model';
import { BankMovement } from '../../../models/bank-movement.model';

@Component({
    selector: 'app-card-detail',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent],
    templateUrl: './card-detail.html',
    styleUrl: './card-detail.scss'
})
export class CardDetailComponent implements OnInit {
    card: CreditCard | null = null;
    movements: BankMovement[] = [];

    actions = [
        { label: 'Enviar dinero', icon: '/images/iconos/transferir-dinero.png' },
        { label: 'PIN', icon: '/images/iconos/cajero-automatico.png' },
        { label: 'Datos', icon: '/images/iconos/contratar.png' }
    ];

    constructor(
        private route: ActivatedRoute,
        private cardService: CardService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.loadData(id);
            }
        });
    }

    loadData(id: number) {
        this.cardService.getCard(id).subscribe({
            next: (data) => this.card = data,
            error: (err) => console.error('Error fetching card', err)
        });

        this.cardService.getMovements(id).subscribe({
            next: (data) => this.movements = data,
            error: (err) => console.error('Error fetching movements', err)
        });
    }
}
