#
# This program is run by the Docker container on initialization.
# It makes sure the remote schema is updated before launching the programs
#

# Push Prisma schema to remote DB
yarn prisma db push --skip-generate

# Start
node server.js
