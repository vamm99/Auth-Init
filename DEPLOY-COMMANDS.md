# 🚀 Comandos para Desplegar la API

## 1. Hacer commit de los cambios

```bash
cd c:\Users\VICTOR MEJIA\Documents\Nextjs\api

# Ver los archivos modificados
git status

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "fix: Actualizar endpoints de ventas - agregar paginación y mejorar manejo de errores"

# Push a GitHub
git push origin main
```

## 2. Archivos modificados que se van a desplegar:

- ✅ `src/modules/sales/controller/sales.controller.ts`
  - Endpoint `/sales/user` ahora acepta query params (page, limit, status, dates)
  - Usa `getSalesByUser()` en lugar de `getUserSales()`

- ✅ `src/modules/sales/service/sales.service.ts`
  - Método `getSalesByUser()` con mejor manejo de errores
  - Retorna respuesta estructurada en lugar de lanzar excepciones
  - Método `getSaleById()` restaurado

- ✅ `src/modules/kardex/repository/kardex.repository.ts`
  - Populate anidado de `category_id` en `getKardexForExport()`

## 3. Desplegar en AWS

### Si usas Elastic Beanstalk:
```bash
# Asegúrate de tener EB CLI instalado
eb deploy
```

### Si usas EC2 con PM2:
```bash
# Conectarse al servidor
ssh tu-usuario@tu-servidor-aws.com

# Ir a la carpeta del proyecto
cd /ruta/a/tu/api

# Pull de los cambios
git pull origin main

# Instalar dependencias (si hay nuevas)
npm install

# Compilar TypeScript
npm run build

# Reiniciar PM2
pm2 restart api
# o
pm2 restart all

# Ver logs
pm2 logs api
```

### Si usas Docker:
```bash
# Reconstruir la imagen
docker build -t tu-api:latest .

# Detener el contenedor actual
docker stop tu-api-container

# Eliminar el contenedor
docker rm tu-api-container

# Iniciar nuevo contenedor
docker run -d --name tu-api-container -p 3005:3005 tu-api:latest

# Ver logs
docker logs -f tu-api-container
```

### Si usas AWS Lambda con Serverless:
```bash
# Desplegar
serverless deploy

# Ver logs
serverless logs -f main -t
```

## 4. Verificar que el deployment fue exitoso

### Verificar que la API responde:
```bash
# Reemplaza con tu URL de AWS
curl https://tu-api.aws.com/health

# Debería retornar algo como:
# {"status": "ok", "timestamp": "..."}
```

### Verificar el endpoint de ventas:
```bash
# 1. Obtener token
curl -X POST https://tu-api.aws.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-email@ejemplo.com", "password": "tu-password"}'

# 2. Copiar el token y probar el endpoint
curl -X GET "https://tu-api.aws.com/sales/user?page=1&limit=10" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# Debería retornar:
# {
#   "code": 200,
#   "message": "Ventas obtenidas exitosamente",
#   "data": [...],
#   "meta": { "page": 1, "limit": 10, "total": X, "totalPages": Y }
# }
```

## 5. Verificar en el Administrador

1. Abre https://tu-administrador.vercel.app
2. Inicia sesión
3. Ve a la página de Ventas
4. Abre DevTools (F12) > Console
5. Busca los logs:
   ```
   [getSalesAction] Llamando a API: /sales/user?page=1&limit=10
   [getSalesAction] Respuesta de API: {...}
   ```

## 6. Si hay errores después del deployment:

### Ver logs de la API en AWS:

**CloudWatch (si usas Elastic Beanstalk o Lambda):**
```bash
# AWS CLI
aws logs tail /aws/elasticbeanstalk/tu-app/var/log/nodejs/nodejs.log --follow
```

**PM2 (si usas EC2):**
```bash
ssh tu-usuario@tu-servidor-aws.com
pm2 logs api
```

**Docker:**
```bash
docker logs -f tu-api-container
```

### Errores comunes:

**Error: Cannot find module**
```bash
# Reinstalar dependencias
npm install
npm run build
```

**Error: Port already in use**
```bash
# Matar el proceso en el puerto
lsof -ti:3005 | xargs kill -9
# o
pm2 restart api
```

**Error: Database connection failed**
```bash
# Verificar variables de entorno
echo $DATABASE_URL
# Verificar que MongoDB esté accesible desde AWS
```

## 7. Rollback si algo sale mal:

```bash
# Volver al commit anterior
git log --oneline  # Ver commits
git revert HEAD    # Revertir último commit
git push

# Redesplegar
eb deploy
# o
pm2 restart api
```

---

## ✅ Checklist de Deployment:

- [ ] Commit y push de cambios a GitHub
- [ ] Deployment en AWS exitoso
- [ ] API responde en el endpoint de health
- [ ] Endpoint `/sales/user` responde correctamente
- [ ] Logs de la API no muestran errores
- [ ] Administrador puede obtener ventas (verificar en DevTools)
- [ ] Ventas se muestran en la UI del Administrador

---

## 📞 Ayuda adicional:

Si necesitas ayuda con el deployment específico de tu infraestructura, comparte:
1. ¿Qué servicio de AWS usas? (EC2, Elastic Beanstalk, Lambda, etc.)
2. ¿Cómo despliegas actualmente? (PM2, Docker, Serverless, etc.)
3. ¿Dónde están los logs de tu API?
