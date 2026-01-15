import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-card-create',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './card-create.html',
    styleUrl: './card-create.scss'
})
export class CardCreateComponent {
    cardType: 'debit' | 'credit' = 'debit';
    holderName = '';

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        const user = this.authService.getCurrentUser();
        this.holderName = [user?.firstName, user?.lastName, user?.secondLastName]
            .filter(Boolean)
            .join(' ');
    }

    createCard(event: Event) {
        event.preventDefault();

        alert('Solicitud de tarjeta enviada con éxito');
        this.router.navigate(['/cards']);
    }
}
