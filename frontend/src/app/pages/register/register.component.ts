import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-background px-4">
      <div class="w-full max-w-md">
        <div class="card p-8">
          <div class="text-center mb-8">
            <div
              class="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-text">Criar conta</h1>
            <p class="text-text-muted mt-2">
              Junte-se à nossa comunidade de filmes
            </p>
          </div>

          <form
            [formGroup]="registerForm"
            (ngSubmit)="onSubmit()"
            class="space-y-5">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-text mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="input-field"
                placeholder="Digite seu email" />
              @if (
                registerForm.get("email")?.touched &&
                registerForm.get("email")?.errors?.["required"]
              ) {
                <p class="text-error text-sm mt-1">Email é obrigatório</p>
              }
              @if (
                registerForm.get("email")?.touched &&
                registerForm.get("email")?.errors?.["email"]
              ) {
                <p class="text-error text-sm mt-1">Formato de email inválido</p>
              }
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-text mb-1.5">
                Senha
              </label>
              <input
                type="password"
                id="password"
                formControlName="password"
                class="input-field"
                placeholder="Crie uma senha" />
              @if (
                registerForm.get("password")?.touched &&
                registerForm.get("password")?.errors?.["required"]
              ) {
                <p class="text-error text-sm mt-1">Senha é obrigatória</p>
              }
              @if (
                registerForm.get("password")?.touched &&
                registerForm.get("password")?.errors?.["minlength"]
              ) {
                <p class="text-error text-sm mt-1">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              }
            </div>

            @if (errorMessage()) {
              <div class="bg-error/10 border border-error/30 rounded-lg p-3">
                <p class="text-error text-sm">{{ errorMessage() }}</p>
              </div>
            }

            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading()"
              class="btn-primary w-full flex items-center justify-center gap-2">
              @if (isLoading()) {
                <svg
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando conta...
              } @else {
                Criar conta
              }
            </button>
          </form>

          <p class="text-center text-text-muted mt-6">
            Já possui uma conta?
            <a
              routerLink="/login"
              class="text-primary hover:text-primary-hover font-medium">
              Logar
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal("");

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set("");

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(["/movies"]);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      },
    });
  }
}
