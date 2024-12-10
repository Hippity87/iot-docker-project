FROM ubuntu:20.04

# Estä apt-get interaktiiviset kyselyt ja valitse aikavyöhyke manuaalisesti
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Helsinki

# Päivitä ja asenna tarvittavat työkalut, ei ylimääräisiä lisäosia. Poista ladatut pakettilistat, poista välimuisti apt-get-hakemistosta.
RUN apt-get update && apt-get install -y --no-install-recommends \
    apache2 \
    nodejs \
    npm \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Kopioi Apache-konfiguraatio
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Kopioi dashboard-tiedostot Nginx-kontin oikeaan paikkaan
COPY dashboard/ /usr/share/nginx/html/


# Kopioi backendin package.json ensin (parempi välimuistin hyödyntäminen)
WORKDIR /app
COPY backend/package.json /app/
RUN npm install

# Kopioi backendin muut tiedostot
COPY backend/ /app/


# Exposaa portit
EXPOSE 80 8080

# Aktivoi tarvittavat Apache-moduulit
RUN a2enmod proxy proxy_http

# Käynnistä Apache ja Node.js
CMD ["bash", "-c", "service apache2 start && node /app/App.js"]
