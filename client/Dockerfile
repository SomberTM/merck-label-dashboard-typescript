FROM node:14 AS Production

ENV NODE_ENV=production

WORKDIR /usr/merck/src/client

COPY package.json .
COPY vite.config.ts .
COPY tsconfig.json . 
COPY tsconfig.node.json .

RUN npm install
# RUN npm install -g typescript
# RUN npm install -g vite@latest
# RUN tsc && npx vite build

COPY . .

# Causes errors. vite is not recognized as a command??
# Currently we copy over the dist folder from the host machine
# which was generating by run vite build on the host machine.
# Ideally we want this container to run vite build
# RUN npm run build
RUN npm install -g serve

# CMD ["sh", "-c", "npm run start"]
CMD ["sh", "-c", "serve -s dist"]