
Portfolio Personal
Un sitio web de portfolio moderno y profesional construido con React, TypeScript y Vite. Incluye una API robusta para el manejo de contactos y herramientas de automatización en Python.

Características
Diseño Responsivo: Adaptado para cualquier dispositivo.

Animaciones Suaves: Implementación de Framer Motion.

Galería Dinámica: Sección de fotografía con procesamiento automático de imágenes.

Seguridad en Backend: Blindado con Rate Limiting y Security Headers.

Internacionalización: Soporte bilingüe para traducciones.

Tecnologías Utilizadas
Frontend
React 19 & TypeScript.

Tailwind CSS & shadcn/ui.

Framer Motion & Lucide React.

Backend
Node.js & Express.js.

Helmet: Asegura la aplicación configurando varios encabezados HTTP.

Express Rate Limit: Prevención de ataques DoS y fuerza bruta en el formulario de contacto.

Nodemailer: Gestión de correos mediante SMTP seguro.

Automatización
Python 3.x: Procesamiento de imágenes (Pillow) y auditoría de API (Requests).

Estructura del Proyecto

portfolio/
├── api/                # Backend (Express API)
│   ├── index.js        # Lógica del servidor y seguridad
│   ├── vercel.json     # Configuración de despliegue
│   └── .env            # Variables sensibles (No trackeado)
├── client/             # Frontend (React + Vite)
│   ├── src/            # Código fuente
│   └── public/         # Assets estáticos y fotografía
└── scripts/            # Herramientas de Automatización
    ├── venv/           # Entorno virtual de Python
    ├── requirements.txt # Dependencias (Pillow, Requests)
    ├── sync_photos.py  # Script de optimización y sincronización
    └── rate_limit_test.py # Script de auditoría de seguridad

Instalación y Configuración
1. Clonar y Dependencias

git clone https://github.com/NahuySan/portfolio-nauel
cd portfolio

# Instalar Frontend
cd client && npm install

# Instalar Backend
cd ../api && npm install

2. Configuración de Seguridad (Backend)
Crea un archivo .env dentro de la carpeta /api:

EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-clave-de-aplicacion-google

3. Entorno de Automatización (Python)

cd scripts
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
    
 Uso en Desarrollo
Backend: cd api && npm run dev (Corre en puerto 3001).

Frontend: cd client && npm run dev (Corre en puerto 5173).

Sincronizar Fotos: cd client && npm run sync-photos (Requiere configuración en package.json).

API Endpoints
POST /api/contact
Envía mensajes desde el formulario. Cuenta con un límite de 5 peticiones cada 15 minutos por IP para evitar spam.

Licencia
Este proyecto está bajo la Licencia MIT.

🚀Freelance Web Dev & Photographer: Nahuel Sanchez.