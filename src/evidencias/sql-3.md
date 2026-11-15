---
titulo: "SQL 3: Restringir y ordenar datos"
seccion: "sql"
orden: 3
fecha: "2026-11-15"
resumen: "Ejercicios de WHERE, LIKE, NULL, AND/OR/NOT, ORDER BY, límite de filas en Oracle SQL Developer, con su álgebra relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Restricting and Sorting Data (SQL_C3)
**Herramienta:** Oracle SQL Developer, esquema HR

En esta práctica filtré y ordené filas del esquema HR con `WHERE` y `ORDER BY`, y escribí cada consulta también en álgebra relacional (`σ` selección, `π` proyección, `τ` ordenamiento, `∧ ∨ ¬` para Y, O, NO).

---

## Ejercicio 3.1. Filtrar con WHERE

**Enunciado:**

1. Mostrar id, apellido, cargo y departamento de los empleados del departamento 90.
2. Buscar al empleado con apellido Whalen.
3. Mostrar apellido y fecha de contratación de los contratados desde el 1 de enero de 2007.
4. Mostrar apellido y salario de los que ganan 3000 o menos.

```sql
SELECT employee_id, last_name, job_id, department_id
FROM   employees
WHERE  department_id = 90;

SELECT last_name, job_id, department_id
FROM   employees
WHERE  last_name = 'Whalen';

SELECT last_name, hire_date
FROM   employees
WHERE  hire_date >= DATE '2007-01-01';

SELECT last_name, salary
FROM   employees
WHERE  salary <= 3000;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 3.1](/img/sql/sql3-01.png)
> ![Resultado ejercicio 3.1](/img/sql/sql3-02.png)
> ![Resultado ejercicio 3.1](/img/sql/sql3-03.png)
> ![Resultado ejercicio 3.1](/img/sql/sql3-04.png)

**Álgebra relacional**

```
π employee_id, last_name, job_id, department_id ( σ department_id = 90 (employees) )
π last_name, job_id, department_id ( σ last_name = 'Whalen' (employees) )
π last_name, hire_date ( σ hire_date ≥ 2007-01-01 (employees) )
π last_name, salary ( σ salary ≤ 3000 (employees) )
```

Los textos van entre comillas simples y distinguen mayúsculas: con `'WHALEN'` la segunda consulta no devuelve nada.

---

## Ejercicio 3.2. BETWEEN e IN

**Enunciado:**

1. Mostrar apellido y salario de los empleados que ganan entre 2500 y 3500.
2. Mostrar id, apellido, salario y jefe de los empleados cuyo jefe es el 100, el 101 o el 201.

```sql
SELECT last_name, salary
FROM   employees
WHERE  salary BETWEEN 2500 AND 3500;

SELECT employee_id, last_name, salary, manager_id
FROM   employees
WHERE  manager_id IN (100, 101, 201);
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 3.2](/img/sql/sql3-05.png)
> ![Resultado ejercicio 3.2](/img/sql/sql3-06.png)

**Álgebra relacional**

```
π last_name, salary ( σ salary ≥ 2500 ∧ salary ≤ 3500 (employees) )
π employee_id, last_name, salary, manager_id
  ( σ manager_id = 100 ∨ manager_id = 101 ∨ manager_id = 201 (employees) )
```

`BETWEEN` incluye los dos extremos.

---

## Ejercicio 3.3. LIKE y valores NULL

**Enunciado:**

1. Mostrar los nombres que empiezan por S.
2. Mostrar los apellidos que tienen una o como segunda letra.
3. Mostrar los empleados cuyo cargo empieza por `SA_`, tomando el guion bajo como un carácter normal.
4. Mostrar los empleados que no tienen jefe.

```sql
SELECT first_name
FROM   employees
WHERE  first_name LIKE 'S%';

SELECT last_name
FROM   employees
WHERE  last_name LIKE '_o%';

SELECT employee_id, last_name, job_id
FROM   employees
WHERE  job_id LIKE 'SA\_%' ESCAPE '\';

SELECT last_name, manager_id
FROM   employees
WHERE  manager_id IS NULL;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 3.3](/img/sql/sql3-07.png)
> ![Resultado ejercicio 3.3](/img/sql/sql3-08.png)
> ![Resultado ejercicio 3.3](/img/sql/sql3-09.png)
> ![Resultado ejercicio 3.3](/img/sql/sql3-010.png)


**Álgebra relacional**

```
π first_name ( σ first_name LIKE 'S%' (employees) )
π last_name ( σ last_name LIKE '_o%' (employees) )
π employee_id, last_name, job_id ( σ job_id LIKE 'SA\_%' ESCAPE '\' (employees) )
π last_name, manager_id ( σ manager_id IS NULL (employees) )
```

`%` reemplaza cero o más caracteres y `_` reemplaza uno. Con `ESCAPE`, el `\_` se toma como guion bajo literal. Para los nulos se usa `IS NULL`, nunca `= NULL`. El único sin jefe es el presidente.

---

## Ejercicio 3.4. AND, OR, NOT y precedencia

**Enunciado:**

1. Mostrar los empleados que ganan 10000 o más **y** cuyo cargo contiene `MAN`.
2. Mostrar los que ganan 10000 o más **o** cuyo cargo contiene `MAN`.
3. Mostrar los empleados cuyo cargo **no** es `IT_PROG`, `ST_CLERK` ni `SA_REP`.
4. Mostrar apellido, departamento y salario de los del departamento 60, o del 80 que ganen más de 10000, y repetirlo con paréntesis para que el salario aplique a los dos departamentos.

```sql
SELECT employee_id, last_name, job_id, salary
FROM   employees
WHERE  salary >= 10000
AND    job_id LIKE '%MAN%';

SELECT employee_id, last_name, job_id, salary
FROM   employees
WHERE  salary >= 10000
OR     job_id LIKE '%MAN%';

SELECT last_name, job_id
FROM   employees
WHERE  job_id NOT IN ('IT_PROG', 'ST_CLERK', 'SA_REP');

-- (a) AND se evalúa primero
SELECT last_name, department_id, salary
FROM   employees
WHERE  department_id = 60
OR     department_id = 80
AND    salary > 10000;

-- (b) Con paréntesis se evalúa primero el OR
SELECT last_name, department_id, salary
FROM   employees
WHERE  (department_id = 60
OR      department_id = 80)
AND    salary > 10000;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 3.4](/img/sql/sql3-10.png)
> ![Resultado ejercicio 3.4](/img/sql/sql3-11.png)
> ![Resultado ejercicio 3.4](/img/sql/sql3-12.png)
> ![Resultado ejercicio 3.4](/img/sql/sql3-13a.png)
> ![Resultado ejercicio 3.4](/img/sql/sql3-13b.png)


**Álgebra relacional**

```
π employee_id, last_name, job_id, salary
  ( σ salary ≥ 10000 ∧ job_id LIKE '%MAN%' (employees) )
π employee_id, last_name, job_id, salary
  ( σ salary ≥ 10000 ∨ job_id LIKE '%MAN%' (employees) )
π last_name, job_id
  ( σ ¬( job_id = 'IT_PROG' ∨ job_id = 'ST_CLERK' ∨ job_id = 'SA_REP' ) (employees) )

(a) π last_name, department_id, salary
      ( σ department_id = 60 ∨ ( department_id = 80 ∧ salary > 10000 ) (employees) )
(b) π last_name, department_id, salary
      ( σ ( department_id = 60 ∨ department_id = 80 ) ∧ salary > 10000 (employees) )
```

`AND` se evalúa antes que `OR`. En (a) salen todos los del departamento 60 y solo los del 80 que ganan más de 10000. En (b) salen de ambos departamentos los que ganan más de 10000.

---

## Ejercicio 3.5. Ordenar con ORDER BY

**Enunciado:** mostrar los empleados ordenados por fecha de contratación.

```sql
SELECT last_name, job_id, department_id, hire_date
FROM   employees
ORDER BY hire_date;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 3.5](/img/sql/sql3-14.png)


**Álgebra relacional**

```
τ hire_date ↑  ( π last_name, job_id, department_id, hire_date (employees) )
```

`ORDER BY` va al final de la sentencia y `ASC` es el orden por defecto. En álgebra uso `τ` (↑ ascendente, ↓ descendente) como último paso, porque una relación clásica no tiene orden.

---

## Ejercicio 3.6. Límite de filas

**Enunciado:** mostrar las primeras 5 filas de empleados ordenados por id.

```sql
SELECT employee_id, first_name
FROM   employees
ORDER BY employee_id
FETCH FIRST 5 ROWS ONLY;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 3.6](/img/sql/sql3-15.png)

**Álgebra relacional**

```
No hay un operador estándar para limitar filas. Se describe como un paso final:
  tomar las primeras 5 tuplas de  τ employee_id ↑ ( π employee_id, first_name (employees) )
```

---

## Resumen

Con estos ejercicios practiqué filtrar con `WHERE` (comparaciones, `BETWEEN`, `IN`, `LIKE`, `IS NULL`), combinar condiciones con `AND`, `OR` y `NOT` cuidando la precedencia, ordenar con `ORDER BY`, limitar filas con `FETCH FIRST`.

*Fuente: presentación SQL_C3 Restricting and Sorting Data, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1.*