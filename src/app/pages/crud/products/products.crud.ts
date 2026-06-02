import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product } from '@/app/models/product.model';
import { ProductService } from '@/app/services/products.service';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        FileUpload
    ],
    templateUrl: './product.crud.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CrudProducts implements OnInit {
    productDialog: boolean = false;
    products = signal<Product[]>([]);
    product: Partial<Product> = {}; // Cambiado a Partial para evitar problemas de tipos al crear nuevos productos
    selectedProducts!: Product[] | null;
    submitted: boolean = false;
    statuses!: any[];
    cols!: Column[];
    exportColumns!: ExportColumn[];

    @ViewChild('dt') dt!: Table;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}


    exportCSV() {
        this.dt.exportCSV();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que deseas eliminar los productos seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    findIndexById(id: number): number {
        return this.products().findIndex((p) => p.id === id);
    }

    createId(): number {
        // Genera un ID numérico único basado en timestamp para coincidir con id: number
        return Math.floor(Math.random() * 1000) + Date.now();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.productService.getProducts().subscribe({
            next: (data) => this.products.set(data),
            error: () => this.showToast('error', 'Error', 'No se pudieron cargar los productos')
        });

        this.statuses = [
            { label: 'Con Stock', value: 'INSTOCK' },
            { label: 'Poco Stock', value: 'LOWSTOCK' },
            { label: 'Sin Stock', value: 'OUTOFSTOCK' }
        ];
    }

    // Captura la respuesta del backend tras subir el archivo con éxito
    onImageUpload(event: any) {
        // El servidor Express devuelve { filename: "1718293...jpg" }
        const response = JSON.parse(event.xhr.response);
        this.product.image = response.filename; 
        
        this.showToast('info', 'Imagen Subida', 'El archivo se procesó correctamente');
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            let _products = [...this.products()];

            if (this.product.id) {
                this.productService.updateProduct(this.product as Product).subscribe({
                    next: (updatedProduct) => {
                        const index = _products.findIndex(p => p.id === updatedProduct.id);
                        if (index !== -1) {
                            _products[index] = updatedProduct;
                            this.products.set(_products);
                        }
                        this.showToast('success', 'Éxito', 'Producto Actualizado');
                    },
                    error: () => this.showToast('error', 'Error', 'No se pudo actualizar')
                });
            } else {
                // Si no subió imagen, asignamos una por defecto
                this.product.image = this.product.image || 'product-placeholder.svg';

                this.productService.createProduct(this.product as Product).subscribe({
                    next: (newProduct) => {
                        this.products.set([..._products, newProduct]);
                        this.showToast('success', 'Éxito', 'Producto Creado');
                    },
                    error: () => this.showToast('error', 'Error', 'No se pudo crear')
                });
            }

            this.productDialog = false;
            this.product = {};
        }
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar ${product.name}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.productService.deleteProduct(product.id).subscribe({
                    next: () => {
                        this.products.set(this.products().filter((val) => val.id !== product.id));
                        this.product = {};
                        this.showToast('success', 'Completado', 'Producto Eliminado');
                    },
                    error: () => this.showToast('error', 'Error', 'No se pudo eliminar')
                });
            }
        });
    }

    private showToast(severity: string, summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail, life: 3000 });
    }
}