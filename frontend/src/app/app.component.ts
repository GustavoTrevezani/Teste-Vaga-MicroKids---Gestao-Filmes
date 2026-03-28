import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-background">
      @if (authService.isAuthenticated()) {
        <app-navbar />
      }
      <main [class.pt-16]="authService.isAuthenticated()">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) {
    this.authService.loadUser();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        error: () => {
          this.authService.logout();
        },
      });
    }
  }
}
