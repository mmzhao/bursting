

var models = require('../models/Models'); // get all models

// response helper
function handleResponse(data, error, status, res) {

  if (error) {
    console.log("An error has occurred: " + error); 
  } else {
    console.log("Operaftion successful"); 
  }

  if (error) {
    res.status(status).send(error.message); // send error message
  } else {
    res.status(status).send(data);  // send data
  }
};


// exports
exports.handleResponse = handleResponse;








