# AURA • Nails & Estética Studio

**Demo en vivo:** [aura-nails.vercel.app](https://aura-nails.vercel.app)

Este proyecto consiste en una Landing Page moderna y minimalista para un salón de manicuría, pedicuría y cuidado de uñas. Cuenta con un sistema de reserva de turnos (booking) interactivo conectado en tiempo real con Google Calendar mediante OAuth 2.0.

El backend incluye un **Modo Simulación** automático. Si las credenciales de Google no están configuradas, el servidor almacena las reservas en memoria para que puedas probar todo el flujo de inmediato sin errores.

---

## Estructura del Proyecto

- `backend/`: API REST construida con Node.js, Express y la API de Google Calendar.
- `frontend/`: Aplicación Single Page (SPA) construida con React, Vite y Tailwind CSS.

---

## Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** (v18 o superior recomendado)
- **pnpm** (para la gestión de paquetes, tal como se solicitó)

---

## Instalación y Configuración Local

### 1. Clonar e instalar dependencias

Instala las dependencias en ambos directorios:

```bash
# Instalar dependencias del Backend
cd backend
pnpm install

# Instalar dependencias del Frontend
cd ../frontend
pnpm install
```

### 2. Configurar el Backend (Modo Simulación)

En la carpeta `backend/` verás un archivo llamado `.env.example`.
Para probar localmente en modo simulación, puedes copiarlo como `.env`:

```bash
cd ../backend
cp .env.example .env
```

Luego inicia los servidores:
- **Iniciar Backend**: `pnpm run dev` (corre en `http://localhost:5000`)
- **Iniciar Frontend**: `cd ../frontend && pnpm run dev` (corre en `http://localhost:5173` o similar)

Abre la web en tu navegador. Podrás seleccionar un servicio, elegir un día y horario (verás algunas horas simuladas de prueba) y confirmar tu reserva.

---

## Integración Real con Google Calendar (OAuth 2.0)

Para sincronizar las citas reales con tu Google Calendar personal, sigue estos pasos:

### Paso 1: Configurar Google Cloud Console

1. Dirígete a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un **Proyecto Nuevo** (ej. "Aura Nails Booking").
3. En el buscador de la barra superior, busca **Google Calendar API** y haz clic en **Habilitar (Enable)**.
4. Configura la **Pantalla de Consentimiento de OAuth (OAuth Consent Screen)**:
   - Tipo de Usuario: Selecciona **Externo (External)**.
   - Completa los datos obligatorios (nombre de la app, tu correo).
   - En **Permisos (Scopes)**, haz clic en *Agregar o quitar permisos* y añade el permiso: `.../auth/calendar` (para leer y escribir eventos).
   - En **Usuarios de prueba (Test Users)**, añade tu correo electrónico personal de Google (el calendario donde quieres agendar los turnos). **¡Este paso es indispensable!**
5. Ve a **Credenciales (Credentials)** en el menú lateral:
   - Haz clic en `+ Crear Credenciales` y selecciona **ID de cliente de OAuth (OAuth Client ID)**.
   - Tipo de aplicación: Selecciona **Aplicación web**.
   - Nombre: "Aura Backend Link".
   - En **Orígenes de JavaScript autorizados**: añade `http://localhost:5000` (y tu URL de Vercel una vez desplegado).
   - En **URI de redirección autorizados**: añade `http://localhost:5000/oauth2callback`.
   - Haz clic en *Crear* y se te presentará tu **Client ID** y **Client Secret**.

### Paso 2: Configurar las variables del Backend

Edita el archivo `backend/.env` y reemplaza con los datos obtenidos:

```env
PORT=5000
GOOGLE_CLIENT_ID=tu_google_client_id_obtenido
GOOGLE_CLIENT_SECRET=tu_google_client_secret_obtenido
GOOGLE_REDIRECT_URI=http://localhost:5000/oauth2callback
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/Argentina/Buenos_Aires
```

*(Nota: Deja `GOOGLE_REFRESH_TOKEN` vacío por ahora; lo obtendremos en el siguiente paso).*

### Paso 3: Generar tu Refresh Token

Hemos creado un script interactivo para que obtengas el token de forma automática.
Con el backend configurado con tu Client ID y Secret, ejecuta:

```bash
cd backend
pnpm run auth
```

1. El script iniciará un servidor temporal y te mostrará un enlace largo de Google en la consola.
2. Haz clic en el enlace (o cópialo en tu navegador).
3. Inicia sesión con la cuenta de Google que configuraste como *usuario de prueba*.
4. Acepta los permisos de calendario (Google mostrará una advertencia de "App no verificada", haz clic en *Configuración Avanzada* y luego en *Ir a Aura Nails (no seguro)*. Esto es normal para proyectos personales en desarrollo).
5. Tras autorizar, serás redirigido a una página de éxito local y en la consola aparecerá tu `GOOGLE_REFRESH_TOKEN`.
6. Copia el token que empieza con `1//...` y pégalo en la variable `GOOGLE_REFRESH_TOKEN` en tu archivo `backend/.env`.

**¡Listo!** Reinicia tu servidor de backend (`pnpm run dev`). Ahora las reservas se guardarán automáticamente en tu calendario de Google en tiempo real y se bloquearán los horarios ocupados.

---

## Despliegue en Vercel

Puedes desplegar tanto el frontend como el backend de manera gratuita en Vercel.

### Desplegar el Backend (API)
Dado que Vercel admite funciones Serverless (Serverless Functions) escritas para Node.js, para subir el backend debes:
1. Crear un proyecto en Vercel para el backend apuntando a la subcarpeta `backend`.
2. En las configuraciones de Vercel del proyecto, añade las Variables de Entorno del archivo `.env` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, etc.).
3. Vercel detectará el archivo de entrada e implementará los endpoints.
4. *Opcional*: Se incluye una configuración básica de Express lista para Vercel. Asegúrate de configurar la redirección del frontend hacia esta nueva URL de API.

### Desplegar el Frontend (React)
1. Crea un nuevo proyecto en Vercel apuntando a la subcarpeta `frontend`.
2. Agrega la variable de entorno:
   - `VITE_API_URL` = `https://tu-api-de-backend.vercel.app` (la URL que te dio Vercel para el backend).
3. El comando de build de Vercel para el frontend es `pnpm run build` y el directorio de salida (output) es `dist`.
# aura-nails
