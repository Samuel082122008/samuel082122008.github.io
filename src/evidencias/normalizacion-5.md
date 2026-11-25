---
titulo: "Normalización 5: Ejemplo avanzado, tutorías de idiomas (de 1FN a BCNF)"
seccion: "normalizacion"
orden: 5
fecha: "2026-11-25"
resumen: "Ejemplo donde 3FN no es suficiente: una tabla de tutorías que cumple 3FN pero viola BCNF, con claves candidatas que se solapan y el costo de resolverlo."
---

**Contexto.** Una academia de idiomas asigna tutores personalizados a sus estudiantes. Las reglas del negocio son las siguientes:

1. Cada tutor enseña **un solo idioma**.
2. Un estudiante puede tener varias tutorías, pero **un solo tutor por idioma**.
3. Cada tutoría tiene una nota.

Este ejemplo muestra el caso típico donde una tabla está en 3FN y aun así queda una anomalía, porque aparecen **claves candidatas que se solapan**.

## Paso 0. Esquema inicial

```
INSCRIPCION(ID_Estudiante, Nombre_Est, Telefono,
            Tutorias{Idioma, ID_Tutor, Nombre_Tutor, Nota})
```

![Esquema inicial sin normalizar](/img/normalizacion/ej3-paso0-sin-normalizar.png)

La columna **Tutorías** guarda varias tutorías dentro de una celda, así que **viola 1FN**.

## Paso 1. Primera forma normal (1FN)

Dejo una fila por cada estudiante e idioma. Por la regla 2, `(ID_Estudiante, Idioma)` identifica cada fila y la tomo como clave primaria.

![Esquema en 1FN](/img/normalizacion/ej3-paso1-1fn.png)

Estas son las dependencias funcionales:

- `ID_Estudiante → Nombre_Est, Telefono` (parcial: depende de una parte de la clave)
- `(ID_Estudiante, Idioma) → ID_Tutor, Nota`
- `ID_Tutor → Nombre_Tutor` (transitiva)
- `ID_Tutor → Idioma` (por la regla 1)

Fíjate en la última: por la regla 1, el tutor determina el idioma. Además hay **dos claves candidatas**: `(ID_Estudiante, Idioma)` y `(ID_Estudiante, ID_Tutor)`.

## Paso 2. Segunda forma normal (2FN)

**Problema:** `Nombre_Est` y `Telefono` dependen solo de `ID_Estudiante`, una parte de la clave.
**Cómo lo corrijo:** creo la tabla `ESTUDIANTE`.

![Esquema en 2FN](/img/normalizacion/ej3-paso2-2fn.png)

## Paso 3. Tercera forma normal (3FN)

**Problema:** `Nombre_Tutor` depende de `ID_Tutor`, que no es clave (dependencia transitiva).
**Cómo lo corrijo:** creo la tabla `TUTOR`.

![Esquema en 3FN](/img/normalizacion/ej3-paso3-3fn.png)

Este esquema **cumple 3FN**. La dependencia `ID_Tutor → Idioma` no la rompe, porque `Idioma` forma parte de una clave candidata. Aun así queda una anomalía:

- Nada impide insertar `(E02, Francés, T1)`, aunque T1 solo enseña inglés. El idioma del tutor queda guardado en una tabla que no lo controla.
- No se puede registrar que un tutor nuevo enseña alemán hasta que un estudiante lo tome.

## Paso 4. Forma normal de Boyce-Codd (BCNF)

**Problema:** `ID_Tutor → Idioma` tiene como determinante a `ID_Tutor`, que **no es clave candidata** en `TUTORIA`. Esa es la definición de una violación de BCNF.
**Cómo lo corrijo:** muevo `Idioma` a `TUTOR`, donde sí depende de la clave, y dejo `TUTORIA` con la clave `(ID_Estudiante, ID_Tutor)`.

![Esquema en BCNF](/img/normalizacion/ej3-paso4-bcnf.png)

```
ESTUDIANTE(ID_Estudiante PK, Nombre_Est, Telefono)
TUTOR(ID_Tutor PK, Nombre_Tutor, Idioma)
TUTORIA(ID_Estudiante PK/FK, ID_Tutor PK/FK, Nota)
```

**Verificación.** Todo determinante es clave en su tabla. Un tutor siempre tiene un solo idioma, y se puede registrar un tutor sin estudiantes. La descomposición es **sin pérdida**: la intersección de `TUTOR` y `TUTORIA` es `ID_Tutor`, que es clave de `TUTOR`, así que al unirlas recupero exactamente la tabla original.

**El costo.** La regla 2 (*un estudiante no puede tener dos tutores del mismo idioma*) dependía de `(ID_Estudiante, Idioma) → ID_Tutor`. En BCNF esa dependencia ya no cabe en una sola tabla: el esquema no puede garantizarla solo con claves. Habría que controlarla con una restricción adicional o la propia aplicación.

## ¿Qué aprendí?

- **3FN y BCNF no siempre coinciden.** Se separan cuando hay claves candidatas que se solapan y un atributo de una clave depende de otro atributo que no es clave.
- BCNF exige que **todo determinante sea clave candidata**, sin la excepción para atributos primos que sí permite 3FN.
- Para comprobar si una descomposición es correcta hay que verificar que sea **sin pérdida**: que al unir las tablas se recupere la original.
- Normalizar hasta BCNF depende del caso. Si la regla que se pierde es crítica, hay que decidir con cuidado qué esquema conviene.