app = angular.module('TodoApp', ['ngRoute', 'mgo-mousetrap']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '../static/main_todo.html',
			controller: 'TodoController'
		});
}]);

app.controller('TodoController', [
	'$scope',
	'$http',
	function($scope, $http) {
		$scope.taskId = 0;
		$scope.inside = false;
		$scope.sortOrder = 'date';
		$scope.newItem = "";

		$http.post('/get_tasks', {
                  	user_id: 1,
                }).success(function(data, status, headers, config) {
                	console.log(data);
                	$scope.todoList = data;
				}).error(function(data, status, headers, config) {
					alert('error');
				});

		// $scope.todoList = [
		// 	{
		// 		'desc' : 'Pick up a panda',
		// 		'date' : new Date('12/23/2015'),
		// 		'task_id' : $scope.taskId++,
		// 	},
		// 	{
		// 		'desc' : 'Pick up a panda',
		// 		'date' : new Date('12/23/2013'),
		// 		'task_id' : $scope.taskId++,
		// 	},
		// 	{
		// 		'desc' : 'Pick up a panda',
		// 		'date' : new Date('12/23/2018'),
		// 		'task_id' : $scope.taskId++,
		// 	},
		// 	{
		// 		'desc' : 'Pick up a panda',
		// 		'date' : new Date('12/23/2011'),
		// 		'task_id' : $scope.taskId++,
		// 	}
		// ];
		$scope.colorCounter = 0;

		$scope.escape = function() {
			$('input').focus();
			$scope.newItem = "";
			$scope.inside = true;
		};


		
		$scope.create = function(user_id) {
			if (!$scope.newItem) {
				windowAlert("text field must be non-empty");
			} else {
				$http
					.post('/create', {
						item: $scope.newItem
					})
					.success(function(data, status, headers, config) {
					if (data.success) {
							$scope.retrieveLastNItems(
							$scope.state.retrieveNr
						);
					} else {
						windowAlert('Adding of item failed');
					}
					})
					.error(function(data, status, headers, config) {
					});
			}

			$.post('/create', {
				description: 'descscription',
				due_date: new Date().getTime() / 1000,
				is_complete: 1,
				user_id: user_id
			}).done(function(task) {
			console.log(task);
		});
		}

		$scope.changeColor = function() {
			
			if($scope.colorCounter === 0)
			{
				document.body.style.background = 'lightblue';
				document.input = 'white';
				$scope.colorCounter++;
			} else if($scope.colorCounter === 1) {
				document.body.style.background = '#333';
				$scope.colorCounter++;
			} else if($scope.colorCounter === 2) {
				document.body.style.background = 'purple';
				$scope.colorCounter++;
			} else if($scope.colorCounter === 3) {
				document.body.style.background = 'lightblue';
				$scope.colorCounter++;
			} else if($scope.colorCounter === 4) {
				document.body.style.background = 'purple';
				$scope.colorCounter++;
			} else {
				$scope.colorCounter = 0;
				document.body.style.background = '#333';
			}
		};



		$scope.addTodo = function() {
			if (!$scope.newItem) {
				windowAlert("text field must be non-empty");
			} else {
				$scope.todoList.push(
					{
						'desc' : $scope.newItem,
						'date' : new Date('12/23/2001'),
						'task_id' : $scope.taskId++
					}
				);
				$http
					.post('/create', {
						item: $scope.newItem
					})
					.success(function(data, status, headers, config) {
					if (data.success) {
							$scope.retrieveLastNItems(
							$scope.state.retrieveNr
						);
					} else {
						windowAlert('Adding of item failed');
					}
					})
					.error(function(data, status, headers, config) {
					});
			}
		};

		$scope.deleteTodo = function(){
			$scope.todoList.pop();
		};

		$scope.deleteSpecificTodo = function(todoList, index) {
			todoList.splice(index, 1);
		};
	}]);

app.controller('TodoItemController', ['$scope', function($scope) {
	this.editing = false;
	console.log($scope);
	this.startEditing = function() {
		this.editing = true;
	};

	this.submit = function() {
		this.editing = false;
	};

	this.isEditing = function() {
		return this.editing;
	};
}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 27) {
				$('input').blur();
			}
        });
    };
});

app.directive('todoItem', function() {
	return {
		restrict: 'E',
		templateUrl: '../static/item.html',
		controller: 'TodoItemController',
		controllerAs: 'todoItem',
	}
});