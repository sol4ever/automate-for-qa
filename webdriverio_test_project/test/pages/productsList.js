import { waitForElementToBeDisplayed } from '../utilities/helpers.waits.js'

class ProductsList {

    get addNewProductButton() {
        return $('[data-testid="add-new-button"]');
    }
    get searchInput() {
        return $('[data-testid="search-input"]');
    }
    get noDataMessage() {
        return $('[data-testid="no-data-message"]');
    }
    get noSearchResultsMessage() {
        return $('[data-testid="no-search-results-message"]');
    }
    get dataGrid() {
        return $('[data-testid="dataGrid"]');
    }
    get deleteConfirmationModal() {
        return $('[data-testid="deleteConfirmationModal"]');
    }
    getEditProductButton(productId) {
        return $(`[data-testid="edit-button${productId}"]`);
    }
    getDeleteProductButton(productId) {
        return $(`[data-testid="delete-button-${productId}"]`);
    }
    getEntityListItem(productId) {
        return $(`[data-testid="entityListItem-${productId}"]`);
    }
    getProductCategory(productId) {
        return $(`[data-testid="product-category-${productId}"]`);
    }
    getProductBrand(productId) {
        return $(`[data-testid="product-brand-${productId}"]`);
    }
    getProductPrice(productId) {
        return $(`[data-testid="product-price-${productId}"]`);
    }
    getProductInStock(productId) {
        return $(`[data-testid="product-inStock-${productId}"]`);
    }

    getProductPromoted(productId) {
        return $(`[data-testid="product-promoted-${productId}"]`);
    }

    async getEntityListItem(productName) {
        const productByAlt = $(`img[alt="${productName}"]`);
        
        if (await productByAlt.isDisplayed()) {
            return productByAlt;
        }
        const productByText = $(`.entityListItem*=${productName}`);
        return productByText;
    }

    async filterProductsByName(newProductName) {
        const searchInput = await this.searchInput;
        await searchInput.click();
        await searchInput.setValue(newProductName);

        const createdProduct = await this.getEntityListItem(newProductName);
        await waitForElementToBeDisplayed(
            createdProduct,
            5000,
            `Expected product ${newProductName} to appear in the filtered list, but it was not found.`
        );

        await expect(createdProduct).toBeDisplayed()
    }
}

export default new ProductsList();
