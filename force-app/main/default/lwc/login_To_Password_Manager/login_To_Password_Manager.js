/* eslint no-console:["error",{allow:["warn","error","log"]}] */
import { LightningElement, track } from 'lwc';

export default class Login_To_Password_Manager extends LightningElement {
    /**
     * Created by Abhishek
     */
    @track user = {
        'userId': 123,
        'password': 456
    };

    /**
     * Handle login button 
     */
    handleLogin() {
        console.log('user data ==>', this.user.userId);
        console.log('user data ==>', this.user.password);
    }

}