---
titulo: "Normalización 3: Ejemplo guiado, matrículas universitarias (de 1FN a 3FN)"
seccion: "normalizacion"
orden: 3
fecha: "2026-11-25"
resumen: "Ejemplo paso a paso: una tabla de matrículas con cursos repetidos se lleva a 1FN, 2FN y 3FN, mostrando en cada paso qué dependencia se corrige y por qué."
---

**Contexto.** Una universidad registra las matrículas de sus estudiantes en una sola tabla: quién es el estudiante, a qué programa pertenece, qué cursos cursa, quién dicta cada curso y qué nota sacó. Todo está en una misma hoja, y eso trae problemas. En este ejemplo la normalizo paso a paso, desde un esquema sin normalizar hasta 3FN.

## Paso 0. Esquema inicial

```
MATRICULA(ID_Estudiante, Nombre_Est, Programa, Facultad,
          Cursos{Cod_Curso, Nombre_Curso, Creditos,
                 ID_Profesor, Nombre_Prof, Oficina, Nota})
```

![Esquema inicial sin normalizar](/img/normalizacion/ej1-paso0-sin-normalizar.png)

La columna **Cursos** guarda varios cursos dentro de una misma celda, así que el esquema **viola 1FN**: cada celda debe tener un solo valor.

## Paso 1. Primera forma normal (1FN)

**Problema que corrijo:** un grupo repetido dentro de una celda.
**Cómo:** dejo una fila por cada pareja estudiante–curso. La clave pasa a ser compuesta: `(ID_Estudiante, Cod_Curso)`.

![Esquema en 1FN](/img/normalizacion/ej1-paso1-1fn.png)

Ya cumple 1FN, pero tiene mucha repetición (en rojo). Estas son las dependencias funcionales:

- `ID_Estudiante → Nombre_Est, Programa`
- `Programa → Facultad`
- `Cod_Curso → Nombre_Curso, Creditos, ID_Profesor`
- `ID_Profesor → Nombre_Prof, Oficina`
- `(ID_Estudiante, Cod_Curso) → Nota`

**Qué pasaría si me quedo aquí:**

- *Actualización:* si el Dr. Ruiz cambia de oficina, hay que modificar 3 filas (todas las matrículas de MAT101). Si se olvida una, el mismo profesor tiene dos oficinas.
- *Inserción:* no se puede registrar un curso nuevo hasta que un estudiante se matricule.
- *Eliminación:* si Ana Torres retira PSI100, que solo tiene una matrícula, desaparecen el curso y la información de la Dra. Vega.

## Paso 2. Segunda forma normal (2FN)

**Problema que corrijo:** dependencias **parciales**. Con clave compuesta, varios atributos dependen de solo una parte de ella: los datos del estudiante dependen de `ID_Estudiante` y los del curso dependen de `Cod_Curso`. Solo `Nota` depende de la clave completa.
**Cómo:** separo en tres tablas, `ESTUDIANTE`, `CURSO` y `MATRICULA`.

![Esquema en 2FN](/img/normalizacion/ej1-paso2-2fn.png)

Las dependencias parciales desaparecieron. Pero quedan dos **dependencias transitivas** (en amarillo): `Programa → Facultad` en `ESTUDIANTE` e `ID_Profesor → Nombre_Prof, Oficina` en `CURSO`.

## Paso 3. Tercera forma normal (3FN)

**Problema que corrijo:** dependencias **transitivas**, donde un atributo que no es clave determina a otros que tampoco lo son.
**Cómo:** saco `PROGRAMA` (con su facultad) y `PROFESOR` (con su oficina), y los dejo conectados mediante llaves foráneas.

![Esquema en 3FN](/img/normalizacion/ej1-paso3-3fn.png)

```
PROGRAMA(Programa PK, Facultad)
ESTUDIANTE(ID_Estudiante PK, Nombre_Est, Programa FK)
PROFESOR(ID_Profesor PK, Nombre_Prof, Oficina)
CURSO(Cod_Curso PK, Nombre_Curso, Creditos, ID_Profesor FK)
MATRICULA(ID_Estudiante PK/FK, Cod_Curso PK/FK, Nota)
```

**Verificación.** En cada tabla, todo atributo que no es clave depende de la clave completa y de nada más. Ahora el cambio de oficina del Dr. Ruiz toca **una sola fila**, se puede registrar un curso sin matrículas y retirar una matrícula ya no borra información del curso ni del profesor.

## ¿Qué aprendí?

- Cada forma normal corrige un tipo distinto de dependencia: **1FN** (valores atómicos), **2FN** (dependencias parciales) y **3FN** (dependencias transitivas).
- La 2FN solo puede fallar cuando la clave es compuesta, por eso aparece recién después de pasar a 1FN.
- Antes de decidir una tabla hay que listar las dependencias funcionales: son las que dicen dónde debe vivir cada atributo.
- Normalizar no pierde información: las tablas se reconectan con las llaves foráneas.
- Para leer una matrícula completa ahora hay que cruzar varias tablas. Es el precio de tener datos consistentes.
- Aquí usé `Programa` como clave por simplicidad. En un sistema real usaría un identificador numérico.