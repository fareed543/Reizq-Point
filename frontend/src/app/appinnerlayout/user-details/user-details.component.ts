import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RamadanService } from 'src/app/ramadan/ramadan.service';
// import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  currentId: any;
  userData: any;
  profileForm!: FormGroup;
  selectedImage!: File;
  imagePath!: string;

  expenseSuggestion: any = [];
  transactionData: any;
  backURL: string = '';

  userInfo : any;
  customerTypes: any = [];
  masjidList: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private ramadanService : RamadanService
    

  ) { }

  ngOnInit(): void {
    this.userInfo = this.localStorageService.getItem('userInfo');
    this.activatedRoute.queryParams.subscribe(params => {
      this.backURL = params['backURL'] || '/users'; // Store for later use
    });

    this.profileForm = this.formBuilder.group(
      {
        firstname: ['', Validators.required],
        lastname: [''],
        username: ['', Validators.pattern(/^\d{10}$/)], // Assuming a 10-digit username
        image: [''],
        otp: [''],
        phone: [''],
        email: [
          '',
          [
            Validators.pattern(
              /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.minLength(6),
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\-]+$/),
          ],
        ],
        confirmpassword: [''],
        date_of_birth: [''],
        gender: ['m'],
        pincode : [''],
        address: [''],
        masjid: [''],
        landmark: [''],
        notes: [''],
        occupation: [''],
        designation : [''],
        college_name: [''],
        company_name: [''],
        id_customer_type: [''],
        ipaddress: [''],
        authKey: [''],
        date_created: [''],
        date_updated: [''],
        active: [1, Validators.required],
        enableOfflineAccess: [false],
        emailNotification: [true],

      },
      { validator: this.passwordMatchValidator() },
    );



    this.activatedRoute.params.subscribe((params: Params) => {
      this.currentId = params['id_user'];
    });

    // if edit mode get the details
    this.getDetails();
    this.getCustomerTypes();

  }


  onPincodeEntered() {
    const pincode = this.profileForm.get('pincode')?.value;
    if (pincode && pincode.length === 6) { 
      this.getMasjidList(pincode);
    }
  }

  getMasjidList(pincode : string){
    this.ramadanService.masjidListbyPincode(pincode).subscribe(
      (response) => {
        this.masjidList = response;
      },
      (error) => {},
    );
  }


  getCustomerTypes() {
    this.authService.getCustomerTypes().subscribe(
      (response) => {
        this.customerTypes = response.customerTypes;
      }, (error) => { },
    );
  }



  getDetails() {
    if (this.currentId) {


      this.authService.getUserDetails(this.currentId).subscribe(
        (response) => {
          if (response) {
            this.userData = response.userData;
            this.imagePath = response.imagePath;

            this.profileForm.patchValue({
              firstname: this.userData.firstname,
              lastname: this.userData.lastname,
              // password: this.userData.password,
              username: this.userData.username,
              id_customer_type: this.userData.id_customer_type,
              gender: this.userData.gender == 'f' ? 'f' : 'm',
              phone: this.userData.phone,
              email: this.userData.email,
              accountDeactivation: this.userData.active === '1',
              enableOfflineAccess: this.userData.offline_access === '1',
              emailNotification: this.userData.email_notification === '1',
              address: this.userData.address,
              masjid: this.userData.masjid,
              landmark: this.userData.landmark,
              notes: this.userData.notes,
              occupation: this.userData.occupation,
              college_name: this.userData.college_name,
              company_name: this.userData.company_name,
              designation : this.userData.designation ,
              pincode : this.userData.pincode 
            });

            if(this.userData.pincode){
              this.getMasjidList(this.userData.pincode);
            }
  
          }
        },
        (error) => { },
      );
    }
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBase64: any;

  onFileChange(event: any) {
    this.imageChangedEvent = event;
  }

  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.blob;

  //   // If you want to convert the blob to base64 for display purposes
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     if (reader.result) {
  //       this.croppedImageBase64 = reader.result as string;
  //     }
  //   };
  //   // @ts-ignore
  //   reader.readAsDataURL(event.blob);
  // }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  onSubmit() {
    if (this.profileForm.valid) {

      const formData = new FormData();
      formData.append('firstname', this.profileForm.value.firstname || '');
      formData.append('lastname', this.profileForm.value.lastname || '');
      formData.append('date_of_birth', this.profileForm.value.date_of_birth || '');
      formData.append('gender', this.profileForm.value.gender || '');
      formData.append('id_customer_type', this.profileForm.value.id_customer_type || '');
      formData.append('password', this.profileForm.value.password || '');
      formData.append('address', this.profileForm.value.address || '');
      formData.append('masjid', this.profileForm.value.masjid || '');
      formData.append('landmark', this.profileForm.value.landmark || '');
      formData.append('notes', this.profileForm.value.notes || '');
      formData.append('occupation', this.profileForm.value.occupation || '');
      formData.append('college_name', this.profileForm.value.college_name || '');
      formData.append('company_name', this.profileForm.value.company_name || '');
      formData.append('designation', this.profileForm.value.designation || '');
      formData.append('pincode', this.profileForm.value.pincode || '');
      formData.append('otp', this.profileForm.value.otp || '');
      formData.append('phone', this.profileForm.value.phone || '');
      formData.append('id', this.currentId);
      

      formData.append(
        'accountDeactivation',
        this.profileForm.value.accountDeactivation ? '1' : '0',
      );
      formData.append(
        'enableOfflineAccess',
        this.profileForm.value.enableOfflineAccess ? '1' : '0',
      );
      formData.append(
        'emailNotification',
        this.profileForm.value.emailNotification ? '1' : '0',
      );



      if (this.croppedImage) {
        formData.append('image', this.croppedImage, 'profile-image.png');
      }

      if (this.currentId) {
        this.authService.updateUser(formData).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'User Details',
              text: 'User Details Updated',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'User Details',
              text: 'Details Update Failed!',
              showConfirmButton: false,
              timer: 1500,
            });
          },
        );
      } else {
        this.authService.createUser(formData).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'User Details',
              text: 'User Details Updated',
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigateByUrl(this.backURL);
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'User Details',
              text: 'Details Update Failed!',
              showConfirmButton: false,
              timer: 1500,
            });
          },
        );
      }
    }
  }

  changeAccountDeactivation(event: any) {
    if (event.target.value) {
      // Ask for confirmation
      Swal.fire({
        title: 'Are you sure?',
        text: 'Want to Deactivate your Account',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Deactivate',
      }).then((result) => {
        this.profileForm.patchValue({
          accountDeactivation: false,
        });
      });
    }
  }

  passwordMatchValidator(): any {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmpassword = formGroup.get('confirmpassword')?.value;

      if (password && confirmpassword && password !== confirmpassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }


  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to Delete User',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(this.currentId).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'User',
              text: 'User Deleted',
              showConfirmButton: false,
              timer: 1500,
            }).then((deleteResult) => {
              this.router.navigateByUrl('/users');
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'User',
              text: 'User Delete Failed!',
              showConfirmButton: false,
              timer: 1500,
            });
          },
        );
      }
    });
  }
}
