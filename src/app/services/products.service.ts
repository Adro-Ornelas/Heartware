import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    // Replace with the actual path to your XML file
    private xmlUrl = '/images/productos.xml';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<Product[]> {
        return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(map((xmlString) => this.parseXml(xmlString)));
    }

    private parseXml(xmlString: string): Product[] {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const productNodes = xmlDoc.getElementsByTagName('product');
        const productList: Product[] = [];

        // Si el XML está mal formado, normalmente aparece <parsererror>
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            return [];
        }

        for (let i = 0; i < productNodes.length; i++) {
            const node = productNodes[i];

            productList.push({
                id: parseInt(this.getValue(node, 'id')),
                name: this.getValue(node, 'name'),
                price: parseFloat(this.getValue(node, 'price')),
                image: this.getValue(node, 'image'),
                category: this.getValue(node, 'category'),
                quantity: parseInt(this.getValue(node, 'quantity'), 10),
                description: this.getValue(node, 'description'),
                inventoryStatus: this.getValue(node, 'inStock') // Mapping <inStock> to inventoryStatus
            });
        }

        return productList;
    }

    private getValue(parent: Element, tagName: string): string {
        const element = parent.getElementsByTagName(tagName)[0];
        return element ? element.textContent || '' : '';
    }
}
