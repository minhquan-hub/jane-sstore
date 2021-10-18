function showinformationChoose() {
    var chooseProduct = JSON.parse(localStorage.getItem('LINK_PRODUCT'));
    var chooseImgBig = document.querySelector('.js-product-img__big');
    var chooseImgSmall = document.querySelectorAll('.js-all-img__item-img');
    var chooseName = document.querySelector('.js-name-product');
    var choosePrice = document.querySelector('.js-price-product');
    var chooseDescription = document.querySelector('.js-descrition-product-content')

    chooseImgBig.setAttribute("src", chooseProduct.img1);
    chooseImgSmall[0].setAttribute('src', chooseProduct.img1);
    chooseImgSmall[1].setAttribute('src', chooseProduct.img2);
    chooseImgSmall[2].setAttribute('src', chooseProduct.img3);
    chooseImgSmall[3].setAttribute('src', chooseProduct.img4);
    chooseImgSmall[4].setAttribute('src', chooseProduct.img5);
    chooseName.textContent = chooseProduct.name;
    choosePrice.textContent = chooseProduct.price;
    chooseDescription.textContent = chooseProduct.description;
}

// Logout
function logout() {
    var btnLogout = document.querySelector('.js-header__nav-user-item-logout');
    btnLogout.addEventListener('click', function() {
        localStorage.setItem('USER_LOGIN_SUCCESS', '');
        btnLoginSuccessful.classList.remove('open');
        btnHeaderRegister.classList.remove('close');
        btnHeaderLogin.classList.remove('close');
    })
}


// Adjust amount user buy
function amountProduct() {
    var amountInput = document.querySelector('.js-adjust-number');
    var adjustAdd = document.querySelector('.js-adjust-add');
    var adjustMinus = document.querySelector('.js-adjust-minus');
    var amountProduct = 0;

    adjustAdd.addEventListener('click', function() {
        amountProduct = parseInt(amountInput.value);
        if(amountProduct >= 1 && amountProduct < 8){
            amountProduct += 1;
            amountInput.setAttribute('value',amountProduct);
        }
    });
    adjustMinus.addEventListener('click', function() {
        amountProduct = parseInt(amountInput.value);
        if(amountProduct > 1 && amountProduct <= 8){
            amountProduct -= 1;
            amountInput.setAttribute('value',amountProduct);
        }
    });
}

function addCartAndBuyRightNow() {
    var amountInput = document.querySelector('.js-adjust-number');
    var btnAddCart = document.querySelector('.js-btn-add-cart')
    var btnBuyRightNow = document.querySelector('.js-btn-buy-right-now');
    if(!localStorage.getItem('LINK_PRODUCT') == ''){
        var jsonLinkProduct = JSON.parse(localStorage.getItem('LINK_PRODUCT'));
    }
    if(!localStorage.getItem('USER_LOGIN_SUCCESS') == ''){
        var jsonUserLoginSuccess = JSON.parse(localStorage.getItem('USER_LOGIN_SUCCESS'));
    }
    var cartUser = {
        cartKey : "CART_USER",
        data : [],
        add : function(jsonCartUser,userId,product) {
            /*If this array after getItem form json just have data then We will into first if stament or
            array null, We will go else stament and push first data into array */
            if(!localStorage.getItem('CART_USER') == ''){
                /* array have lenght = 1. It isn't loop for so we will go if stament . Ater array 
                have more than lenght = 1 we will go else stamnent*/
                if(jsonCartUser.length <= 1){
                    var userOne = jsonCartUser[0];
                    // if user have id existion in array, just add product into it, if user don't existion we will create
                    if(userId === userOne.userId){
                         /* array have product lenght = 1. It isn't loop for so we will go if stament . Ater array 
                             have more than lenght = 1 we will go else stamnent*/
                        if(userOne.productBuy.length == 1){
                            var productBuyOne = userOne.productBuy[0];
                            if(productBuyOne.productId == product.productId){
                                /*if the product existe, we just add amount and update json */
                                productBuyOne.amount = parseInt(productBuyOne.amount) + parseInt(product.amount);
                                this.data = jsonCartUser;
                                return;
                            }else {
                                 /*if the product don,t exist, we will create and push into  productBuy's array */
                                userOne.productBuy.push(product);
                                this.data = jsonCartUser;
                                return;
                            }
                        }else {
                            /*if productBuy's array lenght more than one element, We wil loop each element */
                            for(var checkProductUserOne of userOne.productBuy){
                                if(checkProductUserOne.productId == product.productId){
                                    checkProductUserOne.amount = parseInt(checkProductUserOne.amount) + parseInt(product.amount);
                                    this.data = jsonCartUser;
                                    return;
                                }
                            }
                            /* we want to add product don't exist , we have create and push productBuy's element*/
                            userOne.productBuy.push(product);
                            this.data = jsonCartUser;
                            return;
                        }
                    }else {
                        jsonCartUser.push({
                            userId : userId,
                            productBuy : [product]
                        });
                        this.data = jsonCartUser;
                        return;
                    }
                }else {
                    /*we will loop sequence each element in array if user existed just add product, if user
                    don't exist , well have to create user push array*/
                    for(var checkUser of jsonCartUser){
                        if(checkUser.userId == userId){
                            if(checkUser.productBuy.length == 1){
                                var productBuyOne = checkUser.productBuy[0];
                                if(productBuyOne.productId == product.productId){
                                    productBuyOne.amount = parseInt(productBuyOne.amount) + parseInt(product.amount);
                                    this.data = jsonCartUser;
                                    return;
                                }else {
                                    checkUser.productBuy.push(product);
                                    this.data = jsonCartUser;
                                    return;
                                }
                            }else {
                                for(var checkProductUser of checkUser.productBuy){
                                    if(checkProductUser.productId == product.productId){
                                        checkProductUser.amount = parseInt(checkProductUser.amount) + parseInt(product.amount);
                                        this.data = jsonCartUser;
                                        return;
                                    }
                                }
                                checkUser.productBuy.push(product);
                                this.data = jsonCartUser;
                                return;
                            }
                        }
                    }
                    jsonCartUser.push({
                        userId : userId,
                        productBuy : [product]
                    });
                    this.data = jsonCartUser;
                }
            }else {
                this.data.push({
                    userId : userId,
                    productBuy : [product]
                });
            }
        },
        delete : function(index){
            this.data.splice(index,1);
        },
        save : function() {
            const jsonData = JSON.stringify(this.data);
            localStorage.setItem(this.cartKey,jsonData);
        }
    }
    // localStorage.removeItem('CART_USER');
    
    btnAddCart.addEventListener('click', function() {
       var jsonCartUser = JSON.parse(localStorage.getItem('CART_USER'));
        var product = {
            productId : jsonLinkProduct.id,
            amount : amountInput.value
        }
        cartUser.add(jsonCartUser,jsonUserLoginSuccess.id,product);
        cartUser.save();
        showProductHeaderCart();
    });
}

function hoverImgae() {
    var hoverImageSmall = document.querySelectorAll(".js-all-img__item-img");
    var showImageBig = document.querySelector(".js-product-img__big");

    for(let i = 0; i < hoverImageSmall.length; i++){
        hoverImageSmall[i].addEventListener('click', function() {
            showImageBig.setAttribute('src', hoverImageSmall[i].getAttribute('src'));
        })
    }
}

showinformationChoose();
amountProduct();
addCartAndBuyRightNow();
hoverImgae();