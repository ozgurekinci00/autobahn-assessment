import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  roads = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAutobahnData().subscribe({
      next: (data) => {
        this.roads = data.roads;
        console.log('Data from API:', data.roads);
      },
      error: (error) => {
        console.error('Error fetching Autobahn data:', error);
      }
    });
  }
}
