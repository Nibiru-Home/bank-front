import { Routes } from '@angular/router';
import { IndexComponent } from './components/pages/index/index';
import { LoginComponent } from './components/pages/login/login';
import { AccountsComponent } from './components/pages/accounts/accounts';
import { AccountCreateComponent } from './components/pages/account-create/account-create';
import { CardsComponent } from './components/pages/cards/cards';
import { CardCreateComponent } from './components/pages/card-create/card-create';
import { AccountDetailComponent } from './components/pages/account-detail/account-detail';
import { CardDetailComponent } from './components/pages/card-detail/card-detail';
import { ContratarProductosComponent } from './components/pages/contratar-productos/contratar-productos';
import { IncidenciasComponent } from './components/pages/incidencias/incidencias';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: IndexComponent, canActivate: [authGuard], pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent, canActivate: [authGuard] },
  { path: 'accounts/new', component: AccountCreateComponent, canActivate: [authGuard] },
  { path: 'accounts/:id', component: AccountDetailComponent, canActivate: [authGuard] },
  { path: 'cards', component: CardsComponent, canActivate: [authGuard] },
  { path: 'cards/new', component: CardCreateComponent, canActivate: [authGuard] },
  { path: 'cards/:id', component: CardDetailComponent, canActivate: [authGuard] },
  { path: 'c-contratar-productos', component: ContratarProductosComponent, canActivate: [authGuard] },
  { path: 'incidencias', component: IncidenciasComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
