import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StravaService } from '../services/strava-service';

@Component({
  selector: 'app-strava-auth-redirect',
  template: '<p>Authenticating with Strava...</p>',
  standalone: true,
  providers: [StravaService],  // Register the service here
})
export class StravaAuthRedirectComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stravaService: StravaService
  ) {}

  ngOnInit(): void {
    // Get the authorization code from the URL
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        // Exchange code for token
        this.stravaService.exchangeCodeForToken(code).subscribe(() => {
          this.router.navigate(['/']);  // Redirect to home page after auth
        });
      } else {
        this.router.navigate(['/']);  // Redirect on error or invalid auth
      }
    });
  }
}
