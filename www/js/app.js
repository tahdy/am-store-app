// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('storeApp', ['ionic','ngCordova','ionic.rating', 'angularFileUpload','storeApp.controllers','storeApp.services','lr.upload','lbServices'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      $timeout(function(){
                $cordovaSplashscreen.hide();
      },2000);
  });
    
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        })
    });

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
        console.log('Loading ...');
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
  url: '/app',
  abstract: true,
  templateUrl: 'templates/sidebar.html',
  controller: 'AppCtrl'
  })

    .state('app.home', {
      url: '/home',
      views: {
        'mainContent': {
          templateUrl: 'templates/home.html',
        controller:'HomeController'
  }
  }
  })

  .state('app.favorites', {
url: '/favorites',
cache:false,
views: {
'mainContent': {
templateUrl: 'templates/favorites.html',
controller:'FavoritesController'
}
}
})

    .state('app.categories', {
      url: '/categories',
      views: {
        'mainContent': {
          templateUrl: 'templates/categories.html',
        controller:'HomeController'
  }
  }
  })

  .state('app.contactus', {
  url: '/contactus',
  views: {
  'mainContent': {
  templateUrl: 'templates/contactus.html',
  controller  : 'ContactController'

  }
  }
  })
  .state('app.product', {
  url: '/product',
  views: {
  'mainContent': {
  templateUrl: 'templates/product.html',
  controller  : 'ProductController'
  }
  }
  })

  .state('app.fashion', {
  url: '/fashion',
  views: {
  'mainContent': {
  templateUrl: 'templates/fashion.html',
  controller  : 'ProductController'
  }
  }
  })

  .state('app.kitchen', {
  url: '/kitchen',
  views: {
  'mainContent': {
  templateUrl: 'templates/kitchen.html',
  controller  : 'ProductController'
  }
  }
  })

  .state('app.mobiles', {
  url: '/mobiles',
  views: {
  'mainContent': {
  templateUrl: 'templates/mobiles.html',
  controller  : 'ProductController'
  }
  }
  })

  .state('app.laptops', {
  url: '/laptops',
  views: {
  'mainContent': {
  templateUrl: 'templates/laptops.html',
  controller  : 'ProductController'
  }
  }
  })

  .state('app.babies', {
  url: '/babies',
  views: {
  'mainContent': {
  templateUrl: 'templates/babies.html',
  controller  : 'ProductController'
  }
  }
  })

  .state('app.offer', {
  url: '/offer',
  views: {
  'mainContent': {
  templateUrl: 'templates/offer.html',
  controller: 'AddController'
  }
  }
  })

  .state('app.productdetails', {
  url: '/product/:id',
       cache:false,
  views: {
  'mainContent': {
  templateUrl: 'templates/productdetails.html',
  controller: 'ProductDetailController'

}}
})



  .state('app.offerdetails', {
  url: '/offer/:id',
  views: {
  'mainContent': {
  templateUrl: 'templates/offerdetails.html',
  controller: 'OfferDetailController'
  }
  }
  })


  
  
      .state('app.cart', {
      url: '/cart',
      views: {
      'mainContent': {
      templateUrl: 'templates/cart.html',
      controller: 'cartCtrl'
      }}
    })

      
        
    .state('app.checkOut', {
      url: '/checkout',
            views: {
      'mainContent': {
      templateUrl: 'templates/checkout.html',
      controller: 'cartCtrl'
      }}
    })
      .state('app.search', {
      url: '/search',
            views: {
      'mainContent': {
      templateUrl: 'templates/search.html',
      controller: 'ProductController'
      }}
    })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

  })


;
