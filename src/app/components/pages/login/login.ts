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

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.dni && this.password) {
      this.authService.login(this.dni, this.password).subscribe(success => {
        if (success) {
          this.router.navigateByUrl('/');
        } else {
          alert('Login failed: Verifica tu numero de documento o contraseña');
        }
      });
    }
  }
}
