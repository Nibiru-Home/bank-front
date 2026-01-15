import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-card-create',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './card-create.html',
    styleUrl: './card-create.scss'
})
export class CardCreateComponent {
    constructor(private router: Router) { }

    createCard(event: Event) {
        event.preventDefault();
        // Here we would call the service to create the card
        alert('Solicitud de tarjeta enviada con éxito');
        this.router.navigate(['/cards']);
    }
}
