import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  readonly userAccountType = 'Cuenta personal';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  get userFullName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'Usuario Invitado';
  }

  get userInitials(): string {
    return this.buildInitials(this.userFullName);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
