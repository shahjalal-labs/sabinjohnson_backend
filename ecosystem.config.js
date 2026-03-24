module.exports = {
  apps: [
    {
      name: "sabinjohnson-server",
      script: "./dist/server.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "sabinjohnson-email-worker",
      script: "./dist/workers/emailWorker.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "sabinjohnson-phone-worker",
      script: "./dist/workers/phoneWorkers.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
