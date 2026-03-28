import { Component, Input, Output, EventEmitter, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Movie } from "../../models/movie.model";

@Component({
  selector: "app-movie-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-hover group flex flex-col h-full ">
      <div class="relative aspect-[2/3] overflow-hidden bg-surface-hover">
        @if (movie.poster && movie.poster !== "N/A") {
          <img
            [src]="movie.poster"
            [alt]="movie.title"
            (error)="onImageError($event)"
            class="w-full h-auto rounded-lg"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        } @else {
          <div
            class="w-full h-full flex items-center justify-center text-text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        }
        <div class="absolute top-2 right-2">
          <span class="badge-primary">{{ movie.type }}</span>
        </div>
      </div>

      <div class="p-4 flex-1 flex flex-col">
        <h3
          class="font-semibold text-text line-clamp-2 min-h-[3rem]"
          [title]="movie.title">
          {{ movie.title }}
        </h3>
        <div class="flex items-center gap-2 text-sm text-text-muted mb-1">
          <span>{{ movie.year }}</span>
          <span class="w-1 h-1 bg-text-muted rounded-full"></span>
          <span class="text-xs font-mono">{{ movie.id }}</span>
        </div>

        @if (showActions) {
          <div class="flex min-w-0 flex-col sm:flex-row gap-2 mt-auto">
            @if (!isRemoveMode) {
              <button
                (click)="onFavorite()"
                [disabled]="isLoadingFavorite()"
                class="btn-accent flex-1 min-w-[120px] text-sm py-2 flex items-center justify-center gap-1.5">
                @if (isLoadingFavorite()) {
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                } @else {
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  Favoritar
                }
              </button>
              <button
                (click)="onWatched()"
                [disabled]="isLoadingWatched()"
                class="btn-secondary flex-1 min-w-0 text-sm py-2 flex items-center justify-center gap-1.5">
                @if (isLoadingWatched()) {
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                } @else {
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Assistido
                }
              </button>
            } @else {
              <button
                (click)="onRemove()"
                [disabled]="isLoadingRemove()"
                class="btn-danger flex-1 text-sm py-2 flex items-center justify-center gap-1.5">
                @if (isLoadingRemove()) {
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                } @else {
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remover
                }
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() showActions = true;
  @Input() isRemoveMode = false;

  @Output() favorite = new EventEmitter<Movie>();
  @Output() watched = new EventEmitter<Movie>();
  @Output() remove = new EventEmitter<Movie>();

  isLoadingFavorite = signal(false);
  isLoadingWatched = signal(false);
  isLoadingRemove = signal(false);

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = "/404NotFound.png";
  }

  onFavorite(): void {
    this.isLoadingFavorite.set(true);
    this.favorite.emit(this.movie);
    setTimeout(() => this.isLoadingFavorite.set(false), 500);
  }

  onWatched(): void {
    this.isLoadingWatched.set(true);
    this.watched.emit(this.movie);
    setTimeout(() => this.isLoadingWatched.set(false), 500);
  }

  onRemove(): void {
    this.isLoadingRemove.set(true);
    this.remove.emit(this.movie);
    setTimeout(() => this.isLoadingRemove.set(false), 500);
  }
}
