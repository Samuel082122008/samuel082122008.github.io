---
titulo: "SQL 7: Datos de varias tablas con JOIN"
seccion: "sql"
orden: 7
fecha: "2026-11-15"
resumen: "Ejercicios de NATURAL JOIN, USING, ON, self-join, nonequijoin, OUTER JOIN y CROSS JOIN en Oracle SQL Developer (esquema HR), con su álgebra relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Displaying Data from Multiple Tables Using Joins (SQL_C7)
**Herramienta:** Oracle SQL Developer, esquema HR

En esta práctica combiné datos de varias tablas con `JOIN`. En álgebra relacional uso estos operadores, además de `σ` (selección), `π` (proyección) y `ρ` (renombrado):

| Símbolo | Operador | En SQL |
|---|---|---|
| `⋈` | Reunión natural | `NATURAL JOIN` |
| `⋈ condición` | Reunión con condición | `JOIN ... ON` / `USING` |
| `⟕`, `⟖`, `⟗` | Reunión externa izquierda, derecha y completa | `LEFT`, `RIGHT`, `FULL OUTER JOIN` |
| `×` | Producto cartesiano | `CROSS JOIN` |

---

## Ejercicio 7.1. NATURAL JOIN y USING

**Enunciado:**

1. Mostrar id, nombre, cargo y nombre del cargo de los empleados, uniendo `employees` y `jobs` por las columnas que tienen el mismo nombre.
2. Mostrar id, apellido, ubicación y departamento de los empleados, uniendo con `departments` por `department_id`.
3. Mostrar la ciudad y el nombre del departamento de la ubicación 1400, uniendo `locations` y `departments` con `USING` y poniéndole alias a la tabla.
4. Repetir la consulta anterior de forma que funcione.

```sql
SELECT employee_id, first_name, job_id, job_title
FROM   employees NATURAL JOIN jobs;

SELECT employee_id, last_name, location_id, department_id
FROM   employees JOIN departments
USING  (department_id);

-- Da error ORA-25154
SELECT l.city, d.department_name
FROM   locations l JOIN departments d
USING  (location_id)
WHERE  d.location_id = 1400;

SELECT l.city, d.department_name
FROM   locations l JOIN departments d
USING  (location_id)
WHERE  location_id = 1400;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 7.1](/img/sql/sql7-011.png)
> ![Resultado ejercicio 7.1](/img/sql/sql7-012.png)
> ![Resultado ejercicio 7.1](/img/sql/sql7-013.png)
> ![Resultado ejercicio 7.1](/img/sql/sql7-014.png)

**Álgebra relacional**

```
π employee_id, first_name, job_id, job_title ( employees ⋈ jobs )

π employee_id, last_name, location_id, department_id
  ( employees ⋈ employees.department_id = departments.department_id  departments )

π city, department_name
  ( σ location_id = 1400 ( locations ⋈ locations.location_id = departments.location_id  departments ) )
```

El `NATURAL JOIN` une por todas las columnas que se llaman igual, que aquí es solo `job_id`. Con `USING` se elige la columna exacta: entre `employees` y `departments` hay dos columnas con el mismo nombre (`department_id` y `manager_id`), así que `USING` es la forma de unir solo por `department_id`. La columna usada en el `USING` no puede llevar prefijo ni alias, y por eso la tercera consulta da error.

---

## Ejercicio 7.2. JOIN con ON

**Enunciado:**

1. Mostrar id, apellido y departamento de cada empleado, junto con el id del departamento, el id de la ubicación y su nombre, uniendo con `ON` y alias de tabla.
2. Mostrar id del empleado, ciudad y nombre del departamento, uniendo `employees`, `departments` y `locations`.
3. Repetir la primera consulta mostrando solo los empleados cuyo jefe es el 149, de dos formas: con `AND` y con `WHERE`.

```sql
SELECT e.employee_id, e.last_name, e.department_id,
       d.department_id, d.location_id
FROM   employees e JOIN departments d
ON     (e.department_id = d.department_id);

SELECT employee_id, city, department_name
FROM   employees e
JOIN   departments d
ON     d.department_id = e.department_id
JOIN   locations l
ON     d.location_id = l.location_id;

SELECT e.employee_id, e.last_name, e.department_id,
       d.department_id, d.location_id
FROM   employees e JOIN departments d
ON     (e.department_id = d.department_id)
AND    e.manager_id = 149;

SELECT e.employee_id, e.last_name, e.department_id,
       d.department_id, d.location_id
FROM   employees e JOIN departments d
ON     (e.department_id = d.department_id)
WHERE  e.manager_id = 149;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 7.2](/img/sql/sql7-021.png)
> ![Resultado ejercicio 7.2](/img/sql/sql7-022.png)
> ![Resultado ejercicio 7.2](/img/sql/sql7-023.png)
> ![Resultado ejercicio 7.2](/img/sql/sql7-024.png)

**Álgebra relacional**

```
π e.employee_id, e.last_name, e.department_id, d.department_id, d.location_id
  ( ρ e (employees) ⋈ e.department_id = d.department_id  ρ d (departments) )

π employee_id, city, department_name
  ( ( employees ⋈ employees.department_id = departments.department_id  departments )
      ⋈ departments.location_id = locations.location_id  locations )

π e.employee_id, e.last_name, e.department_id, d.department_id, d.location_id
  ( σ e.manager_id = 149 ( ρ e (employees) ⋈ e.department_id = d.department_id  ρ d (departments) ) )
```

`ON` separa la condición de unión de los demás filtros y permite unir por columnas con nombres distintos. Un join de tres tablas se hace uniendo de a dos. En una unión interna, poner el filtro del jefe en el `AND` o en el `WHERE` da el mismo resultado, así que las dos últimas consultas tienen la misma expresión.

---

## Ejercicio 7.3. Self-join

**Enunciado:** mostrar el apellido de cada empleado junto con el apellido de su jefe.

```sql
SELECT worker.last_name emp, manager.last_name mgr
FROM   employees worker JOIN employees manager
ON     (worker.manager_id = manager.employee_id);
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 7.3](/img/sql/sql7-03.png)

**Álgebra relacional**

```
π worker.last_name, manager.last_name
  ( ρ worker (employees) ⋈ worker.manager_id = manager.employee_id  ρ manager (employees) )
```

Es la misma tabla usada dos veces, una como empleado (`worker`) y otra como jefe (`manager`), por eso en álgebra hay que renombrar cada copia con `ρ`. King no aparece porque no tiene jefe.

---

## Ejercicio 7.4. Nonequijoin

**Enunciado:** mostrar apellido, salario y nombre del cargo de los empleados, uniendo `employees` con `jobs` según si el salario cae dentro del rango mínimo y máximo de cada cargo.

```sql
SELECT e.last_name, e.salary, j.job_title
FROM   employees e JOIN jobs j
ON     e.salary
       BETWEEN j.min_salary AND j.max_salary;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 7.4](/img/sql/sql7-04.png)

**Álgebra relacional**

```
π e.last_name, e.salary, j.job_title
  ( ρ e (employees) ⋈ e.salary ≥ j.min_salary ∧ e.salary ≤ j.max_salary  ρ j (jobs) )
```

No hay una columna en común entre las dos tablas: la unión se hace porque el salario cae dentro de un rango, no por igualdad. Un empleado puede salir varias veces, una por cada cargo cuyo rango incluya su salario.

---

## Ejercicio 7.5. OUTER JOIN

**Enunciado:** mostrar apellido, id y nombre del departamento de los empleados, incluyendo también:

1. Los empleados que no tienen departamento (`LEFT`).
2. Los departamentos que no tienen empleados (`RIGHT`).
3. Ambos casos a la vez (`FULL`).

```sql
SELECT e.last_name, e.department_id, d.department_name
FROM   employees e LEFT OUTER JOIN departments d
ON     (e.department_id = d.department_id);

SELECT e.last_name, d.department_id, d.department_name
FROM   employees e RIGHT OUTER JOIN departments d
ON     (e.department_id = d.department_id);

SELECT e.last_name, d.department_id, d.department_name
FROM   employees e FULL OUTER JOIN departments d
ON     (e.department_id = d.department_id);
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 7.5](/img/sql/sql7-051.png)
> ![Resultado ejercicio 7.5](/img/sql/sql7-052.png)
> ![Resultado ejercicio 7.5](/img/sql/sql7-053.png)

**Álgebra relacional**

```
π e.last_name, e.department_id, d.department_name
  ( ρ e (employees) ⟕ e.department_id = d.department_id  ρ d (departments) )

π e.last_name, d.department_id, d.department_name
  ( ρ e (employees) ⟖ e.department_id = d.department_id  ρ d (departments) )

π e.last_name, d.department_id, d.department_name
  ( ρ e (employees) ⟗ e.department_id = d.department_id  ρ d (departments) )
```

Un join normal solo trae las filas que coinciden. Aquí aparecen dos casos sin pareja: Grant no tiene departamento y el departamento 190 (*Contracting*) no tiene empleados. El `LEFT` conserva a Grant, el `RIGHT` conserva a *Contracting* y el `FULL` conserva a los dos. Lo que no tiene pareja sale con `NULL` en las columnas de la otra tabla.

---

## Ejercicio 7.6. CROSS JOIN

**Enunciado:** mostrar todas las combinaciones posibles entre el apellido de los empleados y el nombre de los departamentos.

```sql
SELECT last_name, department_name
FROM   employees
CROSS JOIN departments;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 7.6](/img/sql/sql7-06.png)

**Álgebra relacional**

```
π last_name, department_name ( employees × departments )
```

Une cada fila de una tabla con todas las de la otra, así que el total es el número de filas de `employees` por el de `departments`. Es un producto cartesiano y casi nunca sirve en la práctica.

---

## Resumen

Con estos ejercicios practiqué cómo unir tablas con `NATURAL JOIN`, `USING` y `ON`, unir tres tablas, unir una tabla consigo misma, unir por rangos con un nonequijoin, traer filas sin pareja con `LEFT`, `RIGHT` y `FULL OUTER JOIN`, y generar un producto cartesiano con `CROSS JOIN`.

*Fuente: presentación SQL_C7 Displaying Data from Multiple Tables Using Joins, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1. Solo se incluye el contenido de Oracle.*