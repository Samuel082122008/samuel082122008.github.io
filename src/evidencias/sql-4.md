---
titulo: "SQL 4: Funciones de una sola fila"
seccion: "sql"
orden: 4
fecha: "2026-11-16"
resumen: "Ejercicios con funciones de carácter, anidadas, numéricas y de fecha en Oracle SQL Developer (esquema HR), con su álgebra relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Using Single-Row Functions to Customize Output (SQL_C4)
**Herramienta:** Oracle SQL Developer, esquema HR

En esta práctica usé funciones de una sola fila: devuelven un resultado por cada fila y se pueden anidar. En álgebra relacional las escribo dentro de la proyección (`π`), que acepta expresiones calculadas, y uso `ρ` para los alias.

---

## Ejercicio 4.1. Funciones de mayúsculas y minúsculas

**Enunciado:**

1. Mostrar el apellido en mayúsculas y el cargo en minúsculas de los empleados del departamento 90.
2. Buscar al empleado Higgins escribiendo el apellido en minúsculas.
3. Repetir la búsqueda para que sí encuentre a Higgins sin importar cómo esté escrito.

```sql
SELECT last_name, UPPER(last_name), job_id, LOWER(job_id)
FROM   employees
WHERE  department_id = 90;

SELECT employee_id, last_name, department_id
FROM   employees
WHERE  last_name = 'higgins';

SELECT employee_id, last_name, department_id
FROM   employees
WHERE  LOWER(last_name) = 'higgins';
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 4.1](/img/sql/sql4-011.png)
> ![Resultado ejercicio 4.1](/img/sql/sql4-012.png)
> ![Resultado ejercicio 4.1](/img/sql/sql4-013.png)

**Álgebra relacional**

```
π last_name, UPPER(last_name), job_id, LOWER(job_id) ( σ department_id = 90 (employees) )
π employee_id, last_name, department_id ( σ last_name = 'higgins' (employees) )
π employee_id, last_name, department_id ( σ LOWER(last_name) = 'higgins' (employees) )
```

La segunda consulta no devuelve filas porque en Oracle los datos distinguen mayúsculas. La tercera sí encuentra a Higgins porque convierte el apellido antes de comparar.

---

## Ejercicio 4.2. Funciones de manipulación de caracteres

**Enunciado:**

1. Mostrar el apellido y una frase "Job category is" más el cargo, solo de los empleados cuyo cargo termina en `REP`.
2. Mostrar id, nombre y apellido unidos, la longitud del apellido y la posición de la letra `a` en el apellido, solo para los apellidos que terminan en `n`.
3. Probar `CONCAT`, `SUBSTR`, `LENGTH`, `INSTR`, `LPAD` y `RPAD` con valores fijos usando la tabla `dual`.

```sql
SELECT last_name, CONCAT('Job category is ', job_id) AS Job
FROM   employees
WHERE  SUBSTR(job_id, 4) = 'REP';

SELECT employee_id, CONCAT(first_name, last_name) NAME,
       LENGTH(last_name), INSTR(last_name, 'a') "Contains 'a'?"
FROM   employees
WHERE  SUBSTR(last_name, -1, 1) = 'n';

SELECT CONCAT('Hello', 'World'), SUBSTR('HelloWorld', 1, 5),
       LENGTH('HelloWorld'), INSTR('HelloWorld', 'W'),
       LPAD(24000, 10, '*'), RPAD(24000, 10, '*')
FROM   dual;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 4.2](/img/sql/sql4-021.png)
> ![Resultado ejercicio 4.2](/img/sql/sql4-022.png)
> ![Resultado ejercicio 4.2](/img/sql/sql4-023.png)

**Álgebra relacional**

```
ρ Job ( π last_name, CONCAT('Job category is ', job_id) ( σ SUBSTR(job_id, 4) = 'REP' (employees) ) )
π employee_id, CONCAT(first_name, last_name), LENGTH(last_name), INSTR(last_name, 'a')
  ( σ SUBSTR(last_name, -1, 1) = 'n' (employees) )
π CONCAT('Hello','World'), SUBSTR('HelloWorld',1,5), LENGTH('HelloWorld'),
  INSTR('HelloWorld','W'), LPAD(24000,10,'*'), RPAD(24000,10,'*') (dual)
```

Con `SUBSTR` un número negativo cuenta desde el final del texto. `LPAD` y `RPAD` rellenan a la izquierda y a la derecha hasta completar la longitud.

---

## Ejercicio 4.3. Funciones anidadas

**Enunciado:** mostrar el apellido de los empleados del departamento 60, y ese mismo apellido recortado a 8 letras, con `_US` al final y todo en mayúsculas.

```sql
SELECT last_name,
       UPPER(CONCAT(SUBSTR(last_name, 1, 8), '_US'))
FROM   employees
WHERE  department_id = 60;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 4.3](/img/sql/sql4-03.png)

**Álgebra relacional**

```
π last_name, UPPER( CONCAT( SUBSTR(last_name, 1, 8), '_US' ) ) ( σ department_id = 60 (employees) )
```

Las funciones anidadas se evalúan de la más interna a la más externa: primero `SUBSTR`, luego `CONCAT` y al final `UPPER`.

---

## Ejercicio 4.4. Funciones numéricas

**Enunciado:**

1. Redondear 45.923 a 2 decimales, a 0 decimales y a decenas.
2. Truncar 45.923 de las mismas tres formas.
3. Mostrar los empleados cuyo id es un número par.

```sql
SELECT ROUND(45.923, 2), ROUND(45.923, 0), ROUND(45.923, -1)
FROM   dual;

SELECT TRUNC(45.923, 2), TRUNC(45.923), TRUNC(45.923, -1)
FROM   dual;

SELECT employee_id AS Numeros_Pares, last_name
FROM   employees
WHERE  MOD(employee_id, 2) = 0;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 4.4](/img/sql/sql4-041.png)
> ![Resultado ejercicio 4.4](/img/sql/sql4-042.png)
> ![Resultado ejercicio 4.4](/img/sql/sql4-043.png)

**Álgebra relacional**

```
π ROUND(45.923,2), ROUND(45.923,0), ROUND(45.923,-1) (dual)
π TRUNC(45.923,2), TRUNC(45.923), TRUNC(45.923,-1) (dual)
ρ Even_Numbers ( π employee_id, last_name ( σ MOD(employee_id, 2) = 0 (employees) ) )
```

`ROUND` da 45.92, 46 y 50. `TRUNC` da 45.92, 45 y 40. `MOD` devuelve el residuo de la división, por eso un residuo de 0 con 2 indica un número par.

---

## Ejercicio 4.5. Trabajar con fechas

**Enunciado:**

1. Mostrar apellido y fecha de contratación de los empleados contratados antes del 1 de febrero de 2013.
2. Mostrar la fecha actual del sistema.
3. Mostrar la zona horaria de la sesión, la fecha actual y la fecha y hora actuales.
4. Mostrar el apellido y cuántas semanas lleva trabajando cada empleado del departamento 90.

```sql
SELECT last_name, hire_date
FROM   employees
WHERE  hire_date < DATE '2013-02-01';

SELECT SYSDATE
FROM   dual;

SELECT SESSIONTIMEZONE, CURRENT_DATE, CURRENT_TIMESTAMP
FROM   dual;

SELECT last_name, (SYSDATE - hire_date)/7 AS SEMANAS
FROM   employees
WHERE  department_id = 90;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 4.5](/img/sql/sql4-051.png)
> ![Resultado ejercicio 4.5](/img/sql/sql4-052.png)
> ![Resultado ejercicio 4.5](/img/sql/sql4-053.png)
> ![Resultado ejercicio 4.5](/img/sql/sql4-054.png)

**Álgebra relacional**

```
π last_name, hire_date ( σ hire_date < 2013-02-01 (employees) )
π SYSDATE (dual)
π SESSIONTIMEZONE, CURRENT_DATE, CURRENT_TIMESTAMP (dual)
ρ WEEKS ( π last_name, (SYSDATE - hire_date)/7 ( σ department_id = 90 (employees) ) )
```

Oracle guarda las fechas en un formato numérico interno y las muestra por defecto como `DD-MON-RR`. Al restar dos fechas el resultado es el número de días, por eso se divide entre 7 para sacar semanas.

---

## Ejercicio 4.6. Funciones de fecha

**Enunciado:**

1. Calcular los meses entre dos fechas, sumar un mes a una fecha, hallar el próximo viernes después de una fecha y el último día de un mes.
2. Redondear y truncar la fecha actual al mes y al año.

```sql
SELECT MONTHS_BETWEEN(DATE '2018-09-01', DATE '2017-01-11'),
       ADD_MONTHS(DATE '2016-01-31', 1),
       NEXT_DAY(DATE '2016-06-01', 'VIERNES'),
       LAST_DAY(DATE '2016-04-01')
FROM   dual;

SELECT ROUND(SYSDATE, 'MONTH'), ROUND(SYSDATE, 'YEAR'),
       TRUNC(SYSDATE, 'MONTH'), TRUNC(SYSDATE, 'YEAR')
FROM   dual;
```

**Resultado en SQL Developer**

> ![Resultado ejercicio 4.6](/img/sql/sql4-061.png)
> ![Resultado ejercicio 4.6](/img/sql/sql4-062.png)

**Álgebra relacional**

```
π MONTHS_BETWEEN(2018-09-01, 2017-01-11), ADD_MONTHS(2016-01-31, 1),
  NEXT_DAY(2016-06-01, 'FRIDAY'), LAST_DAY(2016-04-01) (dual)
π ROUND(SYSDATE,'MONTH'), ROUND(SYSDATE,'YEAR'), TRUNC(SYSDATE,'MONTH'), TRUNC(SYSDATE,'YEAR') (dual)
```

`ADD_MONTHS` ajusta al último día del mes cuando el día no existe (31 de enero más un mes da 29 de febrero de 2016). `ROUND` lleva la fecha al mes o año más cercano y `TRUNC` la lleva al inicio del mes o del año.

---

## Resumen

Con estos ejercicios practiqué funciones de carácter (`UPPER`, `LOWER`, `CONCAT`, `SUBSTR`, `LENGTH`, `INSTR`, `LPAD`, `RPAD`), anidarlas, funciones numéricas (`ROUND`, `TRUNC`, `MOD`) y funciones de fecha de Oracle (`SYSDATE`, `MONTHS_BETWEEN`, `ADD_MONTHS`, `NEXT_DAY`, `LAST_DAY`), además de la aritmética con fechas.

*Fuente: presentación SQL_C4 Using Single-Row Functions to Customize Output, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1. Solo se incluye el contenido de Oracle.*