// Esquemas de validación con Zod para autenticación
import { z } from 'zod';

// Esquema para validar email
export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('Formato de email inválido')
  .max(100, 'El email es demasiado largo');

// Esquema para validar contraseña
export const passwordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(50, 'La contraseña es demasiado larga')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
  );

// Esquema para validar nombre de usuario
export const displayNameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(30, 'El nombre es demasiado largo')
  .regex(
    /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
    'El nombre solo puede contener letras y espacios'
  );

// Esquema completo para registro
export const registerSchema = z.object({
  name: displayNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirma tu contraseña')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

// Esquema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida')
});

// Función para validar con Zod y devolver errores claros
export function validateWithZod(schema, data) {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  // Obtener el primer campo con error
  const [firstField, messages] = Object.entries(fieldErrors)[0] || [];

  return {
    success: false,
    errors: fieldErrors,                   // todos los errores por campo
    field: firstField || null,            // e.g., "password"
    message: messages?.[0] || 'Datos inválidos', // primer mensaje de error
  };
}

