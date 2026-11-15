---
titulo: "SQL 2: Recuperar datos con la sentencia SELECT"
seccion: "sql"
orden: 2
fecha: "2026-11-15"
resumen: "Capacidades de SELECT, expresiones aritméticas, valores NULL, alias, concatenación, DISTINCT y DESCRIBE, con ejercicios en Oracle SQL Developer y su equivalente en álgebra relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque
**Tema:** Retrieving Data Using the SQL SELECT Statement (presentación SQL_C2)
**Herramienta:** Oracle SQL Developer, esquema HR

## Objetivos

- Listar las capacidades de las sentencias `SELECT`.
- Ejecutar una sentencia `SELECT` básica.
- Usar expresiones aritméticas, alias, concatenación y `DISTINCT`.
- Escribir cada consulta también en álgebra relacional.

## Notación de álgebra relacional usada

| Símbolo | Operador | Equivale en SQL |
|---|---|---|
| `σ` | Selección: filtra filas | `WHERE` |
| `π` | Proyección: elige columnas | lista de columnas del `SELECT` |
| `ρ` | Renombrado | alias (`AS`) |
| `δ` | Eliminación de duplicados | `DISTINCT` |
| `τ` | Ordenamiento (álgebra extendida) | `ORDER BY` |
| `⋈` | Reunión (join) | `JOIN` |
| `∧`, `∨`, `¬` | Y, O, NO | `AND`, `OR`, `NOT` |

En el álgebra relacional clásica una relación es un **conjunto**, así que no tiene filas repetidas. SQL en cambio trabaja con **multiconjuntos**: devuelve duplicados salvo que se use `DISTINCT`. Por eso la proyección `π` clásica equivale a un `SELECT DISTINCT`, y un `SELECT` sin `DISTINCT` corresponde al álgebra de multiconjuntos. Se explica con el ejercicio 2.11.

---

## 1. Capacidades de la sentencia SELECT

Un `SELECT` puede hacer tres cosas:

- **Proyección:** elegir las columnas que se quieren ver.
- **Selección:** elegir las filas que se quieren ver (se estudia en SQL 3, con `WHERE`).
- **Unión (join):** combinar datos de varias tablas (se estudia más adelante).

> En el escenario de la presentación (*HR Application*), un usuario quiere la lista de empleados del departamento de Contabilidad: la consulta elige columnas (proyección), filtra por departamento (selección) y entrega un conjunto resultado.

## 2. Reglas para escribir sentencias SQL

- Las sentencias SQL **no distinguen mayúsculas de minúsculas** (los datos guardados sí).
- Pueden escribirse en una o varias líneas.
- Las palabras clave **no se abrevian ni se parten** entre líneas.
- Las cláusulas se ponen normalmente en líneas separadas.
- Se usa sangría para que sea más legible.

## 3. Sentencia SELECT básica

```sql
SELECT *|{[DISTINCT] columna [alias], ...}
FROM   tabla;
```

- `SELECT` identifica **las columnas** que se muestran.
- `FROM` identifica **la tabla** que contiene esas columnas.

**Ejecutar en SQL Developer:** escribir la sentencia en la hoja de trabajo y usar **Ejecutar sentencia** (`Ctrl+Enter`, muestra el resultado en una cuadrícula) o **Ejecutar script** (`F5`, muestra el resultado como texto en *Script Output*). Los encabezados de columna salen en mayúsculas y alineados a la izquierda por defecto.

---

## 4. Ejercicios

### Ejercicio 2.1. Seleccionar todas las columnas

**Concepto:** el asterisco `*` devuelve todas las columnas de la tabla.

```sql
SELECT *
FROM   departments;
```

**Resultado en SQL Developer**

>(/img/sql/sql2-01.png)

**Álgebra relacional**

```
departments
```

Sin proyección ni selección, el resultado es la relación completa.

---

### Ejercicio 2.2. Seleccionar columnas específicas

**Concepto:** se listan las columnas separadas por comas, en el orden en que se quieren ver.

```sql
SELECT department_id, location_id
FROM   departments;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-02.png)

**Álgebra relacional**

```
π department_id, location_id (departments)
```

---

### Ejercicio 2.3. La tabla DUAL

**Concepto:** `dual` es una tabla que Oracle crea automáticamente. Tiene **una columna** llamada `DUMMY` (tipo `VARCHAR2(1)`) y **una fila** con el valor `X`. Sirve para evaluar expresiones o funciones que no dependen de ninguna tabla.

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

`dual` se trata como una relación de una sola tupla. `SYSDATE` es una función que se evalúa para cada tupla de esa relación.

---

### Ejercicio 2.4. Expresiones aritméticas

**Concepto:** se pueden crear expresiones con datos numéricos y de fecha usando `+`, `-`, `*` y `/`.

```sql
SELECT last_name, salary, salary + 300
FROM   employees;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-04.png)

**Álgebra relacional**

```
π last_name, salary, salary + 300 (employees)
```

Es una proyección generalizada: en la lista de la proyección se permiten expresiones calculadas.

---

### Ejercicio 2.5. Precedencia de operadores

**Concepto:** `*` y `/` se evalúan antes que `+` y `-`. Los paréntesis cambian el orden.

```sql
SELECT last_name, salary, 12*salary + 100
FROM   employees;

SELECT last_name, salary, 12*(salary + 100)
FROM   employees;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-051.png)
> (/img/sql/sql2-052.png)

**Álgebra relacional**

```
π last_name, salary, 12*salary + 100   (employees)
π last_name, salary, 12*(salary + 100) (employees)
```

---

### Ejercicio 2.6. Valores NULL

**Concepto:** `NULL` es un valor no disponible, no asignado, desconocido o no aplicable. **No es lo mismo que cero o un espacio en blanco.** Una expresión aritmética que contiene un `NULL` da como resultado `NULL`.

```sql
SELECT last_name, job_id, salary, commission_pct
FROM   employees;

SELECT last_name, 12*salary*commission_pct
FROM   employees;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-061.png)
> (/img/sql/sql2-062.png)


**Álgebra relacional**

```
π last_name, job_id, salary, commission_pct (employees)
π last_name, 12*salary*commission_pct (employees)
```

Los empleados sin comisión (`commission_pct` nulo) aparecen con `NULL` en la segunda consulta, porque cualquier operación aritmética con `NULL` produce `NULL` (lógica de tres valores: verdadero, falso y desconocido).

---

### Ejercicio 2.7. Alias de columna

**Concepto:** un alias renombra el encabezado de una columna; es útil con cálculos. Va justo después de la columna, con la palabra `AS` opcional. Si el alias tiene **espacios, caracteres especiales o distingue mayúsculas**, necesita **comillas dobles**.

```sql
SELECT last_name AS name, commission_pct comm
FROM   employees;

SELECT last_name "Name", salary*12 "Annual Salary"
FROM   employees;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-071.png)
> (/img/sql/sql2-072.png)

**Álgebra relacional**

```
ρ name, comm (π last_name, commission_pct (employees))
ρ Name, Annual_Salary (π last_name, salary*12 (employees))
```

---

### Ejercicio 2.8. Operador de concatenación

**Concepto:** en Oracle el operador de concatenación son **dos barras verticales** (`||`). Une columnas o cadenas y crea una columna resultado de tipo carácter.

```sql
SELECT last_name||job_id AS "Employees"
FROM   employees;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-08.png)

**Álgebra relacional**

```
ρ Employees (π last_name || job_id (employees))
```

---

### Ejercicio 2.9. Cadenas literales

**Concepto:** un literal es un carácter, número o fecha incluido en el `SELECT`. Los literales de carácter y de fecha van entre **comillas simples**, y se muestran una vez por cada fila devuelta.

```sql
SELECT last_name || ' is a ' || job_id AS "Employee Details"
FROM   employees;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-09.png)

**Álgebra relacional**

```
ρ Employee_Details (π last_name || ' is a ' || job_id (employees))
```

---

### Ejercicio 2.10. Operador de comillas alternativo (q)

**Concepto:** el operador `q` permite escoger **tu propio delimitador** para una cadena. Así se puede escribir una comilla simple dentro del texto sin duplicarla, y se gana legibilidad.

```sql
SELECT department_name ||
       q'[ Department´s Manager Id: ]'
       || manager_id
       AS "Department and Manager"
FROM   departments;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-10.png)

**Álgebra relacional**

```
ρ Department_and_Manager
  (π department_name || ' Department''s Manager Id: ' || manager_id (departments))
```

Cuando `manager_id` es `NULL` (por ejemplo el departamento *Contracting*), Oracle trata el `NULL` como cadena vacía en la concatenación, y el texto sale sin número al final.

---

### Ejercicio 2.11. Filas duplicadas y DISTINCT

**Concepto:** por defecto una consulta muestra **todas las filas, incluidas las duplicadas**. `DISTINCT` elimina las repetidas.

```sql
SELECT department_id
FROM   employees;

SELECT DISTINCT department_id
FROM   employees;
```

**Resultado en SQL Developer**

> (/img/sql/sql2-111.png)
> (/img/sql/sql2-112.png)


**Álgebra relacional**

```
π department_id (employees)          -- sin DISTINCT (álgebra de multiconjuntos)
δ ( π department_id (employees) )    -- con DISTINCT
```

En el álgebra relacional clásica una relación es un conjunto, así que `π` ya elimina duplicados y equivale a `SELECT DISTINCT`. Para modelar el comportamiento por defecto de SQL se usa el álgebra de multiconjuntos (*bag algebra*), donde `π` conserva los repetidos y el operador `δ` (eliminación de duplicados) corresponde a `DISTINCT`.

---

### Ejercicio 2.12. Estructura de una tabla con DESCRIBE

**Concepto:** el comando `DESCRIBE` muestra la estructura de una tabla: nombre de columnas, tipo de dato y si admite nulos. Es un comando de SQL Developer y SQL\*Plus, no una sentencia SQL. En SQL Developer también se ve seleccionando la tabla en el árbol de **Conexiones** y abriendo la pestaña **Columnas**.

```sql
DESCRIBE departments
```

**Resultado en SQL Developer**

> (/img/sql/sql2-12.png)

**Álgebra relacional**

```
No aplica: DESCRIBE consulta metadatos, no tuplas.
Esquema de la relación: departments(department_id, department_name, manager_id, location_id)
```

---

## Resumen

Una sentencia `SELECT` bien escrita:

- Devuelve todas las filas y columnas de una tabla (`SELECT *`).
- Devuelve columnas específicas (proyección).
- Usa alias para mostrar encabezados más descriptivos.
- Permite cálculos, concatenación y literales, y `DISTINCT` elimina duplicados.
- Con `DESCRIBE` se consulta la estructura de una tabla.

*Fuente: presentación SQL_C2 Retrieving Data Using the SQL SELECT Statement, Bases de Datos 1, Ing. Christian Felipe Duarte, 2026-1. Solo se incluye el contenido de Oracle.*