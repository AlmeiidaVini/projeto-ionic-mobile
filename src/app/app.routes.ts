import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/tabs.page').then((m) => m.TabsPage),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'timeline',
        loadComponent: () =>
          import('./pages/timeline/timeline.page').then((m) => m.TimelinePage),
      },
      {
        path: 'treinos/detalhes/:id',
        loadComponent: () =>
          import('./pages/detalhes-treino/detalhes-treino.page')
            .then(m => m.DetalhesTreinoPage),
      },
      {
        path: 'treinos',
        loadComponent: () =>
          import('./pages/treinos/treinos.page')
            .then(m => m.TreinosPage),
      },
      {
        path: 'grade/detalhes/:id',
        loadComponent: () =>
          import('./pages/detalhes/detalhes.page').then((m) => m.DetalhesPage),
      },
      {
        path: 'grade',
        loadComponent: () => import('./pages/grade/grade.page').then((m) => m.GradePage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
