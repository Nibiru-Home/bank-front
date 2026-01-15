import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();
    console.log('AuthGuard: User check', user);
    if (user) {
        return true;
    }

    console.log('AuthGuard: User is NOT logged in, redirecting to login');
    router.navigate(['/login']);
    return false;
};
