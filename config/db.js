export default {
  secret: '13qf651f65qzfq4z1f658qz47fqz5f84qz',
  database:
    process.env.NODE_ENV === 'production'
      ? 'mongodb://localhost/rest-api'
      : 'mongodb://localhost/rest-api-test',
};
