# Test de Endpoints de Ventas

## Verificar que los endpoints funcionen localmente antes de desplegar

### 1. Iniciar la API localmente
```bash
cd c:\Users\VICTOR MEJIA\Documents\Nextjs\api
npm run start:dev
```

### 2. Obtener un token de autenticación
Primero necesitas hacer login para obtener un token:
```bash
curl -X POST http://localhost:3005/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-email@ejemplo.com", "password": "tu-password"}'
```

Copia el token de la respuesta.

### 3. Probar el endpoint de ventas
```bash
# Reemplaza YOUR_TOKEN con el token que obtuviste
curl -X GET "http://localhost:3005/sales/user?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Probar el endpoint de estadísticas
```bash
curl -X GET "http://localhost:3005/sales/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Respuesta esperada

### Para /sales/user:
```json
{
  "code": 200,
  "message": "Ventas obtenidas exitosamente",
  "data": [
    {
      "_id": "...",
      "products": [
        {
          "product_id": "...",
          "name": "Producto X",
          "price": 100000,
          "quantity": 2,
          "image_url": "..."
        }
      ],
      "total": 200000,
      "status": "completed",
      "orderNumber": "ORD-123",
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Para /sales/stats:
```json
{
  "code": 200,
  "message": "Estadísticas de ventas obtenidas exitosamente",
  "data": {
    "totalSales": 10,
    "totalRevenue": 1500000,
    "avgOrderValue": 150000,
    "statusCounts": {
      "pending": 3,
      "completed": 7
    }
  }
}
```

## Si los endpoints funcionan localmente pero no en producción:

1. **Verifica que la API esté desplegada en AWS con los últimos cambios**
2. **Verifica la URL de la API en el .env del Administrador**
   - Debe ser: `NEXT_PUBLIC_API_URL=https://tu-api-en-aws.com`
3. **Verifica que el token esté siendo enviado correctamente**
   - Abre DevTools > Network > Headers
   - Busca el header `Authorization: Bearer ...`
