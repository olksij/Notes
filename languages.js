EnLanguage = {
    "notes":"Notes",
    "create":"Create",
    "settings":"Settings",
    "colors":"Colors",
    "settings-colors-description":"Change theme, adjust contrast",
    "layot":"Layot",
    "settings-layot-description":"Change position of elements, rounding, and other things",
    "behivator":"Behivator",
    "settings-behivator-description":"Customize app's actions",
    "account":"Account",
    "settings-account-description":"Change account settings",
    "feedback":"Feedback",
    "settings-feedback-description":"Write a feedback, suggest a suggestion, report a bug",
    "theme":"Theme",
    "contrast":"Contrast",
    "search":"Search",
    "title":"Title",
    "description":"Description",
    "all-notes":"All Notes",
    "add-label":"Add label",
    "syncing":"Syncing..",
    "u-re-offline":"You are offline",
    "create-new":"Create New",
}

UaLanguage = {
    "notes":"Нотатки",
    "create":"Створити",
    "settings":"Налаштування",
    "colors":"Кольори",
    "settings-colors-description":"Змінити тему, відрегулюватт контрасність",
    "layot":"Макет",
    "settings-layot-description":"Змінити позиції елементів, завкруглення, та інше",
    "behivator":"Поведінка",
    "settings-behivator-description":"Змінити поведінку додатка",
    "account":"Акаунт",
    "settings-account-description":"Змінити налаштування додатка",
    "feedback":"Відгук",
    "settings-feedback-description":"Напишіть відгук, запропонувати доробки, повідомити про неполадки",
    "theme":"Теми",
    "contrast":"Контраст",
    "search":"Пошук",
    "title":"Заголовок",
    "description":"Опис",
    "all-notes":"Всі нотатки",
    "add-label":"Додати бірку",
    "syncing":"Синхронізація...",
    "u-re-offline":"Автономний режим",
    "create-new":"Створити",
}

function Translate(){
    var LanguageObj;
    if (userSettings.language == 'ua') LanguageObj = UaLanguage;
    if (!LanguageObj) LanguageObj = EnLanguage, userSettings.language = 'en';
    pObj=document.getElementsByTagName("p");
    for(var i =0; i < pObj.length; i++){
        if(pObj[i].getAttribute('data-str') != null) 
        pObj[i].innerHTML = LanguageObj[pObj[i].getAttribute('data-str')];
    }
    inputObj=document.getElementsByTagName("input");
    for(var i =0; i < inputObj.length; i++){
        if(inputObj[i].getAttribute('data-str') != null) 
        inputObj[i].setAttribute("placeholder",LanguageObj[inputObj[i].getAttribute('data-str')]);
    }
    textareaObj=document.getElementsByTagName("textarea");
    for(var i =0; i < textareaObj.length; i++){
        if(textareaObj[i].getAttribute('data-str') != null) 
        textareaObj[i].setAttribute("placeholder",LanguageObj[textareaObj[i].getAttribute('data-str')]);
    }
}