/* eslint no-console:["error",{allow:["warn","error","log"]}] */
import { LightningElement, track } from 'lwc';

export default class Login_To_Password_Manager extends LightningElement {
    /**
     * Created by Abhishek
     */
    @track user = {
        'userId': undefined,
        'password': undefined
    };

    /**
     * 
     */
    handleLogin() {
        console.log('user data ==>', this.user);
    }

}