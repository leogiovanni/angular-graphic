import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Location } from "../models/location.model";

const initialLocation: Location = {
  algorithm: undefined,
  lat: undefined,
  long: undefined,
  now: undefined
};

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private address = new BehaviorSubject<Location>(initialLocation);
  sharedAddress = this.address.asObservable();

  constructor() { }

  setLocation(loc: Location){
    this.address.next(loc);
  }
}
