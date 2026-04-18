#!/bin/bash

# Detener procesos de fondo al presionar Ctrl+C
trap 'kill $(jobs -p) 2>/dev/null' EXIT

# Función para iniciar servicios solo si están inactivos
start_if_not_running() {
    if ! systemctl is-active --quiet "$1"; then
        echo "Iniciando $1..."
        sudo systemctl start "$1"
    else
        echo "$1 ya está en ejecución."
    fi
}

# 1. Verificar servicios de sistema
start_if_not_running httpd
start_if_not_running mariadb

# 2. Iniciar Backend
cd backend
npm start &
cd ..

# 3. Iniciar Frontend
ng serve &

# Esperar a que los procesos terminen
wait
