# Primera etapa: Construcción
FROM node:23-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos todas las dependencias necesarias para la compilación
RUN npm ci

# Copiamos el código fuente
COPY tsconfig.json ./
COPY src/ ./src/

# Compilamos TypeScript a JavaScript
RUN npm run build

# Segunda etapa: Producción
FROM node:23-alpine AS production

# Establecemos variables de entorno para producción
ENV NODE_ENV=production

# Establecemos el directorio de trabajo  
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos solo dependencias de producción (sin devDependencies)
RUN npm ci --only=production

# Copiamos los archivos compilados de la etapa de construcción
COPY --from=builder /app/dist ./dist

# Exponemos el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]