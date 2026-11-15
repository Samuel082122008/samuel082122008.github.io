---
titulo: "SQL 3: Restringir y ordenar datos"
seccion: "sql"
orden: 3
fecha: "2026-11-15"
resumen: "Filtrado de filas con WHERE, operadores de comparación, LIKE, NULL, AND/OR/NOT, precedencia, ORDER BY, límite de filas y variables de sustitución, con su álgebra relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Restricting and Sorting Data (presentación SQL_C3)
**Herramienta:** Oracle SQL Developer, esquema HR

## Objetivos

- Limitar las filas que devuelve una consulta con `WHERE`.
- Ordenar las filas que devuelve una consulta con `ORDER BY`.
- Combinar condiciones con operadores lógicos y entender su precedencia.
- Limitar el número de filas y usar variables de sustitución de Oracle.

## Notación de álgebra relacional usada

| Símbolo | Operador | Equivale en SQL |
|---|---|---|
| `σ` | Selección: filtra filas | `WHERE` |
| `π` | Proyección: elige columnas | lista de columnas del `SELECT` |
| `τ` | Ordenamiento (álgebra extendida) | `ORDER BY` |
| `∧`, `∨`, `¬` | Y, O, NO | `AND`, `OR`, `NOT` |

La condición de `WHERE` es el predicado de la selección: `σ condición (tabla)`. Primero se filtran las filas con `σ` y después se eligen las columnas con `π`.

---

## 1. Limitar filas con una selección: WHERE

La cláusula `WHERE` va **después de `FROM`** y restringe las filas devueltas a las que cumplen la condición.

```sql
SELECT *|{[DISTINCT] columna|expresión [alias], ...}
FROM   tabla
[WHERE condición(es)];
```

La condición se compone de **nombres de columna, expresiones, constantes y un operador de comparación**.

**Cadenas de caracteres y fechas:**

- Se escriben entre **comillas simples** (`'...'`).
- Los valores de carácter **distinguen mayúsculas y minúsculas** (`'Whalen'` no es igual a `'WHALEN'`).
- Los valores de fecha dependen del formato; en Oracle el formato por defecto es `DD-MON-RR`. En estos ejercicios se usa el literal estándar `DATE 'AAAA-MM-DD'`, que no depende de la configuración.

## 2. Operadores de comparación

| Operador | Significado |
|---|---|
| `=` | Igual a |
| `>` | Mayor que |
| `>=` | Mayor o igual que |
| `<` | Menor que |
| `<=` | Menor o igual que |
| `<>` (también `!=`, `^=`) | Distinto de |
| `BETWEEN ... AND ...` | Entre dos valores (inclusive) |
| `IN (conjunto)` | Coincide con cualquier valor de una lista |
| `LIKE` | Coincide con un patrón de caracteres |
| `IS NULL` | Es un valor nulo |

---

## 3. Ejercicios de restricción

### Ejercicio 3.1. Filtro simple con WHERE

```sql
SELECT employee_id, last_name, job_id, department_id
FROM   employees
WHERE  department_id = 90;
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.1](/images/sql/sql3-01.png)

**Álgebra relacional**

```
π employee_id, last_name, job_id, department_id ( σ department_id = 90 (employees) )
```

---

### Ejercicio 3.2. Cadenas de caracteres

```sql
SELECT last_name, job_id, department_id
FROM   employees
WHERE  last_name = 'Whalen';
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.2](/images/sql/sql3-02.png)

**Álgebra relacional**

```
π last_name, job_id, department_id ( σ last_name = 'Whalen' (employees) )
```

Si se escribe `'WHALEN'` o `'whalen'` la consulta no devuelve filas, porque la comparación distingue mayúsculas.

---

### Ejercicio 3.3. Fechas

```sql
SELECT last_name, hire_date
FROM   employees
WHERE  hire_date >= DATE '2007-01-01';
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.3](/images/sql/sql3-03.png)

**Álgebra relacional**

```
π last_name, hire_date ( σ hire_date ≥ 2007-01-01 (employees) )
```

---

### Ejercicio 3.4. Operadores de comparación

```sql
SELECT last_name, salary
FROM   employees
WHERE  salary <= 3000;
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.4](/images/sql/sql3-04.png)

**Álgebra relacional**

```
π last_name, salary ( σ salary ≤ 3000 (employees) )
```

---

### Ejercicio 3.5. BETWEEN

**Concepto:** `BETWEEN ... AND ...` incluye los **dos extremos**. Primero va el límite inferior.

```sql
SELECT last_name, salary
FROM   employees
WHERE  salary BETWEEN 2500 AND 3500;
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.5](/images/sql/sql3-05.png)

**Álgebra relacional**

```
π last_name, salary ( σ salary ≥ 2500 ∧ salary ≤ 3500 (employees) )
```

---

### Ejercicio 3.6. IN

**Concepto:** `IN` verifica que el valor esté en una lista; se puede usar con cualquier tipo de dato.

```sql
SELECT employee_id, last_name, salary, manager_id
FROM   employees
WHERE  manager_id IN (100, 101, 201);
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.6](/images/sql/sql3-06.png)

**Álgebra relacional**

```
π employee_id, last_name, salary, manager_id
  ( σ manager_id = 100 ∨ manager_id = 101 ∨ manager_id = 201 (employees) )
```

---

### Ejercicio 3.7. Coincidencia de patrones con LIKE

**Concepto:** `LIKE` hace búsquedas con comodines sobre cadenas válidas.

- `%` representa **cero o más** caracteres.
- `_` representa **un** carácter.

```sql
SELECT first_name
FROM   employees
WHERE  first_name LIKE 'S%';

SELECT last_name
FROM   employees
WHERE  last_name LIKE '_o%';
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.7](/images/sql/sql3-07.png)

**Álgebra relacional**

```
π first_name ( σ first_name LIKE 'S%' (employees) )
π last_name  ( σ last_name LIKE '_o%' (employees) )
```

El álgebra relacional pura no define la coincidencia de patrones; `LIKE` se escribe como un predicado más dentro de `σ`.

---

### Ejercicio 3.8. Combinar comodines y ESCAPE

**Concepto:** los dos comodines se pueden combinar con caracteres literales. Para buscar los símbolos `%` o `_` tal cual, se usa el identificador `ESCAPE`.

```sql
SELECT employee_id, last_name, job_id
FROM   employees
WHERE  job_id LIKE 'SA\_%' ESCAPE '\';
```

Aquí `\_` es un guion bajo literal: se buscan los `job_id` que empiezan por `SA_` (por ejemplo `SA_REP`, `SA_MAN`).

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.8](/images/sql/sql3-08.png)

**Álgebra relacional**

```
π employee_id, last_name, job_id ( σ job_id LIKE 'SA\_%' ESCAPE '\' (employees) )
```

---

### Ejercicio 3.9. Condiciones NULL

**Concepto:** para probar nulos se usa `IS NULL`. **No** se puede usar `= NULL`, porque un nulo no es igual a nada (ni a otro nulo).

```sql
SELECT last_name, manager_id
FROM   employees
WHERE  manager_id IS NULL;
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.9](/images/sql/sql3-09.png)

**Álgebra relacional**

```
π last_name, manager_id ( σ manager_id IS NULL (employees) )
```

El único empleado sin jefe es el presidente de la compañía.

---

## 4. Condiciones lógicas: AND, OR y NOT

| Operador | Significado |
|---|---|
| `AND` | Devuelve `TRUE` si **ambas** condiciones son verdaderas |
| `OR` | Devuelve `TRUE` si **al menos una** es verdadera |
| `NOT` | Invierte el resultado de la condición |

### Ejercicio 3.10. Operador AND

```sql
SELECT employee_id, last_name, job_id, salary
FROM   employees
WHERE  salary >= 10000
AND    job_id LIKE '%MAN%';
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.10](/images/sql/sql3-10.png)

**Álgebra relacional**

```
π employee_id, last_name, job_id, salary
  ( σ salary ≥ 10000 ∧ job_id LIKE '%MAN%' (employees) )
```

---

### Ejercicio 3.11. Operador OR

```sql
SELECT employee_id, last_name, job_id, salary
FROM   employees
WHERE  salary >= 10000
OR     job_id LIKE '%MAN%';
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.11](/images/sql/sql3-11.png)

**Álgebra relacional**

```
π employee_id, last_name, job_id, salary
  ( σ salary ≥ 10000 ∨ job_id LIKE '%MAN%' (employees) )
```

Equivale a la unión de dos selecciones: `σ salary ≥ 10000 (employees) ∪ σ job_id LIKE '%MAN%' (employees)`.

---

### Ejercicio 3.12. Operador NOT

```sql
SELECT last_name, job_id
FROM   employees
WHERE  job_id NOT IN ('IT_PROG', 'ST_CLERK', 'SA_REP');
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.12](/images/sql/sql3-12.png)

**Álgebra relacional**

```
π last_name, job_id
  ( σ ¬( job_id = 'IT_PROG' ∨ job_id = 'ST_CLERK' ∨ job_id = 'SA_REP' ) (employees) )
```

`NOT` también se combina con `BETWEEN`, `LIKE` y `IS NULL` (`NOT BETWEEN`, `NOT LIKE`, `IS NOT NULL`).

---

## 5. Reglas de precedencia

Orden en que Oracle evalúa los operadores:

| Orden | Operador |
|---|---|
| 1 | Operadores aritméticos |
| 2 | Operador de concatenación |
| 3 | Condiciones de comparación |
| 4 | `IS [NOT] NULL`, `LIKE`, `[NOT] IN` |
| 5 | `[NOT] BETWEEN` |
| 6 | Distinto de |
| 7 | Operador lógico `NOT` |
| 8 | Operador lógico `AND` |
| 9 | Operador lógico `OR` |

Se pueden usar **paréntesis** para cambiar el orden.

### Ejercicio 3.13. Precedencia de AND y OR

```sql
-- (1) AND se evalúa primero
SELECT last_name, department_id, salary
FROM   employees
WHERE  department_id = 60
OR     department_id = 80
AND    salary > 10000;

-- (2) Con paréntesis se evalúa primero el OR
SELECT last_name, department_id, salary
FROM   employees
WHERE  (department_id = 60
OR      department_id = 80)
AND    salary > 10000;
```

La primera consulta devuelve **todos** los del departamento 60 y, del 80, solo los que ganan más de 10000. La segunda devuelve de ambos departamentos únicamente los que ganan más de 10000.

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.13](/images/sql/sql3-13.png)

**Álgebra relacional**

```
(1) π last_name, department_id, salary
      ( σ department_id = 60 ∨ ( department_id = 80 ∧ salary > 10000 ) (employees) )

(2) π last_name, department_id, salary
      ( σ ( department_id = 60 ∨ department_id = 80 ) ∧ salary > 10000 (employees) )
```

---

## 6. Ordenar filas: ORDER BY

**Concepto:** `ORDER BY` ordena las filas del resultado. Va **al final** de la sentencia `SELECT`.

- `ASC`: ascendente (por defecto).
- `DESC`: descendente.
- Se puede ordenar por columna, expresión, alias o posición de la columna en el `SELECT`, y por varias columnas separadas por comas.
- En Oracle los nulos se consideran el valor más grande: salen al final en orden ascendente (`NULLS FIRST` / `NULLS LAST` lo cambian).

### Ejercicio 3.14. Ordenar el resultado

```sql
-- Más antiguo primero
SELECT last_name, job_id, department_id, hire_date
FROM   employees
ORDER BY hire_date;

-- Más reciente primero
SELECT last_name, job_id, department_id, hire_date
FROM   employees
ORDER BY hire_date DESC;

-- Por alias
SELECT employee_id, last_name, salary*12 annsal
FROM   employees
ORDER BY annsal;

-- Por varias columnas
SELECT last_name, department_id, salary
FROM   employees
ORDER BY department_id, salary DESC;
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.14](/images/sql/sql3-14.png)

**Álgebra relacional**

```
τ hire_date ↑  ( π last_name, job_id, department_id, hire_date (employees) )
τ hire_date ↓  ( π last_name, job_id, department_id, hire_date (employees) )
τ annsal ↑     ( ρ annsal ( π employee_id, last_name, salary*12 (employees) ) )
τ department_id ↑, salary ↓ ( π last_name, department_id, salary (employees) )
```

`τ` es el operador de ordenamiento del álgebra extendida (↑ ascendente, ↓ descendente). Una relación clásica es un conjunto sin orden, por eso `ORDER BY` se ubica como último paso, sobre el resultado final.

---

## 7. Cláusula de límite de filas

**Concepto:** limita el número de filas que devuelve una consulta y permite hacer reportes **Top-N**. Va **después de `ORDER BY`**.

```sql
SELECT ...
FROM   ...
[WHERE ...]
[ORDER BY ...]
[OFFSET desplazamiento {ROW | ROWS}]
[FETCH {FIRST | NEXT} {cantidad | porcentaje PERCENT} {ROW | ROWS} {ONLY | WITH TIES}];
```

### Ejercicio 3.15. FETCH FIRST y OFFSET

```sql
-- Las primeras 5 filas
SELECT employee_id, first_name
FROM   employees
ORDER BY employee_id
FETCH FIRST 5 ROWS ONLY;

-- Saltar 5 filas y traer las 5 siguientes
SELECT employee_id, first_name
FROM   employees
ORDER BY employee_id
OFFSET 5 ROWS FETCH NEXT 5 ROWS ONLY;
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.15](/images/sql/sql3-15.png)

**Álgebra relacional**

```
No existe un operador estándar en el álgebra relacional clásica para limitar filas.
Se describe como un paso final sobre el resultado ordenado:
  tomar las primeras 5 tuplas de  τ employee_id ↑ ( π employee_id, first_name (employees) )
  omitir 5 tuplas y tomar las 5 siguientes de ese mismo resultado ordenado
```

---

## 8. Variables de sustitución (Oracle)

**Concepto:** permiten consultar valores distintos sin reescribir la sentencia. Guardan valores temporalmente con `&` (una vez) o `&&` (se reutiliza) y se pueden usar en:

- Condiciones `WHERE`.
- Cláusulas `ORDER BY`.
- Expresiones de columna.
- Nombres de tabla.
- Sentencias `SELECT` completas.

### Ejercicio 3.16. Variable de un ampersand (&)

SQL Developer abre una ventana **Enter Substitution Variable** y pide el valor.

```sql
SELECT employee_id, last_name, salary, department_id
FROM   employees
WHERE  employee_id = &employee_num;
```

Al escribir `101` en la ventana, devuelve a Kochhar.

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura** (de la ventana de la variable y del resultado)
>
> ![Resultado ejercicio 3.16](/images/sql/sql3-16.png)

**Álgebra relacional**

```
π employee_id, last_name, salary, department_id ( σ employee_id = :employee_num (employees) )
```

La variable es un **parámetro** de la consulta: se sustituye antes de ejecutar y la expresión queda como `σ employee_id = 101`. Es una función de la herramienta cliente, no del álgebra.

---

### Ejercicio 3.17. Nombres de columna, expresiones y texto

```sql
SELECT employee_id, last_name, job_id, &column_name
FROM   employees
WHERE  &condition
ORDER BY &order_column;
```

Valores usados en las ventanas: `salary`, `salary > 15000` y `last_name`.

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.17](/images/sql/sql3-17.png)

**Álgebra relacional**

```
τ last_name ↑ ( π employee_id, last_name, job_id, salary ( σ salary > 15000 (employees) ) )
```

Ya con los valores sustituidos, la consulta equivale a esta expresión.

---

### Ejercicio 3.18. Doble ampersand (&&)

`&&` guarda el valor de la variable y **lo reutiliza** sin volver a preguntar.

```sql
SELECT employee_id, last_name, job_id, &&column_name
FROM   employees
ORDER BY &column_name;
```

Con `department_id` como valor, solo pregunta una vez y usa ese valor en el `SELECT` y en el `ORDER BY`.

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.18](/images/sql/sql3-18.png)

**Álgebra relacional**

```
τ department_id ↑ ( π employee_id, last_name, job_id, department_id (employees) )
```

---

### Ejercicio 3.19. DEFINE, UNDEFINE y VERIFY

- `DEFINE` crea una variable y le asigna un valor (no pregunta nada al ejecutar).
- `UNDEFINE` elimina la variable.
- `SET VERIFY ON` muestra la sentencia **antes y después** de sustituir las variables (aparece en *Script Output*; ejecutar con `F5`).

```sql
DEFINE employee_num = 200

SELECT employee_id, last_name, salary, department_id
FROM   employees
WHERE  employee_id = &employee_num;

UNDEFINE employee_num

SET VERIFY ON
SELECT employee_id, last_name, salary
FROM   employees
WHERE  employee_id = &employee_num;
```

**Resultado en SQL Developer**

> 📷 **Aquí va tu captura**
>
> ![Resultado ejercicio 3.19](/images/sql/sql3-19.png)

**Álgebra relacional**

```
π employee_id, last_name, salary, department_id ( σ employee_id = 200 (employees) )
```

Devuelve a Whalen (empleado 200). `DEFINE`, `UNDEFINE` y `SET VERIFY` son comandos de la herramienta cliente y no tienen operador algebraico.

---

## Resumen

- `WHERE` restringe las filas (selección `σ`) con operadores de comparación, `BETWEEN`, `IN`, `LIKE` e `IS NULL`.
- `AND`, `OR` y `NOT` combinan condiciones; los paréntesis controlan la precedencia.
- `ORDER BY` ordena el resultado final (`ASC` por defecto, `DESC` invierte).
- `FETCH FIRST` y `OFFSET` limitan las filas devueltas (reportes Top-N).
- Las variables de sustitución `&` y `&&`, junto con `DEFINE` y `SET VERIFY`, permiten reutilizar una misma consulta con valores distintos.

*Fuente: presentación SQL_C3 Restricting and Sorting Data, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1. Solo se incluye el contenido de Oracle.*