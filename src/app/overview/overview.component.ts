import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe } from '@angular/common';
import { AllRoadInfos, CommonFields } from '../interfaces/CommonInfoFields';
import { ParserService } from '../parser.service';
import { MatTableModule } from '@angular/material/table';
export interface ExampleTab {
  label: string;
  content: CommonFields[];
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    GoogleMapsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatTabsModule,
    AsyncPipe,
    MatTableModule,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {
  panelOpenState = false;
  roads = [];
  selectedRoad: string = 'A1';
  center: google.maps.LatLngLiteral = { lat: 54.006057, lng: 10.729057 };
  zoom = 14;
  asyncTabs: Observable<ExampleTab[]>;
  currentContent = [];
  displayedColumns: string[] = ['title', 'subtitle', 'latitude', 'longitude', 'isBlocked'];
  selectedRow: any = null;

  constructor(
    private apiService: ApiService,
    private parserService: ParserService
  ) {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      observer.next([
        { label: 'Construction Sites', content: [] },
        { label: 'Rest Areas', content: [] },
        { label: 'Traffic Reports', content: [] },
        { label: 'Suspensions', content: [] },
        { label: 'Charging Stations', content: [] },
      ]);
    });
  }

  ngOnInit() {
    this.apiService.getAutobahns().subscribe({
      next: (data) => {
        this.roads = data.roads;
        console.log('Data from API:', data.roads);
      },
      error: (error) => {
        console.error('Error fetching Autobahn data:', error);
      },
    });
    this.onRoadSelectionChange();
  }

  onRoadSelectionChange() {
    this.selectedRow = null; // Reset selected row when highway changes

    // Make API call with the new value of selectedRoad
    this.apiService.getTableData(this.selectedRoad).subscribe({
      next: (data: AllRoadInfos) => {
        console.log('RAW DATA', data);
        // Update map values and content values of tabs
        if (data.roadworksData.roadworks.length !== 0) {
          this.center = {
            lat: Number(data.roadworksData.roadworks[0].coordinate.lat),
            lng: Number(data.roadworksData.roadworks[0].coordinate.long),
          };
        }
        const parsedData = this.parserService.parseInfo(data);
        // Update tab content based on the API response
        this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
          observer.next([
            { label: 'Construction Sites', content: parsedData.roadworksData },
            { label: 'Rest Areas', content: parsedData.restAreasData },
            {
              label: 'Traffic Reports',
              content: parsedData.trafficReportsData,
            },
            { label: 'Suspensions', content: parsedData.suspensionsData },
            {
              label: 'Charging Stations',
              content: parsedData.chargingStationsData,
            },
          ]);
        });
      },
      error: (error: any) => {
        console.error('Error fetching road data:', error);
      },
    });
  }

  onRowSelected(row: CommonFields) {
    if (this.selectedRow !== row) {
      this.selectedRow = row;
      console.log('SELECTED ROW', this.selectedRow);
      // Update the center based on the selected row
      this.updateCenterFromSelectedRow();
    } else {
      this.selectedRow = null;
    }
  }

  updateCenterFromSelectedRow() {
    if (this.selectedRow) {
      const long = parseFloat(this.selectedRow.coordinate.long);
      const lat = parseFloat(this.selectedRow.coordinate.lat);
      this.center = { lat: lat, lng: long };
    }
  }
  // onTabChange(event: any) {
  //   this.selectedRow = row;
  //   const selectedTabIndex = event.index;

  //   // Update center based on the selected tab
  //   switch (selectedTabIndex) {
  //     case 0: // Construction Sites
  //       this.center = this.getCenterFromData(this.parserService.parseInfo(this.roadworksData));
  //       break;
  //     case 1: // Rest Areas
  //       this.center = this.getCenterFromData(this.parserService.parseInfo(this.restAreasData));
  //       break;
  //     case 2: // Traffic Reports
  //       this.center = this.getCenterFromData(this.parserService.parseInfo(this.trafficReportsData));
  //       break;
  //     case 3: // Suspensions
  //       this.center = this.getCenterFromData(this.parserService.parseInfo(this.suspensionsData));
  //       break;
  //     case 4: // Charging Stations
  //       this.center = this.getCenterFromData(this.parserService.parseInfo(this.chargingStationsData));
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // private getCenterFromData(parsedData: any): google.maps.LatLngLiteral {
  //   // Implement logic to determine center based on parsedData
  //   // Example: return { lat: parsedData.latitude, lng: parsedData.longitude };
  // }
}
