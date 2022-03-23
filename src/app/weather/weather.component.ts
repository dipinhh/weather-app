import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WeatherService } from './weather.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  cityName = new FormControl();
  searchHistory: any[] = [];
  searchStatus: boolean = false;
  constructor(private weatherService: WeatherService, private firestore: AngularFirestore) { 
  }

  ngOnInit(): void {
  }

  getWeatherDetails() {
    this.weatherService.getWeatherData(this.cityName.value).subscribe((res: any) => { 
      this.firestore.collection('searchData').add(res);
       });
  }
  onSearchClick() {
    this.searchStatus = false;
this.getWeatherDetails();
  }
  
  viewSearchHistory() {
    this.searchStatus = true;
   this.firestore.collection('searchData').valueChanges().subscribe(res => {
    console.log(res, 'resres');
    this.searchHistory = res;
   });
   
  }
}
