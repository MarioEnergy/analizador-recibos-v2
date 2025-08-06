# 📊 Configuración Google Sheets + Gemini AI

## Estado Actual
✅ **Implementado:**
- Función `saveToGoogleSheets()` integrada en `current_system.js`
- Auto-guardado después de cada análisis
- Dashboard.html para visualizar análisis guardados
- Almacenamiento temporal en localStorage

## 🎯 Próximos Pasos para Google Sheets Real

### 1. Crear Google Sheet
1. Ir a [Google Sheets](https://sheets.google.com)
2. Crear nueva hoja: "Energy Saver - Base de Datos Clientes"
3. Agregar estas columnas en la fila 1:
   - A: ID
   - B: Fecha/Hora
   - C: Nombre Cliente
   - D: Teléfono
   - E: Email
   - F: Consumo kWh
   - G: Gasto Mensual ₡
   - H: Factor Potencia
   - I: Tiene Multa
   - J: Equipo Recomendado
   - K: Inversión Total ₡
   - L: Ahorro Mensual ₡
   - M: ROI Años
   - N: Estado
   - O: Notas Vendedor

### 2. Configurar Google Sheets API
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear nuevo proyecto o usar existente
3. Habilitar Google Sheets API
4. Crear credenciales (API Key)
5. Obtener ID de la hoja de cálculo

### 3. Integrar con Sistema
Actualizar `SHEETS_CONFIG` en el código con:
- spreadsheetId
- apiKey
- Implementar llamada real a API

### 4. AppSheet (Opcional)
Para crear app móvil de seguimiento:
1. Ir a [AppSheet](https://www.appsheet.com)
2. Conectar con Google Sheet creado
3. Personalizar vistas y filtros
4. Compartir con equipo de ventas

## 📈 Beneficios
- Base de datos centralizada
- Acceso desde cualquier dispositivo
- Reportes automáticos
- Seguimiento de conversiones
- Integración con Gemini AI para predicciones

## 🔒 Seguridad
- Usar cuenta: mariosavardenergysaver@gmail.com
- Configurar permisos apropiados
- No exponer API keys en código público
