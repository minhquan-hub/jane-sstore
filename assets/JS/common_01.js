const btnHeaderRegister = document.querySelector('.js-header-register');
const btnHeaderLogin = document.querySelector('.js-header-login');
const modal = document.querySelector('.js-modal');
const modalBody = document.querySelector('.js-modal-Body');
const authFormRegister = document.querySelector('.js-auth-form-register');
const authFormLogin = document.querySelector('.js-auth-form-login');
const authFormBtnRegister = document.querySelector('.js-auth-form__swith-btn-register');
const authFormBtnLogin = document.querySelector('.js-auth-form__swith-btn-login');
const authFormBtnBack = document.querySelectorAll('.js-auth-form__controls-back');


function showModalBodyRegister() {
    modal.classList.add('open');
    authFormRegister.classList.add('open');
    authFormLogin.classList.remove('open');

}

function showModalBodyLogin() {
    modal.classList.add('open');
    authFormLogin.classList.add('open');
    authFormRegister.classList.remove('open');
}

function closeModalBodyRegisterAndLogin() {
    modal.classList.remove('open');
}

function transferRegisterToLogin() {
    authFormRegister.classList.remove('open');
    authFormLogin.classList.add('open');
}

function transferLoginToRegister() {
    authFormLogin.classList.remove('open');
    authFormRegister.classList.add('open');
}

btnHeaderRegister.addEventListener('click', showModalBodyRegister);
btnHeaderLogin.addEventListener('click', showModalBodyLogin);
modal.addEventListener('click', closeModalBodyRegisterAndLogin);
authFormRegister.addEventListener('click', function (event) {
    event.stopPropagation()
})
authFormLogin.addEventListener('click', function (event) {
    event.stopPropagation()
})
authFormBtnRegister.addEventListener('click', transferRegisterToLogin);
authFormBtnLogin.addEventListener('click', transferLoginToRegister);
authFormBtnBack[0].addEventListener('click', closeModalBodyRegisterAndLogin);
authFormBtnBack[1].addEventListener('click', closeModalBodyRegisterAndLogin);

// Validator

function Validator(options) {

    var selectorRules = {};

    // Validate
    function validate(inputElement, rule){
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorElement);
        
        // get rules of selector
        var rules = selectorRules[rule.selector];

        // loop each rule
        for(var i = 0; i < rules.length; ++i){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }
        
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid');
        }

        return !errorMessage;
    }
    // get element of form need validate
    var formElment = document.querySelector(options.form);
    if(formElment) {

        // loop each rule and validate
        formElment.querySelector(options.btn).onclick = function (e) {
            var isFormValid = true;

            options.rules.forEach(function (rule) {
                var inputElement = formElment.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });
            

            if(isFormValid) {
                if(options.form === '.js-auth-form-register'){
                    checkRegister();
                }else {
                    checkLogin();
                }
        
                // checkLogin();
                
            }
        } 

        // loop each rule and listen event blur, input
        options.rules.forEach(function (rule) {

            // save rules for each input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElment.querySelector(rule.selector);

            // case blur outside input
            if(inputElement) {
                inputElement.onblur = function () {
                   validate(inputElement, rule);
                }
            }

            // case stop error when enter input
            inputElement.oninput = function() {
                var errorElement = inputElement.parentElement.querySelector(options.errorElement);
                errorElement.innerText = "";
                inputElement.parentElement.classList.remove('invalid');
            }
        }); 
    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector : selector,
        test : function (value) {
            return value.trim() ? undefined : message || "Vui lòng nhập trường này";
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector : selector,
        test : function (value) {
            var regrex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regrex.test(value) ? undefined : message || "Vui lòng nhập email";
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector : selector,
        test : function (value) {
            return value === getConfirmValue() ? undefined : message || "vui lòng nhập lại"
        }
    }
}

// Object user

var informationUser = {
    userKey: "INFORMATION_USER",
    data: [],
    add: function(information) {
        this.data.push(information);
    },
    delete: function(index) {
        this.data.splice(index, 1);
    },
    getList: function() {
        return this.data;
    },
    save: function() {
        const JsonData = JSON.stringify(this.data);
        localStorage.setItem(this.userKey, JsonData);
    }
}


// Check Register
function checkRegister() {
    var registerEmail = document.getElementById("email-register").value;
    var registerPassword = document.getElementById("password-register").value;
    var dataJson = JSON.parse(localStorage.getItem('INFORMATION_USER'));
    var lastUserId ;
    for(var dataUser of dataJson){
        lastUserId = dataUser.id;
    }

    function createId(lastUserId) {
        var idSeparate = lastUserId.slice(1);
        var newIdNumber =  ++idSeparate;
        console.log(typeof newIdNumber);
        return 'U'+ newIdNumber;
    }
    
    var id = createId(lastUserId);
    informationUser.add({
        id: id,
        email: registerEmail,
        password: registerPassword
    })
    informationUser.save();
    closeModalBodyRegisterAndLogin();
    alert("Đăng ký thành công");
}

if(localStorage.getItem('INFORMATION_USER') == null){
informationUser.add({
    id: 'U3047',
    email: 'minhquan@gmail.com',
    password: 'quan123'
})
informationUser.save();
}

// localStorage.removeItem('INFORMATION_USER');

// CheckLogin
const btnLogin = document.querySelector('.js-btn-login');
const btnLoginSuccessful = document.querySelector('.js-header__nav-user');
const loginName = document.querySelector('.js-header__nav-user-name')
const getJsonInformationUser = JSON.parse(localStorage.getItem('INFORMATION_USER'));

btnLogin.addEventListener('click', checkLogin);


function checkLogin() {
    var loginEmail = document.getElementById("email-login").value;
    var loginPassword = document.getElementById("password-login").value;
    var findUsername = getJsonInformationUser.some(function(user) {
        idCheck = user.id;
        emailCheck = user.email;
        passwordCheck = user.password;
        if(emailCheck === loginEmail && passwordCheck === loginPassword){
            return true;
        }else {
            return false;
        }
    });
    if(findUsername) {
        afterlogin();
    }else {
        alert("Đăng nhập không thành công.");
    }


    function afterlogin() {
        // Save login Success
        var loginUserSuccess = {
            storeKey: 'USER_LOGIN_SUCCESS',
            data: [],
            add: function(user) {
                this.data = user;
            },
            save: function() {
                const jsonData = JSON.stringify(this.data);
                localStorage.setItem(this.storeKey,jsonData);
            }
        }

        loginUserSuccess.add({
            id: idCheck,
            email: emailCheck,
            password: passwordCheck,
        });
        loginUserSuccess.save();

        // change show information user
        btnHeaderRegister.classList.add('close');
        btnHeaderLogin.classList.add('close');
        btnLoginSuccessful.classList.add('open');
        closeModalBodyRegisterAndLogin();
        loginName.textContent = emailCheck;

        showProductHeaderCart();
    }
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

// Auto Login

function autoLogin() {
    if(!localStorage.getItem('USER_LOGIN_SUCCESS') == '') {
        var loginName = document.querySelector('.js-header__nav-user-name');
        var btnHeaderRegister = document.querySelector('.js-header-register');
        var btnLoginSuccessful = document.querySelector('.js-header__nav-user');
        var btnHeaderLogin = document.querySelector('.js-header-login');
        var getJsonUserLoginSuccess = JSON.parse(localStorage.getItem('USER_LOGIN_SUCCESS'));

        btnHeaderRegister.classList.add('close');
        btnHeaderLogin.classList.add('close');
        btnLoginSuccessful.classList.add('open');
        loginName.textContent = getJsonUserLoginSuccess.email;
    }
}



// Show product header cart
function showProductHeaderCart() {
    var liContentRemove = document.querySelectorAll('.header__cart-item');
    var showAmountProduct = document.querySelector('.js-header__cart-notice');
    var countAmountProduct = 0;

    console.log(countAmountProduct);

    if(!localStorage.getItem('CART_USER') == ''){
        var jsonCartUser = JSON.parse(localStorage.getItem('CART_USER'));
    }
    if(!localStorage.getItem('USER_LOGIN_SUCCESS') == ''){
        var jsonUserLoginSuccess = JSON.parse(localStorage.getItem('USER_LOGIN_SUCCESS'));
    }

    for(var i = 0; i < liContentRemove.length; i++){
        liContentRemove[i].remove();
    }

    if(!localStorage.getItem('CART_USER') == ''){
        if(!localStorage.getItem('USER_LOGIN_SUCCESS') == '') {
            if(jsonCartUser.length <= 1){
                var userOne = jsonCartUser[0];
                if(jsonUserLoginSuccess.id === userOne.userId){
                    countAmountProduct = userOne.productBuy.length;
                    if(userOne.productBuy.length == 1){
                        var productBuyOne = userOne.productBuy[0];
                        headerCart(productBuyOne.productId,productBuyOne.amount);
                    }else {
                        countAmountProduct = userOne.productBuy.length;
                        for(var checkProductUserOne of userOne.productBuy){
                        headerCart(checkProductUserOne.productId,checkProductUserOne.amount);
                        }
                    }
                }else {
                    console.log('The user is empty');
                }
            }else {
                for(var checkUser of jsonCartUser){
                    if(jsonUserLoginSuccess.id == checkUser.userId){
                        countAmountProduct = checkUser.productBuy.length;
                        if(checkUser.productBuy.length == 1){
                            var productBuyOne = checkUser.productBuy[0];
                            headerCart(productBuyOne.productId,productBuyOne.amount);
                        }else {
                            for(var checkProductUser of checkUser.productBuy){
                                headerCart(checkProductUser.productId,checkProductUser.amount);
                            }
                        }
                    }
                }
            }
        }
    }else {
        console.log("This array is empty")
    }

    showAmountProduct.textContent = countAmountProduct;

    function productInformation(productId) {
        var jsonInformationProduct = JSON.parse(localStorage.getItem('INFORMATION_PRODUCT'));
        for(var i=0; i < jsonInformationProduct.length; i++){
            if(jsonInformationProduct[i].id == productId){
                return jsonInformationProduct[i];
            }
        }
    }    

    function headerCart(productId,amount) {
        var getElementProduct = productInformation(productId);
        var liHeaderCartItem = document.createElement('li');
        var liContent = '<li class="header__cart-item"><img src="'+getElementProduct.img1+'" alt="" class="header__cart-img"><div class="header__cart-item-info"><div class="header__cart-item-head"><h5 class="header__cart-item-name">'+getElementProduct.name+' </h5><div class="header__cart-item-price-wrap"><span class="header__cart-item-price">'+getElementProduct.price+'</span><span class="header__cart-item-multiply">x</span><span class="header__cart-item-qnt">'+amount+'</span></div></div><div class="header__cart-item-body"><span class="header__cart-item-description"></span><span class="header__cart-item-remove" value="'+getElementProduct.id+'">Xóa</span></div></div></li>'
        liHeaderCartItem.innerHTML = liContent;
        var ulCartListItem = document.querySelector('.header__cart-list-item');
        ulCartListItem.append(liHeaderCartItem);
    }
    deleteProduct();
}

function deleteProduct() {
    var btnDeleteProduct = document.querySelectorAll('.header__cart-item-remove');
    if(!localStorage.getItem('CART_USER') == ''){
        var jsonCartUser = JSON.parse(localStorage.getItem('CART_USER'));
    }
    if(!localStorage.getItem('USER_LOGIN_SUCCESS') == ''){
        var jsonUserLoginSuccess = JSON.parse(localStorage.getItem('USER_LOGIN_SUCCESS'));
    }

    for(let i = 0; i < btnDeleteProduct.length; i++){
        btnDeleteProduct[i].onclick = function() {
            removeItem(i);
            showProductHeaderCart();
        }
    }

    function removeItem(index) {
        if(!localStorage.getItem('CART_USER') == ''){
            if(jsonCartUser.length <= 1){
                var userOne = jsonCartUser[0];
                userOne.productBuy.splice(index,1);
            }else {
                for(var checkUser of jsonCartUser){
                    if(jsonUserLoginSuccess.id == checkUser.userId){
                        checkUser.productBuy.splice(index,1);
                    }
                }
            }
            localStorage.setItem('CART_USER', JSON.stringify(jsonCartUser));
        }
    }
}

// Call back function

autoLogin();
logout();
showProductHeaderCart();
deleteProduct();

// localStorage.removeItem('CART_USER');
// localStorage.removeItem('LINK_PRODUCT');
// localStorage.removeItem('INFORMATION_USER');
// localStorage.removeItem('USER_LOGIN_SUCCESS');
// localStorage.removeItem('INFORMATION_PRODUCT');