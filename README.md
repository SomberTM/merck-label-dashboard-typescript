# Merck Label Dashboard Typescript Re-Write

### Tech Stack / Toolkit
- TypeScript
- React
- Express
- PostgreSQL/Prisma
- Redux & Redux-Thunk
- Material UI

# Setup Instructions for Local Host
### Follow these instructions step by step
- git clone https://github.com/SomberTM/merck-label-dashboard-typescript
- cd merck-label-dashboard-typescript/server
- npm install
- vim .env OR nano .env OR use your editor of choice
    - Change 'POSTGRESS_DEV_URI' to your local database URI
    - URI format is as follows 'postgress://{user}:{password}@localhost:{port}/{database_name}
    - Default port is 5432 if you set up postgress using postgress app
    - If your user has no password then omit the ':{password}' portion
- npx prisma migrate dev --name init --preview-feature
- npm start

### In another terminal/shell
- Navigate back to merck-label-dashboard-typescript
- cd client
- npm install
    - May need to add the --force tag to the end
- npm start


- Trivial comment added here for demo

