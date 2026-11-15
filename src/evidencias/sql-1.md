---
titulo: "SQL 1: Introducción a Oracle y montaje del entorno"
seccion: "sql"
orden: 1
fecha: "2026-11-15"
resumen: "Conceptos base del modelo relacional y de Oracle Database, el esquema HR del curso y cómo crear mi propia base de datos en Oracle SQL Developer para practicar."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Introducción al curso (presentación SQL_C1)
**Herramienta:** Oracle SQL Developer + Oracle Database

## Objetivos

- Definir qué es una base de datos relacional y cómo se relaciona con el álgebra relacional.
- Conocer la terminología del modelo relacional: tabla, fila, columna, llave primaria y llave foránea.
- Conocer las tablas del esquema **HR** (Human Resources) que se usa en todo el curso.
- Identificar las categorías de sentencias SQL y los entornos de desarrollo de Oracle.
- Montar mi propia base de datos HR en SQL Developer para hacer los ejercicios.

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
job_grades   (grade_level PK, lowest_sal, highest_sal)
```

Observaciones útiles:

- `employees.manager_id` es una **relación recursiva** (un empleado es jefe de otro empleado de la misma tabla).
- `departments.manager_id` apunta a `employees`, y `employees.department_id` apunta a `departments`: las dos tablas se referencian entre sí.
- `job_grades` no tiene llaves foráneas; se usa más adelante en el curso para uniones por rangos.

> 📷 **Aquí va tu captura:** diagrama de las tablas del esquema HR (en SQL Developer: clic derecho sobre la conexión HR → *Open Data Modeler* o el diagrama de la presentación).
>
> ![Esquema HR](/images/sql/sql1-esquema-hr.png)

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

## 7. Práctica: crear mi propia base de datos HR en SQL Developer

La base del profesor ya no estaba disponible, así que monté una propia en mi computador. Estos son los pasos.

### Paso 1. Tener un servidor Oracle local

Opción A (Windows 10/11 **Pro**): instalar **Oracle Database Free** desde la página oficial de Oracle (*oracle.com/database/free/get-started*). El instalador pide una contraseña; sirve para los usuarios `SYS`, `SYSTEM` y `PDBADMIN`. Anótala.

Opción B (Windows Home, Mac o Linux): usar Docker.

```bash
docker run -d --name oracle-free -p 1521:1521 -e ORACLE_PASSWORD=ClaveSegura123 gvenzl/oracle-free:23-slim
```

En ambos casos la base de datos queda en `localhost:1521`.

### Paso 2. Conectar SQL Developer como administrador

En SQL Developer: **Nueva conexión** (el `+` verde) con estos datos:

| Campo | Valor |
|---|---|
| Nombre | `admin_free` |
| Usuario | `SYSTEM` |
| Contraseña | la del instalador (o `ClaveSegura123` con Docker) |
| Nombre de host | `localhost` |
| Puerto | `1521` |
| **Nombre del servicio** | `FREEPDB1` |

Usa **Nombre del servicio** (no SID) y `FREEPDB1`. Si te conectas al servicio `FREE`, entras al contenedor raíz y aparece el error `ORA-65096` al crear usuarios.

> 📷 **Aquí va tu captura:** ventana de la nueva conexión con estos datos.
>
> ![Conexión SYSTEM](/images/sql/sql1-conexion-system.png)

### Paso 3. Crear el usuario HR

Con la conexión `admin_free`, abre una hoja de trabajo y ejecuta con **F5** (*Run Script*):

```sql
CREATE USER hr IDENTIFIED BY "Hr12345#"
  DEFAULT TABLESPACE users
  QUOTA UNLIMITED ON users;

GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW, CREATE SEQUENCE,
      CREATE SYNONYM, CREATE PROCEDURE, CREATE TRIGGER TO hr;
```

### Paso 4. Crear la conexión del usuario HR

Repite el Paso 2 con estos cambios: nombre `hr_local`, usuario `HR`, contraseña `Hr12345#`, mismo host, puerto y servicio `FREEPDB1`. A partir de aquí **todo se hace con esta conexión**.

### Paso 5. Crear las tablas y cargar los datos

Oracle publica los scripts del esquema HR en su repositorio oficial de ejemplos (*oracle-samples/db-sample-schemas*, etiqueta `v19.2`, carpeta `human_resources`). Se usan los dos archivos clásicos, que tienen los mismos datos de las presentaciones (King, Kochhar, Whalen, Zlotkey, Abel...):

- `hr_cre.sql`: crea las tablas, llaves, secuencias y la vista.
- `hr_popul.sql`: inserta los datos.

Enlaces directos:

- https://raw.githubusercontent.com/oracle-samples/db-sample-schemas/v19.2/human_resources/hr_cre.sql
- https://raw.githubusercontent.com/oracle-samples/db-sample-schemas/v19.2/human_resources/hr_popul.sql

Con la conexión `hr_local`:

1. Abre el enlace de `hr_cre.sql`, copia todo (Ctrl+A, Ctrl+C), pégalo en una hoja de trabajo de SQL Developer y ejecútalo con **F5**.
2. Haz lo mismo con `hr_popul.sql`.

Las versiones nuevas del esquema (archivos `hr_create.sql` y `hr_populate.sql` de la rama principal) usan **otros nombres de empleados** y los resultados no coincidirían con las diapositivas. Por eso se usa la etiqueta `v19.2`.

### Paso 6. Crear la tabla JOB_GRADES

La presentación usa `JOB_GRADES`, que no viene en los scripts de Oracle:

```sql
CREATE TABLE job_grades (
  grade_level  VARCHAR2(3) PRIMARY KEY,
  lowest_sal   NUMBER,
  highest_sal  NUMBER
);

INSERT INTO job_grades VALUES ('A', 1000, 2999);
INSERT INTO job_grades VALUES ('B', 3000, 5999);
INSERT INTO job_grades VALUES ('C', 6000, 9999);
INSERT INTO job_grades VALUES ('D', 10000, 14999);
INSERT INTO job_grades VALUES ('E', 15000, 24999);
INSERT INTO job_grades VALUES ('F', 25000, 40000);
COMMIT;
```

### Paso 7 (opcional). Dejar los datos igual que las diapositivas

Las diapositivas muestran una versión reducida: **20 empleados y 8 departamentos**. El script de Oracle trae 107 empleados y 27 departamentos, así que las consultas devuelven más filas. Para que mis resultados coincidan con las capturas de la presentación, recorté los datos:

```sql
-- 1. Historial laboral de empleados que se van a conservar
DELETE FROM job_history
 WHERE employee_id NOT IN (100,101,102,103,104,107,124,141,142,143,144,
                           149,174,176,178,200,201,202,205,206)
    OR department_id NOT IN (10,20,50,60,80,90,110,190);

-- 2. Jefes de los departamentos que se conservan (como en las diapositivas)
UPDATE departments SET manager_id = 124 WHERE department_id = 50;
UPDATE departments SET manager_id = 149 WHERE department_id = 80;

-- 3. Soltar el jefe de los departamentos que se van a borrar
UPDATE departments SET manager_id = NULL
 WHERE department_id NOT IN (10,20,50,60,80,90,110,190);

-- 4. Borrar empleados y departamentos sobrantes
DELETE FROM employees
 WHERE employee_id NOT IN (100,101,102,103,104,107,124,141,142,143,144,
                           149,174,176,178,200,201,202,205,206);

DELETE FROM departments
 WHERE department_id NOT IN (10,20,50,60,80,90,110,190);

COMMIT;
```

El orden importa por las llaves foráneas: primero se borra lo que depende de otras filas y al final lo referenciado. Si prefieres ver los 107 empleados, sáltate este paso.

### Paso 8. Verificar

```sql
SELECT 'employees' AS tabla, COUNT(*) AS filas FROM employees
UNION ALL SELECT 'departments', COUNT(*) FROM departments
UNION ALL SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL SELECT 'locations', COUNT(*) FROM locations
UNION ALL SELECT 'job_grades', COUNT(*) FROM job_grades;
```

Valores esperados: sin el Paso 7, 107 empleados y 27 departamentos; con el Paso 7, 20 empleados y 8 departamentos. En ambos casos `jobs` tiene 19, `locations` 23 y `job_grades` 6.

> 📷 **Aquí va tu captura:** árbol de la conexión `hr_local` con las tablas creadas y el resultado de la verificación.
>
> ![Verificación HR](/images/sql/sql1-verificacion.png)

### Álgebra relacional de la verificación

El conteo es una operación de agregación del álgebra extendida (`γ`, gamma):

```
γ COUNT(*) (employees)
```

---

## Resumen

- Una base de datos relacional es un conjunto de tablas (relaciones) controladas por un servidor; el modelo lo propuso Codd en 1970.
- Las filas se identifican con una llave primaria y las tablas se relacionan con llaves foráneas.
- SQL es el lenguaje estándar ANSI y se divide en DML, DDL, DCL y control de transacciones.
- Con Oracle Database Free, SQL Developer y los scripts del esquema HR se puede reproducir el entorno del curso en un computador propio.

*Fuente: presentación SQL_C1 Introduction, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1.*