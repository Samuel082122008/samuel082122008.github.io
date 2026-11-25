---
titulo: "Modelado 2: Reducción a tablas (AeroAndes)"
seccion: "modelado"
orden: 2
fecha: "2026-10-11"
resumen: "Transformé el modelo entidad-relación de la aerolínea AeroAndes a un modelo previo al relacional, aplicando las reglas de reducción en notación de Peter Chen."
---

En este taller partí del modelo conceptual de la aerolínea AeroAndes (pasajeros, vuelos, rutas, aviones, tripulación, insumos y proveedores) y lo transformé en un modelo que ya puede pasar al modelo relacional. Es decir, un modelo donde solo sobreviven entidades, atributos simples y relaciones binarias 1:1 y 1:N. El modelo lo hice en draw.io.

## ¿Qué hice?

Apliqué una regla de transformación a cada elemento del modelo original que no cumplía esa condición:

- **Atributos compuestos, multivaluados y derivados (PASAJERO).** `nombre_completo` lo separé en `nombres` y `apellidos`. El atributo `contacto`, que es multivaluado y compuesto, pasó a ser la entidad débil **CONTACTO** (`tipo_contacto`, `numero`), conectada con PASAJERO mediante la relación **P-C** (1:N). Eliminé `edad` y `antiguedad`, porque se calculan a partir de `fecha_nacimiento` y `anio_fabricacion`.
- **Relaciones N:M con atributos.** **RESERVA** (PASAJERO–VUELO) se convirtió en la entidad débil **VUE-PAS**, con `clase`, `precio` y `fecha_reserva`. Se identifica con `documento` y la clave de VUELO. **ASIGNA** (TRIPULANTE–VUELO) pasó a ser **TRI_VUE**, con `rol_a_bordo` y `horas_servicio`. Cada una queda conectada a sus dos entidades con relaciones 1:M.
- **Relación ternaria.** **SUMINISTRA** (PROVEEDOR–VUELO–INSUMO) se reemplazó por la entidad **PRO-VUE-INS**, que guarda `cantidad` y se conecta con las tres entidades originales mediante tres relaciones binarias.
- **Agregación.** **DOTA** parte de la participación de un tripulante en un vuelo (el recuadro "PARTICIPACIÓN"). Por eso TABLET se relaciona con TRI_VUE y no directamente con TRIPULANTE ni con VUELO.
- **Especialización.** TRIPULANTE → PILOTO / AUXILIAR quedó como dos entidades conectadas con TRIPULANTE mediante relaciones **Ser** 1:1. El atributo multivaluado `idiomas` pasó a ser la entidad **IDIOMA**, relacionada con AUXILIAR mediante **I-A**.
- **Relaciones recursivas.** **CONECTA** (VUELO–VUELO, N:M) se transformó en la entidad débil **CONEXION**, con `tiempo_conexion` y dos relaciones, **Salir** y **Llegar**, hacia VUELO. **SUPERVISA** (1:N recursiva) no necesita transformación y la dejé tal cual.
- **Relaciones que pasan sin cambios.** IDENTIFICA (RUTA–VUELO), OPERA (AVION–VUELO) y HABILITA (AVION–CERTIFICADO) ya eran binarias 1:1 o 1:N.

## ¿Qué aprendí?

- Una relación N:M, una ternaria o una agregación se convierten en **entidad**, y esa entidad toma como clave las claves de las entidades que conecta. Por eso suele ser débil.
- El orden importa en un atributo multivaluado y compuesto como `contacto`: primero se convierte en entidad (por ser multivaluado) y luego sus componentes pasan a ser atributos simples de esa entidad.
- Los atributos derivados no se guardan: se pueden calcular a partir de otro dato, así que el modelo no pierde información al quitarlos.
- Poner `rol_a_bordo` u `horas_servicio` en TRIPULANTE o en VUELO duplicaría o perdería datos, porque pertenecen a la **participación** de un tripulante en un vuelo concreto, no a uno solo de los dos.
- La agregación me enseñó que una relación puede apoyarse sobre otra relación ya transformada, no solo sobre entidades.
- Una especialización total y disjunta se refleja con relaciones 1:1 hacia las subentidades. Además, `idiomas` por ser multivaluado también debe convertirse en entidad.
- Cada transformación hay que justificarla con la regla aplicada, no basta con dibujar el resultado.

![Modelo transformado AeroAndes](/img/modelado-2-taller.png)

[Ver el modelo en draw.io](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Copia%20de%20Taller&dark=auto#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1fxD4CiXxuO2MGfdzVm1OVv3Z3WuBRFMC%26export%3Ddownload)