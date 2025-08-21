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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  loading = false;
  apiError = '';

  form!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    role: FormControl<Role>;
  }>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['cliente', Validators.required] // padrão singular
    }) as FormGroup<{
      name: FormControl<string>;
      email: FormControl<string>;
      password: FormControl<string>;
      role: FormControl<Role>;
    }>;
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.apiError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { name, email, password, role } = this.form.getRawValue();

    this.auth.register(name, email, password, role).subscribe({
      next: res => {
        this.auth.saveToken(res.token);
        const userRole = this.auth.getRole();

        switch (userRole) {
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
        this.apiError = err?.error?.error ?? 'Falha ao registrar. Verifique os dados.';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
