import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  isLoading: boolean = false;
  message: string = null;
  formSearch: FormGroup;
  search: string = null;

  constructor(private data: DataService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {  }

  ngOnInit() {    
    this.formSearch = this.formBuilder.group({
      'search' : [null, [ Validators.minLength(5), Validators.maxLength(100)] ]
    });
  }

  onInputChange(formSearch:NgForm) {
    this.search = formSearch['search'];
    console.log(this.search);
    if (this.search.length >= 5 && this.search.length <= 100) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        console.log("222");
      }, 1000);    
    }
  }
}