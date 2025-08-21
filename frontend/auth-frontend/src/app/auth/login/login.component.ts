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
import { Role } from '../roles';

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

  form!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
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
        this.auth.saveToken(res.token);
        const role = this.auth.getRole();

        switch (role) {
          case 'superadmin':
            this.router.navigate(['/superadmin']);
            break;
          case 'empresa':
            this.router.navigate(['/empresa']);
            break;
          case 'funcionario':
            this.router.navigate(['/funcionarios']);
            break;
          case 'cliente':
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
