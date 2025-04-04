import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetPlannerComponent } from './budget-planner.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { PlannerComponent } from './components/planner/planner.component';
import { BudgetOverviewComponent } from './components/budget-overview/budget-overview.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetPlannerComponent,

    children: [
      {
        path : '',
        redirectTo : 'overview',
        pathMatch : 'full'
      },
      {
        path: 'planner',
        component: PlannerComponent,
      },
      {
        path: 'overview',
        component: BudgetOverviewComponent,
      },
      // {
      //   path: 'income',
      //   component: IncomeComponent,
      // },
      // {
      //   path: 'savings',
      //   component: SavingsComponent,
      // },
      // {
      //   path: 'categories',
      //   component: CategoriesComponent,
      // }
    ],
  },
];

@NgModule({
  declarations: [
    BudgetPlannerComponent,
    PlannerComponent,
    BudgetOverviewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class BudgetPlannerModule { }
