function RatingsController($scope, $http){
  refresh_contacts();

  function refresh_contacts(){
    $http.get('/ratings').success(function(data){
      $scope.contact_list = data;
    });
  }

}
