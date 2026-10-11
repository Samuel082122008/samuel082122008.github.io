---
titulo: "Proyecto 2: Modelo Entidad-Relación (Peter Chen)"
seccion: "proyecto"
orden: 2
fecha: "2026-10-11"
resumen: "Diagrama entidad-relación en notación Peter Chen del sistema de gestión de la Liga BetPlay: entidades, atributos, relaciones y cardinalidades."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 1, Modelo entidad-relación (notación Peter Chen)  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

[Descargar el diagrama (PDF)](/docs/ER_Chen_BD1.pdf)

![Diagrama entidad-relación en notación Peter Chen](/img/er-chen-betplay.png)

## ¿Qué hice?

Modelé con un diagrama entidad-relación en notación Peter Chen el **Sistema de Gestión de Información de la Liga BetPlay**, usando draw.io. A continuación describo las entidades, los atributos, las relaciones y las decisiones de diseño.

## 1. Entidades y atributos

### Entidades fuertes

**TORNEO:** representa una temporada de la liga.

- `id_torneo` (clave), nombre, año, semestre, fecha_inicio, fecha_fin
- `duracion_dias` (derivado: fecha_fin − fecha_inicio)

**EQUIPO:** club participante.

- `id_equipo` (clave), nombre, ciudad, fecha_fundacion
- `colores` (multivaluado)

**ESTADIO:** escenario donde se juegan los partidos.

- `id_estadio` (clave), nombre, capacidad
- `ubicación` (compuesto): dirección, barrio, ciudad

**JUGADOR**

- `id_jugador` (clave), nacionalidad, fecha_nacimiento, posición
- `nombre` (compuesto): nombres, apellidos
- `edad` (derivado de fecha_nacimiento)

**TÉCNICO:** entrenador de un equipo.

- `id_tecnico` (clave), nacionalidad, fecha_nacimiento
- `nombre` (compuesto): nombres, apellidos

**ÁRBITRO**

- `cédula` (clave), categoría, ciudad
- `nombre` (compuesto): nombres, apellidos

**PARTIDO:** encuentro entre dos equipos dentro de un torneo.

- `id_partido` (clave), fecha, hora, jornada

**TIPO_TARJETA:** catálogo de tipos de sanción.

- `id_tipo` (clave), color (amarilla o roja)

### Entidades débiles (todas dependen de PARTIDO)

**GOL**

- `id_gol` (clave parcial), minuto, tipo (normal, penal, autogol)

**TARJETA**

- `id_tarjeta` (clave parcial), minuto, motivo

**RESULTADO**

- goles_local, goles_visitante
- Incluí `id_resultado` en el dibujo. Funciona, pero como RESULTADO es 1:1 con PARTIDO, su identidad ya la da el partido.

## 2. Relaciones y cardinalidades

| # | Relación | Entidades | Cardinalidad | Atributos | Participación total |
|---|----------|-----------|--------------|-----------|---------------------|
| 1 | Participar | Equipo – Torneo | M:N | | Ambos lados |
| 2 | Dirigir | Técnico – Equipo | 1:N | | Equipo |
| 3 | Inscribir (ternaria) | Jugador – Equipo – Torneo | N:M:P | dorsal, fecha_inicio, fecha_fin | Jugador |
| 4 | Tener sede | Equipo – Estadio | N:1 | | Equipo |
| 5 | Tener | Torneo – Partido | 1:N | | Partido |
| 6 | Ser_local | Equipo – Partido | 1:N | | Partido |
| 7 | Ser_visitante | Equipo – Partido | 1:N | | Partido |
| 8 | Jugar | Estadio – Partido | 1:N | | Partido |
| 9 | Arbitrar | Árbitro – Partido | M:N | rol | Partido |
| 10 | Tener (identificadora, rombo doble) | Partido – Resultado | 1:1 | | Resultado |
| 11 | Ocurrir (identificadora, rombo doble) | Partido – Gol | 1:N | | Gol |
| 12 | Ocurrir (identificadora, rombo doble) | Partido – Tarjeta | 1:N | | Tarjeta |
| 13 | Marcar | Jugador – Gol | 1:N | | Gol |
| 14 | Recibir | Jugador – Tarjeta | 1:N | | Tarjeta |
| 15 | Ser | Tipo_Tarjeta – Tarjeta | 1:N | | Tarjeta |

En las relaciones 1:N, el 1 va junto a la entidad que aparece primero en la tabla y la N junto a la segunda. En la relación 4 es al revés (N:1: Equipo lleva la N).

## 3. Explicación del modelo

**Estructura del torneo.** TORNEO es la entidad central. Los equipos se vinculan mediante *Participar* (M:N): un equipo juega muchos torneos y un torneo tiene muchos equipos. Cada torneo contiene muchos partidos (*Tener*), pero cada partido pertenece a un solo torneo.

**Equipos, técnicos y estadios.** Cada equipo tiene su sede en un estadio (*Tener sede*, N:1), y un estadio puede ser sede de varios equipos. El técnico se relaciona con el equipo mediante *Dirigir*.

**Jugadores.** La relación ternaria *Inscribir* conecta Jugador, Equipo y Torneo: un jugador se inscribe con un equipo en un torneo específico. El dorsal y las fechas van en el rombo porque dependen de la combinación completa. Así, un jugador puede cambiar de equipo entre torneos, o a mitad de año, y el historial queda registrado.

**Partidos.** Cada partido tiene un equipo local y uno visitante (dos relaciones separadas entre Partido y Equipo, ambas 1:N desde Equipo). Se juega en un estadio (*Jugar*), pertenece a un torneo y tiene varios árbitros con un rol distinto (*Arbitrar*, M:N con atributo `rol`).

**Eventos del partido (entidades débiles).** GOL, TARJETA y RESULTADO no existen sin un partido, por eso son débiles y se conectan con rombos dobles. Además de depender de PARTIDO, GOL y TARJETA se relacionan con JUGADOR (*Marcar* y *Recibir*), y TARJETA con TIPO_TARJETA (*Ser*).

**Tabla de posiciones.** No se modeló como entidad porque es un cálculo derivado de los resultados (puntos, partidos jugados, ganados, empatados, perdidos y goles por equipo).

## ¿Qué aprendí?

- A distinguir entidades fuertes y débiles, y a representar la dependencia de existencia con rombos dobles.
- A modelar una relación ternaria (*Inscribir*) cuando los atributos dependen de la combinación de tres entidades.
- A separar atributos compuestos, derivados y multivaluados.
- A no modelar como entidad lo que se puede calcular a partir de otros datos (la tabla de posiciones).