FROM node:18

# Çalışma dizinini belirle
WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package.json package-lock.json ./
RUN npm install

# Uygulama dosyalarını kopyala
COPY . .

# Port tanımla
EXPOSE 5000

# Uygulamayı başlat
CMD ["node", "index.js"]
