---
titulo: "Proyecto 8: Selección del RDBMS"
seccion: "proyecto"
orden: 8
fecha: "2026-11-07"
resumen: "Comparación de Oracle, MySQL, PostgreSQL y MariaDB, y justificación de Oracle AI Database 26ai Free como motor de la Liga BetPlay."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 2, Infraestructura  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

[Descargar el análisis completo (PDF)](/docs/Analisis_Seleccion_RDBMS_BD1.pdf)

## ¿Qué hice?

Comparamos las cuatro opciones que permite el enunciado (cualquier RDBMS menos SQL Server) según lo que necesita el proyecto: funcionar en Oracle Linux 9, trabajar con SQL Developer y no tener costo.

## Comparación

| Categoría | Oracle AI Database 26ai Free | MySQL 8.4 LTS | PostgreSQL 18 | MariaDB 11.8 LTS |
|---|---|---|---|---|
| Oracle Linux 9 | Soporte oficial | Desde repositorios | Desde repositorios | Desde repositorios |
| Tipos NUMBER y VARCHAR2 | Nativos | Hay que adaptar | Hay que adaptar | Solo en modo de compatibilidad |
| SQL Developer | Funciona completo | Con funciones limitadas | Con funciones limitadas | Con funciones limitadas |
| Costo | Gratis | Gratis | Gratis | Gratis |
| Límites de la edición | 2 GB de RAM, 2 hilos, 12 GB de datos | Ninguno | Ninguno | Ninguno |
| Familiaridad | La usamos en clase | Poca | Poca | Poca |

## Decisión

**Oracle AI Database 26ai Free.** Funciona de forma completa con SQL Developer, está soportada en Oracle Linux, no tiene costo y sus límites alcanzan de sobra para las 22 tablas de la liga.

## Riesgos y cómo los manejamos

| Riesgo | Qué hacemos |
|---|---|
| Límites de recursos de la edición Free | El volumen de la liga está muy por debajo; queda documentado como limitación conocida |
| Sin soporte pago | Documentación pública de Oracle, guías de ORACLE-BASE y la comunidad |
| Pasos propios de la familia Red Hat | Seguir la guía oficial y anotar los comandos |

## ¿Qué aprendí?

- Que un RDBMS se elige por el contexto (herramientas, tipos de datos, entorno) y no solo por popularidad.
- Que conviene dejar documentados los límites de una edición gratuita antes de que se conviertan en un problema.