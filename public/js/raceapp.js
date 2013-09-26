var PCFApp = angular.module('raceapp', [])
// Service for wrapping socket.io's "on" and "emit" functions in Angular
.service('socket', function($rootScope){
	var socket = io.connect(null); //paramater is for address and port - passing in 'null' ensures that the browser's current address and port are used
	return{
		// socket.on
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				// Bind to root scope and apply any changes on change
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		},
		// socket.emit
		emit: function(eventName, data, callback){
			socket.emit(eventName, data, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					if(callback){
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});