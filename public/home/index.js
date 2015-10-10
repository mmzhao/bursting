var app = angular.module('utilities', ['ui.router','ui.bootstrap']);


// factory for all http requests connecting to api
app.factory('Backend', ['$http', '$window', function($http, $window) {
  var backend = {
    users: [],
    restrooms: []
  };

  // backend.getPositions = function(top, bottom, left, right) {
  //   return $http.get('/api/practices?top='+top+'&bottom='+bottom+'&left='+left+'&right='+right).success(function(data) {
  //     angular.copy(data, backend.positions);
  //   }).error(function(error) {
  //     alert("ERROR: " + error);
  //   });
  // };

  // backend.getPositions = function(bottom, left, top, right) {
  //   return $http.get('/api/positions/bound?
  //     bottom='+bottom+'&
  //     left='+left+'&
  //     top='+top+'&
  //     right='+right).success(function(data) {
  //     angular.copy(data, backend.positions);
  //   }).error(function(error) {
  //     alert("ERROR: " + error);
  //   });
  // };

  backend.getUsers = function() {
    return $http.get('/api/users').success(function(data) {
      angular.copy(data, backend.users);
    }).error(function(error) {
      alert("ERROR: " + error);
    });
  };

  backend.getRestrooms = function() {
    return $http.get('/api/restrooms').success(function(data) {
      angular.copy(data, backend.restrooms);
    }).error(function(error) {
      alert("ERROR: " + error);
    });
  };
  

  return backend;
}]);


app.controller('ProductCtrl', ['$scope', '$window', 'Backend', function($scope, $window, backend){
  $scope.users = backend.users;
  $scope.restrooms = backend.restrooms;
  // $scope.messages = [];
  // for(var i = 0; i < $scope.practices.length; i++) {
  //   $scope.messages.push($scope.practices[i].message);
  // }

  // var resetMarkers = function() {
  //   var bounds = map.getBounds();
  //   var ne = bounds.getNorthEast(); // LatLng of the north-east corner
  //   var sw = bounds.getSouthWest(); // LatLng of the south-west corner

  //   backend.getPositions(ne.lat(), sw.lat(), sw.lng(), ne.lng);
  //   initMap();
  // }

  

  var map;
  function initMap() {
    var myLatLng = {lat: 37.8642117, lng: -122.2557938};

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: myLatLng
    });
    for(var i = 0; i < $scope.restrooms.length; i++) {
      var marker = new google.maps.Marker({
        position: $scope.restrooms[i],
        map: map,
        label: $scope.restrooms.score,
        title: $scope.restrooms[i].name
      });
    }
  }
  initMap();

}]);






