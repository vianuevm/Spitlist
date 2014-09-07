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
		$scope.inside = false;
		$scope.sortOrder = 'date';
		$scope.newItem = "";
		$scope.todoList = [
			{
				'desc' : 'Pick up a panda',
				'date' : new Date('12/23/2015')
			},
			{
				'desc' : 'Pick up a panda',
				'date' : new Date('12/23/2013')
			},
			{
				'desc' : 'Pick up a panda',
				'date' : new Date('12/23/2018')
			},
			{
				'desc' : 'Pick up a panda',
				'date' : new Date('12/23/2011')
			}
		];
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
				$scope.taskId++;
				$scope.todoList.push(
					{
						'desc' : $scope.newItem,
						'date' : new Date('12/23/2001')
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

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 27) {
				$('input').blur();
			}
        });
    };
});