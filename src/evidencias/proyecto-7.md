---
titulo: "Proyecto 7: Selección del sistema operativo y la máquina virtual"
seccion: "proyecto"
orden: 7
fecha: "2026-11-05"
resumen: "Comparación de cuatro distribuciones Linux para alojar la base de datos, elección de Oracle Linux 9 y de VirtualBox, y configuración base de la VM."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 2, Infraestructura  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

[Descargar el análisis completo (PDF)](/docs/Analisis_Seleccion_SO_BD1.pdf)

## ¿Qué hice?

Elegimos el sistema operativo de la máquina virtual donde vive la base de datos. Partimos de las restricciones del proyecto: solo Linux o Unix, base de datos distinta de SQL Server (Oracle, para seguir con SQL Developer y los tipos NUMBER y VARCHAR2), computadores de 16 GB de RAM y sin presupuesto para licencias.

## Alternativas evaluadas

| Categoría | Oracle Linux 9 | RHEL 9 | Rocky Linux 9 | Ubuntu Server 24.04 |
|---|---|---|---|---|
| Soporte de Oracle AI Database Free | Oficial | Oficial | No figura | Solo el cliente, no el servidor |
| Preparación para la base de datos | Un solo comando | Manual | Sin pasos oficiales | Sin pasos equivalentes |
| Actualizaciones | Hasta junio de 2032 (ampliado a 2035) | Hasta mayo de 2032 | Igual que RHEL | Hasta mayo de 2029 |
| Costo | Gratis | Requiere suscripción | Gratis | Gratis |
| Familiaridad del equipo | Menor (familia Red Hat) | Menor | Menor | La más conocida |

## Decisión

**Oracle Linux 9** (instalación Server, sin interfaz gráfica; versión exacta 9.8). Es el sistema oficial de Oracle AI Database Free, no tiene costo, tiene guía oficial y es la referencia que menciona el enunciado. Elegimos la 9 y no la 10 porque está más probada y porque la familia Red Hat 10 exige procesadores más modernos, y la demostración podría hacerse en un equipo distinto.

**Virtualización:** Oracle VirtualBox 7.2, porque es gratuito y permite exportar la VM completa en un archivo OVA para abrirla en otro computador, incluso con VMware. La alternativa Hyper-V no viene en Windows Home y no abre OVA directamente.

## Configuración base de la VM

| Parámetro | Valor |
|---|---|
| Nombre | BD1-OracleLinux |
| Sistema invitado | Oracle Linux 9, 64 bits, Server |
| Memoria | 4096 MB (Oracle Free usa hasta 2 GB) |
| Procesadores | 2 (el máximo que usa Oracle Free) |
| Disco | 40 GB, VDI dinámico |
| Red | NAT con reenvío de puertos: 1521 (Oracle) y 2222 hacia 22 (SSH) |

## ¿Qué aprendí?

- A comparar alternativas por necesidades del proyecto, sin puntajes, y a justificar por qué pesan más la compatibilidad y la instalación.
- Qué es un hipervisor y por qué el reenvío de puertos permite conectarse por `localhost` sin depender de la red.