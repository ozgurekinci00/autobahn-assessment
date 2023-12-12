import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MapComponent } from './map/map.component';
import { RoadComponent } from './road/road.component';
import { TabComponent } from './tab/tab.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    GoogleMapsModule,
    MatPaginatorModule,
    MapComponent,
    RoadComponent,
    TabComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'autobahn-assessment';
}
