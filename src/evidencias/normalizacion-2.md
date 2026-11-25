---
titulo: "Normalización 2: Correcciones y casos posibles"
seccion: "normalizacion"
orden: 2
fecha: "2026-10-11"
resumen: "Revisé el taller anterior, corregí supuestos del modelo (diagnóstico, venta con varios productos) y exploré qué cambia en la normalización si cambian las reglas del negocio."
---

Después de entregar el primer taller volvimos sobre nuestro trabajo con ojo crítico. Corregimos supuestos que habíamos dado por buenos y probamos qué pasaría si el negocio funcionara distinto. El resultado fue una segunda versión del Excel con las correcciones y varios **casos hipotéticos** para cada esquema.

## Archivos de la entrega

- [Descargar el Excel con las correcciones y los casos posibles](/docs/normalizacion/normalizacion-casos-posibles.xlsx)
- [Excel del taller original, para comparar](/docs/normalizacion/normalizacion-taller.xlsx)

## ¿Qué hice?

**1. Correcciones en la clínica.**

- Quité `Hora_Cita` del esquema como atributo redundante respecto a la fecha.
- Detecté una dependencia transitiva más: `Diagnóstico → Tratamiento_Recomendado`. Si el protocolo de un diagnóstico cambia, habría que editar todas las citas con ese diagnóstico. Por eso agregué un paso nuevo y la tabla `DIAGNOSTICO`.
- El esquema final quedó en 5 tablas: `CITA_CLINICA`, `PACIENTE`, `DOCTOR`, `CONSULTORIO` y `DIAGNOSTICO`.

**2. Correcciones en la tienda.** Antes asumíamos que cada venta tenía un solo producto. Pero una venta puede incluir varios, así que la clave real es compuesta (`ID_Venta + ID_Producto`).

- Esto cambia el análisis: ya hay **dependencias parciales**, por ejemplo `ID_Venta → Fecha_Venta, ID_Sucursal, ID_Vendedor` y `ID_Producto → Nombre, Precio, Categoría`. El esquema original no estaba en 2FN, sino solo en 1FN.
- Resolví 6 dependencias parciales y 4 transitivas (2 de la sucursal y 2 del vendedor).
- El esquema final quedó en 5 tablas: `VENTA`, `DETALLE_VENTA`, `PRODUCTO`, `SUCURSAL` y `VENDEDOR`.

**3. Casos posibles en la clínica.** Cambié una regla del negocio y rehice el esquema:

- **Caso 1.** Cada doctor tiene exactamente un consultorio y cada consultorio pertenece a un solo doctor. El consultorio sale de `CITA_CLINICA` y pasa a `DOCTOR` como atributo único (UK), porque ya no depende de la cita sino del doctor.
- **Caso 2.** Cada piso tiene una sola especialidad. Aparece la dependencia `Piso → Especialidad`, y la cadena `Cita → Consultorio → Piso → Especialidad` obliga a crear la tabla `PISO` y dejar `CONSULTORIO` solo con el piso como FK.

**4. Casos posibles en la tienda.** Probé dos formas de definir la comisión:

- **Escenario A.** La comisión depende de la sucursal. Cada sucursal define su política y la comisión pasa a la tabla `SUCURSAL`.
- **Escenario B.** La comisión depende de cada transacción (por ejemplo, escalonada según la cantidad vendida). Entonces depende de la clave completa de `DETALLE_VENTA` y se queda allí.

## ¿Qué aprendí?

- Una normalización es **correcta solo respecto a las reglas del negocio** que se suponen. Un cambio en una sola regla (una venta con varios productos, o una comisión que depende de otra cosa) cambia las dependencias y, por tanto, las tablas.
- Revisar el propio trabajo sirve: encontramos errores al preguntarnos si cada dependencia **siempre** se cumple.
- Una clave compuesta obliga a revisar la 2FN. Un atributo puede depender de solo una parte de la clave aunque antes el esquema pareciera limpio.
- Dónde vive un atributo se decide según de qué depende: de la cita, del doctor, del piso, de la sucursal o de la venta.
- Plantear casos hipotéticos es una buena forma de entender las formas normales, porque obliga a razonar la dependencia en lugar de memorizar la regla.