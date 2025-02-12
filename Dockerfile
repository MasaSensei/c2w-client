# Gunakan image Node.js yang ringan
FROM node:18-alpine

# Tentukan direktori kerja dalam container
WORKDIR /app

# Salin package.json dan package-lock.json untuk menginstall dependensi dulu
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Expose port yang digunakan oleh Next.js
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
