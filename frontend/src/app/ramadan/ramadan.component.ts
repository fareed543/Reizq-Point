import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { LocalStorageService } from '../services/local-storage.service';
import { BudgetService } from '../services/budget.service';
import moment from 'moment';

@Component({
  selector: 'app-ramadan',
  templateUrl: './ramadan.component.html',
  styleUrls: ['./ramadan.component.scss']
})
export class RamadanComponent {

  @ViewChild('HeaderEl', { read: ElementRef, static: false })
  headerView!: ElementRef;
  @ViewChild('mainPage', { read: ElementRef, static: false })
  mainPageView!: ElementRef;
  @ViewChild('FooterEl', { read: ElementRef, static: false })
  footerView!: ElementRef;

  constructor(
    private renderer: Renderer2
  ) {
  }


  ngOnInit(): void {
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
  }
}
