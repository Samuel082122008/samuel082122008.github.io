---
titulo: "Proyecto 2: Modelo Entidad-Relación (Peter Chen)"
seccion: "proyecto"
orden: 2
fecha: "2026-10-14"
resumen: "Modelo entidad-relación en notación Peter Chen de la Liga BetPlay: 14 entidades, 17 relaciones, entidades débiles y atributos compuestos, derivados y multivaluados."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 1, Modelo entidad-relación (notación Peter Chen)  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

<a href="https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Modelo-Enditad-Relacion%20Proyecto%20Final%20Bases%20de%20Datos.drawio&dark=auto#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1_nSS_n_VPcDwqMsjRz1k6HhqVOuUiJNx%26export%3Ddownload" target="_blank" rel="noopener">Ver el diagrama en draw.io</a>

![Modelo entidad-relación en notación Peter Chen](/img/er-chen-betplay.png)

## ¿Qué hice?

Modelamos con notación Peter Chen el **Sistema de Gestión de Información de la Liga BetPlay**, usando draw.io. El modelo tiene **14 entidades**. Abajo describo cada entidad, sus relaciones y las decisiones de diseño.

## 1. Entidades y atributos

### Entidades fuertes

| Entidad | Atributos |
|---|---|
| **TECNICO** | `id_tecnico` (clave), nombre (compuesto: nombres, apellidos), nacionalidad, fecha_nacimiento |
| **EQUIPO** | `id_equipo` (clave), nombre, ciudad, fecha_fundacion, escudo_url, colores (multivaluado) |
| **ESTADIO** | `id_estadio` (clave), nombre, capacidad, ubicación (compuesto: dirección, ciudad, barrio) |
| **TORNEO** | `id_torneo` (clave), nombre, año, semestre, fecha_inicio, fecha_fin, duracion_dias (derivado) |
| **PARTIDO** | `id_partido` (clave), fecha, hora, jornada |
| **ARBITRO** | `cedula` (clave), nombre (compuesto), ciudad, categoría |
| **JUGADOR** | `id_jugador` (clave), nombre (compuesto), nacionalidad, fecha_nacimiento, edad (derivado), posición |
| **PARTICIPACION** | `id_participacion` (clave), titular, minutos_jugados |
| **TIPO_TARJETA** | `id_tipo` (clave), color (amarilla o roja) |
| **USUARIO** | `id_usuario` (clave), usuario, contrasenia (cifrada), correo, verificado, codigo_verificacion, expira_verificacion |
| **ROL** | `id_rol` (clave), nombre_rol |

### Entidades débiles (rectángulo doble)

| Entidad | Atributos | Depende de |
|---|---|---|
| **RESULTADO** | `id_resultado` (clave parcial), goles_local, goles_visitante | PARTIDO |
| **GOL** | `id_gol` (clave parcial), tipo, minuto | PARTICIPACION |
| **TARJETA** | `id_tarjeta` (clave parcial), motivo, minuto | PARTICIPACION |

## 2. Relaciones y cardinalidades

| # | Relación | Entidades | Cardinalidad | Atributos propios |
|---|----------|-----------|--------------|-------------------|
| 1 | Dirigir | Técnico – Equipo | 1:1 | |
| 2 | Tener sede | Equipo – Estadio | N:1 | |
| 3 | Participar | Equipo – Torneo | M:N | |
| 4 | Inscribir (ternaria) | Equipo – Torneo – Jugador | M:N:P | dorsal, fecha_inicio, fecha_fin |
| 5 | Tener | Torneo – Partido | 1:N | |
| 6 | Ser_local | Equipo – Partido | 1:N | |
| 7 | Ser_visitante | Equipo – Partido | 1:N | |
| 8 | Jugar | Estadio – Partido | 1:N | |
| 9 | Tener (identificadora) | Partido – Resultado | 1:1 | |
| 10 | Arbitrar | Árbitro – Partido | M:N | rol |
| 11 | Realizar | Jugador – Participación | 1:N | |
| 12 | Incluir | Partido – Participación | 1:N | |
| 13 | Ocurrir (identificadora) | Participación – Gol | 1:N | |
| 14 | Ocurrir (identificadora) | Participación – Tarjeta | 1:N | |
| 15 | Ser | Tipo_Tarjeta – Tarjeta | 1:N | |
| 16 | Tener_rol | Rol – Usuario | 1:N | |
| 17 | Elegir_favorito | Usuario – Equipo | N:1 | |

## 3. Explicación del modelo

**Estructura del torneo.** TORNEO es la entidad central. Los equipos se vinculan mediante *Participar* (M:N) y cada torneo contiene muchos partidos (*Tener*), pero cada partido pertenece a un solo torneo.

**Equipos, técnicos y estadios.** Cada equipo es dirigido por un único técnico (*Dirigir*, 1:1) y tiene un estadio sede (*Tener sede*, N:1); un estadio puede ser sede de varios equipos.

**Jugadores.** La ternaria *Inscribir* conecta Equipo, Torneo y Jugador: un jugador se inscribe con un equipo en un torneo específico. El dorsal y las fechas van en el rombo porque dependen de la combinación completa, así que el historial de un jugador que cambia de equipo queda registrado.

**Partidos.** Cada partido tiene un equipo local y uno visitante (dos relaciones separadas), se juega en un estadio y tiene varios árbitros, cada uno con un rol (*Arbitrar*, M:N con atributo `rol`).

**Participación, goles y tarjetas.** Un jugador y un partido se relacionan muchos a muchos. Esa relación se convirtió en la entidad PARTICIPACION, conectada por *Realizar* e *Incluir*. Los goles y las tarjetas son entidades débiles de la participación (rombo doble): así solo puede haber un gol o una tarjeta si el jugador participó en el partido. El jugador y el partido de cada gol se conocen a través de la participación, por eso no hay una relación directa *Marcar* o *Recibir*.

**Usuarios.** USUARIO y ROL sostienen el inicio de sesión de la aplicación web. Cada usuario tiene un único rol y, de forma opcional, un equipo favorito.

**Tabla de posiciones.** No se modeló como entidad porque es un cálculo derivado de los resultados.

## ¿Qué aprendí?

- A distinguir entidades fuertes y débiles y a representar la dependencia de existencia con rombos dobles.
- A modelar una relación ternaria cuando los atributos dependen de la combinación de tres entidades.
- A convertir una relación M:N en entidad (PARTICIPACION) para poder asociarle goles y tarjetas.
- A no modelar como entidad lo que se puede calcular (la tabla de posiciones).