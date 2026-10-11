---
titulo: "Proyecto 1: Propuesta del proyecto final"
seccion: "proyecto"
orden: 1
fecha: "2026-10-11"
resumen: "Propuesta de un sistema de base de datos relacional para gestionar la información de la Liga BetPlay de fútbol profesional colombiano."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 1, Propuesta del proyecto  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

[Descargar la propuesta completa (PDF)](/docs/Propuesta_Proyecto_BD1.pdf)

## Problemática

La Liga BetPlay genera constantemente información sobre equipos, jugadores, entrenadores, partidos, resultados, árbitros y tarjetas. Sin embargo, esa información no la administra de forma centralizada una única organización: está dispersa entre medios de comunicación, aplicaciones de terceros, portales de estadísticas y redes sociales, cada uno con sus propios registros y formatos.

Por eso un mismo dato, como las tarjetas de un jugador o el historial entre dos equipos, puede aparecer distinto según la fuente, y no existe un registro único y confiable que sirva de referencia. Además, la consolidación de resultados y estadísticas suele hacerse de forma manual o semiautomática, lo que aumenta el riesgo de inconsistencias.

Se plantea entonces diseñar e implementar una base de datos relacional que permita a una sola organización centralizar y administrar internamente la información de la liga: equipos, jugadores, partidos, resultados y sanciones.

## Justificación

El dominio de la Liga BetPlay ofrece entidades y relaciones naturales (equipos, jugadores, partidos, árbitros, resultados, tarjetas, torneos) que permiten construir un modelo entidad-relación con relaciones de uno a uno, uno a muchos y muchos a muchos, y que exige una normalización cuidadosa para evitar redundancia y anomalías.

El proyecto se plantea como un sistema interno para una sola organización, lo que acota el dominio de datos y permite enfocar el esfuerzo en un modelo bien diseñado. Además, permite practicar el ciclo completo de trabajo con bases de datos: modelado conceptual, normalización, implementación en un motor relacional dentro de un entorno virtualizado, consultas con álgebra relacional y conexión con una aplicación web sencilla.

## Objetivo general

Diseñar e implementar un sistema de gestión de bases de datos relacional que permita a una única organización centralizar y administrar internamente la información de la Liga BetPlay, aplicando modelado entidad-relación, normalización y consultas mediante álgebra relacional.

## Objetivos específicos

- Modelar con un diagrama entidad-relación en notación Peter Chen las entidades y relaciones de la liga.
- Normalizar el modelo relacional hasta la Tercera Forma Normal (3FN), evitando redundancias y anomalías de inserción, actualización o eliminación.
- Implementar la base de datos en un gestor relacional distinto a SQL Server, sobre una máquina virtual con Linux.
- Formular consultas con álgebra relacional (uniones, proyecciones y selecciones) para obtener la tabla de posiciones, estadísticas de un jugador o el historial de un equipo.
- Desarrollar una aplicación web sencilla, de uso interno, que se conecte a la base de datos y permita consultar la información.
- Gestionar el proyecto en un repositorio de GitHub, con contribuciones significativas de todos los integrantes.

## Alcance

El sistema se orienta exclusivamente a la Liga BetPlay, administrada por una sola organización. Permitirá gestionar los torneos (por ejemplo, cada temporada) con sus equipos, jugadores, entrenadores, árbitros, partidos, resultados y sanciones. Su uso es interno, no una plataforma pública.

Quedan fuera del alcance la venta de boletería, la transmisión en vivo, los pagos o inscripciones en línea, la integración con otras ligas y la conexión con plataformas externas de streaming o redes sociales.

## Entidades principales

- **Torneo:** agrupa la información de una temporada (nombre, año, etapa, fechas de inicio y fin).
- **Equipo:** nombre, ciudad, estadio y entrenador asociado.
- **Jugador:** nombre, posición, número de camiseta, fecha de nacimiento y equipo.
- **Entrenador:** información del cuerpo técnico de cada equipo.
- **Partido:** fecha, hora, estadio y jornada de cada encuentro.
- **Resultado:** marcador y detalles de cada partido jugado.
- **Árbitro:** información de los árbitros asignados a los partidos.
- **Tarjeta / Sanción:** amonestaciones (amarillas o rojas) de un jugador en un partido.
- **Tabla de posiciones:** puntos, partidos jugados, ganados, empatados, perdidos y goles por equipo, calculada a partir de los resultados.

## Requerimientos funcionales principales

- Registrar, consultar, actualizar y eliminar información de equipos, jugadores, entrenadores y árbitros.
- Programar los partidos de un torneo, asignando equipos, árbitros, fecha, hora y lugar.
- Registrar el resultado de cada partido y actualizar automáticamente la tabla de posiciones.
- Registrar las tarjetas o sanciones aplicadas durante cada partido.
- Consultar estadísticas de un jugador: partidos jugados, goles y tarjetas acumuladas.
- Consultar el historial de resultados de un equipo a lo largo de un torneo.
- Generar la tabla de posiciones de un torneo en un momento determinado.