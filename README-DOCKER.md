# Docker Setup para Ad-Moai-Test

Este proyecto incluye configuración Docker para ejecutar la aplicación en un contenedor sin necesidad de instalar dependencias localmente.

## Requisitos

- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)

## Uso Rápido

### Construir y ejecutar con Docker Compose

```bash
# Construir la imagen y levantar el contenedor
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener el contenedor
docker-compose down
```

### Usar Docker directamente

```bash
# Construir la imagen
docker build -t ad-moai-test .

# Ejecutar el contenedor
docker run -p 3000:3000 ad-moai-test

# Ejecutar en segundo plano
docker run -d -p 3000:3000 --name ad-moai-test ad-moai-test
```

## Acceso a la Aplicación

Una vez que el contenedor esté ejecutándose, la aplicación estará disponible en:

- **URL**: http://localhost:3000
- **API**: http://localhost:3000/api

## Comandos Útiles

```bash
# Ver logs del contenedor
docker-compose logs -f app

# Ejecutar comandos dentro del contenedor
docker-compose exec app sh

# Reconstruir la imagen (útil después de cambios)
docker-compose up --build --force-recreate

# Limpiar contenedores e imágenes
docker-compose down --rmi all

# Ver estado de los contenedores
docker-compose ps
```

## Notas Importantes

1. **Datos en Memoria**: Esta aplicación usa un store en memoria. Los datos se perderán al reiniciar el contenedor.

2. **Puerto**: El puerto 3000 está mapeado. Si necesitas usar otro puerto, modifica `docker-compose.yml`:
   ```yaml
   ports:
     - "8080:3000"  # Puerto externo:puerto interno
   ```

3. **Variables de Entorno**: Puedes agregar variables de entorno en `docker-compose.yml`:
   ```yaml
   environment:
     - NODE_ENV=production
     - NEXT_TELEMETRY_DISABLED=1
     - CUSTOM_VAR=value
   ```

4. **Health Check**: El contenedor incluye un health check que verifica que la aplicación esté respondiendo.

## Solución de Problemas

### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs app

# Verificar que el puerto no esté en uso
lsof -i :3000
```

### Reconstruir desde cero

```bash
# Eliminar contenedores, volúmenes e imágenes
docker-compose down -v --rmi all

# Reconstruir
docker-compose up --build
```

### Problemas de permisos

Si tienes problemas de permisos en Linux/Mac:

```bash
# Cambiar ownership de archivos si es necesario
sudo chown -R $USER:$USER .
```

## Optimizaciones

El Dockerfile usa un build multi-stage que:
- Reduce el tamaño final de la imagen
- Separa dependencias de desarrollo y producción
- Usa Alpine Linux para una imagen más ligera
- Ejecuta la aplicación como usuario no-root para mayor seguridad

