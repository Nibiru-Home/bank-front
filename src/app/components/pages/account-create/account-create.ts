import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-account-create',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './account-create.html',
    styleUrl: './account-create.scss'
})
export class AccountCreateComponent {
    constructor(private router: Router) { }

    createAccount(event: Event) {
        event.preventDefault();
        // Here we would call the service to create the account
        alert('Cuenta creada con éxito');
        this.router.navigate(['/accounts']);
    }
}
