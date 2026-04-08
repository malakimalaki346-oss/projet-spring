FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Supprimer la ligne COPY nginx.conf si le fichier n'existe pas
# Ou s'assurer que le fichier existe
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]