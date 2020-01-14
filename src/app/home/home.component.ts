import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DataService } from '../service/data.service';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

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

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private apollo: Apollo) {  }

  ngOnInit() {    
    this.formSearch = this.formBuilder.group({
      'search' : [null, [ Validators.minLength(5), Validators.maxLength(100)] ]
    });
  }

  onInputChange(formSearch:NgForm) {
    this.search = formSearch['search'];
    
    if (this.search.length >= 5 && this.search.length <= 100) {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      }, 1000); 
    }
  }
}