# 🔋 Energy Saver Costa Rica - Sistema Profesional

## Sistema de Análisis Energético con Control de Usuarios

**Versión:** 2.0 Segura  
**Autor:** Mario S  
**Email:** energysavercr@gmail.com  
**Teléfono:** 8722-6666

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### 🔐 Sistema de Seguridad
- **Límite de 50 análisis por día** por usuario
- **Mario tiene análisis ilimitados** (rol admin)
- **Control total de usuarios** por Mario
- **Sistema de aprobación doble** (activo + aprobado)

### 👥 Gestión de Usuarios
- **Solo Mario puede crear usuarios**
- **Usuarios nuevos están inactivos por defecto**
- **Mario debe activar Y aprobar cada usuario**
- **Control en tiempo real** con checkboxes

### 💾 Almacenamiento Automático
- **Google Drive integration** completa
- **Datos guardados en Drive de Mario**
- **Acceso desde cualquier dispositivo**
- **Sincronización automática**

---

## 🚀 CONFIGURACIÓN INICIAL

### 1. Configurar Google Cloud Console

1. **Ir a:** https://console.cloud.google.com/
2. **Crear proyecto:** "Energy Saver Costa Rica"
3. **Habilitar APIs:**
   - Google Drive API
   - Google OAuth2 API

### 2. Crear Credenciales OAuth2

1. **APIs & Services** → **Credentials**
2. **CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
3. **Application type:** Web application
4. **Authorized JavaScript origins:**
https://mariosavardenergysaver.github.io
5. **Authorized redirect URIs:**
https://mariosavardenergysaver.github.io/analizador-recibos-v2/

### 3. Actualizar Credenciales

En el archivo `app.js`, líneas 6-11, reemplazar:

```javascript
const GOOGLE_CONFIG = {
 CLIENT_ID: 'TU_CLIENT_ID_AQUI',
 API_KEY: 'TU_API_KEY_AQUI',
 // resto igual
};
4. Cambiar Email de Mario
En el archivo app.js, línea 15:
javascriptMARIO_EMAIL: 'mario.savard@energysavercr.com', // ← Cambiar aquí

👑 FUNCIONES DE MARIO (ADMIN)
Panel de Gestión de Usuarios

Ver todos los usuarios registrados
Crear nuevos usuarios con email y nombre
Activar/desactivar usuarios con checkbox
Aprobar/rechazar acceso con checkbox
Ver estadísticas de análisis por usuario

Control Total del Sistema

Análisis ilimitados (sin restricción de 50/día)
Ve todos los análisis de todos los vendedores
Gestión completa sin necesidad de programar
Monitoreo en tiempo real del uso del sistema


👤 EXPERIENCIA DEL VENDEDOR
Al Hacer Login

Login con Google (solo si aprobado por Mario)
Ve contador: "📊 5/50 (45 restantes)"
Puede trabajar hasta llegar al límite
Al llegar a 50: "Límite diario alcanzado"

Funcionalidades Disponibles

Análisis completos de recibos eléctricos
Generación de pagarés automática
Historial personal de análisis
Acceso desde móvil/tablet/PC


🔄 CÓMO AGREGAR USUARIOS
Proceso para Mario:

Login al sistema con tu cuenta Google
Ir a sección "Gestión de Usuarios"
Llenar formulario:

Email: vendedor@ejemplo.com
Nombre: Nombre Completo


Clic "Crear Usuario"
Usuario aparece INACTIVO
Marcar checkbox "Activo"
Marcar checkbox "Aprobado"
¡Listo! El vendedor ya puede hacer login

Estados del Usuario:

🔴 Inactivo/No Aprobado: No puede hacer login
🟡 Activo/No Aprobado: No puede hacer login
🟡 Inactivo/Aprobado: No puede hacer login
🟢 Activo/Aprobado: ✅ Puede usar el sistema


📊 LÍMITES Y CONTROLES
Para Vendedores:

50 análisis máximo por día
Reset automático a medianoche
10 segundos entre análisis (anti-spam)
Solo pueden ver sus propios análisis

Para Mario:

Análisis ilimitados
Ve todo el historial de todos
Control total de usuarios
Sin restricciones de tiempo


🛠️ RESOLUCIÓN DE PROBLEMAS
"Usuario no puede hacer login"

Verificar que email está en sistema
Comprobar checkbox "Activo" ✅
Comprobar checkbox "Aprobado" ✅
Confirmar que usuario usa email correcto

"Límite diario alcanzado"

Normal: Usuario hizo 50 análisis hoy
Reset: Automático a medianoche
Manual: Mario puede resetear contador

"Error de Google API"

Verificar CLIENT_ID y API_KEY
Comprobar URLs autorizadas
Revisar que APIs están habilitadas


📱 ACCESO AL SISTEMA
URL Principal: https://mariosavardenergysaver.github.io/analizador-recibos-v2/
Dispositivos Compatibles:

✅ PC/Laptop (Chrome, Firefox, Safari, Edge)
✅ Tablet (iPad, Android)
✅ Móvil (iPhone, Android)

Requisitos:

✅ Conexión a internet
✅ Navegador moderno
✅ Cuenta Google
✅ Aprobación de Mario


📞 SOPORTE
Contacto Energy Saver:

Email: energysavercr@gmail.com
Teléfono: 8722-6666
WhatsApp: 8722-6666

Soporte Técnico:

Configuración Google: Documentación incluida
Gestión usuarios: Panel intuitivo
Problemas sistema: Logs automáticos


🔒 SEGURIDAD Y PRIVACIDAD
Datos Protegidos:

Almacenamiento: Solo en Google Drive de Mario
Acceso: Solo usuarios aprobados
Encriptación: HTTPS obligatorio
Backup: Automático en Google Drive

Cumplimiento:

GDPR: Datos solo para uso comercial
Costa Rica: Cumple ley de datos personales
Google: Términos de servicio cumplidos


📈 ESTADÍSTICAS Y REPORTES
Mario Puede Ver:

Total análisis por usuario
Análisis por día/mes
Usuarios más activos
Tendencias de uso
Export completo de datos

Métricas Disponibles:

Análisis realizados hoy
Usuarios activos
Límites alcanzados
Análisis totales históricos


🎉 SISTEMA LISTO PARA PRODUCCIÓN
Este sistema está diseñado para crecer con su negocio, manteniendo siempre el control total en manos de Mario mientras protege contra abuso y garantiza calidad de servicio.
© 2025 Energy Saver Costa Rica - Todos los derechos reservados
