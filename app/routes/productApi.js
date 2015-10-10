// app/routes/productApi.js

var express = require('express');
var async = require('async');
var router = express.Router();
var models = require('../models/Models'); // get all models
var utils = require(__dirname + "/utils.js");

// MIDDLEWARE
// =============================================================================
router.use(function(req, res, next) {
  console.log('Processing incoming request...');
  next();
});

// cleans out any residual objects that were floating around
router.delete('/clean', function(req, res, next) {
  // checks every schema
  async.forEachOf(models, function(model, index, callback) {
    model.remove({}, callback);
  }, function(err) {
    if(err) utils.handleResponse(null, err, 400, res);
    else res.send('cleaning done');
  });
});

// gets number of documents in the database
router.get('/count', function(req, res, next) {
  // checks every schema
  var count = 0;
  var str = '';
  async.forEachOf(models, function(model, index, callback) {
    model.find({}, function(err, docs) {
      if(err) callback(err);
      else{
        count += docs.length;
        str += model.schemaType + ": " + docs.length + " left\n";
        callback(err);
      }
    });
  }, function(err) {
    if(err) utils.handleResponse(null, err, 400, res);
    else {
      str += count + " total docs remaining";
      res.send(str);
    }
  });
  
});

router.param('restroom', function(req, res, next, id) {
  models.Restroom.findById(id).exec(function(err, restroom) {
    if(err) {
      utils.handleResponse(null, err, 400, res);
    }
    else if(!restroom) {
      utils.handleResponse(null, new Error('can\'t find Restroom Object with id ' + id), 400, res);
    }
    else{
      req.restroom = restroom;
      return next();
    }
  });
});

router.get('/restrooms', function(req, res, next) {
  models.Restroom.find().exec(function(err, restrooms) {
    if(err) {
      utils.handleResponse(null, err, 400, res);
    }
    else{
      utils.handleResponse(restrooms, null, 200, res);
    }
  });
});

router.get('/restrooms/:restroom', function(req, res) {
  utils.handleResponse(req.restroom, null, 200, res);
});

router.post('/restrooms', function(req, res, next) {
  var lat = req.body.lat;
  var lng = req.body.lng;
  var name = req.body.name;
  var newRestroom = new models.Restroom({
    lat: lat,
    lng: lng,
    name: name,
    score: 0,
    ratings: []
  });

  newRestroom.save(function(err, newrestroom) {
    if(err) utils.handleResponse(null, err, 400, res);
    else {
      utils.handleResponse(newrestroom, null, 201, res);
    }
  });
});



router.param('user', function(req, res, next, id) {
  models.User.findById(id).exec(function(err, user) {
    if(err) {
      utils.handleResponse(null, err, 400, res);
    }
    else if(!user) {
      utils.handleResponse(null, new Error('can\'t find User Object with id ' + id), 400, res);
    }
    else{
      req.user = user;
      return next();
    }
  });
});

router.get('/login/:device_id', function(req, res, next) {
  models.User.findOne({device_id: req.params.device_id}).exec(function(err, user) {
    if(err) {
      utils.handleResponse(null, err, 400, res);
    }
    if(!user) {
      utils.handleResponse(null, null, 400, res);
    }
    else{
      utils.handleResponse(user, null, 200, res);
    }
  });
});

router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var device_id = req.body.device_id;
  models.User.findOne({device_id: device_id}).exec(function(err, user) {
    if(err) utils.handleResponse(null, err, 400, res);
    else if(user) utils.handleResponse(null, new Error('User with device_id ' + device_id + ' already exists'), 400, res);
    else {
      var newUser = new models.User({
        username: username,
        device_id: device_id,
        ratings: []
      });

      newUser.save(function(err, newuser) {
        if(err) utils.handleResponse(null, err, 400, res);
        else {
          utils.handleResponse(newuser, null, 201, res);
        }
      });
    }
  });
  
});

router.get('/users', function(req, res, next) {
  models.User.find().exec(function(err, users) {
    if(err) {
      utils.handleResponse(null, err, 400, res);
    }
    else{
      utils.handleResponse(users, null, 200, res);
    }
  });
});

router.get('/users/:user', function(req, res) {
  utils.handleResponse(req.user, null, 200, res);
});

router.post('/users', function(req, res, next) {
  var username = req.body.username;
  var newUser = new models.User({
    username: username,
    ratings: []
  });

  newUser.save(function(err, newuser) {
    if(err) utils.handleResponse(null, err, 400, res);
    else {
      utils.handleResponse(newuser, null, 201, res);
    }
  });
});


router.param('rating', function(req, res, next, id) {
  models.Rating.findById(id).exec(function(err, rating) {
    if(err) {
      utils.handleResponse(null, err, 400, res);
    }
    else if(!rating) {
      utils.handleResponse(null, new Error('can\'t find Rating Object with id ' + id), 400, res);
    }
    else{
      req.rating = rating;
      return next();
    }
  });
});

router.get('/ratings', function(req, res, next) {
  models.Rating.find().exec(function(err, ratings) {
    if(err) {
      utils.handleResponse(null, err, 400, res);
    }
    else{
      utils.handleResponse(ratings, null, 200, res);
    }
  });
});

router.get('/ratings/:rating', function(req, res) {
  utils.handleResponse(req.rating, null, 200, res);
});

router.post('/ratings', function(req, res, next) {
  var score = req.body.score;
  var user = req.body.user;
  var restroom = req.body.restroom;
  var description = req.body.description;
  var newRating = new models.Rating({
    score: score,
    user: user,
    restroom: restroom,
    description: description
  });

  var newValues = {
    $addToSet: {
      ratings: newRating._id
    }
  }
  models.Restroom.findById(restroom).exec(function(err, rr) {
    if(err) utils.handleResponse(null, err, 400, res);
    else if(!rr) utils.handleResponse(null, 'can\'t find Restroom Object with id ' + restroom, 400, res);
    else{
      models.User.findById(user).exec(function(err, u) {
        if(err) utils.handleResponse(null, err, 400, res);
        if(!u) utils.handleResponse(null, 'can\'t find User Object with id ' + user, 400, res);
        else{
          models.User.findOneAndUpdate({_id: user}, newValues, function(err) {
            if(err) utils.handleResponse(null, err, 400, res);
            else{
              newValues.score = (rr.score * rr.ratings.length + score)/(rr.ratings.length + 1);
              models.Restroom.findOneAndUpdate({_id: restroom}, newValues, function(err) {
                newRating.save(function(err, newrating) {
                  if(err) utils.handleResponse(null, err, 400, res);
                  else {
                    utils.handleResponse(newrating, null, 201, res);
                  }
                });
              });
            }
          });
        }
      });
    }
  });

  
});

// router.get('/positions/bounds', function(req, res, next) {
//   var minlat = req.query.bottom;
//   var minlng = req.query.left;
//   var maxlat = req.query.top;
//   var maxlng = req.query.right;
//   var query = {
//     // lat: { $gte: minlat, $lt: maxlat },
//     // lng: { $gte: minlng, $lt: maxlng }
//   }
//   models.Position.find({ $query : query,
//      $orderby: { count : -1 } }
//     ).exec(function(err, positions) {
//     if(err) {
//       utils.handleResponse(null, err, 400, res);
//     }
//     else{
//       var inbound = [];
//       for(var i = 0; i < positions.length; i++) {
//         var p = positions[i];
//         if(p.lat >= minlat && p.lat <= maxlat && p.lng >= minlng && p.lng <= maxlng) {
//           inbound.push(p);
//         }
//       }
//       inbound = inbound.splice(0, Math.min(5, inbound.length));
//       utils.handleResponse(inbound, null, 200, res);
//     }
//   });
// });

// router.delete('/restrooms/:restroom', function(req, res, next) {
//   req.Restroom.remove(function(err) {
//     if(err) {
//       utils.handleResponse(null, err, 400, res);
//     }
//     else{
//       utils.handleResponse(req.position, null, 200, res);
//     }
//   });
// });



// export routes
module.exports = router;















