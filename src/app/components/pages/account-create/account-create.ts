import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-account-create',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './account-create.html',
    styleUrl: './account-create.scss'
})
export class AccountCreateComponent {
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

    createAccount(event: Event) {
        event.preventDefault();
        
        alert('Cuenta creada con éxito');
        this.router.navigate(['/accounts']);
    }
}
