import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '../../ui/input/input';
import { ButtonComponent } from '../../ui/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly router = inject(Router);

  onSubmit(event: Event): void {
    event.preventDefault();
    this.router.navigateByUrl('/');
  }
}
