import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RamadanService } from '../../../ramadan.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-halqa-details',
  templateUrl: './halqa-details.component.html',
  styleUrls: ['./halqa-details.component.scss']
})
export class HalqaDetailsComponent implements OnInit {
  halqaForm!: FormGroup;
  userInfo: any = null;
  currentId: number | null = null;
  formSubmitted: boolean = false;
  masjidList : any = [];
  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ramadanService: RamadanService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.activatedRoute.params.subscribe((params: Params) => {
      this.currentId = params['id'] ? parseInt(params['id'], 10) : null;
      if (this.currentId) {
        this.getDetails();
      }
    });

    this.userInfo = this.localStorageService.getItem('userInfo') || {};
    this.halqaForm.patchValue({ id_customer: this.userInfo?.id || '' });
  }

  /** Initialize the form */
  private initForm(): void {
    this.halqaForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      address: [''],
      city: [''],       // ✅ Added
      state: [''],      // ✅ Added
      country: [''],    // ✅ Added
      description: [''],
      status: ['1', Validators.required],
      id_customer: [''],
      masjids : []
    });
  }

  private getDetails(): void {
    const request = { id: this.currentId };
  
    this.ramadanService.getHalqaDetails(request).subscribe(
      (data) => {
        this.halqaForm.patchValue(data.halqa);
  
        // Extract Masjid list from the response
        this.masjidList = data.masjids; // Assuming `data.masjids` contains the masjid list
  
        // Extract selected Masjid IDs
        const selectedMasjidIds = this.masjidList
          .filter((masjid : any) => masjid.selected) // Get only selected masjids
          .map((masjid : any) => masjid.id); // Extract their IDs
  
        console.log('Selected Masjid IDs:', selectedMasjidIds);
  
        // Patch the selected values into the form
        this.halqaForm.patchValue({ masjids: selectedMasjidIds });
      },
      (error: any) => console.error('Error fetching Halqa details:', error)
    );
  }
  

  /** Handle form submission */
  onSubmit(): void {
    this.formSubmitted = true;
    if (!this.halqaForm || this.halqaForm.invalid) return;

    const formData = this.halqaForm.value;
    this.saveHalqa(formData);
  }

  /** Create or Update Halqa */
  saveHalqa(eventData: Record<string, any>): void {
    this.ramadanService.saveHalqa(eventData).pipe(take(1)).subscribe({
      next: () => {
        Swal.fire({
          title: this.currentId ? 'Updated!' : 'Created!',
          text: `Halqa ${this.currentId ? 'updated' : 'created'} successfully.`,
          icon: 'success'
        }).then(() => this.navigateBack());
      },
      error: (error: any) => {  
        console.error(`Error ${this.currentId ? 'updating' : 'creating'} Halqa:`, error);
        Swal.fire({
          title: 'Error!',
          text: `Failed to ${this.currentId ? 'update' : 'create'} Halqa.`,
          icon: 'error'
        });
      }
    });
  }

  /** Navigate back to list */
  navigateBack(): void {
    this.router.navigateByUrl('/ramadan/halqa');
  }

  /** Delete Halqa */
  delete(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the Halqa!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed && this.currentId) {
        this.ramadanService.deleteHalqa(this.currentId).subscribe(
          () => {
            Swal.fire('Deleted!', 'Halqa deleted successfully.', 'success').then(() => {
              this.navigateBack();
            });
          },
          (error) => {
            console.error('Error deleting Halqa:', error);
          }
        );
      }
    });
  }
}
