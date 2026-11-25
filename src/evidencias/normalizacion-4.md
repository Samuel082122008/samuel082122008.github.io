---
titulo: "Normalización 4: Ejemplo guiado, taller mecánico (de 1FN a 3FN)"
seccion: "normalizacion"
orden: 4
fecha: "2026-11-25"
resumen: "Segundo ejemplo paso a paso: las órdenes de servicio de un taller mecánico pasan por 1FN, 2FN y 3FN, incluyendo una cadena transitiva orden, vehículo y propietario."
---

**Contexto.** Un taller mecánico anota cada orden de servicio en una sola tabla: la fecha, el vehículo, su propietario y los servicios realizados con las horas de trabajo. Con el tiempo los mismos vehículos, propietarios y servicios se repiten en muchas órdenes. Voy a normalizar esa tabla paso a paso hasta llegar a 3FN.

## Paso 0. Esquema inicial

```
ORDEN_SERVICIO(ID_Orden, Fecha, Placa, Marca, Modelo,
               ID_Prop, Nombre_Prop, Tel_Prop,
               Servicios{Cod_Serv, Desc_Serv, Precio_Serv, Horas})
```

![Esquema inicial sin normalizar](/img/normalizacion/ej2-paso0-sin-normalizar.png)

La columna **Servicios** junta varios servicios en una celda, así que el esquema **viola 1FN**.

## Paso 1. Primera forma normal (1FN)

**Problema que corrijo:** grupo repetido dentro de una celda.
**Cómo:** una fila por cada servicio de cada orden. La clave queda como `(ID_Orden, Cod_Serv)`.

![Esquema en 1FN](/img/normalizacion/ej2-paso1-1fn.png)

Estas son las dependencias funcionales:

- `ID_Orden → Fecha, Placa`
- `Placa → Marca, Modelo, ID_Prop`
- `ID_Prop → Nombre_Prop, Tel_Prop`
- `Cod_Serv → Desc_Serv, Precio_Serv`
- `(ID_Orden, Cod_Serv) → Horas`

**Qué pasaría si me quedo aquí:**

- *Actualización:* si Marta Ríos cambia de teléfono, hay que modificar 3 filas (las dos de O-101 y la de O-103). Si se olvida una, tiene dos teléfonos.
- *Inserción:* no se puede registrar un servicio nuevo en el catálogo hasta que se use en una orden.
- *Eliminación:* si se borra la orden O-103 (el único servicio de Frenos), se pierde el servicio y su precio.

## Paso 2. Segunda forma normal (2FN)

**Problema que corrijo:** dependencias **parciales**. Los datos de la orden dependen solo de `ID_Orden`, y los datos del servicio solo de `Cod_Serv`. Únicamente `Horas` depende de la clave completa.
**Cómo:** creo `ORDEN`, `SERVICIO` y `DETALLE_ORDEN`.

![Esquema en 2FN](/img/normalizacion/ej2-paso2-2fn.png)

Quedaron resueltas las dependencias parciales, pero `ORDEN` aún tiene una cadena transitiva (en amarillo): `ID_Orden → Placa → Marca, Modelo, ID_Prop → Nombre_Prop, Tel_Prop`.

## Paso 3. Tercera forma normal (3FN)

**Problema que corrijo:** dependencias **transitivas**. La marca y el modelo dependen de la placa, y el nombre y el teléfono del propietario dependen del propietario, no de la orden.
**Cómo:** saco `VEHICULO` y `PROPIETARIO`.

![Esquema en 3FN](/img/normalizacion/ej2-paso3-3fn.png)

```
PROPIETARIO(ID_Prop PK, Nombre_Prop, Tel_Prop)
VEHICULO(Placa PK, Marca, Modelo, ID_Prop FK)
ORDEN(ID_Orden PK, Fecha, Placa FK)
SERVICIO(Cod_Serv PK, Desc_Serv, Precio_Serv)
DETALLE_ORDEN(ID_Orden PK/FK, Cod_Serv PK/FK, Horas)
```

**Verificación.** Todo atributo que no es clave depende de la clave completa y de nada más. Cambiar el teléfono de un propietario es modificar una fila, y se puede registrar un vehículo o un servicio nuevo sin necesidad de una orden.

## ¿Qué aprendí?

- Una **cadena de dependencias** (`Orden → Placa → Propietario`) es un patrón típico de dependencia transitiva. Se rompe con una tabla por cada eslabón.
- Una misma tabla puede tener dependencias parciales y transitivas a la vez. Conviene corregirlas en orden: primero 1FN, luego 2FN y por último 3FN.
- `Horas` pertenece a la combinación orden–servicio, así que debe quedarse en la tabla intermedia y no en `ORDEN` ni en `SERVICIO`.
- Con `Precio_Serv` en `SERVICIO`, un cambio de precio afectaría el historial de órdenes ya cobradas. En un sistema real convendría guardar también el precio cobrado en `DETALLE_ORDEN`. Es una decisión de diseño que depende del negocio.
- Comparar el esquema antes y después me mostró que normalizar reduce la repetición y los errores de actualización, pero obliga a cruzar más tablas al consultar.