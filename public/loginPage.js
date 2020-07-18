"use strict";
const userForm = new UserForm();
userForm.loginFormCallback = data => {
    console.log(data);
    ApiConnector.login(data, response => {
        console.log(response);
        response.success ? location.reload() : userForm.setLoginErrorMessage(response.data);
    });
}
userForm.registerFormCallback = data => {
    console.log(data);
    ApiConnector.register(data, response => {
        console.log(response);
        response.success ? location.reload() : userForm.setRegisterErrorMessage(response.data);
    });
}
