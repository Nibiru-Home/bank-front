import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ButtonComponent } from '../../ui/button/button';
import { InputComponent } from '../../ui/input/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  dni: string = '';
  password: string = '';
  loginError = '';

  onSubmit(): void {
    const dni = this.dni.trim();
    const password = this.password.trim();

    if (!dni || !password) {
      this.loginError = 'Numero de documento o contrasena incorrecto.';
      return;
    }

    this.authService.login(dni, password).subscribe({
      next: (success) => {
        if (success) {
          this.loginError = '';
          this.router.navigateByUrl('/');
          return;
        }

        this.loginError = 'Numero de documento o contrasena incorrecto.';
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
