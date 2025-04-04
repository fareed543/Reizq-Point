import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BudgetService } from 'src/app/services/budget.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as moment from 'moment';
import * as dayjs from 'dayjs';
import { RamadanService } from '../ramadan/ramadan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('HeaderEl', { read: ElementRef, static: false })
  headerView!: ElementRef;
  @ViewChild('mainPage', { read: ElementRef, static: false })
  mainPageView!: ElementRef;
  @ViewChild('FooterEl', { read: ElementRef, static: false })
  footerView!: ElementRef;
  
  selectedRangeCalendarCenter: any;

  categoryImagePath!: string;
  statisticsData: any;
  userInfo: any;
  public daterange: any = {};
  expenseData: any;
  public options: any = {
    locale: { format: 'DD-MM-YYYY', direction: 'daterange-center shadow' },
    alwaysShowCalendars: false,
  };

  startDate: any;
  endDate: any;

  dropsDown = 'down';
  opensCenter = 'center';
  locale = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };

  ranges: any = {
    Today: [dayjs().startOf('day'), dayjs().endOf('day')],
    Yesterday: [
      dayjs().startOf('day').subtract(1, 'day'),
      dayjs().endOf('day').subtract(1, 'day'),
    ],
    'Last 7 days': [
      dayjs().startOf('day').subtract(6, 'days'),
      dayjs().endOf('day'),
    ],
    'Last 30 days': [
      dayjs().startOf('day').subtract(29, 'days'),
      dayjs().endOf('day'),
    ],
    'This month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last month': [
      dayjs().startOf('month').subtract(1, 'month'),
      dayjs().endOf('month').subtract(1, 'month'),
    ],
  };
  tooltips = [
    { date: dayjs(), text: 'Today is just unselectable' },
    { date: dayjs().add(2, 'days'), text: 'Yeeeees!!!' },
  ];
  isTooltipDate = (m: dayjs.Dayjs) => {
    const tooltip = this.tooltips.find((tt) => tt.date.isSame(m, 'day'));
    return tooltip ? tooltip.text : false;
  };

  showAds: boolean = true; 
  @ViewChild('adsContainer', { static: false }) adsContainer!: ElementRef;

  constructor(
    private bugetService: BudgetService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private ramadanService : RamadanService
  ) {

    this.selectedRangeCalendarCenter = {
      startDate: dayjs().startOf('month'), 
      endDate: dayjs().endOf('month'),
    };
   }

   ngOninIt(){
    const adsEnabled = localStorage.getItem('showAds');
    if (adsEnabled !== null) {
      this.showAds = adsEnabled === '1'; // Convert to boolean
    }
   }

   datesUpdatedRange($event: Object) {
    this.searchRecords();
  }
  invalidDates: dayjs.Dayjs[] = [];
  isInvalidDate = (m: dayjs.Dayjs) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };

  isCustomDate = (date: dayjs.Dayjs) => {
    return date.month() === 0 || date.month() === 6 ? 'mycustomdate' : false;
  };
  ngOnInit(): void {
    const today = moment();
    this.userInfo = this.localStorageService.getItem('userInfo');
    this.searchRecords();
    this.getProgramsList();
  }

  searchRecords() {
    if (this.userInfo) {
      const request = {
        startDate: this.selectedRangeCalendarCenter.startDate.format('YYYY-MM-DD'), //  "2024-11-30"
        endDate: this.selectedRangeCalendarCenter.endDate.format('YYYY-MM-DD'), //  "2024-11-01"
      };
      this.expenseData = [];
      this.statisticsData = [];
      this.bugetService.statistics(request).subscribe(
        (response) => {
          this.categoryImagePath = response.categoryImagePath;

          this.statisticsData = response;

          this.statisticsData.balance =
            parseFloat(this.statisticsData?.incomeTotal) -
            (parseFloat(this.statisticsData?.expenseTotal) +
              parseFloat(this.statisticsData?.expenditureTotal));

          this.expenseData = response.expenseData;
          this.cdr.detectChanges();
        },
        (error) => { },
      );
    }
  }




  ngAfterViewInit() {
    this.renderer.setStyle(
      this.mainPageView.nativeElement,
      'padding-top',
      `${this.headerView.nativeElement.offsetHeight + 10}px`,
    );
    this.renderer.setStyle(
      this.mainPageView.nativeElement,
      'padding-bottom',
      `${this.headerView.nativeElement.offsetHeight + 10}px`,
    );
    this.renderer.setStyle(
      this.mainPageView.nativeElement,
      'min-height',
      `${window.outerHeight}px`,
    );

    if (this.showAds && this.adsContainer) {
      try {
        setTimeout(() => {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        }, 1000); // Delay to ensure DOM is ready
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }
  programList : any = [];
  getProgramsList() {
    if (this.userInfo) {
      this.programList = [];
      this.ramadanService.getAllProgramsList(this.userInfo.pincode).subscribe(
        (response) => {
          this.programList = response;
        },
        (error) => { },
      );
    }
  }


  programSubscription(program: any) {
    if (program.entrolled) {
      // Unsubscribe Confirmation
      Swal.fire({
        title: 'Unsubscribe?',
        text: 'Are you sure you want to unsubscribe from this program?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Unsubscribe!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.ramadanService.programEnrollment(program.id).subscribe(
            () => {
              program.entrolled = false; // Update UI after successful API response
              Swal.fire('Unsubscribed!', 'You have been unsubscribed from the program.', 'success');
            },
            (error) => {
              Swal.fire('Error!', error.error?.message || 'Failed to unsubscribe.', 'error');
            }
          );
        }
      });
    } else {
      // Subscribe Confirmation
      Swal.fire({
        title: 'Subscribe?',
        text: 'Do you want to subscribe to this program?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Subscribe!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.ramadanService.programEnrollment(program.id).subscribe(
            () => {
              program.entrolled = true; // Update UI after successful API response
              Swal.fire('Subscribed!', 'You have successfully subscribed to the program.', 'success');
            },
            (error) => {
              Swal.fire('Error!', error.error?.message || 'Failed to subscribe.', 'error');
            }
          );
        }
      });
    }
  }
  

}
