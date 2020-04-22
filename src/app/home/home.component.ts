import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { Location } from "../models/location.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  isLoading: boolean = false;
  formSearch: FormGroup;
  search: string = null;
  searchObject = null;
  subscription: Array<any> = [];
  loc: Location = null;

  constructor(private formBuilder: FormBuilder, private router: Router, private sharedService: SharedService) {  }

  ngOnInit() {    
    this.formSearch = this.formBuilder.group({
      'search' : [null, [ Validators.minLength(5), Validators.maxLength(100)] ]
    });
  }

  onInputChange(formSearch:NgForm) {
    this.search = formSearch['search'];
    
    if (this.search.length >= 5 && this.search.length <= 100) {
      
      this.isLoading = true;
      this.loc = {
        algorithm: 'NEAREST',
        lat: '-23.632919',
        long: '-46.699453',
        now: '2017-08-01T20:00:00.000Z'
      };

      this.sharedService.setLocation(this.loc);

      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      }, 1000); 
    }
  }
}