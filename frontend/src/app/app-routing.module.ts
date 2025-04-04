import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthlayoutRoutingModule } from './authlayout/authlayout-routing.module';
import { AppinnerlayoutRoutingModule } from './appinnerlayout/appinner-routing.module';
import { ApphomelayoutRoutingModule } from './apphomelayout/apphome-routing.module';
import { SharedModule } from './shared/shared.module';
import { SitemapComponent } from './sitemap/sitemap.component';

const routes: Routes = [
  {
    path: 'budget',
    loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'ramadan',
    loadChildren: () => import('./ramadan/ramadan.module').then(m => m.RamadanModule)
  },
  {
    path: 'budget-planner',
    loadChildren: () => import('./budget-planner/budget-planner.module').then(m => m.BudgetPlannerModule)
  },
  { path: 'sitemap', component: SitemapComponent },
  {
    path: '**',
    redirectTo: '/pagenotfound',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthlayoutRoutingModule,
    AppinnerlayoutRoutingModule,
    ApphomelayoutRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
