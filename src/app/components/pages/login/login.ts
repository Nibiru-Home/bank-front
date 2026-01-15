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
  // password field is present in HTML but logic might be purely simulation based on DNI for now as per plan
  // If we want to capture password we need a property
  password: string = '';

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.dni) {
      this.authService.login(this.dni).subscribe(success => {
        if (success) {
          this.router.navigateByUrl('/');
        } else {
          alert('Login failed: User not found');
        }
      });
    }
  }
}
