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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  loading = false;
  apiError = '';

  // Formulário tipado
  form!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    role: FormControl<'superadmin' | 'empresa' | 'funcionarios' | 'clientes'>;
  }>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // Inicializa o form corretamente
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['clientes', Validators.required] // valor padrão
    }) as FormGroup<{
      name: FormControl<string>;
      email: FormControl<string>;
      password: FormControl<string>;
      role: FormControl<'superadmin' | 'empresa' | 'funcionarios' | 'clientes'>;
    }>;
  }

  // ✅ getter correto dentro da classe
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
        // Salva o token retornado pelo backend
        this.auth.saveToken(res.token);

        // Pega o role direto do JWT
        const userRole = this.auth.getRole();

        // Redireciona conforme o role
        switch (userRole) {
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
        this.apiError = err?.error?.error ?? 'Falha ao registrar. Verifique os dados.';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
