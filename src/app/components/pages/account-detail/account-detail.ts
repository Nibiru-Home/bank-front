import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { ActivatedRoute } from '@angular/router';
import { BankAccountService } from '../../../services/bank-account.service';
import { BankAccount } from '../../../models/bank-account.model';

@Component({
    selector: 'app-account-detail',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent],
    templateUrl: './account-detail.html',
    styleUrl: './account-detail.scss'
})
export class AccountDetailComponent {
    
    account: any = null;
    movements: any[] = [];

    actions = [
        { label: 'Enviar dinero', icon: '/images/iconos/transferir-dinero.png' },
        { label: 'Datos', icon: '/images/iconos/contratar.png' }
    ];

    constructor(
        private route: ActivatedRoute,
        private bankAccountService: BankAccountService
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
        this.bankAccountService.findById(id).subscribe({
            next: (data) => {
                this.account = {
                    name: `CUENTA *${data.iban.slice(-4)}`,
                    amount: data.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                };
                this.movements = data.movements.map(m => {
                    const isExpense = m.movementType === 'Remove';
                    const sign = isExpense ? '-' : '+';
                    return {
                        concept: m.concept || 'Movimiento',
                        date: new Date(m.timestamp).toLocaleDateString(),
                        amount: `${sign} ${m.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`
                    };
                });
            },
            error: (err) => console.error('Error loading account', err)
        });
    }
}
