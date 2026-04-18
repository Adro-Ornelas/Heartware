import { Injectable, signal } from "@angular/core";
import { Product } from "../models/product.model";

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
    private productosSignal = signal<Product[]>([]);
    products = this.productosSignal.asReadonly();

    add(producto: Product) {
        this.productosSignal.update(lista => [...lista, producto]);
    }
    removeProduct(id: number) {
        this.productosSignal.update(lista => lista.filter(p => p.id !== id));
    }
    empty() {
        this.productosSignal.set([]);
    }

    total(): number {
        return this.productosSignal().reduce((suma, producto) => {
            // Convertimos explícitamente el precio a número.
            // Si por alguna razón viene undefined o null, el || 0 evita que explote.
            const precio = Number(producto.price) || 0;

            return suma + precio;
        }, 0);
    }
    // total(): number {
    //     // Usamos (p.price ?? 0) para que si es undefined, tome 0
    //     return this.productosSignal().reduce((acc, p) => acc + (p.price ?? 0), 0);
    // }
    exportXML() {
        const productos = this.productosSignal();

        let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<recibo>\n`;

        for (const p of productos) {
            xml += `<producto>\n`;
            xml += `<id>${p.id}</id>\n`;
            xml += `<nombre>${this.escapeXml(p.name ?? '0')}</nombre>\n`;
            xml += `<precio>${p.price}</precio>\n`;
            if (p.description) {
                xml += `<description>${this.escapeXml(p.description)}</description>\n`;
            }
            xml += `</producto>\n`;
        }
        xml += `<total>${this.total()}</total>\n`;
        xml += `</recibo>`;

        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Receipt.xml';
        a.click();

        URL.revokeObjectURL(url);
    }

    private escapeXml(value: string): string {
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&apos;')

    }

}