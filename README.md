# Nahuel Sanchez - Portfolio

Este repositorio contiene el código fuente completo de mi portfolio personal, un proyecto que unifica mi entusiasmo por el desarollo de software, el diseño de interfaces y la fotografía.

La aplicación está diseñada como un monorepo que separa las responsabilidades del frontend (cliente), backend (API para formulario de contacto) y los scripts de automatización.

[**(Miralo acá)**](https://nahuelsanchez.com) 

---

## ✨ Funcionalidades

-   **Sitio Bilingüe (ES/EN):** Soporte completo para español e inglés.
-   **Galería de Fotos Automatizada:** Un script de Python procesa y optimiza automáticamente las imágenes de la galería, generando un índice JSON que el frontend consume.
-   **Hero Interactivo 3D:** Una escena 3D creada con `react-three-fiber` y `drei` como banner principal.
-   **Diseño Responsivo:** Interfaz moderna y adaptable a cualquier dispositivo, desarrollada con Tailwind CSS y animaciones de Framer Motion.
-   **API Serverless para Contacto:** Un endpoint de API seguro (con rate limiting) desplegado en Vercel para gestionar el envío de correos desde el formulario de contacto.
-   **Flujo de Trabajo Optimizado:** El script de sincronización de fotos se ejecuta automáticamente al iniciar el entorno de desarrollo o al construir el proyecto.

---

## 🛠️ Stack Tecnológico

| Área              | Tecnologías                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Frontend**      | React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber (Three.js)                      |
| **Backend (API)** | Node.js, Express.js, Nodemailer, Helmet, Vercel Serverless Functions                                    |
| **Scripts**       | Python, Pillow (PIL)                                                                                    |
| **Deployment**    | Vercel                                                                                                  |

---

## 📂 Estructura del Proyecto

El proyecto está organizado como un monorepo con las siguientes carpetas principales:

```
portfolio/
├── /api/         # Backend: Express API para el formulario de contacto
├── /client/      # Frontend: Aplicación React (Vite)
├── /scripts/     # Scripts de automatización (Python)
└── README.md
```

---

## 🚀 Cómo Correrlo Localmente

Para levantar este proyecto en tu entorno local, vas a necesitar tener instalado **Node.js** (v18 o superior) y **Python** (v3.8 o superior).

### 1. Clonar el Repositorio

```bash
git clone https://github.com/nahuel-sanchez/portfolio.git
cd portfolio
```

### 2. Configurar el Backend (API)

El backend es necesario para que el formulario de contacto funcione.

1.  **Navegar a la carpeta de la API e instalar dependencias:**

    ```bash
    cd api
    npm install
    ```

2.  **Crear el archivo de entorno:**

    Crea un archivo `.env` en la carpeta `/api` y configúralo con tus credenciales de correo (se usa Gmail como proveedor por defecto en el código, pero podés adaptarlo).

    ```env
    # Credenciales para Nodemailer (Gmail)
    EMAIL_USER=tu_correo@gmail.com
    EMAIL_PASS=tu_contraseña_de_aplicacion
    ```

    > **Importante:** Si usas Gmail, necesitas generar una "Contraseña de Aplicación" desde la configuración de seguridad de tu cuenta de Google. No uses tu contraseña principal.

3.  **Ejecutar el servidor de la API (opcional):**

    El frontend se conectará a la API desplegada en producción por defecto. Si quieres probar la API localmente, puedes iniciarla con:

    ```bash
    npm run dev
    ```

    Y luego cambiar la URL del endpoint en el código del frontend.

### 3. Configurar el Frontend (Cliente)

1.  **Navegar a la carpeta del cliente e instalar dependencias:**

    ```bash
    cd ../client 
    npm install
    ```

2.  **Configurar el entorno virtual de Python (primera vez):**

    El script de fotos necesita dependencias de Python.

    ```bash
    cd ../scripts
    python -m venv venv
    source venv/bin/activate  # En Linux/macOS
    # o
    .\venv\Scripts\activate   # En Windows
    pip install -r requirements.txt
    ```

3.  **Iniciar el entorno de desarrollo:**

    Vuelve a la carpeta del cliente y ejecuta el comando `dev`. Esto ejecutará primero el script de Python para sincronizar las fotos y luego iniciará el servidor de Vite.

    ```bash
    cd ../client
    npm run dev
    ```

¡Listo! La aplicación debería estar corriendo en `http://localhost:5173`.

---

## 📸 Flujo de Trabajo de Fotografía

Para agregar nuevas fotos a la galería, el proceso es muy simple:

1.  **Agrega tus imágenes:** Simplemente copia tus archivos de imagen (`.jpg`, `.png`) en la subcarpeta de la categoría que corresponda dentro de `client/public/photography/`. Si la categoría no existe, crea una nueva carpeta.

    ```
    client/public/photography/
    ├── Arquitectura/
    ├── Bichos/
    ├── Naturaleza/
    └── TuNuevaCategoria/
        └── mi-nueva-foto.jpg
    ```

2.  **Ejecuta el servidor:** Al correr `npm run dev` (o `npm run build`), el script `scripts/sync_photos.py` hará lo siguiente automáticamente:
    -   Detectará las nuevas imágenes.
    -   Creará una versión optimizada en formato `.webp` si no existe.
    -   Determinará la orientación de la imagen (vertical u horizontal).
    -   Actualizará el archivo `client/src/data/photos.json` con la nueva información.

El frontend leerá este JSON actualizado y mostrará tus nuevas fotos en la galería sin que tengas que hacer nada más.

---

## Deployment

El proyecto está configurado para un despliegue sencillo en **Vercel**.

-   El **frontend** (`/client`) se despliega como una aplicación de Vite.
-   El **backend** (`/api`) se despliega como una Serverless Function de Node.js. Vercel detectará automáticamente el archivo `api/vercel.json` y configurará los builds y rutas necesarios.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

Nahuel Sánchez | Freelance Web Dev & Photographer | Jardín América, Misiones.