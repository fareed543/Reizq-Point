import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { take } from 'rxjs';
import { RamadanService } from 'src/app/ramadan/ramadan.service';

@Component({
  selector: 'app-masjid-details',
  templateUrl: './masjid-details.component.html',
  styleUrls: ['./masjid-details.component.scss']
})
export class MasjidDetailsComponent implements OnInit {
  masjidForm!: FormGroup;
  userInfo: any = null;
  currentId: number | null = null;
  formSubmitted: boolean = false;

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
    this.masjidForm.patchValue({ id_customer: this.userInfo?.id || '' });
  }

  /** Initialize the Masjid form */
  private initForm(): void {
    this.masjidForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      address: [''],
      area: [''],
      city: [''],
      state: [''],
      pincode: [''],
      country: [''],
      status: ['1', Validators.required],
      id_customer: [''],
      id_halqa: ['']
    });
  }

  /** Fetch Masjid details if updating */
  private getDetails(): void {
    const request = { id: this.currentId };
    this.ramadanService.getMasjidDetails(request).subscribe(
      (data) => {
        this.masjidForm.patchValue(data);
      },
      (error) => {
        console.error('Error fetching Masjid details:', error);
      }
    );
  }

  /** Handle form submission */
  onSubmit(): void {
    this.formSubmitted = true;
    if (!this.masjidForm || this.masjidForm.invalid) return;

    const formData = this.masjidForm.value;
    this.saveMasjid(formData);
  }

  /** Create or Update Masjid */
  saveMasjid(eventData: Record<string, any>): void {
    this.ramadanService.saveMasjid(eventData).pipe(take(1)).subscribe({
      next: () => {
        Swal.fire({
          title: this.currentId ? 'Updated!' : 'Created!',
          text: `Masjid ${this.currentId ? 'updated' : 'created'} successfully.`,
          icon: 'success'
        }).then(() => this.navigateBack());
      },
      error: (error: any) => {
        console.error(`Error ${this.currentId ? 'updating' : 'creating'} Masjid:`, error);
        Swal.fire({
          title: 'Error!',
          text: `Failed to ${this.currentId ? 'update' : 'create'} Masjid.`,
          icon: 'error'
        });
      }
    });
  }

  /** Navigate back to list */
  navigateBack(): void {
    this.router.navigateByUrl('/ramadan/masjid');
  }

  /** Delete Masjid */
  delete(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the Masjid!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed && this.currentId) {
        this.ramadanService.deleteMasjid(this.currentId).subscribe(
          () => {
            Swal.fire('Deleted!', 'Masjid deleted successfully.', 'success').then(() => {
              this.navigateBack();
            });
          },
          (error) => {
            console.error('Error deleting Masjid:', error);
          }
        );
      }
    });
  }
}
