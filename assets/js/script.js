const rememberButton = document.getElementById("header-remember-button");
const forgetButton = document.getElementById("header-forget-button");

const buttonElem = document.querySelector(".comments__button");
const textareaElem = document.querySelector("#message-input-id");
let msgItems = document.querySelector(".comments__messages-items");

let errorsElem = document.querySelector(".header__errors");

let nameElem = document.querySelector(".header__name-box");
let authBlockElem = document.querySelector(".header__auth-box");
let userpicElem = document.getElementById("userpic");
// блок с именем
let usernameElem = document.querySelector(".header__username-block");

// скрыть блок с ошибками
hideBlock(errorsElem);

// "name" - ключ для хранения имени, "userpic" - для хранения адреса картинки
const nameKey = "name";
const picAddrKey = "userpic";
const lastMsgId = "lastMsgId";
const msgId = "idmsg";

const defaultPic = "https://img.freepik.com/free-vector/vector-realistic-white-baseball-cap-side-view-isolated-background_1284-45495.jpg";

// запросим имя и адрес картинки из хранилища
let username = localStorage.getItem(nameKey);
let userpic = localStorage.getItem(picAddrKey);
console.log("username " + username);
console.log("userpic " + userpic);

if ( username && userpic ) {
    // показать имя и аватарку
    showUserInfo(username, userpic );
    // скрыть поля для ввода имени, адреса картинки и кнопку
    hideBlock(authBlockElem);
} else {
    hideBlock(nameElem);
}


// скрыть блок с сообщениями
hideBlock(msgItems);

// загрузить комменты из хранилища
loadComments();

// сюда собираем ошибки
let errors = [];

// что делается при нажатии на кнопку "Remember me!" в шапке
rememberButton.addEventListener( "click", (event) => {
    //очистить ошибки и скрыть блок с ошибками
    removeErrors();
    hideBlock(errorsElem);
    // проверка корректности заполнения имени и url картинки
    checkAuthErrors();
    
    if ( !errors.length ) {
        // если нет ошибок
        // записать в хранилище имя и адрес картинки
        let userNameInput = document.getElementById("header-username"); 
        localStorage.setItem(nameKey, userNameInput.value.trim());
        let userImageInput = document.getElementById("header-image-link"); 
        localStorage.setItem(picAddrKey, userImageInput.value.trim());
        // сохранить имя и картинку
        showUserInfo(localStorage.getItem(nameKey), localStorage.getItem(picAddrKey) );
        // скрыть форму для ввода имени и адреса картинки
        hideBlock(authBlockElem);
        // отобразить блок с именем и новую картинку
        showBlock(nameElem);
    }
});

// что происходит при нажатии на "Forget me!" в шапке
forgetButton.addEventListener( "click", (event) => {
    // удалить ключи "name" & "userpic" из локального хранилища
    localStorage.removeItem(nameKey);
    localStorage.removeItem(picAddrKey);
    //скрыть блок с именем и картинкой
    hideBlock(nameElem);
    // показать блок с полями для ввода имени и url картинки + конпкой "Remember me!"
    showUserInfo("", defaultPic );
    showBlock(authBlockElem);
});

buttonElem.addEventListener("click", (event) => {
    let msgText = textareaElem.value;
    if ( msgText ) {
        let message = checkSpam(msgText);
        addMessage( msgItems, message );
        addMessageToStorage(message);
        textareaElem.value = "";   
        showComments();
    } 

});


function showUserInfo( user, pic ) {
    usernameElem.textContent = user;
    userpicElem.setAttribute( "src", pic );
}
function checkAuthErrors() {
    //получаем все инпуты
    let inputs = document.querySelectorAll("input");

    //перебираем их и на каждый вызываем функцию валидации
    for (let input of inputs) {
        checkValidity(input);
    }
    if ( errors.length ) {
        showBlock(errorsElem);
    }
    errorsElem.innerHTML = errors.join('<br>');
}

function checkValidity( input ) {
    let validity = input.validity;
    if ( validity.patternMismatch ) {
        errors.push(input.value + ' - неверный формат заполнения, допустимы только буквы, пробелы и тире'); 
    }
    if ( validity.valueMissing ) {
        errors.push('Не заполнено обязательное поле'); 
    }
    if ( validity.tooShort ) {
        errors.push(input.value + ' - слишком мало символов'); 
    }
    if ( validity.tooLong ) {
        errors.push(input.value + ' - слишком много символов'); 
    }
    if ( validity.typeMismatch ) {
        errors.push(input.value + ' - несоответствие типу'); 
    }
}

function removeErrors() {
    errors = [];
}

function loadComments() {
    // загрузить все хранилище
    let LS = localStorage;
    // узнать последний id сообщения
    let lastId = Number(getLastId());

    let ind = 0;
    // пройдем от 1 до последнего id и выведем все значения ключей idmsg****
    for ( let i = 1; i <= lastId; i++ ) {
        addMessage(msgItems, localStorage.getItem( msgId + String(i) ));
        ind++;
    } 
    if ( ind ) {
        showComments();
    }        

}

function hideBlock( elem ) {
    elem.style.display = "none";
}

function showBlock( elem ) {
    elem.style.display = "";
}

function showComments() {
    msgItems.style.display = "";
}

function hideComments() {
    msgItems.style.display = "none";
}

function addMessage( parentElem, msg ) {
    // parentElem - в какой элемент добавляем элемент-сообщение
    // msg - текст сообщения
    if (!msg) {
        return 0;
    }
    let div = document.createElement("div");
    // let message = checkSpam(msg);
    div.textContent = msg;
    div.setAttribute("class", "comments__messages-item");

    parentElem.appendChild(div);
}

function addMessageToStorage( msg ) {
    let id = incLastId();
    localStorage.setItem( msgId + id, msg);
}

function getLastId() {
    return localStorage.getItem(lastMsgId);
}

function setLastId( idVal ) {
    localStorage.setItem(lastMsgId, idVal );
}

function incLastId() {
    // получить последний id
    let lastId = Number(getLastId()) + 1;
    setLastId(lastId);
    return lastId;
}

function checkSpam (msg) {
    // замена viagra или xxx --> ***. Не заменяет подстроки, только слова, не чувствительна к регистру
    return msg.replace( /\b(viagra|XXX)\b/ig, "***");
}