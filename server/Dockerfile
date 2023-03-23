FROM node AS Production

ENV NODE_ENV=production

WORKDIR /usr/merck/src/server

COPY package.json .

# Wont have package-lock.json untill npm install
# COPY package-lock.json .

RUN npm install typescript
RUN npm install --force

COPY . .
COPY .docker.env .env

# Upon cloning a fresh repository this prisma command didnt work
# CMD ["sh", "-c", "npx prisma migrate dev --name docker --create-only && tsc && node build/index.js"]

# At first thought, the prisma command should be run outside of the entrypoint cmd,
# but due to the way prisma relies on the database already being setup it has to be done
# here. Just to note that it works here because the docker-compose file defines postgres
# as a dependency so by the time we get here it is set up and ready to use.
CMD ["sh", "-c", "npx prisma db push --preview-feature && node build/index.js"]