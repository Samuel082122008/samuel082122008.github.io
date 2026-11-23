---
titulo: "SQL 5: Funciones de conversión y expresiones condicionales"
seccion: "sql"
orden: 5
fecha: "2026-11-15"
resumen: "Ejercicios de conversión de tipos (TO_CHAR, TO_NUMBER, CAST), funciones generales para nulos, CASE, DECODE y funciones JSON en Oracle SQL Developer, con su álgebra relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Conversion Functions and Conditional Expressions (SQL_C5)
**Herramienta:** Oracle SQL Developer, esquema HR

En esta práctica convertí datos de un tipo a otro, trabajé con valores nulos y usé lógica condicional (`CASE` y `DECODE`) dentro de las consultas. En álgebra relacional las funciones van dentro de la proyección (`π`), el filtro es la selección (`σ`) y los alias son `ρ`.

---

## Ejercicio 5.1. Conversión implícita

**Enunciado:**

1. Mostrar nombre, apellido y departamento de los empleados cuyo departamento es menor que el texto que resulta de unir `'9'` y `'0'`.
2. Mostrar nombre, apellido y salario de los empleados cuyo salario contiene el dígito 5.

```sql
SELECT first_name, last_name, department_id
FROM   employees
WHERE  department_id < CONCAT('9', '0');

SELECT first_name, last_name, salary
FROM   employees
WHERE  INSTR(salary, '5') > 0;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 5.1](/img/sql/sql5-011.png)
> ![Resultado ejercicio 5.1](/img/sql/sql5-012.png)

**Álgebra relacional**

```
π first_name, last_name, department_id ( σ department_id < CONCAT('9','0') (employees) )
π first_name, last_name, salary ( σ INSTR(salary, '5') > 0 (employees) )
```

Aquí Oracle hace la conversión solo: en la primera pasa el texto `'90'` a número para comparar, y en la segunda pasa el salario a texto para buscar el dígito.

---

## Ejercicio 5.2. TO_CHAR con fechas

**Enunciado:**

1. Mostrar el id de Higgins y el mes y año en que fue contratado, en formato `MM/YY`.
2. Mostrar el apellido de todos los empleados con su fecha de contratación escrita como "17 June 2011".

```sql
SELECT employee_id, TO_CHAR(hire_date, 'MM/YY') Month_Hired
FROM   employees
WHERE  last_name = 'Higgins';

SELECT last_name,
       TO_CHAR(hire_date, 'fmDD Month YYYY') AS HIREDATE
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 5.2](/img/sql/sql5-021.png)
> ![Resultado ejercicio 5.2](/img/sql/sql5-022.png)

**Álgebra relacional**

```
ρ Month_Hired ( π employee_id, TO_CHAR(hire_date, 'MM/YY') ( σ last_name = 'Higgins' (employees) ) )
ρ HIREDATE ( π last_name, TO_CHAR(hire_date, 'fmDD Month YYYY') (employees) )
```

El modelo de formato define cómo se ve la fecha (`MM` mes en número, `MONTH` nombre completo, `YYYY` año completo). El `fm` quita los espacios y ceros de relleno.

---

## Ejercicio 5.3. TO_CHAR con números, TO_NUMBER

**Enunciado:**

1. Mostrar el salario de Ernst con formato de dinero.
2. Convertir un texto con formato de dinero a número.

```sql
SELECT TO_CHAR(salary, '$99,999.00') SALARY
FROM   employees
WHERE  last_name = 'Ernst';

SELECT TO_NUMBER('$6,000.00', '$99,999.00') AS SALARY
FROM   dual;

```

**Resultado en SQL Developer**

> ![Resultado ejercicio 5.3](/img/sql/sql5-031.png)
> ![Resultado ejercicio 5.3](/img/sql/sql5-032.png)


**Álgebra relacional**

```
ρ SALARY ( π TO_CHAR(salary, '$99,999.00') ( σ last_name = 'Ernst' (employees) ) )
ρ SALARY ( π TO_NUMBER('$6,000.00', '$99,999.00') (dual) )
```

En el formato numérico `9` es un dígito, `$` pone el signo de dinero, `,` la coma de miles y `.` el punto decimal.

---

## Ejercicio 5.4. La función CAST

**Enunciado:**

1. Repetir la comparación del departamento con `'9'` y `'0'`, pero convirtiendo el texto a número de forma explícita.
2. Mostrar los empleados cuyo salario contiene el dígito 5, convirtiendo el salario a texto de forma explícita.

```sql
SELECT first_name, last_name, department_id
FROM   employees
WHERE  department_id < CAST(CONCAT('9', '0') AS DECIMAL(2,0));

SELECT first_name, last_name, salary
FROM   employees
WHERE  INSTR(CAST(salary AS VARCHAR2(30)), '5') > 0;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 5.4](/img/sql/sql5-041.png)
> ![Resultado ejercicio 5.4](/img/sql/sql5-042.png)

**Álgebra relacional**

```
π first_name, last_name, department_id
  ( σ department_id < CAST( CONCAT('9','0') AS DECIMAL(2,0) ) (employees) )
π first_name, last_name, salary
  ( σ INSTR( CAST(salary AS VARCHAR2(30)), '5' ) > 0 (employees) )
```

Es lo mismo del ejercicio 5.1, pero con la conversión escrita por mí en vez de dejársela a Oracle.

---

## Ejercicio 5.5. Funciones generales para nulos

**Enunciado:**

1. Mostrar apellido, salario, comisión (con 0 cuando sea nula) y salario anual incluyendo la comisión.
2. Para los empleados de los departamentos 50 y 80, mostrar `SAL+COMM` si tienen comisión y `SAL` si no.
3. Comparar el largo del nombre con el largo del apellido y mostrar un nulo cuando sean iguales.

```sql
SELECT last_name, salary, NVL(commission_pct, 0),
       (salary*12) + (salary*12*NVL(commission_pct, 0)) AN_SAL
FROM   employees;

SELECT last_name, salary, commission_pct,
       NVL2(commission_pct, 'SAL+COMM', 'SAL') income
FROM   employees
WHERE  department_id IN (50, 80);

SELECT first_name, LENGTH(first_name) AS expr1,
       last_name,  LENGTH(last_name)  AS expr2,
       NULLIF(LENGTH(first_name), LENGTH(last_name)) AS Result
FROM   employees;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 5.5](/img/sql/sql5-051.png)
> ![Resultado ejercicio 5.5](/img/sql/sql5-052.png)
> ![Resultado ejercicio 5.5](/img/sql/sql5-053.png)

**Álgebra relacional**

```
ρ AN_SAL ( π last_name, salary, NVL(commission_pct, 0),
           (salary*12) + (salary*12*NVL(commission_pct, 0)) (employees) )
ρ income ( π last_name, salary, commission_pct, NVL2(commission_pct, 'SAL+COMM', 'SAL')
           ( σ department_id = 50 ∨ department_id = 80 (employees) ) )
ρ Result ( π first_name, LENGTH(first_name), last_name, LENGTH(last_name),
           NULLIF(LENGTH(first_name), LENGTH(last_name)) (employees) )
```

`NVL` cambia un nulo por un valor. `NVL2` devuelve un valor si la expresión tiene dato y otro si es nula. `NULLIF` devuelve nulo cuando las dos expresiones son iguales.
---

## Ejercicio 5.6. CASE y DECODE

**Enunciado:**

1. Mostrar apellido, cargo, salario y salario revisado: 10% más para `IT_PROG`, 15% más para `ST_CLERK`, 20% más para `SA_REP` y sin cambio para los demás (con `CASE`).
2. Clasificar el salario en Low (menos de 5000), Medium (menos de 10000), Good (menos de 20000) o Excellent (con `CASE` buscado).
3. Repetir el salario revisado del punto 1 usando `DECODE`.


```sql
SELECT last_name, job_id, salary,
       CASE job_id WHEN 'IT_PROG'  THEN 1.10*salary
                   WHEN 'ST_CLERK' THEN 1.15*salary
                   WHEN 'SA_REP'   THEN 1.20*salary
                   ELSE salary END AS REVISED_SALARY
FROM   employees;

SELECT last_name, salary,
       (CASE WHEN salary < 5000  THEN 'Low'
             WHEN salary < 10000 THEN 'Medium'
             WHEN salary < 20000 THEN 'Good'
             ELSE 'Excellent'
       END) AS qualified_salary
FROM   employees;

SELECT last_name, job_id, salary,
       DECODE(job_id, 'IT_PROG',  1.10*salary,
                      'ST_CLERK', 1.15*salary,
                      'SA_REP',   1.20*salary,
                      salary) REVISED_SALARY
FROM   employees;

```

**Resultado en SQL Developer**

> ![Resultado ejercicio 5.6](/img/sql/sql5-061.png)
> ![Resultado ejercicio 5.6](/img/sql/sql5-062.png)
> ![Resultado ejercicio 5.6](/img/sql/sql5-063.png)

**Álgebra relacional**

```
ρ REVISED_SALARY ( π last_name, job_id, salary,
   CASE job_id WHEN 'IT_PROG' THEN 1.10*salary WHEN 'ST_CLERK' THEN 1.15*salary
               WHEN 'SA_REP' THEN 1.20*salary ELSE salary END (employees) )
ρ qualified_salary ( π last_name, salary,
   CASE WHEN salary<5000 THEN 'Low' WHEN salary<10000 THEN 'Medium'
        WHEN salary<20000 THEN 'Good' ELSE 'Excellent' END (employees) )
ρ REVISED_SALARY ( π last_name, job_id, salary,
   DECODE(job_id, 'IT_PROG', 1.10*salary, 'ST_CLERK', 1.15*salary, 'SA_REP', 1.20*salary, salary)
   (employees) )
```

El álgebra relacional clásica no tiene lógica condicional, así que `CASE` y `DECODE` se tratan como expresiones calculadas dentro de la proyección. Las consultas 1 y 3 dan el mismo resultado: `DECODE` es la forma abreviada de Oracle para el `CASE` que compara con igualdad.

---

## Ejercicio 5.7. Funciones JSON

**Enunciado:**

1. Extraer un objeto JSON completo con `JSON_QUERY`.
2. Extraer un solo valor con `JSON_VALUE`.
3. Convertir un JSON en una tabla con `JSON_TABLE`.

```sql
SELECT JSON_QUERY('{"a":100, "b":200, "c":300}', '$') AS value
FROM   dual;

SELECT JSON_VALUE('{"a":100}', '$.a') AS value
FROM   dual;

SELECT *
FROM   JSON_TABLE('{"a":100, "b":200, "c":300}', '$'
         COLUMNS (a NUMBER PATH '$.a',
                  b NUMBER PATH '$.b',
                  c NUMBER PATH '$.c'));
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 5.7](/img/sql/sql5-071.png)
> ![Resultado ejercicio 5.7](/img/sql/sql5-072.png)
> ![Resultado ejercicio 5.7](/img/sql/sql5-073.png)

**Álgebra relacional**

```
π JSON_QUERY('{"a":100,"b":200,"c":300}', '$') (dual)
π JSON_VALUE('{"a":100}', '$.a') (dual)
JSON_TABLE('{"a":100,"b":200,"c":300}')  →  relación R(a, b, c) con una tupla (100, 200, 300)
```

`JSON_QUERY` devuelve el JSON como texto, `JSON_VALUE` devuelve un valor suelto (aquí 100) y `JSON_TABLE` arma una relación con una columna por cada campo, así que se puede consultar como una tabla normal.

---

## Resumen

Con estos ejercicios practiqué la conversión de tipos (implícita, `TO_CHAR`, `TO_NUMBER` y `CAST`), el manejo de nulos con `NVL`, `NVL2`, `NULLIF`, la lógica condicional con `CASE` y `DECODE`, y las funciones JSON de Oracle.

*Fuente: presentación SQL_C5 Conversion Functions and Conditional Expressions, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1. Solo se incluye el contenido de Oracle.*