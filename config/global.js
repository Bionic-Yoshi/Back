export default {
  port: process.env.NODE_ENV === 'production' ? 8090 : 3090,
  portwss: process.env.NODE_ENV === 'production' ? 8091 : 3091,
};
