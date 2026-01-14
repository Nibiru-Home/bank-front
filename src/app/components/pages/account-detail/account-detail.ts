import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-account-detail',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent],
    templateUrl: './account-detail.html',
    styleUrl: './account-detail.scss'
})
export class AccountDetailComponent {
    // Mock data for the view
    account = {
        name: 'CUENTA *3270',
        amount: '211,47 €'
    };

    movements = [
        { concept: 'Amazon Prime', date: '12/01/2026', amount: '-4,99 €' },
        { concept: 'Nomina Enero', date: '01/01/2026', amount: '+2.450,00 €' },
        { concept: 'Netflix', date: '28/12/2025', amount: '-12,99 €' },
        { concept: 'Supermercado', date: '24/12/2025', amount: '-145,20 €' },
        { concept: 'Bizum Alberto', date: '20/12/2025', amount: '+15,00 €' },
        { concept: 'Spotify Premium', date: '18/12/2025', amount: '-9,99 €' },
        { concept: 'Gasolinera Repsol', date: '15/12/2025', amount: '-45,00 €' },
        { concept: 'Gym McFit', date: '10/12/2025', amount: '-29,90 €' },
        { concept: 'Cena Empresa', date: '05/12/2025', amount: '-35,00 €' },
        { concept: 'Transferencia Ahorro', date: '01/12/2025', amount: '-500,00 €' }
    ];

    actions = [
        { label: 'Enviar dinero', icon: '/images/iconos/transferir-dinero.png' },
        { label: 'Datos', icon: '/images/iconos/contratar.png' }
    ];

    constructor(private route: ActivatedRoute) {
        // In a real app, we would fetch ID from route and get data from service
        // this.route.params.subscribe(params => console.log(params));
    }
}
