import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { take } from 'rxjs';
import { RamadanService } from 'src/app/ramadan/ramadan.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProgramMemberComponent } from '../add-program-member/add-program-member.component';


@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent {
  programForm!: FormGroup;
  userInfo: any = null;
  currentId: number | null = null;
  formSubmitted: boolean = false;
  halqaList: any = [];
  programData : any;
  mappedUsers : any;
  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ramadanService: RamadanService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.activatedRoute.params.subscribe((params: Params) => {
      this.currentId = params['id'] ? parseInt(params['id'], 10) : null;
      if (this.currentId) {
        this.getDetails();
      }
    });

    this.userInfo = this.localStorageService.getItem('userInfo') || {};
    this.programForm.patchValue({ id_customer: this.userInfo?.id || '' });
  }

  /** Initialize the form */
  private initForm(): void {
    this.programForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      id_customer: [null, Validators.required],
      id_halqa: [null, Validators.required],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      contact_number: ['', Validators.maxLength(20)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      registration_allowed: [true, Validators.required],
      max_participants: [100, [Validators.required, Validators.min(1)]],
      waitlist_enabled: [true, Validators.required],
      description: [''],
      status: ['active', Validators.required],
      created_at: [{ value: new Date(), disabled: true }],
    });
  }

  /** Fetch program details and update form */





  getDetails(): void {


    this.ramadanService.halqaList().pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.halqaList = response.halqas;
        }
      }
    });



    if (!this.currentId) return;

    const request = { id: this.currentId };

    this.ramadanService.getProgramDetails(request).pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.programData = response.program;
          this.mappedUsers = response.mapped_users;
          this.programForm.patchValue({
            id: this.programData.id,
            id_customer: this.programData.id_customer,
            id_halqa: this.programData.id_halqa,
            name: this.programData.name,
            code: this.programData.code,
            start_date: this.programData.start_date,
            end_date: this.programData.end_date,
            contact_number: this.programData.contact_number,
            email: this.programData.email,
            registration_allowed: this.programData.registration_allowed,
            waitlist_enabled: this.programData.waitlist_enabled,
            max_participants: this.programData.max_participants,
            description: this.programData.description,
            status: this.programData.status,
            created_at: this.programData.created_at,
          });
        }
      },
      error: (error) => {
        console.error('Error fetching program details:', error);
        Swal.fire('Error!', 'Failed to fetch program details.', 'error');
      }
    });
  }



  /** Handle form submission */
  onSubmit(): void {
    this.formSubmitted = true;
    if (!this.programForm || this.programForm.invalid) return;

    const formData = {
      id: this.programForm.get('id')?.value,
      id_customer: this.programForm.get('id_customer')?.value,
      id_halqa: this.programForm.get('id_halqa')?.value,
      name: this.programForm.get('name')?.value,
      code: this.programForm.get('code')?.value,
      start_date: this.programForm.get('start_date')?.value,
      end_date: this.programForm.get('end_date')?.value,
      contact_number: this.programForm.get('contact_number')?.value,
      email: this.programForm.get('email')?.value,
      registration_allowed: this.programForm.get('registration_allowed')?.value,
      max_participants: this.programForm.get('max_participants')?.value,
      waitlist_enabled: this.programForm.get('waitlist_enabled')?.value,
      description: this.programForm.get('description')?.value,
      status: this.programForm.get('status')?.value,
      created_at: this.programForm.get('created_at')?.value,
    };

    this.saveProgram(formData);
  }


  /** Create or Update Program */
  saveProgram(eventData: Record<string, any>): void {
    this.ramadanService.saveProgram(eventData).pipe(take(1)).subscribe({
      next: () => {
        Swal.fire({
          title: this.currentId ? 'Program Updated!' : 'Program Created!',
          text: `The program has been successfully ${this.currentId ? 'updated' : 'created'}.`,
          icon: 'success'
        }).then(() => this.navigateBack());
      },
      error: (error: any) => {
        console.error(`Error ${this.currentId ? 'updating' : 'creating'} program:`, error);
        Swal.fire({
          title: 'Error!',
          text: `Failed to ${this.currentId ? 'update' : 'create'} the program.`,
          icon: 'error'
        });
      }
    });
  }


  /** Navigate back to list */
  navigateBack(): void {
    this.router.navigateByUrl('/ramadan/program');
  }

  /** Delete Program */
  delete(): void {
    if (!this.currentId) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the program!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // this.ramadanService.deleteHalqa(this.currentId).pipe(take(1)).subscribe({
        //   next: () => {
        //     Swal.fire('Deleted!', 'The program has been deleted successfully.', 'success').then(() => {
        //       this.navigateBack();
        //     });
        //   },
        //   error: (error) => {
        //     console.error('Error deleting program:', error);
        //     Swal.fire('Error!', 'Failed to delete the program.', 'error');
        //   }
        // });
      }
    });
  }

  addMember() {
    const dialogRef = this.dialog.open(AddProgramMemberComponent, {
      width: '400px',
      data: { programData: this.programData },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDetails(); 
      }
    });
  }
  
  
}
