import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZakatService {
  private _authenticated: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    // private _userService: UserService
  ) {}

  getCountries(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}zakat/countries`);
  }

  getStates(id_country: any): Observable<any> {
    return this._httpClient.get(
      `${environment.apiUrl}zakat/states?country=${id_country}`,
    );
  }

  getCities(): Observable<any> {
    // return this._httpClient.get( `${environment.apiUrl}zakat/cities`, );
    return this._httpClient.get(
      `${environment.apiUrl}zakat/city-list`,
    );
  }

  getLocationPrices(id_city: any): Observable<any> {
    return this._httpClient.get(
      `${environment.apiUrl}zakat/location-prices?city=${id_city}`,
    );
  }

  /**
   * Categories
   *
   * @param user
   */
  getCategories(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}zakat/zakat-categories`);
  }

  saveProfile(profileData: FormData): Observable<any> {
    return this._httpClient.post(
      `${environment.apiUrl}auth/save-profile`,
      profileData,
    );
  }
}
