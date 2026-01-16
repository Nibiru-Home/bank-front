import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '../../ui/input/input';
import { ButtonComponent } from '../../ui/button/button';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  dni: string = '';
  password: string = '';
  loginError = '';

  onSubmit(event: Event): void {
    event.preventDefault();
    const dni = this.dni.trim();
    const password = this.password.trim();
    if (!dni || !password) {
      this.loginError = 'Numero de documento o contrasena incorrecto.';
      return;
    }

    this.authService.login(dni).subscribe({
      next: (success) => {
        if (success) {
          this.loginError = '';
          this.router.navigateByUrl('/');
        } else {
          this.loginError = 'Numero de documento o contrasena incorrecto.';
        }
      },
      error: () => {
        this.loginError = 'Numero de documento o contrasena incorrecto.';
      }
    });
  }

  clearError(): void {
    if (this.loginError) {
      this.loginError = '';
    }
  }
}
