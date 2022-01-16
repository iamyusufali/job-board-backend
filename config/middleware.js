module.exports = ({ env }) => ({
  settings: {
    cors: {
      enabled: true,
      origin: env("CORS_ORIGINS").split(","),
    },
  },
});
