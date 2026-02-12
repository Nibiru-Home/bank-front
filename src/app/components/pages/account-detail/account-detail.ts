import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { ActivatedRoute } from '@angular/router';
import { BankAccountService } from '../../../services/bank-account.service';
import { BankAccount } from '../../../models/bank-account.model';
import { BankMovement } from '../../../models/bank-movement.model';
import { CreditCard } from '../../../models/credit-card.model';

interface MovementView {
    concept: string;
    date: string;
    amount: string;
}

interface AssociatedCardView {
    id: number;
    label: string;
    pan: string;
    expirationDate: string;
}

@Component({
    selector: 'app-account-detail',
    standalone: true,
    imports: [CommonModule, HeaderComponent, FooterComponent],
    templateUrl: './account-detail.html',
    styleUrl: './account-detail.scss'
})
export class AccountDetailComponent {

    account: { name: string; amount: string } | null = null;
    accountDetails: BankAccount | null = null;
    movements: MovementView[] = [];
    associatedCards: AssociatedCardView[] = [];
    showAccountData = false;

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

    loadData(id: number | string): void {
        const accountId = Number(id);
        if (!Number.isFinite(accountId)) {
            console.error('Invalid account ID', id);
            return;
        }

        this.bankAccountService.findById(accountId).subscribe({
            next: (data) => {
                this.accountDetails = data;
                this.account = {
                    name: `CUENTA *${data.iban.slice(-4)}`,
                    amount: data.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                };
                this.associatedCards = this.mapAssociatedCards(data.creditCards ?? []);

                this.bankAccountService.getMovementsByAccountId(accountId).subscribe({
                    next: (movements) => {
                        const source = movements.length > 0 ? movements : (data.movements ?? []);
                        this.movements = this.mapMovements(source);
                    },
                    error: () => {
                        this.movements = this.mapMovements(data.movements ?? []);
                    }
                });
            },
            error: (err) => console.error('Error loading account', err)
        });
    }

    onActionClick(actionLabel: string) {
        if (actionLabel === 'Datos') {
            this.showAccountData = true;
        }
    }

    closeAccountData() {
        this.showAccountData = false;
    }

    private mapMovements(movements: BankMovement[]): MovementView[] {
        return movements.map((movement) => {
            const isExpense = movement.movementType === 'Remove';
            const sign = isExpense ? '-' : '+';
            const amount = Math.abs(movement.amount);

            return {
                concept: movement.concept?.trim() || 'Movimiento',
                date: this.formatMovementDate(movement.timestamp),
                amount: `${sign} ${amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`
            };
        });
    }

    private formatMovementDate(timestamp: string): string {
        const parsed = new Date(timestamp);
        if (Number.isNaN(parsed.getTime())) {
            return '';
        }
        return parsed.toLocaleDateString('es-ES');
    }

    private mapAssociatedCards(cards: CreditCard[]): AssociatedCardView[] {
        return cards.map((card) => ({
            id: card.id,
            label: `Tarjeta *${this.getLast4Digits(card.number)}`,
            pan: this.maskCardNumber(card.number),
            expirationDate: this.formatExpirationDate(card.expirationDate)
        }));
    }

    private maskCardNumber(number: string): string {
        const last4 = this.getLast4Digits(number);
        return `**** **** **** ${last4}`;
    }

    private getLast4Digits(number: string): string {
        const digits = number.replace(/\D/g, '');
        if (!digits) {
            return '****';
        }

        const suffix = digits.slice(-4);
        return suffix.padStart(4, '*');
    }

    private formatExpirationDate(expirationDate: string): string {
        const raw = expirationDate.trim();
        if (!raw) {
            return '--/--';
        }

        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) {
            const month = String(parsed.getMonth() + 1).padStart(2, '0');
            const year = String(parsed.getFullYear()).slice(-2);
            return `${month}/${year}`;
        }

        const match = raw.match(/^(\d{4})-(\d{2})/);
        if (match) {
            return `${match[2]}/${match[1].slice(-2)}`;
        }

        return raw;
    }
}
