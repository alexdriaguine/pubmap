angular
  .module("pub-map")
  .controller("ListPubsController", ListPubsController);

ListPubsController.$inject = [
  "PubService", 
  "FlashService",
  "AuthService",
  "$location", 
  "TagService"
];

/**
 * Handles showing all the pubs
 * 
 * @param PubService - Pub factory
 */
function ListPubsController(PubService, FlashService, 
                            AuthService, $location, TagService) {
  var vm = this;
  var myPubsPath = "/my-pubs";
  var user = AuthService.getCurrentUser();
  var currentPath = $location.path();

  FlashService.clear();
  vm.loaded = false;
  vm.filter = {};
  
  if (currentPath == myPubsPath && user) { showUserPubs(user); } 
  else { showAllPubs(); }

  vm.filterByTags = function(pub) {
    var showPub = pub.tags.some(function(tag) {
      console.log(vm.filter[tag.id]);
      return vm.filter[tag.id];
    });

    return showPub || noFilter(vm.filter);

    
    //return vm.filter[pub.tag.id] || noFilter(vm.filter);
  }

  function noFilter(filterObj) {
    for (var key in filterObj) {
        if (filterObj[key]) {
            // There is at least one checkbox checked
            return false;
        }
    }

    // No checkbox was found to be checked
    return true;
}

  
  function showAllPubs() {
    PubService
      .getPubs()
      .then(function(res) {
        vm.title = "All pubs";
        vm.pubs = res.pubs;
      })
      .then(loadTags)
      .catch(function(error) {
        FlashService.createErrorFlash(error);
      });
  }
  
  function showUserPubs() {
    PubService
      .getPubsByEmail(user.email)
      .then(function(res) {
        vm.title = "My pubs";
        vm.pubs = res.pubs;
      })
      .then(loadTags)
      .catch(function(error) {
        FlashService.createErrorFlash(error);
      }); 
  }

  function loadTags() {
    return TagService.getTags()
      .then(function(res) {
        vm.tags = res.tags;
        vm.tags.forEach(function(tag) {
          tag.selected = true;
        });
        console.log(vm.tags);
        vm.loaded = true;
      })
  }
}




