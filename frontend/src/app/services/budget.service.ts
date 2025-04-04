import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  constructor(private _httpClient: HttpClient) {}



  setUserSehri(setSehriObj : any){
    return this._httpClient.post(`${environment.apiUrl}http-ramadan/set-user-sehri`, {
      setSehriObj,
    });
  }

  getUserSehri(id_customer : any){
    return this._httpClient.get(`${environment.apiUrl}http-ramadan/get-user-sehri?id_customer=${id_customer}`);
  }

  getSuggestion(param: string): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}budget/suggestion`, {
      param,
    });
  }

  getList(
    type: number,
    queryParam?: string,
    category?: number,
    startDate?: number,
    endDate?: number,
    page?: number,
    pageSize?: number
  ): Observable<any> {
    // Prepare the payload with optional parameters
    const payload: any = {
      type,
      queryParam,
      category,
      startDate,
      endDate,
    };
  
    // Add pagination parameters if provided
    if (page !== undefined) {
      payload.page = page;
    }
    if (pageSize !== undefined) {
      payload.pageSize = pageSize;
    }
  
    // Make the API call
    return this._httpClient.post(`${environment.apiUrl}budget/get-list`, payload);
  }
  

  getDetails(transactionId: number): Observable<any> {
    return this._httpClient.get(
      `${environment.apiUrl}budget/get/${transactionId}`,
    );
  }

  addExpense(expenseData: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}budget/add`,
      expenseData,
    );
  }

  updateExpense(expenseData: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}budget/update`,
      expenseData,
    );
  }

  deleteTransaction(id: number): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}budget/delete/`, { id });
  }

  statistics(request: any): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}budget/statistics`,
      request,
    );
  }

  downloadImage(imageUrl: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/octet-stream',
    });
    return this._httpClient.get(imageUrl, {
      responseType: 'blob',
      headers,
    });
  }
}
