import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import dayjs from 'dayjs';
import moment from 'moment';
import { BudgetService } from 'src/app/services/budget.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent {

  @ViewChild('HeaderEl', { read: ElementRef, static: false })
  headerView!: ElementRef;
  @ViewChild('mainPage', { read: ElementRef, static: false })
  mainPageView!: ElementRef;
  @ViewChild('FooterEl', { read: ElementRef, static: false })
  footerView!: ElementRef;
  
  ramadanForm !: FormGroup ;
  userInfo : any;
  toggleStatus: string = 'off'; // Default value

  constructor(
    private bugetService: BudgetService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {
    this.ramadanForm = this.fb.group({
      days: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    const today = moment();
    this.userInfo = this.localStorageService.getItem('userInfo');
    this.getUserSehri(this.userInfo.id);
    this.initializeDays();
  }

  initializeDays() {
    const daysArray = this.ramadanForm.get('days') as FormArray;
    const startDate = new Date(Date.UTC(2025, 2, 1)); // Ensure March 1, 2025, UTC
  
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + i); // Correctly increment the date
  
      daysArray.push(
        this.fb.group({
          date: [dayjs(date).format('DD-MMM-YYYY')], // Format as '01-Mar-2025'
          observed: ['yes'], // Default checkbox value to 'yes'
        })
      );
    }
  }
  

  get daysControls() {
    return (this.ramadanForm.get('days') as FormArray).controls;
  }

  onSubmit() {
    const customerId = this.userInfo.id || this.ramadanForm.value.customerId; // Get customer ID
  
    if (!customerId) {
      console.error("Customer ID is missing");
      return;
    }
  
    const formData = {
      ...this.ramadanForm.value,
      id_customer: customerId, // Ensure customer ID is included
    };
  
    console.log(formData);
  
    this.bugetService.setUserSehri(formData).subscribe(
      (response) => {
        Swal.fire({
            title: 'Sehri subscription successful',
            text: 'Our team will contact you for food distribution.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Navigate to the sign-in page after the user confirms the success message
            // this.router.navigateByUrl('/signin');
          });
      },
      (error) => {
        console.error("Error saving data", error);
      }
    );
  }
  

  getUserSehri(id_customer: number) {
    this.bugetService.getUserSehri(id_customer).subscribe(
      (response: any) => {
        if (response.status === 'success' && response.data.length) {
          const daysArray = this.ramadanForm.get('days') as FormArray;
  
          response.data.forEach((savedDay: any) => {
            const matchingDay = daysArray.controls.find(
              (control) => control.value.date === savedDay.date
            );
  
            if (matchingDay) {
              matchingDay.patchValue({ observed: savedDay.observed }); // Set saved data
            }
          });
  
          console.log("Sehri data pre-filled successfully", response.data);
        } else {
          console.log("No previous Sehri data found for this user");
        }
      },
      (error) => {
        console.error("Error fetching Sehri data", error);
      }
    );
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
