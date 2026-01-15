import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { Router } from '@angular/router';

@Component({
    selector: 'app-card-create',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent],
    templateUrl: './card-create.html',
    styleUrl: './card-create.scss'
})
export class CardCreateComponent {
    constructor(private router: Router) { }

    createCard(event: Event) {
        event.preventDefault();
        
        alert('Solicitud de tarjeta enviada con éxito');
        this.router.navigate(['/cards']);
    }
}
