import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UiNotificationService } from '../services/ui-notification.service';

export const paymentErrorInterceptor: HttpInterceptorFn = (_req, next) => {
    const uiNotificationService = inject(UiNotificationService);

    return next(_req).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && isCheckoutError(error)) {
                uiNotificationService.showError(buildCheckoutErrorMessage(error));
            }

            return throwError(() => error);
        })
    );
};

function isCheckoutError(error: HttpErrorResponse): boolean {
    const url = (error.url ?? '').toLowerCase();
    const isCheckoutUrl = url.includes('/api/payments/checkout') || url.includes('/payments/checkout');
    return isCheckoutUrl && error.status >= 400;
}

function buildCheckoutErrorMessage(error: HttpErrorResponse): string {
    const backendMessage = extractBackendMessage(error.error);
    const insufficientFunds = backendMessage.includes('insufficient funds')
        || backendMessage.includes('saldo insuficiente')
        || backendMessage.includes('not enough');

    if (insufficientFunds) {
        return 'Error de tarjeta: saldo insuficiente.';
    }

    if (error.status === 400) {
        return 'Error de tarjeta: saldo insuficiente.';
    }

    return 'No se pudo procesar el pago con tarjeta.';
}

function extractBackendMessage(payload: unknown): string {
    if (typeof payload === 'string') {
        return payload.toLowerCase();
    }

    if (payload && typeof payload === 'object') {
        const errorObj = payload as { message?: unknown; error?: unknown };

        if (typeof errorObj.message === 'string') {
            return errorObj.message.toLowerCase();
        }

        if (typeof errorObj.error === 'string') {
            return errorObj.error.toLowerCase();
        }
    }

    return '';
}
