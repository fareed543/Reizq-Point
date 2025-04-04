import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { StaticfooterComponent } from './staticfooter/staticfooter.component';
import { HeadermenuComponent } from './headermenu/headermenu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CurrencyPipe } from './pipes/currency.pipe';
import { FilterByCategoryTypePipe } from './pipes/filter-by-category-type.pipe';
import { MemberSearchPipe } from './pipes/member-pipe.pipe';
import { MembersSortPipe } from './pipes/member-sort-pipe.pipe';
import { SubscribersDateFilterPipe } from './pipes/subscribers-date-filter.pipe';
import { RamadanBarChartComponent } from './ramadan-bar-chart/ramadan-bar-chart.component';
import { PacketsBarChartComponent } from './packets-bar-chart/packets-bar-chart.component';

@NgModule({
  declarations: [LoaderComponent,
    StaticfooterComponent,
    HeadermenuComponent,
    SidebarComponent,
    VerticalBarChartComponent,
    PieChartComponent,
    CurrencyPipe,
    FilterByCategoryTypePipe,
    MemberSearchPipe,
    MembersSortPipe,
    SubscribersDateFilterPipe,
    RamadanBarChartComponent,
    PacketsBarChartComponent
  ],
  imports: [CommonModule, RouterModule,
    TranslateModule.forChild(),
    HighchartsChartModule
  ],
  exports: [LoaderComponent,
    StaticfooterComponent,
    HeadermenuComponent,
    SidebarComponent,
    VerticalBarChartComponent,
    PieChartComponent,
    CurrencyPipe,
    FilterByCategoryTypePipe,
    MemberSearchPipe,
    MembersSortPipe,
    SubscribersDateFilterPipe,
    RamadanBarChartComponent,
    PacketsBarChartComponent
  ],

})
export class SharedModule { }
