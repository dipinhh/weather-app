import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WeatherService } from './weather.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  
  cityName = new FormControl();
  searchHistory: any[] = [];
  searchStatus: boolean = false;
  lat: any;
  lon: any;
  chart: any;
  pointSeries: any;
  polygonSeries: any;
  constructor(private weatherService: WeatherService, private firestore: AngularFirestore) { 
  }
  ngOnInit(): void {
    let root = am5.Root.new("chartdiv");
    this.chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "translateX",
      panY: "translateY",
      projection: am5map.geoMercator(),
      homeGeoPoint: { longitude: 10, latitude: 51 },
      homeZoomLevel: 1
    }));
    this.polygonSeries = this.chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"]
    }));
    this.chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    this.polygonSeries.events.on("datavalidated", () => {
      this.chart.goHome();
    })
    this.pointSeries = this.chart.series.push(am5map.MapPointSeries.new(root, {}));
  this.pointSeries.bullets.push(function() {
  return am5.Bullet.new(root, {
    sprite: am5.Picture.new(root, {
      templateField: "pictureSettings"
    })
  })
  })
  
  this.pointSeries.bullets.push(function() {
  return am5.Bullet.new(root, {
    sprite: am5.Label.new(root, {
      templateField: "labelSettings",
      centerX: am5.p50,
      dy: 10
    })
  })
  })
  }
  getWeatherDetails() {
    this.weatherService.getWeatherData(this.cityName.value).subscribe((res: any) => { 
      this.firestore.collection('searchData').add(res);
       });
  }
  onSearchClick() {
    this.searchStatus = false;
this.getWeatherDetails();
this.firestore.collection('searchData').valueChanges().subscribe(res => {
  console.log(res, 'resres');
  this.searchHistory = res.filter((ele:any) => (ele?.city?.name).toLowerCase() === this.cityName.value.toLowerCase());
  this.getChart(this.searchHistory);
});
  }
  
  viewSearchHistory() {
    this.searchStatus = true;
   this.firestore.collection('searchData').valueChanges().subscribe(res => {
    console.log(res, 'resres');
    this.searchHistory = res;  
   });
  }
getChart(searchData:any) {
  searchData.forEach((element: any) => {
    let src = 'https://www.amcharts.com/wp-content/uploads/assets/weather/animated/rainy-1.svg'
    switch (element?.list[0]?.weather[0]?.main) {
      case 'Clear':
        src = 'https://www.amcharts.com/wp-content/uploads/assets/weather/animated/day.svg'
        break;
    
        case 'Rain':
          src = 'https://www.amcharts.com/wp-content/uploads/assets/weather/animated/rainy-1.svg'
          break;
              
        case 'Clouds':
          src = 'https://www.amcharts.com/wp-content/uploads/assets/weather/animated/cloudy-day-1.svg'
          break;
      }
    this.pointSeries.data.setAll([{
      geometry: { type: "Point", coordinates: [element?.city?.coord?.lon, element?.city?.coord?.lat] },
      pictureSettings: {
        src: src,
        width: 50,
        height: 50,
        centerX: am5.p50,
        centerY: am5.p50
      },
      labelSettings: {
        text: `${element?.city?.name}, ${(element?.list[0]?.main?.temp).toFixed()}°C \n ${element?.list[0]?.weather[0]?.description}`
      }
      }
      ]);
    });
    this.chart.appear(1000, 100);
}

}
