import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BudgetService } from 'src/app/services/budget.service';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  userInfo: any;
  categoryList: any;
  eventForm!: FormGroup;
  selectedImage!: File;
  imagePath!: string;
  currentId!: number;
  formSubmitted: boolean = false;
  eventsList: any = [];
  expenseSuggestion: any = [];
  eventExpenseData: any;
  members: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private bugetService: BudgetService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    this.activatedRoute.params.subscribe((params: Params) => {
      // this.type = params['type'];
      this.currentId = parseInt(params['id_event']);
    });

    this.eventForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      start_date: [formattedDate],
      end_date: [formattedDate],
      status: ['1', [Validators.required]],
      members: [],
    });

    // if edit mode get the details
    this.getParticipants();

    this.getDetails();


    // Set initial options
    this.filteredOptions.next(this.options.slice());

    // Listen for search field changes and filter the options
    this.searchTextboxControl.valueChanges
      .pipe(
        startWith(''),
        takeUntil(this._onDestroy),
        map(search => {
          if (!search) {
            return this.options.slice();
          } else {
            search = search.toLowerCase();
            return this.options.filter(option =>
              option.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe(filtered => {
        this.filteredOptions.next(filtered);
      });
  }

  getDetails() {
    if (this.currentId) {
      const formData = new FormData();
      formData.append('id', this.currentId.toString());
      this.eventService.getEventDetails(formData).subscribe(
        (response) => {
          // this.transactionData = response.data;
          const { data } = response;
          this.eventForm.patchValue({
            id: data.id_event,
            name: data.event_name,
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status,
            // members : response.members
            members: response.members.map((member: number) =>
              member.toString(),
            ), // Convert numbers to strings
          });
          this.imagePath = response.imagePath;
        },
        (error) => {},
      );

      this.eventService.eventExpenses(formData).subscribe(
        (response) => {
          this.eventExpenseData = response;
          console.log(response);
        },
        (error) => {},
      );
    }
  }

  getParticipants() {
    this.eventService.getMembers().subscribe(
      (response) => {
        this.members = response.list;
      },
      (error) => {},
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.eventForm.valid) {
      const formData = new FormData();
      formData.append('id', this.eventForm.value.id);
      formData.append('name', this.eventForm.value.name);
      formData.append('start_date', this.eventForm.value.start_date);
      formData.append('end_date', this.eventForm.value.end_date);
      formData.append('status', this.eventForm.value.status);
      formData.append('members', JSON.stringify(this.eventForm.value.members));

      if (this.currentId) {
        this.eventService.updateEvent(formData).subscribe(
          (response) => {
            this.navigateBack();
          },
          (error) => {},
        );
      } else {
        this.eventService.addEvent(formData).subscribe(
          (response) => {
            this.navigateBack();
          },
          (error) => {},
        );
      }
    }
  }

  navigateBack() {
    this.router.navigateByUrl('/events');
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to Delete Event',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(this.currentId).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Event',
              text: 'Event Deleted',
              showConfirmButton: false,
              timer: 1500,
            }).then((deleteResult) => {
              this.navigateBack();
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Event',
              text: 'Event Delete Failed!',
              showConfirmButton: false,
              timer: 1500,
            });
          },
        );
      }
    });
  }

  getSuggestions(param: any) {
    this.bugetService.getSuggestion(param.value).subscribe(
      (response) => {
        this.expenseSuggestion = response;
        // this.categoryList = response;
      },
      (error) => {},
    );
  }

  onOptionSelect(option: any) {
    this.eventForm.patchValue({
      name: option.expense_name,
      category: option.id_category,
    });

    this.expenseSuggestion = [];
  }

  preventText($event: any) {
    const value = $event.target.value.replace(/[a-zA-Z%@*^$!`)(_+=#&\s]/g, '');
    $event.target.value = value;
  }


    // Control for the multi-select dropdown
  selectFormControl: FormControl = new FormControl([]);

  // Control for the search input
  searchTextboxControl: FormControl = new FormControl();

  // Original list of options (change this to match your data model)
  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

  // Observable for filtered options
  filteredOptions: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  private _onDestroy = new Subject<void>();



  // Called when the dropdown is opened/closed
  openedChange(isOpen: boolean): void {
    if (isOpen) {
      // Reset the search when opening the dropdown
      this.searchTextboxControl.setValue('');
    }
  }

  // Called when an option is selected/deselected
  selectionChange(event: any): void {
    // You can perform additional logic here when selection changes
    console.log('Selection changed:', event);
  }

  // Clear the search textbox
  clearSearch(event: Event): void {
    event.stopPropagation();
    this.searchTextboxControl.setValue('');
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
