"use strict";
// Выход из личного кабинета
const exit = new LogoutButton();
exit.action = () => ApiConnector.logout(response => {
    if(response.success) location.reload();
});
// Получение информации о пользователе
ApiConnector.current(response => ProfileWidget.showProfile(response.data));
// Получение текущих курсов валюты
function getStocks() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            newBoard.clearTable();
            newBoard.fillTable(response.data);
        }
    });
}
const newBoard = new RatesBoard();
getStocks();
const intervalGetStocks = setInterval(getStocks, 60 * 1000);
// Операции с деньгами
const newMoney = new MoneyManager();
// Пополнение баланса
newMoney.addMoneyCallback = addMoneyData => {
    ApiConnector.addMoney(addMoneyData, response => {
        if(response.success) {
            newMoney.setMessage(false, `Вы успешно пополнили баланс на ${addMoneyData.amount} ${addMoneyData.currency}`);
            ProfileWidget.showProfile(response.data);
        }
        else {
            newMoney.setMessage(true, response.data);
        }
    });
}
// Конвертирование валюты
newMoney.conversionMoneyCallback = convertMoneyData => {
    ApiConnector.convertMoney(convertMoneyData, response => {
        if(response.success) {
            newMoney.setMessage(false, `Вы успешно перевели ${convertMoneyData.fromAmount} ${convertMoneyData.fromCurrency} в ${convertMoneyData.targetCurrency}`);
            ProfileWidget.showProfile(response.data);
        }
        else {
            newMoney.setMessage(true, response.data);
        }
    });
}
// Перевод валюты
newMoney.sendMoneyCallback = sendMoneyData => {
    ApiConnector.transferMoney(sendMoneyData, response => {
        if(response.success) {
            newMoney.setMessage(false, `Успешно проведен перевод ${sendMoneyData.amount} ${sendMoneyData.currency}`);
            ProfileWidget.showProfile(response.data);
        }
        else {
            newMoney.setMessage(true, response.data);
        }
    });
}
// Работа с избранным
const newFavoritesWidgets = new FavoritesWidget();
//Начальный список избранного 
ApiConnector.getFavorites((response) => {
    if (response.success) {      
        newFavoritesWidgets.clearTable();
        newFavoritesWidgets.fillTable(response.data);
        newMoney.updateUsersList(response.data);
    }
});
//Добавлениe пользователя в список избранных
newFavoritesWidgets.addUserCallback = () => {
    const addedUser = newFavoritesWidgets.getData();
    ApiConnector.addUserToFavorites(addedUser, response => {
        if(response.success) {
            newFavoritesWidgets.setMessage(false, `Пользователь ${addedUser.name} с id = ${addedUser.id} добавлен в избранное`);
            newFavoritesWidgets.clearTable();
            newFavoritesWidgets.fillTable(addedUser.data);
            newMoney.updateUsersList(addedUser.data);
        }
        else {
            newFavoritesWidgets.setMessage(true, response.data);
        }
    });
};
//Удаление пользователя из избранного
newFavoritesWidgets.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, response => {
        if(response.success) {
            newFavoritesWidgets.setMessage(false, `Пользователь c ID = ${id} удален из избранного`);
            newFavoritesWidgets.clearTable();
            newFavoritesWidgets.fillTable(response.data);
            newMoney.updateUsersList(response.data);
        }
        else {
            newFavoritesWidgets.setMessage(true, response.data);
        }
    });
};