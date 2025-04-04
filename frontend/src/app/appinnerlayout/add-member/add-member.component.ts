import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RamadanService } from 'src/app/ramadan/ramadan.service';
import { EventService } from 'src/app/services/event.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {
  memberForm!: FormGroup;
  currentId!: number;
  formSubmitted: boolean = false;
  imagePath!: string;
  userInfo: any;
  masjidList: any = [];  
  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ramadanService : RamadanService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.currentId = parseInt(params['id_member']);
    });

    this.memberForm = this.formBuilder.group({
      id_member: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone_number: ['', [Validators.pattern('^[0-9]*$')]],
      email: ['', [ Validators.email]],
      birthday: [''],
      address: ['', ],
      notes: [''],
      photo: [''],
      document: [''],
      halka: [''],
      masjid: [''],
      id_customer: ['', Validators.required],
      date_created: [''],
      date_updated: [''],
    });

    this.userInfo = this.localStorageService.getItem('userInfo');
    this.memberForm.patchValue({ id_customer: this.userInfo.id });
    this.getDetails();
    this.getMasjidList();
  }
  getMasjidList(){
    this.ramadanService.masjidList().subscribe(
      (response) => {
        this.masjidList = response;
      },
      (error) => {},
    );
  }

  getDetails() {
    if (this.currentId) {
      this.eventService.getMemberDetails(this.currentId).subscribe(
        (response) => {
          const memberData = response.data;
          this.memberForm.patchValue(memberData);
          this.imagePath = response.imagePath;
        },
        (error) => {}
      );
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.memberForm.valid) {
      const formData = new FormData();
      Object.keys(this.memberForm.value).forEach((key) => {
        formData.append(key, this.memberForm.value[key]);
      });

      if (this.currentId) {
        this.eventService.updateMember(formData).subscribe(
          () => this.navigateBack(),
          (error) => {}
        );
      } else {
        this.eventService.addMember(formData).subscribe(
          () => this.navigateBack(),
          (error) => {}
        );
      }
    }
  }

  navigateBack() {
    this.router.navigateByUrl('/members');
  }

  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to Delete Member',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteMember(this.currentId).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              text: 'Member Deleted',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => this.navigateBack());
          },
          () => {
            Swal.fire({
              icon: 'error',
              text: 'Member Delete Failed!',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
      }
    });
  }

  preventText($event: any) {
    const value = $event.target.value.replace(/[^0-9]/g, '');
    $event.target.value = value;
  }
}
