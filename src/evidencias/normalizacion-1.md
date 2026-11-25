---
titulo: "Normalización 1: Taller de dependencias funcionales y formas normales"
seccion: "normalizacion"
orden: 1
fecha: "2026-10-11"
resumen: "Analicé dependencias funcionales, formas normales y anomalías en una clínica y una tienda, y llevé ambos esquemas a 3FN. También normalicé a 1FN un registro de asistencia."
---

Este taller lo hice en grupo de tres para Bases de Datos 1. Partimos de esquemas empresariales sin datos de ejemplo y tuvimos que **razonar desde el negocio**: qué determina a qué, qué anomalías aparecen y hasta dónde conviene normalizar. El desarrollo quedó en un documento de Word (respuestas) y en un Excel (normalización paso a paso).

## Archivos de la entrega

- [Descargar el Word con las respuestas del taller](/docs/normalizacion/normalizacion-taller-respuestas.docx) (Partes 1, 3 y 4)
- [Descargar el Excel con la normalización paso a paso](/docs/normalizacion/normalizacion-taller.xlsx) (Parte 2, dependencias, 3FN y BCNF)
- [Ver el enunciado del taller (PDF)](/docs/normalizacion/normalizacion-enunciado.pdf)

## ¿Qué hice?

**Parte 1. Análisis de dos esquemas.** Para cada tabla grande hice tres cosas: enumeré todas las dependencias funcionales con su justificación de negocio, determiné en qué forma normal estaba y describí tres anomalías (inserción, actualización y eliminación).

- **CITA_CLINICA** (citas, pacientes, doctores y consultorios). La clave es `ID_Cita`. Está en 2FN pero no en 3FN, por cinco dependencias transitivas: dos del paciente (`ID_Paciente → Nombre, Teléfono`), dos del doctor (`ID_Doctor → Nombre, Especialidad`) y una del consultorio (`Consultorio_Asignado → Piso`). También analicé por qué `Especialidad_Doctor → Piso_Consultorio` **no** es una dependencia válida: una especialidad puede repartirse en varios consultorios y pisos.
- **VENTA_SUCURSAL** (ventas en varias sucursales). También está en 2FN y no en 3FN. Encontré siete dependencias transitivas: dos de la sucursal, tres del producto y dos del vendedor. Para el impacto usé ejemplos con números, como una sucursal que se muda de ciudad y tiene 800 ventas históricas, o un producto que sube de precio y se vendió 300 veces.

**Parte 2. Normalización paso a paso (Excel).** En cada paso escribí el problema que corregía, qué pasaría si no lo corregía y el nuevo esquema con PK y FK.

- La clínica quedó en 4 tablas: `CITA_CLINICA`, `PACIENTE`, `DOCTOR` y `CONSULTORIO`.
- La tienda quedó en 4 tablas: `VENTA`, `SUCURSAL`, `PRODUCTO` y `VENDEDOR`.
- En ambos casos comparé una operación típica antes y después. Actualizar un dato se vuelve mucho más simple (una sola fila), pero leer una cita o una venta completa requiere cruzar varias tablas.

**Parte 3. BCNF.** Revisé cada tabla buscando determinantes que no fueran clave candidata. No encontré ninguno, así que 3FN y BCNF coinciden en ambos esquemas. Defendí la decisión con la carga del enunciado (100.000 registros, 50 cambios por hora y 1.000 búsquedas al día). En la clínica son 1.200 escrituras diarias contra 1.000 lecturas, lo que favorece mantener el esquema normalizado. En la tienda las lecturas dominan, pero no existe una versión alternativa que justifique desnormalizar.

**Parte 4. REGISTRO_ASISTENCIA y 1FN.** El esquema guarda varias fechas y varios proyectos en una sola celda, así que viola 1FN. Además, fechas y proyectos son independientes entre sí. Lo separé en tres tablas: `EMPLEADO`, `ASISTENCIA` y `PROYECTO_ASIGNADO`. Comparé dos búsquedas (por fecha, y por fecha más proyecto con un JOIN) y discutí cuándo tendría sentido, si acaso, guardar todo en una sola columna de texto.

## ¿Qué aprendí?

- Tener una **clave simple** garantiza 2FN, porque no puede haber dependencias parciales. Por eso en estos esquemas el problema era la 3FN.
- Una dependencia transitiva no es solo un tema de teoría: genera anomalías reales, como datos repetidos que quedan desactualizados en unas filas y en otras no, o información que desaparece al borrar un registro.
- Antes de afirmar una dependencia hay que preguntarse si **siempre** se cumple en el negocio. El caso `Especialidad → Piso` me lo dejó claro.
- Normalizar **simplifica las escrituras y complica las lecturas** (más tablas y más JOIN). Por eso decidir cuánto normalizar depende de la carga de trabajo, no solo de la teoría.
- 3FN y BCNF solo se separan cuando hay claves candidatas que se solapan. Si cada tabla tiene una única clave y es su único determinante, no hay nada más que corregir.
- Un atributo multivaluado o una lista dentro de una celda se resuelve con una tabla aparte, y las listas independientes van en tablas distintas para no inventar combinaciones que no existen.