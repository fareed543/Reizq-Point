import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RamadanService } from 'src/app/ramadan/ramadan.service';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-add-program-member',
  templateUrl: './add-program-member.component.html',
  styleUrls: ['./add-program-member.component.scss']
})
export class AddProgramMemberComponent {
  assignMemberForm!: FormGroup;
  isSubmitting = false;
  customers$: Observable<any[]> = of([]); // Store search results

  constructor(
    private fb: FormBuilder,
    private ramadanService: RamadanService, 
    private dialogRef: MatDialogRef<AddProgramMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { programData: any }  
  ) {}

  ngOnInit(): void {
    this.assignMemberForm = this.fb.group({
      customerId: ['', Validators.required], // Will store selected customer ID
      customerSearch: [''], // Search field
      programId: [this.data.programData?.id || '', Validators.required],
      role: ['', Validators.required]
    });

    // Listen for changes in customerSearch field
    this.assignMemberForm.get('customerSearch')?.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms before making the API call
        distinctUntilChanged(), // Only call if input is different from last
        switchMap(value => this.searchCustomer(value)) // Call searchCustomer API
      )
      .subscribe(results => {
        this.customers$ = of(results);
      });
  }

  searchCustomer(query: string): Observable<any[]> {
    if (!query || query.length < 3) return of([]); // Avoid API calls on empty input
    return this.ramadanService.getCustomersBySearch(query); // API call to fetch customers
  }

  
  selectCustomer(customer: any): void {
    this.assignMemberForm.patchValue({
      customerId: customer.id, // Set the customer ID
      customerSearch: `${customer.firstname} ${customer.lastname}` // Show full name
    });
    this.customers$ = of([]); // Hide dropdown after selection
  }
  

  submit(): void {
    if (this.assignMemberForm.valid) {
      this.isSubmitting = true;
      const formData = this.assignMemberForm.value;

      this.ramadanService.assignMember(formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Member assigned successfully!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.dialogRef.close(response);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to assign member. Please try again.',
            timer: 2500,
            showConfirmButton: true
          });
          console.error('Error assigning member:', error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
