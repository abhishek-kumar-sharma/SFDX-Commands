/* eslint no-console:["error",{allow:["warn","error","log"]}] */
import { LightningElement, track } from 'lwc';

export default class Login_To_Password_Manager extends LightningElement {
    /**
     * Created by Abhishek
     */
    @track user = {
        'username': undefined,
        'password': undefined
    };

    /**
     * Handle login button 
     */
    handleLogin() {
        console.log('user data ==>', this.user.username);
        console.log('user data ==>', this.user.password);
    }

    /**
     * Handler method to set the input value , name must be same as UI
     */
    setInputValue(event) {
        if (event.target.value !== null && event.target.value !== undefined && event.target.value.trim() !== '') {
            this.user[event.target.name] = event.target.value;
        }

    }

}