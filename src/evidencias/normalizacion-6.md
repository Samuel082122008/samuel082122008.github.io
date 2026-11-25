---
titulo: "Normalización 6: Ejemplo avanzado, perfiles de desarrolladores (de 1FN a 4FN)"
seccion: "normalizacion"
orden: 6
fecha: "2026-11-25"
resumen: "Ejemplo completo con dependencias parciales, transitivas y multivaluadas: una tabla de perfiles de desarrolladores llega hasta la cuarta forma normal."
---

**Contexto.** Una empresa de software guarda el perfil de cada desarrollador: a qué equipo pertenece, qué lenguajes de programación maneja y qué idiomas habla. Los lenguajes y los idiomas **no tienen relación entre sí**: que alguien sepa Java no tiene que ver con que hable inglés. Este ejemplo muestra qué pasa cuando se mezclan dos listas independientes en una misma tabla, y cómo se resuelve con la 4FN.

## Paso 0. Esquema inicial

```
PERFIL(ID_Dev, Nombre_Dev, ID_Equipo, Nombre_Equipo, Lider,
       Lenguajes{ }, Idiomas{ })
```

![Esquema inicial sin normalizar](/img/normalizacion/ej4-paso0-sin-normalizar.png)

Lenguajes e Idiomas guardan varios valores en una celda, así que **viola 1FN**.

## Paso 1. Primera forma normal (1FN)

Hay que dejar un valor por celda. Como las dos listas son independientes, la forma de lograrlo en una sola tabla es repetir **todas las combinaciones** de lenguaje e idioma de cada desarrollador. La clave queda como `(ID_Dev, Lenguaje, Idioma)`.

![Esquema en 1FN](/img/normalizacion/ej4-paso1-1fn.png)

Paula (2 lenguajes × 2 idiomas) ocupa 4 filas, y sus datos personales y de equipo se repiten en todas.

Estas son las dependencias:

- `ID_Dev → Nombre_Dev, ID_Equipo` (parcial)
- `ID_Equipo → Nombre_Equipo, Lider` (transitiva)
- `ID_Dev →→ Lenguaje | Idioma` (**dependencia multivaluada**: el conjunto de lenguajes de un desarrollador es independiente del conjunto de idiomas)

**Qué pasaría si me quedo aquí:**

- *Inserción:* si Paula aprende Go, hay que agregar **dos** filas (Go × Español y Go × Inglés). Si solo se agrega una, parecería que con Go solo habla un idioma, lo cual es falso.
- *Actualización:* si el líder del equipo Frontend cambia, hay que modificar 4 filas (las de D02 y D03).
- *Eliminación:* si Nicolás deja de hablar inglés, hay que borrar su fila de cada lenguaje.

## Paso 2. Segunda forma normal (2FN)

**Problema:** los datos del desarrollador y del equipo dependen solo de `ID_Dev`, una parte de la clave.
**Cómo lo corrijo:** creo `DESARROLLADOR` y dejo en `PERFIL` solo la clave.

![Esquema en 2FN](/img/normalizacion/ej4-paso2-2fn.png)

## Paso 3. Tercera forma normal (3FN) y BCNF

**Problema:** en `DESARROLLADOR`, `Nombre_Equipo` y `Lider` dependen de `ID_Equipo`, no del desarrollador (transitiva).
**Cómo lo corrijo:** creo `EQUIPO`.

![Esquema en 3FN](/img/normalizacion/ej4-paso3-3fn.png)

Ahora las tres tablas cumplen 3FN, y también BCNF. `PERFIL` tiene todas sus columnas en la clave, así que no tiene determinantes problemáticos. Pero **sigue teniendo el problema de las combinaciones repetidas** (en azul). Ni 3FN ni BCNF detectan esto, porque no es una dependencia funcional sino una multivaluada.

## Paso 4. Cuarta forma normal (4FN)

**Problema:** `ID_Dev →→ Lenguaje` y `ID_Dev →→ Idioma` son independientes entre sí. Mezclarlas obliga a guardar todas las combinaciones.
**Cómo lo corrijo:** separo cada lista en su propia tabla.

![Esquema en 4FN](/img/normalizacion/ej4-paso4-4fn.png)

```
EQUIPO(ID_Equipo PK, Nombre_Equipo, Lider)
DESARROLLADOR(ID_Dev PK, Nombre_Dev, ID_Equipo FK)
DEV_LENGUAJE(ID_Dev PK/FK, Lenguaje PK)
DEV_IDIOMA(ID_Dev PK/FK, Idioma PK)
```

**Verificación.** Si Paula aprende Go, se agrega **una sola fila** en `DEV_LENGUAJE`. Si deja de hablar inglés, se borra una fila de `DEV_IDIOMA`. No hay combinaciones inventadas ni repetidas.

## ¿Qué aprendí?

- Hay problemas que **3FN y BCNF no ven**: las dependencias multivaluadas. Esas se resuelven con 4FN.
- Una **dependencia multivaluada** aparece cuando dos listas son independientes entre sí. Si se guardan en una misma tabla, se multiplican las filas.
- Una tabla con todas sus columnas en la clave puede estar en BCNF y aun así tener anomalías.
- El orden de trabajo es el mismo: primero 1FN, luego 2FN y 3FN, y recién al final se revisan BCNF y 4FN.
- Para decidir cuánto normalizar hay que preguntarse si los datos son realmente independientes, algo que solo se sabe conociendo el negocio.