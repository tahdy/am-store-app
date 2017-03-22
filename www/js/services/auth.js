'use strict';

angular
  .module('storeApp.services',[])
   .constant("baseURL", "http://amstore.mybluemix.net/")
  .factory('AuthService', ['Customer', '$q', '$rootScope', '$ionicPopup', 
    function(Customer, $q, $rootScope, $ionicPopup) {
    function login(loginData) {
      return Customer
        .login(loginData)
        .$promise
        .then(function(response) {
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            username: loginData.username
          };
          $rootScope.$broadcast('login:Successful');
        },
        function(response){

              var message = '<div><p>' +  response.data.error.message + 
                  '</p><p>' + response.data.error.name + '</p></div>';
            
               var alertPopup = $ionicPopup.alert({
                    title: '<h4>Login Failed!</h4>',
                    template: message
                });

                alertPopup.then(function(res) {
                    console.log('Login Failed!');
                });
        });
    }
      
    function isAuthenticated() {
        if ($rootScope.currentUser) {
            return true;
        }
        else{
            return false;
        }
    }
      
    function getUsername() {
        return $rootScope.currentUser.username;
    }

    function logout() {
      return Customer
       .logout()
       .$promise
       .then(function() {
         $rootScope.currentUser = null;
       });
    }

    function register(registerData) {
      return Customer
        .create({
         username: registerData.username,
         email: registerData.email,
         password: registerData.password
       })
       .$promise
      .then (function(response) {
          
        },
        function(response){
            
              var message = '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';
            
               var alertPopup = $ionicPopup.alert({
                    title: '<h4>Registration Failed!</h4>',
                    template: message
                });

                alertPopup.then(function(res) {
                    console.log('Registration Failed!');
                });

        });
    }

    return {
      login: login,
      logout: logout,
      register: register,
      isAuthenticated: isAuthenticated,
      getUsername: getUsername
    };
  }])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])



.factory('sharedCartService', ['$ionicPopup','$localStorage',function($ionicPopup,$localStorage){
	
	var cartObj = {};
	cartObj.cart=$localStorage.getObject('cart','[]');
	cartObj.total_amount=$localStorage.getObject('total_amount','0');
	cartObj.total_qty=$localStorage.getObject('total_qty','0');
	
	cartObj.cart.add=function(id,image,name,price,qty){
		if( cartObj.cart.find(id)!=-1 ){
			var alertPopup = $ionicPopup.alert({
                title: 'Product Already Added',
                template: 'Increase the quentity from the cart'
            });
			//cartObj.cart[cartObj.cart.find(id)].cart_item_qty+=1;
			//cartObj.total_qty+= 1;	
			//cartObj.total_amount+= parseInt(cartObj.cart[cartObj.cart.find(id)].cart_item_price);
		}
		else{
		    cartObj.cart.push( { "cart_item_id": id , "cart_item_image": image , "cart_item_name": name , "cart_item_price": price , "cart_item_qty": qty } );
			cartObj.total_qty+=1;	
			cartObj.total_amount+=parseInt(price)+9.79;	
		}
	};
	
	cartObj.cart.find=function(id){	
		var result=-1;
		for( var i = 0, len = cartObj.cart.length; i < len; i++ ) {
			if( cartObj.cart[i].cart_item_id === id ) {
				result = i;
				break;
			}
		}
		return result;
	};
	
	cartObj.cart.drop=function(id){
	 var temp=cartObj.cart[cartObj.cart.find(id)];
	 cartObj.total_qty-= parseInt(temp.cart_item_qty);
	 cartObj.total_amount-=( parseInt(temp.cart_item_qty) * (parseInt(temp.cart_item_price)) );
	 cartObj.cart.splice(cartObj.cart.find(id), 1);

	};
	
	cartObj.cart.increment=function(id){
		 cartObj.cart[cartObj.cart.find(id)].cart_item_qty+=1;
		 cartObj.total_qty+= 1;
		 cartObj.total_amount+=( parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) );	
	};
	
	cartObj.cart.decrement=function(id){
		
		 cartObj.total_qty-= 1;
		 cartObj.total_amount-= parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) ;
		 

		 if(cartObj.cart[cartObj.cart.find(id)].cart_item_qty == 1){  // if the cart item was only 1 in qty
			cartObj.cart.splice( cartObj.cart.find(id) , 1);  //edited
		 }else{
			cartObj.cart[cartObj.cart.find(id)].cart_item_qty-=1;
		 }
	
	};
	
	return cartObj;
}])

;
