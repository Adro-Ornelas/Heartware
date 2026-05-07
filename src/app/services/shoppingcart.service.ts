import { Injectable, signal } from "@angular/core";
import { Product } from "../models/product.model";

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
    private productosSignal = signal<Product[]>([]);
    products = this.productosSignal.asReadonly();


    updateQuantity(id: number, newQuantity: number) {
        this.productosSignal.update(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    }
    add(producto: Product) {
        this.productosSignal.update(lista => {
            const index = lista.findIndex(p => p.id === producto.id);

            if (index !== -1) {
                // ya existe → incrementa
                const updated = [...lista];
                updated[index] = {
                    ...updated[index],
                    quantity: (updated[index].quantity || 1) + 1
                };
                return updated;
            }

            return [...lista, { ...producto, quantity: 1 }];
        });
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
            const precio = Number(producto.price) * Number(producto.quantity) || 0;

            return suma + precio;
        }, 0);
    }

    exists(id: number): boolean {
        return this.productosSignal().some(p => p.id === id);
    }

    getQuantity(id: number): number {
        return this.productosSignal().find(p => p.id === id)?.quantity || 0;
    }

    increase(id: number) {
        this.updateQuantity(id, this.getQuantity(id) + 1);
    }

    decrease(id: number) {
        const current = this.getQuantity(id);
        if (current <= 1) {
            this.removeProduct(id);
        } else {
            this.updateQuantity(id, current - 1);
        }
    }
    
    exportXML() {
        const productos = this.productosSignal();
        
        // CFDI 4.0 requiere fecha en formato específico: YYYY-MM-DDThh:mm:ss
        const fechaActual = new Date().toISOString().substring(0, 19);

        // Cálculos matemáticos precisos para el SAT (Asumiendo que price NO tiene IVA)
        let subTotal = 0;
        let totalImpuestosTrasladados = 0;

        // 1. Construir los Conceptos primero para tener las sumas exactas
        let conceptosXml = `<cfdi:Conceptos>\n`;
        for (const p of productos) {
            const cantidad = p.quantity || 1;
            const valorUnitario = Number(p.price);
            const importe = cantidad * valorUnitario;
            const baseImpuesto = importe;
            const importeIva = baseImpuesto * 0.16; // IVA 16%

            subTotal += importe;
            totalImpuestosTrasladados += importeIva;

            conceptosXml += `    <cfdi:Concepto 
        ClaveProdServ="01010101" 
        NoIdentificacion="${p.id}" 
        Cantidad="${cantidad.toFixed(2)}" 
        ClaveUnidad="H87" 
        Unidad="Pieza" 
        Descripcion="${this.escapeXml(p.name)}" 
        ValorUnitario="${valorUnitario.toFixed(2)}" 
        Importe="${importe.toFixed(2)}" 
        ObjetoImp="02">
        <cfdi:Impuestos>
            <cfdi:Traslados>
                <cfdi:Traslado Base="${baseImpuesto.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${importeIva.toFixed(2)}"/>
            </cfdi:Traslados>
        </cfdi:Impuestos>
    </cfdi:Concepto>\n`;
        }
        conceptosXml += `  </cfdi:Conceptos>\n`;

        const totalCFDI = subTotal + totalImpuestosTrasladados;

        // 2. Construir el Comprobante (Raíz)
        // Nota: Faltan Sello, Certificado y NoCertificado. Esos te los da tu Backend/PAC.
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
    xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" 
    Version="4.0" 
    Fecha="${fechaActual}" 
    Sello="" 
    FormaPago="04" 
    NoCertificado="" 
    Certificado="" 
    SubTotal="${subTotal.toFixed(2)}" 
    Moneda="MXN" 
    Total="${totalCFDI.toFixed(2)}" 
    TipoDeComprobante="I" 
    Exportacion="01" 
    MetodoPago="PUE" 
    LugarExpedicion="44100">
`;

        // 3. Emisor (Tus datos como tienda)
        xml += `  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="HEARTWARE SA DE CV" RegimenFiscal="601"/>\n`;

        // 4. Receptor (Datos del cliente - Público en General por defecto)
        xml += `  <cfdi:Receptor Rfc="XAXX010101000" Nombre="PUBLICO EN GENERAL" DomicilioFiscalReceptor="44100" RegimenFiscalReceptor="616" UsoCFDI="S01"/>\n`;

        // 5. Insertar Conceptos
        xml += conceptosXml;

        // 6. Resumen de Impuestos Globales
        xml += `  <cfdi:Impuestos TotalImpuestosTrasladados="${totalImpuestosTrasladados.toFixed(2)}">
    <cfdi:Traslados>
        <cfdi:Traslado Base="${subTotal.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${totalImpuestosTrasladados.toFixed(2)}"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>\n`;

        // 7. Cierre
        xml += `</cfdi:Comprobante>`;

        // Exportar a Blob
        const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CFDI_40_Pendiente_Timbrado_${Date.now()}.xml`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    private escapeXml(value: string): string {
        if (!value) return '';
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&apos;');
    }

}