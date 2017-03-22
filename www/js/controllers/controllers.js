
angular.module('storeApp.controllers', [])

.controller('AppCtrl', function ($scope,$rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, AuthService,Offers,FileUploader, $ionicLoading, $cordovaFileTransfer) {
    $scope.upload = function() {
        var image = document.getElementById('tempImage');
            image.src = imageData;
            filePath = imageData;

        var options = {
            fileKey: "file",
            fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg"
        };
        $cordovaFileTransfer.upload('/api/containers/images/upload', filePath, options).then(function(result) {
            console.log("SUCCESS: " + JSON.stringify(result.response));
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
            // constant progress updates
        });
    }


  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.reservation = {};
    $scope.registration = {};
    $scope.loggedIn = false;

    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    }

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

        AuthService.login($scope.loginData);

        $scope.closeLogin();
    };

    $scope.logOut = function() {
       AuthService.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });




    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the login modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;

        AuthService.register($scope.registration);
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };

    $rootScope.$on('registration:Successful', function () {
        $localStorage.storeObject('userinfo',$scope.loginData);
    });
    // Create the offer modal that we will use later
$ionicModal.fromTemplateUrl('templates/addoffer.html', {
scope: $scope
})
    .then(function(modal) {
$scope.addofferform = modal;
});
// Triggered in the offer modal to close it
$scope.closeAddoffer = function() {
$scope.addofferform.hide();
};
// Open the offer modal
$scope.addoffer = function() {
$scope.addofferform.show();
};
// Perform the reserve action when the user submits the reserve form

    $scope.myoffer = { name: "", price: 0, description: "",images:[], phone: "", email :"",agree: false,mychannel: ""};

    var channels = [{
        value: "sell",
        label: "Sell"
    },
    {
        value: "borrow",
        label: "Borrow"
    },
     {
        value: "exchange",
        label: "Exchange"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;



    $scope.doOffer = function () {
          if ($scope.myoffer.agree && ($scope.myoffer.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        }else {
           $scope.invalidChannelSelection = false;
           Offers.create($scope.myoffer);
            $scope.myoffer = { name: "", price: 0, description: "",images:[], phone: "", email :"",agree: false,mychannel: ""};

                console.log('Adding Offer', $scope.myoffer);
// Simulate a reservation delay. Remove this and replace with your reservation
// code if using a server system
$timeout(function() {
$scope.closeAddoffer();
}, 1000);

        }


    };







  // create a uploader with options

    var uploader = $scope.uploader = new FileUploader({
      scope: $scope,                          // to automatically update the html. Default: $rootScope
      url: '/api/containers/images/upload',

      formData: [
        { key: 'value' }
      ]
    });

    // ADDING FILTERS
    uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
    });

    // REGISTER HANDLERS
    // --------------------
     uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(item) {
      console.info('After adding a file', item);
         console.log(item.file.name);
        $scope.picname=[];

        $scope.picname.push('images/'+item.file.name);

        console.log($scope.picname);

    };
    // --------------------
    uploader.onAfterAddingAll = function(items) {
      console.info('After adding all files', items);

    };
    // --------------------
    uploader.onWhenAddingFileFailed = function(item, filter, options) {
      console.info('When adding a file failed', item);
    };
    // --------------------
    uploader.onBeforeUploadItem = function(item) {
      console.info('Before upload', item);


        $scope.picname.push('images/'+item.file.name);
        console.log($scope.picname);
        $scope.myoffer.images=$scope.picname;
        console.log($scope.myoffer.images);
    };
    // --------------------
    uploader.onProgressItem = function(item, progress) {
      console.info('Progress: ' + progress, item);
    };
    // --------------------
    uploader.onProgressAll = function(progress) {
      console.info('Total progress: ' + progress);
    };
    // --------------------
    uploader.onSuccessItem = function(item, response, status, headers) {
      console.info('Success', response, status, headers);
      $scope.$broadcast('uploadCompleted', item);

    };
    // --------------------
    uploader.onErrorItem = function(item, response, status, headers) {
      console.info('Error', response, status, headers);
    };
    // --------------------
    uploader.onCancelItem = function(item, response, status, headers) {
      console.info('Cancel', response, status);
    };
    // --------------------
    uploader.onCompleteItem = function(item, response, status, headers) {
      console.info('Complete', response, status, headers);
    };
    // --------------------
    uploader.onCompleteAll = function(items) {
      console.info('Complete all');

    };

    $scope.collection = {
        selectedImage : ''
    };

    $ionicPlatform.ready(function() {

        $scope.getImageSaveContact = function() {
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 4, // Max number of selected images, I'm using only one for this example
                width: 800,
                height: 800,
                quality: 80            // Higher is better
            };

            $cordovaImagePicker.getPictures(options).then(function (results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    $scope.collection.selectedImage = results[i];   // We loading only one image so we can use it like this

                    window.plugins.Base64.encodeFile($scope.collection.selectedImage, function(base64){  // Encode URI to Base64 needed for contacts plugin
                        $scope.collection.selectedImage = base64;

                    });
                }
                $cordovaFileTransfer.upload("/api/containers/images/upload", imageUrlToUpload, options)
        .then(function(result) {
            // Success!
            console.log('upload success');
        }, function(err) {
            // Error
            console.log("error in file upload");
            console.log(err);
        }, function (progress) {
            // constant progress updates
            console.log('some progress')
        });


            }, function(error) {
                console.log('Error: ' + JSON.stringify(error));    // In case of error
            });
        };

    });


})



.controller('HomeController',['$scope','$rootScope','Products','baseURL', function($scope,$rootScope,Products,baseURL) {
$scope.baseURL = baseURL;
$scope.tab = 1;
$scope.filtText = 'new';


Products.query(

function(response){
  $scope.products=response;

},
function(response){

}

);

 $scope.select = function(setTab) {
  $scope.tab = setTab;
   if (setTab === 1)
       $scope.filtText = "new";
  else if (setTab === 2)
       $scope.filtText = "best";
  else if (setTab === 3)
       $scope.filtText = "popular";
  else
       $scope.filtText = "new";

};
$scope.isSelected = function (checkTab) {
  return ( $scope.tab === checkTab);
};

$scope.data = {};

  $scope.data.currentPage = 0;


  var setupSlider = function() {
    //some options to pass to our slider
    $scope.data.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal', //or vertical
      speed: 300, //0.3s transition
      pagination: false
    };
  }

  setupSlider();

  $scope.slidePrevious = function() {
$scope.data.sliderDelegate.slidePrev()
    }

    $scope.slideNext = function() {
      $scope.data.sliderDelegate.slideNext();
    }
}])


.controller('ProductController',['$scope','$rootScope','baseURL','Products','Favorites','$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',  function($scope,$rootScope, baseURL,Products,Favorites, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast){
     $rootScope.global = {
        search: ''
    };
 $scope.baseURL = baseURL;

    Products.query(

        function(response){
            $scope.products=response;

        },
        function(response){}

    );
    $scope.addFavorite = function (productid) {
        console.log("productid is " + productid);

        Favorites.create({customerId: $rootScope.currentUser.id, productsId: productid});
        $ionicListDelegate.closeOptionButtons();

        $ionicPlatform.ready(function () {

                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.products[productid].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.products[productid].name);
                },
                function () {
                    console.log('Failed to add Favorite ');
                });

              $cordovaToast
                  .show('Added Favorite '+$scope.products[productid].name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });


        });
    }


       }])


.controller('ProductDetailController', ['$scope','$rootScope', '$state', '$stateParams','baseURL','sharedCartService', 'ratingConfig','$timeout', '$ionicPopover','Favorites','$ionicListDelegate','$ionicModal', 'Products', 'Comments', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', '$cordovaSocialSharing', function ($scope,$rootScope, $state,  $stateParams, baseURL,sharedCartService, ratingConfig,$timeout, $ionicPopover,Favorites,$ionicListDelegate,$ionicModal, Products, Comments, $ionicPlatform, $cordovaLocalNotification, $cordovaToast, $cordovaSocialSharing) {

  $scope.deleteComment = function(commentid) {

    Comments.deleteById({id: commentid});

  $state.go($state.current, null, {reload: true});


};

    $scope.product = {};
    $scope.showProduct = false;
    $scope.message="Loading.....";
   $scope.baseURL = baseURL;
    $scope.product = Products.findById({id: $stateParams.id})
    .$promise.then(
      function(response){
                                $scope.product = response;
                     $scope.product.comments = Products.comments({
                    id: $stateParams.id,
                    "filter":{"include":["customer"]}});
                                $scope.showProduct = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }

    );

    // .fromTemplateUrl() method
$ionicPopover.fromTemplateUrl('templates/product-detail-popover.html', {
    scope: $scope
}).then(function (popover) {
    $scope.popover = popover;
});


$scope.openPopover = function ($event) {
    $scope.popover.show($event);
};
$scope.closePopover = function () {
    $scope.popover.hide();
};
//Cleanup the popover when we're done with it!
$scope.$on('$destroy', function () {
    $scope.popover.remove();
});
// Execute action on hide popover
$scope.$on('popover.hidden', function () {
    // Execute action
});
// Execute action on remove popover
$scope.$on('popover.removed', function () {
    // Execute action
});

    $scope.addFavorite = function (productid) {
        console.log("productid is " + productid);

        Favorites.create({customerId: $rootScope.currentUser.id, productsId: $stateParams.id});
          $scope.popover.hide();

        $ionicPlatform.ready(function () {

                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.product.name
                }).then(function () {
                    console.log('Added Favorite '+$scope.product.name);
                },
                function () {
                    console.log('Failed to add Favorite ');
                });

              $cordovaToast
                  .show('Added Favorite '+$scope.product.name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });


        });
    }

       $scope.rating = {};
  $scope.rating.rate = 3;
  $scope.rating.max = 5;
     $scope.mycomment = {
        rating: 3,
        comment: "",
         productsId: $stateParams.id
    };

    $scope.submitComment = function () {

    if ($rootScope.currentUser)
            $scope.mycomment.customerId = $rootScope.currentUser.id;

        Comments.create($scope.mycomment);

        $scope.closeCommentForm();
        console.log($scope.rating);
       console.log($scope.rating.rate);
        $scope.mycomment.rating=$scope.rating.rate;
        $scope.mycomment = {
            rating: 5,
            comment: "",
            productsId: $stateParams.id
        };

        $state.go($state.current, null, {reload: true});
    }
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/product-comment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.commentForm = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeCommentForm = function () {
        $scope.commentForm.hide();
    };

    // Open the login modal
    $scope.showCommentForm = function () {
           if(!$scope.commentForm) return;

        // Call a function to close the popover
        $scope.closePopover();

        // Set a timeout to show the modal only in next cycle
        $timeout(function(){
          $scope.commentForm.show();
        $scope.popover.hide();
        }, 0);

    };
        $ionicPlatform.ready(function() {

        var message = $scope.product.description;
        var subject = $scope.product.name;
        var link = $scope.baseURL+$scope.product.image;
        var image = $scope.baseURL+$scope.product.image;

        $scope.nativeShare = function() {
            $cordovaSocialSharing
                .share(message, subject, link); // Share via native share sheet
        };

        //checkout http://ngcordova.com/docs/plugins/socialSharing/
        // for other sharing options
    });
    	//put cart after menu
	var cart = sharedCartService.cart;

    	 //add to cart function
	 $scope.addToCart=function(id,image,name,price){
		cart.add(id,image,name,price,1);
	 };
   // $scope.product.images[0]=$scope.item.cart_item_image;
 $scope.readOnly = true;
}])


.controller('ContactController',['$scope','$rootScope', '$ionicModal', '$timeout', 'Feedbacks', function ($scope,$rootScope, $ionicModal, $timeout, Feedbacks) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/feedback.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.feedbackform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeFeedback = function () {
        $scope.feedbackform.hide();
    };

    // Open the login modal
    $scope.feedback = function () {
        $scope.feedbackform.show();
    };

    $scope.sendFeedback = function () {

        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        } else {
            $scope.invalidChannelSelection = false;
            // feedbackFactory.save($scope.feedback);
             Feedbacks.create($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            console.log($scope.feedback);
        }
    };
}])


.   controller('AddController', ['$scope','$rootScope', 'Offers','baseURL', function ($scope,$rootScope, Offers, baseURL) {
     $scope.baseURL = baseURL;
    $scope.filtText='sell';
     $scope.showOffer=false;
     $scope.message="Loading.....";

    Offers.query(

        function(response){
            $scope.offers=response;
            $scope.showOffer=true;
        },
        function(response){$scope.message="Error: "+response.status+" "+response.statusText;}

    );
               $scope.select = function(setTab) {
            $scope.tab = setTab;
             if (setTab === 1)
                 $scope.filtText = "sell";
            else if (setTab === 2)
                 $scope.filtText = "borrow";
            else if (setTab === 3)
                 $scope.filtText = "exchange";
            else
                 $scope.filtText = "sell";

        };
        $scope.isSelected = function (checkTab) {
            return ( $scope.tab === checkTab);
        };
}])
.controller('OfferController', ['$scope','$rootScope', 'Offers','$state', '$stateParams','baseURL','Upload','$window', function ($scope,$rootScope, Offers,$state, $stateParams, baseURL, Upload,$window) {
$scope.baseURL = baseURL;
    $scope.myoffer = { name: "", price: 0, description: "",image:"", phone: "", email :"",agree: false,mychannel: ""};

    var channels = [{
        value: "sell",
        label: "Sell"
    },
    {
        value: "borrow",
        label: "Borrow"
    },
     {
        value: "exchange",
        label: "Exchange"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.addOffer = function () {
          if ($scope.myoffer.agree && ($scope.myoffer.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        }else {
           $scope.invalidChannelSelection = false;
           Offers.create($scope.myoffer);
            $scope.myoffer = { name: "", price: 0, description: "",image:"", phone: "", email :"",agree: false,mychannel: ""};
             $scope.myoffer.mychannel = "";
            $scope.offerForm.$setPristine();

        }
    };

}])
.controller('OfferDetailController',['$scope','$rootScope', '$state', '$stateParams','baseURL','sharedCartService', 'ratingConfig','$timeout', '$ionicPopover','Favorites','$ionicListDelegate','$ionicModal', 'Offers', 'Reviews', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', '$cordovaSocialSharing', function ($scope,$rootScope, $state,  $stateParams, baseURL,sharedCartService, ratingConfig,$timeout, $ionicPopover,Favorites,$ionicListDelegate,$ionicModal,Offers,Reviews, $ionicPlatform, $cordovaLocalNotification, $cordovaToast, $cordovaSocialSharing) {



$scope.baseURL = baseURL;
    $scope.offer = {};
    $scope.showOffer = false;
    $scope.message="Loading.....";

    $scope.offer = Offers.findById({id: $stateParams.id})
    .$promise.then(
      function(response){$scope.offer = response;
                $scope.offer.reviews = Offers.reviews({
                    id: $stateParams.id,
                    "filter":{"include":["customer"]}});
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
    );
    // .fromTemplateUrl() method
$ionicPopover.fromTemplateUrl('templates/offer-detail-popover.html', {
    scope: $scope
}).then(function (popover) {
    $scope.popover = popover;
});


$scope.openPopover = function ($event) {
    $scope.popover.show($event);
};
$scope.closePopover = function () {
    $scope.popover.hide();
};
//Cleanup the popover when we're done with it!
$scope.$on('$destroy', function () {
    $scope.popover.remove();
});
// Execute action on hide popover
$scope.$on('popover.hidden', function () {
    // Execute action
});
// Execute action on remove popover
$scope.$on('popover.removed', function () {

    });


  $scope.rating = {};
  $scope.rating.rate = 3;
  $scope.rating.max = 5;
      $scope.myreview = {
        rating: 3,
        review: "",
        offersId: $stateParams.id
    };
    $scope.deleteReview = function(reviewid) {
         Reviews.deleteById({id: reviewid});
    $state.go($state.current, null, {reload: true});

  };
    $scope.submitReview = function () {
        if ($rootScope.currentUser)
            $scope.myreview.customerId = $rootScope.currentUser.id;
         console.log($scope.rating);
       console.log($scope.rating.rate);
        $scope.myreview.rating=$scope.rating.rate;
        Reviews.create( $scope.myreview);
          $scope.closeReviewForm();
        $scope.myreview = {
            rating: 3,
            review: "",
        offersId: $stateParams.id
        };
            $state.go($state.current, null, {reload: true});
    }
        // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/offer-review.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.reviewForm = modal;

    });

    // Triggered in the login modal to close it
    $scope.closeReviewForm = function () {
        $scope.reviewForm.hide();
    };

    // Open the login modal
    $scope.showReviewForm = function () {
         if(!$scope.reviewForm) return;

        // Call a function to close the popover
        $scope.closePopover();

        // Set a timeout to show the modal only in next cycle
        $timeout(function(){
          $scope.reviewForm.show();
        $scope.popover.hide();
        }, 0);

    };
    $scope.readOnly = true;
             	//put cart after menu
	var cart = sharedCartService.cart;

    	 //add to cart function
	 $scope.addToCart=function(id,image,name,price){
		cart.add(id,image,name,price,1);
	 };

    }])


.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])

.controller('FavoritesController', ['$scope', '$rootScope', '$state', 'Favorites','Products', 'Customer', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$ionicPlatform', '$cordovaVibration', function ($scope, $rootScope, $state, Favorites,Products, Customer, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $ionicPlatform, $cordovaVibration) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    if ($rootScope.currentUser) {
    Customer.favorites({id:$rootScope.currentUser.id, "filter":
        {"include":["products"]}
        })
        .$promise.then(
        function (response) {
            $scope.favorites = response;
             $scope.showProduct = true;
        },
        function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    }
    else{
        $scope.message = "You are not logged in"
    }


    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (favoriteid) {

        var confirmPopup = $ionicPopup.confirm({
            title: '<h3>Confirm Delete</h3>',
            template: '<p>Are you sure you want to delete this item?</p>'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                Favorites.deleteById({id: favoriteid});

               $state.go($state.current, null, {reload: true});
               // $window.location.reload();
            } else {
                console.log('Canceled delete');
            }
        });
        $scope.shouldShowDelete = false;


    }

}])
.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
        var files = event.target.files;
        var file = files[0];
        if(file && typeof(file) !== undefined && file.size > 0){
          scope.file = file;
          scope.$parent.file = file;
        } else {
          scope.file = {};
          scope.$parent.file = {};
        }
        scope.$apply();
      });
    }
  };
})

.controller('cartCtrl', function($scope,sharedCartService,$ionicPopup,$state,$localStorage) {
		$scope.cart =[];
        $scope.total_qty = 0;
        $scope.total_amount = 0;

		//onload event-- to set the values
		$scope.$on('$stateChangeSuccess', function () {
			$scope.cart=sharedCartService.cart;
			$scope.total_qty=sharedCartService.total_qty;
			$scope.total_amount=sharedCartService.total_amount;
       $localStorage.storeObject('cart',$scope.cart);
     $localStorage.storeObject('total_qty',$scope.total_qty);
     $localStorage.storeObject('total_amount',$scope.total_amount);
            console.log('cart', $scope.cart);
            console.log('total_qty', $scope.total_qty);
            console.log('total_amount', $scope.total_amount);
		});

		//remove function
		$scope.removeFromCart=function(c_id){
			$scope.cart.drop(c_id);
			$scope.total_qty=sharedCartService.total_qty;
			$scope.total_amount=sharedCartService.total_amount;
     $localStorage.storeObject('cart',$scope.cart);
     $localStorage.storeObject('total_qty',$scope.total_qty);
     $localStorage.storeObject('total_amount',$scope.total_amount);
            console.log('cart', $scope.cart);
            console.log('total_qty', $scope.total_qty);
            console.log('total_amount', $scope.total_amount);
		};

		$scope.inc=function(c_id){
			$scope.cart.increment(c_id);
			$scope.total_qty=sharedCartService.total_qty;
			$scope.total_amount=sharedCartService.total_amount;
    $localStorage.storeObject('cart',$scope.cart);
     $localStorage.storeObject('total_qty',$scope.total_qty);
     $localStorage.storeObject('total_amount',$scope.total_amount);
                        console.log('cart', $scope.cart);
            console.log('total_qty', $scope.total_qty);
            console.log('total_amount', $scope.total_amount);
		};

		$scope.dec=function(c_id){
			$scope.cart.decrement(c_id);
			$scope.total_qty=sharedCartService.total_qty;
			$scope.total_amount=sharedCartService.total_amount;
           $localStorage.storeObject('cart',$scope.cart);
     $localStorage.storeObject('total_qty',$scope.total_qty);
     $localStorage.storeObject('total_amount',$scope.total_amount);
          console.log('cart', $scope.cart);
            console.log('total_qty', $scope.total_qty);
            console.log('total_amount', $scope.total_amount);
		};

		$scope.checkout=function(){
			if($scope.total_amount>0){

                $state.go('app.checkOut');

			}
			else{
				var alertPopup = $ionicPopup.alert({
					title: 'No item in your Cart',
					template: 'Please add Some Items!'
				});
			}
		};

})

.controller('checkOutCtrl', function($scope) {

})
;
