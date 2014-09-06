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
		$scope.sortOrder = 'date';
		$scope.newItem = "Starter";
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
			$scope.taskId++;
			$scope.todoList.push(
				{
					'desc' : $scope.newItem,
					'date' : new Date('12/23/2001')
				}
			);
		};

		$scope.deleteTodo = function(){
			$scope.todoList.pop();
		};

		$scope.deleteSpecificTodo = function(todoList, index) {
			todoList.splice(index, 1);
		}

	}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                	scope.todoList.push(
					{
						'desc' : scope.newItem,
						'dueDate' : 'now'
					});

                });
                event.preventDefault();
            } else {
            	console.log(event.which);
            }
        });
    };
});