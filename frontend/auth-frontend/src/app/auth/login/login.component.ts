import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading = false;
  apiError = '';

  // Formulário tipado
  form!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // Inicializa o form
    this.form = this.fb.nonNullable.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required]),
    });
  }

  get f() { return this.form.controls; }

  submit() {
    this.apiError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: res => {
        // Salva o token retornado pelo backend
        this.auth.saveToken(res.token);

        // Pega o role direto do token
        const role = this.auth.getRole();

        // Redireciona conforme o role
        switch (role) {
          case 'superadmin':
            this.router.navigate(['/superadmin']);
            break;
          case 'empresa':
            this.router.navigate(['/empresa']);
            break;
          case 'funcionarios':
            this.router.navigate(['/funcionarios']);
            break;
          case 'clientes':
            this.router.navigate(['/clientes']);
            break;
          default:
            this.router.navigate(['/home']);
            break;
        }
      },
      error: err => {
        this.apiError = err?.error?.error ?? 'Falha ao entrar. Verifique suas credenciais.';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
