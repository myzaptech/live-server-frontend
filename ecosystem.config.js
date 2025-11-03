module.exports = {
  apps: [
    {
      name: 'live-stream-frontend',
      cwd: '/var/www/live-server-frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
