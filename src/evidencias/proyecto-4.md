---
titulo: "Proyecto 4: Documento de supuestos"
seccion: "proyecto"
orden: 4
fecha: "2026-10-14"
resumen: "Supuestos del dominio, 14 reglas de negocio y decisiones de modelado que respaldan el MER, el MER extendido y el modelo relacional."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 1, Documento de supuestos (actualizado el 31/10/2026)  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

[Descargar el documento completo (PDF)](/docs/Documento_de_Supuestos_BD1.pdf)

## ¿Qué hice?

Redactamos los supuestos, las interpretaciones del enunciado y las reglas de negocio que adoptamos, para que el diagrama pueda leerse sin ambigüedad. El documento describe cada entidad, atributo y relación con su cardinalidad y participación, y explica cómo se pasa del MER al modelo relacional.

## Supuestos generales

- La información la administra una única organización. El sistema se ejecuta de forma local y no se publica en internet.
- Los usuarios verificados consultan; solo el rol ADMIN registra, actualiza y elimina datos.
- Un torneo es una edición de la liga (año y semestre) y agrupa equipos, inscripciones y partidos.
- Cada partido enfrenta a dos equipos distintos, local y visitante, ambos participantes del torneo.
- Jugadores, técnicos y árbitros son categorías disjuntas: una persona no puede ser de dos de ellas.
- La tabla de posiciones no se almacena: se calcula con una consulta SQL para no tener datos repetidos.
- Los valores derivados (edad del jugador y duración del torneo) se calculan, no se guardan.
- No se modela el historial de cambios de técnico ni de estadio sede.

## Reglas de negocio

| Código | Regla |
|---|---|
| RN-01 | El equipo local y el visitante son distintos y ambos participan en el torneo del partido |
| RN-02 | Un equipo no juega dos partidos en la misma jornada de un torneo |
| RN-03 | Un jugador tiene una sola participación por partido |
| RN-04 | Solo participa quien está inscrito en uno de los dos equipos del partido, en ese torneo |
| RN-05 | En un torneo, un jugador está inscrito en un solo equipo a la vez; el dorsal es único por equipo y torneo |
| RN-06 | El resultado solo existe si el partido fue disputado y coincide con los goles registrados |
| RN-07 | Todo gol se cuenta a favor del equipo de quien lo anota (no se distinguen autogoles) |
| RN-08 | Cada partido tiene al menos un árbitro (el central); los demás roles son opcionales |
| RN-09 | Minutos jugados entre 0 y 120; minuto de gol o tarjeta entre 1 y 120 |
| RN-10 | Las tarjetas son de un tipo del catálogo (amarilla o roja); un jugador puede recibir varias en un partido |
| RN-11 | La fecha de fin del torneo es posterior o igual a la de inicio; la inscripción queda dentro del torneo |
| RN-12 | Tabla de posiciones: victoria = 3 puntos, empate = 1, derrota = 0 |
| RN-13 | Jugador, técnico y árbitro son categorías disjuntas |
| RN-14 | Todo usuario tiene exactamente un rol y, opcionalmente, un equipo favorito |

## Fuera del alcance

Venta de boletería, transmisión en vivo, pagos o inscripciones en línea, integración con otras ligas o plataformas externas, historial de cambios de técnico, estadio o equipo (más allá de la inscripción por torneo), sanciones posteriores como suspensiones o multas, y criterios de desempate de la tabla.

## ¿Qué aprendí?

- Que escribir los supuestos obliga a decidir antes de dibujar, y evita discusiones al normalizar.
- A separar las reglas que garantiza la base de datos (llaves, UNIQUE, NOT NULL) de las que valida la aplicación (rangos y comparaciones).