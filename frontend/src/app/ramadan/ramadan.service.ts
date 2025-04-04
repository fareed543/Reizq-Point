import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RamadanService {
  constructor(private _httpClient: HttpClient) { }

  checkProgram(registrationCode: string): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/check-program?code=${registrationCode}`);
  }
  programList(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/program-list`);
  }
  saveProgram(eventData: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/save-program`,
      eventData,
    );
  }
  getAllProgramsList(pincode: any): Observable<any> {
    return this._httpClient.get(
      `${environment.apiUrl}http-ramadan/all-programs-list?pincode=${pincode}`
    );
  }

  getCustomersBySearch(query: string): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/customer-search?query=${query}`);
  }

  assignMember(request: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}http-ramadan/assign-member`, request );
  }

  
  
  programEnrollment(programId: number): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}http-ramadan/program-enrollment`, { id_program: programId });
  }

  getProgramDetails(request: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/program-details`,
      request,
    );
  }
  deleteProgram(id: number): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/delete-program/`, { id },
    );
  }


  halqaList(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/halqa-list`);
  }
  saveHalqa(eventData: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/save-halqa`,
      eventData,
    );
  }
  getHalqaDetails(request: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/halqa-details`,
      request,
    );
  }
  deleteHalqa(id: number): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/delete-halqa/`,
      {
        id,
      },
    );
  }

  masjidList(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/masjid-list`);
  }
  
  masjidListbyPincode(pincode : string): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/masjid-list?pincode=${pincode}`);
  }


  userMasjidList(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/user-masjid-list`);
  }
  saveMasjid(eventData: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/save-masjid`,
      eventData,
    );
  }
  getMasjidDetails(request: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/masjid-details`,
      request,
    );
  }
  deleteMasjid(id: number): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/delete-masjid/`,
      {
        id,
      },
    );
  }

  getAssignedPackets(params: { id_customer: string; date?: string; id_program?: string }): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/get-assigned-packets`, { params });
  }
  

  assignPackets(eventData: any) {
    return this._httpClient.post(
      `${environment.apiUrl}http-ramadan/assign-packets`,
      eventData,
    );
  }

  packetsPerDay(id_program: any): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/packets-per-day?id_program=${id_program}`);
  }

  getSubscribers(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/users`);
  }

  getMembers(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}http-event/members-list`);
  }

  addMember(expenseData: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-event/member`,
      expenseData,
    );
  }

  updateMember(expenseData: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-event/member`,
      expenseData,
    );
  }

  deleteMember(id: number): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}http-event/delete-member`,
      {
        id,
      },
    );
  }

  getMemberDetails(id: number): Observable<any> {
    const request = { id };
    return this._httpClient.post(
      `${environment.apiUrl}http-event/member-details`,
      request,
    );
  }
}
