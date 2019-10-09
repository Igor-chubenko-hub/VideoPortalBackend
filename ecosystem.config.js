module.exports = {
  apps: [
    {
      name: 'main',
      script: './bin/www',
      exec_mode: 'cluster',
      instances: 'max',
      env_test: {
        PORT: 5000,
        NODE_ENV: 'test',
      },
      env_production: {
        PORT: 5000,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'cronJob',
      script: 'cronJob',
      env_test: {
        NODE_ENV: 'test',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
