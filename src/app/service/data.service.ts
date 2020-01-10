import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getUser(url: string): Observable<any>{
    return this.http.get<any>(url)
      .catch(this.errorHandler);    
  }

  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || 'Server Error');
  }
}
