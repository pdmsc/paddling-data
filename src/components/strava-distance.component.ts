import { Component, OnInit } from '@angular/core';
import { StravaService } from '../services/strava-service';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-strava-distance',
  templateUrl: './strava-distance.component.html',
  styleUrls: ['./strava-distance.component.css'],
  providers: [StravaService],  // Register the service here
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  standalone: true,
})
export class StravaDistanceComponent implements OnInit {
  totalDistance: number | null = null;

  isLoading= false;
  isInputChanged = false;

  selectedStartDate?: string;
  selectedEndDate?: string;

  selectedActivityType: string = 'StandUpPaddling';

  activityTypes: string[] = [
    'Run', 'Ride', 'StandUpPaddling',
  ];

  constructor(private stravaService: StravaService) {}

  get userLoggedIn(): boolean {
    return !!localStorage.getItem('strava_access_token');
  }

  ngOnInit(): void {
    if (this.userLoggedIn) {
      //this.fetchActivities();
      console.log("User Logged In");
    }
  }

  authenticateWithStrava() {
    this.stravaService.authorizeUser();
  }

  fetchActivities() {
    if (!this.selectedStartDate) return;
    if (!this.selectedEndDate) return;

    const startTimestamp = Math.floor(new Date(this.selectedStartDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(this.selectedEndDate).getTime() / 1000);

    this.isLoading=true;

    this.stravaService.getAllActivities(startTimestamp, endTimestamp, this.selectedActivityType).subscribe(activities => {
      this.totalDistance = this.stravaService.calculateTotalDistance(activities);
      this.isLoading = false;
    });
  }
}
