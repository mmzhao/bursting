// config/database.js

module.exports = {
  // Sets the database based on whether we're running tests or in production
  getDatabaseUrl: function() {
    var url;
    if(process.env.NODE_ENV == 'test') { //tests will set the TEST Env variable
      url = 'mongodb://localhost/test';
      console.log('info','Use TEST database at ' + url);
    } else {
      url = 'mongodb://localhost/utilities';
      console.log('info','Using PRODUCTION database at ' + url);
    }
    return url;     
  }
};
