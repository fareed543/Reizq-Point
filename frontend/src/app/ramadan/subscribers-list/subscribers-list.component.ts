import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AssignPacketsComponent } from '../assign-packets/assign-packets.component';
import { MatDialog } from '@angular/material/dialog';
import { RamadanService } from '../ramadan.service';

@Component({
  selector: 'app-subscribers-list',
  templateUrl: './subscribers-list.component.html',
  styleUrls: ['./subscribers-list.component.scss']
})
export class SubscribersListComponent {

  queryParam: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  userInfo: any;
  memberList: any;
  userImagePath : string = '';
  programList : any = [];
  selectedProgram : any;

  constructor(
    private router: Router,
    private eventService: EventService,
    private ramadanService :RamadanService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userInfo = this.localStorageService.getItem('userInfo');
    if (this.userInfo) {
      
      this.getProgramsList();
    }
  }

  getProgramsList(){
    this.ramadanService.programList().subscribe(
      (response) => {
        this.programList = response;
        this.selectedProgram = this.programList[0].id; 
        this.getSubscribers(this.selectedProgram);
      },
      (error) => {},
    );
  }

  getSubscribers(selectedProgram : any) {
    this.eventService.getSubscribers(selectedProgram).subscribe(
      (response) => {
        this.userImagePath = response.userImagePath;
        this.memberList = response.list;
      },
      (error) => { },
    );
  }


  exportToExcel(): void {
    // Define the selected fields to export
    const selectedFields = ['id', 'firstname', 'gender', 'phone', 
      'occupation', 'company_name', 'notes', 'masjid'];

    // Map the data to include only the selected fields
    const filteredData = this.memberList.map((member: any) => {
      const selectedMember: any = {};
      selectedFields.forEach(field => {
        selectedMember[field] = member[field];
      });
      return selectedMember;
    });

    // Convert filtered JSON to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and append the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate Excel file and trigger download
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, "exported_data.xlsx");
  }


  refreshList() {
    this.getSubscribers(this.selectedProgram);
  }

  assignPacket(member: any): void {
    debugger;
    const dialogRef = this.dialog.open(AssignPacketsComponent, {
      width: '400px', // Adjust width as needed
      data: { 
        member: member, 
        selectedProgram: this.selectedProgram 
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        // Handle the result (e.g., refresh the list or update UI)
      }
    });
  }
  

  openMember(member: any) {
    this.router.navigate(['/user', member.id], {
      queryParams: { backURL: this.router.url },
    });
  }


  clearQuery() {
    this.queryParam = '';  // Clear the search parameter
  }

  trackByUser(index: number, user: any): number {
    return user.id; // Ensure 'id' is a unique identifier for each user
  }
}
