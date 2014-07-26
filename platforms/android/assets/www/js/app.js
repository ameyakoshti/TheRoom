angular.module('todo', ['ionic'])
  .factory('Projects', function() {
    return {
      all: function() {
        var projectString = window.localStorage['projects'];
        if(projectString) {
          return angular.fromJson(projectString);
        }
        return [];
      },
      save: function(projects) {
        window.localStorage['projects'] = angular.toJson(projects);
      },
      newProject: function(projectTitle) {
        // Add a new project
        return {
          title: projectTitle,
          tasks: []
        };
      },
      getLastActiveIndex: function() {
        return parseInt(window.localStorage['lastActiveProject']) || 0;
      },
      setLastActiveIndex: function(index) {
        window.localStorage['lastActiveProject'] = index;
      }
    }
  })

  .controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $http, $ionicPopup) {
    $scope.totalprice = 0;

    $scope.data = {
      showDelete: false
    };
    
    $scope.edit = function(item) {
      this.editPopup(item);
    };
    
    $scope.moveItem = function(item, fromIndex, toIndex) {
      $scope.activeProject.tasks.splice(fromIndex, 1);
      $scope.activeProject.tasks.splice(toIndex, 0, item);
    };
    
    $scope.onItemDelete = function(item) {
      $scope.activeProject.tasks.splice($scope.activeProject.tasks.indexOf(item), 1);
      Projects.save($scope.projects);
      calculateProjectPrice();
    };

    var createProject = function(projectTitle) {
      var newProject = Projects.newProject(projectTitle);
      $scope.projects.push(newProject);
      Projects.save($scope.projects);
      $scope.selectProject(newProject, $scope.projects.length-1);
    };

    // Load or initialize projects
    $scope.projects = Projects.all();

    // Grab the last active, or the first project
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

    // Called to create a new project
    $scope.newProject = function() {
      this.newProjectPopup();
    };

    // Called to select the given project
    $scope.selectProject = function(project, index) {
      $scope.activeProject = project;
      Projects.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleLeft(false);
    };

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope
    });

    $scope.createTask = function(task) {
      if(!$scope.activeProject || !task) {
        return;
      }
      $scope.activeProject.tasks.push({
        title: task.title
      });
      $scope.taskModal.hide();

      // Inefficient, but save all the projects
      Projects.save($scope.projects);

      task.title = "";
    };

    $scope.newTask = function() {
      $scope.taskModal.show();
    };

    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    };

    $scope.toggleProjects = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.vendorSelected = function(event) {
      var split = event.target.id.split("-");
      $scope.activeProject.tasks[split[1]].vendor = split[0];
      
      // set the text of the vendor selected
      var domElementName = '#vendor-' + split[1];
      var domElement = angular.element(document.querySelector(domElementName));
      domElement[0].innerText = split[0];
    };

    $scope.showHide = function(event, id, showhide){
      var split = event.target.id.split("-");

      var domElementName = id + split[1];   
      var domElement = angular.element(document.querySelector(domElementName));
      domElement[0].hidden = showhide;
    };

    $scope.updatePrice = function(idSelected, quantity){
      this.getPrice(idSelected, quantity);
    };

    $scope.getPrice = function(idSelected, quantity){
      $scope.activeProject.selectedID = idSelected;

      var item = $scope.activeProject.tasks[idSelected].title;
      $scope.activeProject.tasks[idSelected].qt = quantity;

      // get value from walmart api

      var url = "http://walmartlabs.api.mashery.com/v1/search?query="+item+"&format=json&apiKey=d9jpuntrwfc5hb47g7njwr64&callback=calculatePrice";
      $http.jsonp(url)
      .error(function(data){
          console.log(data);
      });
    };

    calculatePrice = function(res){
        var value = res.items[0].salePrice;
        var quantity = $scope.activeProject.tasks[$scope.activeProject.selectedID].qt;
        var totalValue = value * quantity;
        totalValue = Math.round(totalValue * 100) / 100;

        $scope.activeProject.tasks[$scope.activeProject.selectedID].price = totalValue;

        this.calculateProjectPrice();
    };

    calculateProjectPrice = function(){
       var log = [];
       var total = 0;
       angular.forEach($scope.activeProject.tasks, function(value, key) {
          if(typeof(value.price) === "number")
            total += value.price;
       }, log);
       $scope.totalprice = total;
    };

    $scope.newProjectPopup = function() {
      $scope.data = {}

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.listName">',
        title: 'Enter a name for the List',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.listName) {
                e.preventDefault();
              } else {
                createProject($scope.data.listName);
              }
            }
          },
        ]
      });
    };

    $scope.editPopup = function(item) {
      $scope.data = {}

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.editName">',
        title: 'A new name for the item :',
        subTitle: item.title,
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.editName) {
                e.preventDefault();
              } else {
                item.title = $scope.data.editName;
                Projects.save($scope.projects);
                //this.updatePrice(item.id,item.qt);
                calculateProjectPrice();
              }
            }
          },
        ]
      });
    };

    $timeout(function() {
      if($scope.projects.length == 0) {
        $scope.newProjectPopup();
      }
    });

  });