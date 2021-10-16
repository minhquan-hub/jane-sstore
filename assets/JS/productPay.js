
// showProductToPay
function showProductToPay() {
    if(!localStorage.getItem('CART_USER') == ''){
        var jsonCartUser = JSON.parse(localStorage.getItem('CART_USER'));
    }
    if(!localStorage.getItem('USER_LOGIN_SUCCESS') == ''){
        var jsonUserLoginSuccess = JSON.parse(localStorage.getItem('USER_LOGIN_SUCCESS'));
    }
    var PriceTotalList = []; 

    if(!localStorage.getItem('CART_USER') == ''){
        if(jsonCartUser.length <= 1){
            var userOne = jsonCartUser[0];
            if(jsonUserLoginSuccess.id === userOne.userId){
                if(userOne.productBuy.length == 1){
                    var productBuyOne = userOne.productBuy[0];
                    productPay(productBuyOne.productId,productBuyOne.amount);
                }else {
                    for(var checkProductUserOne of userOne.productBuy){
                        productPay(checkProductUserOne.productId,checkProductUserOne.amount);
                    }
                }
            }else {
                console.log('The user is empty');
            }
        }else {
            for(var checkUser of jsonCartUser){
                if(jsonUserLoginSuccess.id == checkUser.userId){
                    if(checkUser.productBuy.length == 1){
                        var productBuyOne = checkUser.productBuy[0];
                        productPay(productBuyOne.productId,productBuyOne.amount);
                    }else {
                        for(var checkProductUser of checkUser.productBuy){
                            productPay(checkProductUser.productId,checkProductUser.amount);
                        }
                    }
                }
            }
        }
    }else {
        console.log("This array is empty")
    }

    showPriceTotalLast();

    function moneyFormat(money){
        afterMoneyFormat = money.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        })
        return afterMoneyFormat.replace(/\s+/g, '');
    }

    function productInformation(productId) {
        var jsonInformationProduct = JSON.parse(localStorage.getItem('INFORMATION_PRODUCT'));
        for(var i=0; i < jsonInformationProduct.length; i++){
            if(jsonInformationProduct[i].id == productId){
                return jsonInformationProduct[i];
            }
        }
    }    

    function productPay(productId,amount) {
        var getElementProduct = productInformation(productId);
        var divPayProduct = document.createElement('div');
        var calPriceTotalItem = parseFloat(getElementProduct.price.slice(0,5))*parseFloat(amount);
        // console.log(calPriceTotalItem);
        if(getElementProduct.price.length > 8){
            calPriceTotalItem *= 1000000;
            PriceTotalList.push(calPriceTotalItem)
        }else {
            calPriceTotalItem *= 1000;
            PriceTotalList.push(calPriceTotalItem)
        }
        var divContent = '<div class="product-buy-information"><div class="information-product-name column-product-name"><img src="'+getElementProduct.img1+'" alt="" class="information-product__img"><span class="information-product-span">'+getElementProduct.name+'</span></div><span class="information-product-span column-product-small">'+getElementProduct.price+'</span><span class="information-product-span column-product-small">'+amount+'</span><span class="information-product-span column-product-end">'+moneyFormat(calPriceTotalItem)+'</span></div>';
        divPayProduct.innerHTML = divContent;
        var divProductList = document.querySelector('.js-row-title');
        divProductList.append(divPayProduct);
    }
    
    function showPriceTotalLast() {
        var priceTotalText1 = document.querySelector('.product-buy-total__price');
        var priceTotalText2 = document.querySelector('.js-inform-price');
        var priceTotalTextLast = document.querySelector('.inform-price--total');
        var totalPayNoShip = 0;
        var totalPayHaveShip = 0;

        for(var i = 0; i < PriceTotalList.length; i++){
            console.log(PriceTotalList[i]);
            totalPayNoShip += PriceTotalList[i];
        }
        totalPayHaveShip = totalPayNoShip + 20000;
        console.log(totalPayHaveShip);
        priceTotalText1.textContent = moneyFormat(totalPayNoShip);
        priceTotalText2.textContent = moneyFormat(totalPayNoShip);
        priceTotalTextLast.textContent = moneyFormat(totalPayHaveShip);

    }
}

function interfaceAfterPayment(){
    var btnOrderProduct = document.querySelector('.js-order-product');
    var gridShowPayent = document.querySelector('.js-grid-show-payment');
    var contentAfterPayment = document.querySelector('.content-after-payment');
    if(!localStorage.getItem('CART_USER') == ''){
        var jsonCartUser = JSON.parse(localStorage.getItem('CART_USER'));
    }
    if(!localStorage.getItem('USER_LOGIN_SUCCESS') == ''){
        var jsonUserLoginSuccess = JSON.parse(localStorage.getItem('USER_LOGIN_SUCCESS'));
    }

    btnOrderProduct.addEventListener('click', function() {
        gridShowPayent.setAttribute('style','display : none');
        contentAfterPayment.setAttribute('style', 'display : flex');
        deleteInformationAfterPayment();
    })

    function deleteInformationAfterPayment() {
            if(jsonCartUser.length <= 1){
                var userOne = jsonCartUser[0];
                if(jsonUserLoginSuccess.id === userOne.userId){
                    userOne.productBuy = [];
                    localStorage.setItem('CART_USER', JSON.stringify(jsonCartUser));
                }
            }else {
                for(var checkUser of jsonCartUser){
                    if(jsonUserLoginSuccess.id == checkUser.userId){
                        checkUser.productBuy = [];
                        localStorage.setItem('CART_USER', JSON.stringify(jsonCartUser));
                    }
                }
            }
        
    }
}

showProductToPay();
interfaceAfterPayment();