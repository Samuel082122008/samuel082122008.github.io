---
titulo: "SQL 1: Introducción a Oracle y al esquema HR"
seccion: "sql"
orden: 1
fecha: "2026-11-15"
resumen: "Conceptos base del modelo relacional y de Oracle Database, terminología, el esquema HR del curso y las categorías de sentencias SQL."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Introducción al curso (presentación SQL_C1)
**Herramienta:** Oracle SQL Developer + Oracle Database

## Objetivos

- Definir qué es una base de datos relacional y cómo se relaciona con el álgebra relacional.
- Conocer la terminología del modelo relacional: tabla, fila, columna, llave primaria y llave foránea.
- Conocer las tablas del esquema **HR** (Human Resources) que se usa en todo el curso.
- Identificar las categorías de sentencias SQL y los entornos de desarrollo de Oracle.

---

## 1. Oracle Database y los sistemas relacionales

**Oracle Database** es un sistema gestor de bases de datos (SGBD) de Oracle. En el curso se trabaja con la versión 19c de referencia, y en la práctica se puede usar cualquier versión reciente, porque el SQL básico es el mismo.

Oracle es un **RDBMS** (sistema de gestión de bases de datos relacionales) y además un **ORDBMS** (objeto-relacional), es decir:

- Implementa el modelo relacional y el modelo objeto-relacional.
- Permite tipos de datos y objetos definidos por el usuario.
- Es totalmente compatible con el modelo relacional.
- Soporta multimedia y objetos grandes (LOB).
- Ofrece funciones de servidor de alta calidad: disponibilidad, rendimiento, seguridad, administrabilidad.

## 2. Modelo relacional

El modelo relacional lo propuso **Dr. E. F. Codd en 1970** y es la base de los RDBMS. Consta de:

- Una **colección de objetos o relaciones** (las tablas).
- Un **conjunto de operadores** que actúan sobre las relaciones (el álgebra relacional: selección, proyección, unión, producto, etc.).
- **Integridad de datos** para garantizar exactitud y consistencia (llaves primarias, foráneas, restricciones).

> **Base de datos relacional:** colección de relaciones o tablas bidimensionales controladas por el servidor de Oracle.

Cada consulta SQL tiene su equivalente en álgebra relacional, y por eso en las siguientes páginas cada ejercicio incluye su expresión algebraica.

## 3. Modelos de datos y modelo Entidad-Relación

Antes de crear tablas se modela el sistema: del **modelo del sistema en la mente del cliente** se pasa a un **modelo entidad-relación** y de ahí a un **modelo de tablas** dentro del servidor Oracle.

Convenciones del modelado E-R que se ven en la presentación:

| Elemento | Convención |
|---|---|
| Entidad | Nombre único en singular, en mayúsculas, caja de esquinas suaves; sinónimo entre paréntesis |
| Atributo | Nombre en singular y minúsculas; obligatorio con `*`, opcional con `o` |
| Identificador único (UID) | Primario marcado con `#`, secundario con `(#)` |

Ejemplo de la presentación: una `EMPLOYEE` *se asigna a* un `DEPARTMENT`, y un `DEPARTMENT` *está compuesto por* empleados.

## 4. Terminología de bases de datos relacionales

| Término relacional | Equivale a | Definición |
|---|---|---|
| Relación | Tabla | Conjunto de filas y columnas con un nombre (`EMPLOYEES`) |
| Tupla | Fila (registro) | Una fila de la tabla: un empleado concreto |
| Atributo | Columna | Una propiedad de la entidad: `salary`, `last_name` |
| Llave primaria (PK) | Columna(s) que identifican cada fila de forma única | `employee_id` en `EMPLOYEES` |
| Llave foránea (FK) | Columna que referencia la PK de otra tabla | `department_id` en `EMPLOYEES` apunta a `DEPARTMENTS` |
| Campo | Intersección de fila y columna | El valor de una celda |
| NULL | Campo sin valor | Valor no disponible, no asignado, desconocido o no aplicable; **no es cero ni un espacio en blanco** |

Las llaves foráneas permiten **relacionar lógicamente varias tablas**: cada fila se identifica con su PK y se enlaza con otra tabla mediante una FK.

## 5. Tablas usadas en el curso: esquema HR

Todos los ejercicios se hacen sobre el esquema **HR (Human Resources)**. Su esquema relacional es:

```
regions      (region_id PK, region_name)
countries    (country_id PK, country_name, region_id FK -> regions)
locations    (location_id PK, street_address, postal_code, city, state_province,
              country_id FK -> countries)
departments  (department_id PK, department_name,
              manager_id FK -> employees, location_id FK -> locations)
jobs         (job_id PK, job_title, min_salary, max_salary)
employees    (employee_id PK, first_name, last_name, email, phone_number, hire_date,
              job_id FK -> jobs, salary, commission_pct,
              manager_id FK -> employees, department_id FK -> departments)
job_history  (employee_id FK -> employees, start_date PK, end_date,
              job_id FK -> jobs, department_id FK -> departments)
```

Observaciones útiles:

- `employees.manager_id` es una **relación recursiva** (un empleado es jefe de otro empleado de la misma tabla).
- `departments.manager_id` apunta a `employees`, y `employees.department_id` apunta a `departments`: las dos tablas se referencian entre sí.


## 6. SQL y entornos de desarrollo

**SQL** (Structured Query Language) es:

- El **lenguaje estándar ANSI** para operar bases de datos relacionales.
- Eficiente y fácil de aprender y usar.
- Funcionalmente completo: permite definir, consultar y manipular datos.

Categorías de sentencias SQL usadas en el curso:

| Categoría | Sentencias | Para qué sirve |
|---|---|---|
| **DML** (manipulación de datos) | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE` | Consultar y modificar datos |
| **DDL** (definición de datos) | `CREATE`, `ALTER`, `DROP`, `RENAME`, `TRUNCATE`, `COMMENT` | Crear y cambiar estructuras |
| **DCL** (control de datos) | `GRANT`, `REVOKE` | Permisos de acceso |
| **Control de transacciones** | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | Confirmar o deshacer cambios |

Entornos de desarrollo para SQL en Oracle:

- **Oracle SQL Developer:** la herramienta principal del curso (interfaz gráfica).
- **SQL\*Plus:** cliente de línea de comandos.

---

## Resumen

- Una base de datos relacional es un conjunto de tablas (relaciones) controladas por un servidor; el modelo lo propuso Codd en 1970.
- Las filas se identifican con una llave primaria y las tablas se relacionan con llaves foráneas.
- SQL es el lenguaje estándar ANSI y se divide en DML, DDL, DCL y control de transacciones.
- Los ejercicios de las siguientes páginas se hacen sobre el esquema HR en Oracle SQL Developer.

*Fuente: presentación SQL_C1 Introduction, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1.*