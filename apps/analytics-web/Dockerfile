FROM node:20-alpine as deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
RUN npm run build || echo "Build will run after dependencies are added"

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
