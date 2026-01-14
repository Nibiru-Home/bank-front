import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  readonly userFullName = 'Usuario Apellido';
  readonly userAccountType = 'Cuenta personal';

  get userInitials(): string {
    return this.buildInitials(this.userFullName);
  }

  private buildInitials(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) {
      return '';
    }

    const parts = trimmed.split(/\s+/);
    const first = parts[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    const firstInitial = first.slice(0, 1);
    const lastInitial = last.slice(0, 1) || first.slice(1, 2);

    return `${firstInitial}${lastInitial}`.toUpperCase();
  }
}
