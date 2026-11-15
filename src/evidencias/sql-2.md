---
titulo: "SQL 2: Recuperar datos con la sentencia SELECT"
seccion: "sql"
orden: 2
fecha: "2026-11-15"
resumen: "Ejercicios de SELECT en Oracle SQL Developer (esquema HR): columnas, expresiones, NULL, alias, concatenación, DISTINCT y DESCRIBE, cada uno con su álgebra relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Retrieving Data Using the SQL SELECT Statement (SQL_C2)
**Herramienta:** Oracle SQL Developer, esquema HR

En esta práctica hice consultas básicas con `SELECT` sobre el esquema HR y escribí cada una también en álgebra relacional.

## Notación de álgebra relacional

| Símbolo | Operador | En SQL |
|---|---|---|
| `σ` | Selección (filtra filas) | `WHERE` |
| `π` | Proyección (elige columnas) | lista del `SELECT` |
| `ρ` | Renombrado | alias (`AS`) |
| `δ` | Eliminación de duplicados | `DISTINCT` |

Una nota: en el álgebra clásica una relación es un conjunto y no tiene filas repetidas, pero SQL sí las devuelve si no se usa `DISTINCT`. Por eso el ejercicio 2.11 se plantea con álgebra de multiconjuntos.

---

## Ejercicios

### Ejercicio 2.1

**Enunciado:** mostrar toda la información de la tabla `departments`.

```sql
SELECT *
FROM   departments;
```

**Resultado en SQL Developer**

>![Resultado ejercicio 2.1](/img/sql/sql2-01.png)

**Álgebra relacional**

```
departments
```

---

### Ejercicio 2.2

**Enunciado:** mostrar solo el id del departamento y el id de la ubicación de la tabla `departments`.

```sql
SELECT department_id, location_id
FROM   departments;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.2](/img/sql/sql2-02.png)

**Álgebra relacional**

```
π department_id, location_id (departments)
```

---

### Ejercicio 2.3

**Enunciado:** consultar la tabla `dual` y obtener la fecha actual del sistema.

```sql
SELECT *
FROM   dual;

SELECT SYSDATE
FROM   dual;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.3](/img/sql/sql2-03.png)

**Álgebra relacional**

```
dual
π SYSDATE (dual)
```

`dual` tiene una sola columna (`DUMMY`) y una sola fila, por eso sirve para evaluar cosas como `SYSDATE`.

---

### Ejercicio 2.4

**Enunciado:** mostrar el apellido y el salario de cada empleado, junto con el salario aumentado en 300.

```sql
SELECT last_name, salary, salary + 300
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.4](/img/sql/sql2-04.png)

**Álgebra relacional**

```
π last_name, salary, salary + 300 (employees)
```

---

### Ejercicio 2.5

**Enunciado:** mostrar apellido, salario y el resultado de `12*salary + 100` y de `12*(salary + 100)`, para ver cómo cambia el resultado con los paréntesis.

```sql
SELECT last_name, salary, 12*salary + 100
FROM   employees;

SELECT last_name, salary, 12*(salary + 100)
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.5](/img/sql/sql2-051.png)
> ![Resultado ejercicio 2.5](/img/sql/sql2-052.png)

**Álgebra relacional**

```
π last_name, salary, 12*salary + 100   (employees)
π last_name, salary, 12*(salary + 100) (employees)
```

---

### Ejercicio 2.6

**Enunciado:** mostrar apellido, cargo, salario y porcentaje de comisión de los empleados, y luego calcular el ingreso anual por comisión (`12*salary*commission_pct`).

```sql
SELECT last_name, job_id, salary, commission_pct
FROM   employees;

SELECT last_name, 12*salary*commission_pct
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.6](/img/sql/sql2-061.png)
> ![Resultado ejercicio 2.6](/img/sql/sql2-062.png)

**Álgebra relacional**

```
π last_name, job_id, salary, commission_pct (employees)
π last_name, 12*salary*commission_pct (employees)
```

Los empleados sin comisión salen con `NULL` en la segunda consulta, porque cualquier operación aritmética con `NULL` da `NULL`.

---

### Ejercicio 2.7

**Enunciado:** mostrar el apellido como `name` y la comisión como `comm`; después el apellido como `Name` y el salario anual como `Annual Salary`.

```sql
SELECT last_name AS name, commission_pct comm
FROM   employees;

SELECT last_name "Name", salary*12 "Annual Salary"
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.7](/img/sql/sql2-071.png)
> ![Resultado ejercicio 2.7](/img/sql/sql2-072.png)

**Álgebra relacional**

```
ρ name, comm (π last_name, commission_pct (employees))
ρ Name, Annual_Salary (π last_name, salary*12 (employees))
```

Cuando el alias tiene espacios o mayúsculas hay que ponerlo entre comillas dobles.

---

### Ejercicio 2.8

**Enunciado:** mostrar el apellido y el cargo de cada empleado unidos en una sola columna llamada `Employees`.

```sql
SELECT last_name||job_id AS "Employees"
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.8](/img/sql/sql2-08.png)

**Álgebra relacional**

```
ρ Employees (π last_name || job_id (employees))
```

---

### Ejercicio 2.9

**Enunciado:** mostrar una frase por empleado con el formato "apellido is a cargo", en una columna llamada `Employee Details`.

```sql
SELECT last_name || ' is a ' || job_id AS "Employee Details"
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.9](/img/sql/sql2-09.png)

**Álgebra relacional**

```
ρ Employee_Details (π last_name || ' is a ' || job_id (employees))
```

---

### Ejercicio 2.10

**Enunciado:** mostrar el nombre de cada departamento junto con el id de su gerente, en una columna llamada `Department and Manager`, usando el operador `q` para escribir el apóstrofe sin problemas.

```sql
SELECT department_name ||
       q'[ Department´s Manager Id: ]'
       || manager_id
       AS "Department and Manager"
FROM   departments;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.10](/img/sql/sql2-10.png)

**Álgebra relacional**

```
ρ Department_and_Manager
  (π department_name || ' Department''s Manager Id: ' || manager_id (departments))
```

Si `manager_id` es `NULL` (como en *Contracting*), la concatenación lo toma como cadena vacía y el texto queda sin número al final.

---

### Ejercicio 2.11

**Enunciado:** mostrar el id de departamento de todos los empleados, primero con repetidos y luego sin repetidos.

```sql
SELECT department_id
FROM   employees;

SELECT DISTINCT department_id
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.11](/img/sql/sql2-111.png)
> ![Resultado ejercicio 2.11](/img/sql/sql2-112.png)

**Álgebra relacional**

```
π department_id (employees)          -- sin DISTINCT (multiconjuntos)
δ ( π department_id (employees) )    -- con DISTINCT
```

En el álgebra clásica `π` ya quita los duplicados. Para representar lo que hace SQL por defecto uso álgebra de multiconjuntos, donde `π` deja los repetidos y `δ` equivale a `DISTINCT`.

---

### Ejercicio 2.12

**Enunciado:** ver la estructura de la tabla `departments` (columnas, tipos de dato y si aceptan nulos).

```sql
DESCRIBE departments
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 2.12](/img/sql/sql2-12.png)

**Álgebra relacional**

```
No aplica: DESCRIBE consulta metadatos, no tuplas.
Esquema: departments(department_id, department_name, manager_id, location_id)
```

`DESCRIBE` es un comando de SQL Developer y SQL\*Plus, no una sentencia SQL.

---

## Resumen

Con estos ejercicios practiqué traer todas las columnas o solo algunas, hacer cálculos, usar alias, concatenar texto, quitar duplicados con `DISTINCT` y ver la estructura de una tabla con `DESCRIBE`. También vi que cualquier cálculo con `NULL` da `NULL`.

*Fuente: presentación SQL_C2, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1.*