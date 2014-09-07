app = angular.module('TodoApp', ['ngRoute', 'mgo-mousetrap']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '../static/main_todo.html',
			controller: 'TodoController',
			resolve:  {
				tasks: function(srvLibrary) {
					return srvLibrary.getTasks();
				},
			}
		});
}]);

app.factory('srvLibrary', ['$http', function($http) {
	var sdo = {
		getTasks: function() {
			var promise = $http.get('/get_tasks').success(function(data, status, headers, config) {
               	return data;
			});
			return promise;
		},
	}
	return sdo;
}]);

app.controller('TodoController', [
	'$scope',
	'$http',
	'tasks',
	function($scope, $http, tasks) {
		$scope.taskId = 0;
		$scope.inside = false;
		$scope.sortOrder = 'date';
		$scope.newItem = "";
		$scope.todoList = tasks.data.tasks;
		$scope.colorCounter = 0;

		$scope.escape = function() {
			$('input').focus();
			$scope.newItem = "";
			$scope.inside = true;
		};

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

		$scope.addTodo = function(item_description, new_date) {
			if (!item_description)
				return;
			$http.post('/create', {
				due_date: new_date,
				description: item_description,
				is_complete: 0,
			}).success(function(data, status, headers, config) {
				$scope.task_id = data.task_id;
				$scope.todoList.push({
					'description': item_description,
					'due_date' : new_date,
					'task_id' : $scope.task_id
				});
			});
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