---
titulo: "SQL 6: Funciones de grupo"
seccion: "sql"
orden: 6
fecha: "2026-11-15"
resumen: "Ejercicios con funciones de grupo (AVG, SUM, MIN, MAX, COUNT), GROUP BY en Oracle SQL Developer (esquema HR), con su álgebra relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Aggregating Data Using Group Functions (SQL_C6)
**Herramienta:** Oracle SQL Developer, esquema HR

En esta práctica usé funciones de grupo, que trabajan sobre un conjunto de filas y devuelven un solo resultado por grupo. En álgebra relacional uso el operador de agrupación `γ`, que se escribe `γ columnas de grupo ; funciones (relación)`. Si no hay columnas de grupo, toda la tabla es un solo grupo. `σ` es la selección, `π` la proyección y `ρ` el alias.

---

## Ejercicio 6.1. Funciones AVG, SUM, MIN, MAX y COUNT

**Enunciado:**

1. Mostrar el promedio, el máximo, el mínimo y la suma de los salarios de los empleados cuyo cargo contiene `REP`.
2. Mostrar el primer y el último apellido en orden alfabético, y la fecha de contratación más antigua y la más reciente.
3. Contar cuántos empleados hay en el departamento 50.
4. Contar cuántos empleados del departamento 50 tienen comisión.
5. Contar cuántos departamentos distintos hay en la tabla de empleados.

```sql
SELECT AVG(salary), MAX(salary), MIN(salary), SUM(salary)
FROM   employees
WHERE  job_id LIKE '%REP%';

SELECT MIN(last_name), MAX(last_name), MIN(hire_date), MAX(hire_date)
FROM   employees;

SELECT COUNT(*)
FROM   employees
WHERE  department_id = 50;

SELECT COUNT(commission_pct)
FROM   employees
WHERE  department_id = 50;

SELECT COUNT(DISTINCT department_id)
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 6.1](/img/sql/sql6-011.png)
> ![Resultado ejercicio 6.1](/img/sql/sql6-012.png)
> ![Resultado ejercicio 6.1](/img/sql/sql6-013.png)
> ![Resultado ejercicio 6.1](/img/sql/sql6-014.png)
> ![Resultado ejercicio 6.1](/img/sql/sql6-015.png)

**Álgebra relacional**

```
γ ; AVG(salary), MAX(salary), MIN(salary), SUM(salary) ( σ job_id LIKE '%REP%' (employees) )
γ ; MIN(last_name), MAX(last_name), MIN(hire_date), MAX(hire_date) (employees)
γ ; COUNT(*) ( σ department_id = 50 (employees) )
γ ; COUNT(commission_pct) ( σ department_id = 50 (employees) )
γ ; COUNT(DISTINCT department_id) (employees)
```

`AVG` y `SUM` son solo para datos numéricos, mientras que `MIN` y `MAX` sirven también con texto y fechas. `COUNT(*)` cuenta todas las filas y `COUNT(columna)` solo las que no son nulas, por eso en el departamento 50 da 0: nadie tiene comisión. `DISTINCT` hace que cuente cada valor una sola vez.

---

## Ejercicio 6.2. Funciones de grupo y valores NULL

**Enunciado:**

1. Calcular el promedio del porcentaje de comisión de todos los empleados.
2. Calcular ese mismo promedio contando como 0 a los que no tienen comisión.

```sql
SELECT AVG(commission_pct)
FROM   employees;

SELECT AVG(NVL(commission_pct, 0))
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 6.2](/img/sql/sql6-021.png)
> ![Resultado ejercicio 6.2](/img/sql/sql6-022.png)

**Álgebra relacional**

```
γ ; AVG(commission_pct) (employees)
γ ; AVG( NVL(commission_pct, 0) ) (employees)
```

Las funciones de grupo ignoran los nulos. En el primer caso el promedio se saca solo entre los que tienen comisión (0.2125), y en el segundo cuenta a todos (0.0425), por eso el resultado baja.

---

## Ejercicio 6.3. GROUP BY

**Enunciado:**

1. Mostrar el salario promedio de cada departamento.
2. Mostrar solo los promedios por departamento, sin la columna del departamento.
3. Mostrar la suma de salarios por departamento y cargo, solo para los departamentos mayores a 40, ordenado por departamento.

```sql
SELECT department_id, AVG(salary)
FROM   employees
GROUP BY department_id;

SELECT AVG(salary)
FROM   employees
GROUP BY department_id;

SELECT department_id, job_id, SUM(salary)
FROM   employees
WHERE  department_id > 40
GROUP BY department_id, job_id
ORDER BY department_id;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 6.3](/img/sql/sql6-031.png)
> ![Resultado ejercicio 6.3](/img/sql/sql6-032.png)
> ![Resultado ejercicio 6.3](/img/sql/sql6-033.png)

**Álgebra relacional**

```
γ department_id ; AVG(salary) (employees)
π AVG(salary) ( γ department_id ; AVG(salary) (employees) )
τ department_id ↑ ( γ department_id, job_id ; SUM(salary) ( σ department_id > 40 (employees) ) )
```

Toda columna del `SELECT` que no esté dentro de una función de grupo tiene que estar en el `GROUP BY`. Lo contrario no es necesario: se puede agrupar por una columna sin mostrarla, pero así los promedios quedan sin saber a qué departamento pertenecen. El `WHERE` filtra las filas antes de agrupar.

---

## Resumen

Con estos ejercicios practiqué las funciones de grupo (`COUNT`, `MAX`, `MIN`, `SUM`, `AVG`), cómo tratan los nulos, agrupar con `GROUP BY`.

*Fuente: presentación SQL_C6 Aggregating Data Using Group Functions, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1. Solo se incluye el contenido de Oracle.*