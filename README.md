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
    - Change 'POSTGRES_DEV_URI' to your local database URI
    - URI format is as follows 'postgres://{user}:{password}@localhost:{port}/{database_name}
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

### Zihao Contributions
- Added pages for the Pharmaceutical team to add and view samples
- Added sample ID as a major vriable to trace samples instead of experimental ID
- Corrected the typos in the setup steps
