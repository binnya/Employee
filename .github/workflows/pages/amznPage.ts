import {Page, Locator} from '@playwright/test'
export class AmznPage
{
    readonly page:Page;
    readonly searchBox:Locator;
    readonly searchButton:Locator;
    constructor(page:Page)
    {
        this.page = page;
        this.searchBox = page.getByRole('combobox', {name:'Search'});
        this.searchButton = page.getByRole('button', {name:'Go'});
    }
    async searchProduct(productName:string)
    {
        await this.searchBox.fill(productName);
        await this.searchButton.click();
    }
    async getProductTitle():Promise<string>
    {
        return await this.page.title();
    }
}