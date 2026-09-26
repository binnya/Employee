import {Page, Locator} from '@playwright/test'

export class LoginPage
{
    readonly page:Page;
    readonly userName:Locator;
    readonly password:Locator;
    readonly signInButton:Locator;
    readonly agreeCheckBox:Locator;
    
    constructor(page:Page)
    {
        this.page = page;
        this.userName = page.getByLabel('Username');
        this.password = page.getByLabel('Password');
        this.signInButton = page.getByRole('button', {name:'Sign In'});
        this.agreeCheckBox=page.getByRole('checkbox', {name:' terms'});
    }
    async Login(username:string,password:string)
    {
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.agreeCheckBox.check();
        await this.signInButton.click();     
        

    }
}
