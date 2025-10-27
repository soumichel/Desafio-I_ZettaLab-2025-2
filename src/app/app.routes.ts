import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Busca } from './pages/busca/busca';
import { Analise } from './pages/analise/analise';
import { Educativo } from './pages/educativo/educativo';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'busca', component: Busca },
  { path: 'analise', component: Analise },
  { path: 'educativo', component: Educativo }
];
