---
titulo: "Proyecto 3: Modelo Entidad-Relación Extendido"
seccion: "proyecto"
orden: 3
fecha: "2026-10-10"
resumen: "MER extendido de la Liga BetPlay: especialización de JUGADOR por posición y agregación PARTICIPACIÓN sobre la que se registran goles y tarjetas."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 1, MER extendido  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

[Descargar el diagrama (PDF)](/docs/MER_Extendido_BD1.pdf)

![Modelo entidad-relación extendido](/img/er-extendido-betplay.png)

## ¿Qué hice?

Partimos del MER en notación Chen y le agregamos dos conceptos del modelo extendido (Elmasri y Navathe, 2016): la **especialización** y la **agregación**. El resto del modelo, con las mismas entidades, atributos y relaciones, se conserva.

## Especialización de JUGADOR (relación ES)

JUGADOR es la superclase y se especializa según su posición. Cada subclase hereda todos los atributos del jugador y agrega una estadística propia:

| Subclase | Atributo propio | Qué mide |
|---|---|---|
| ATACANTE | Tiros_Puerta | Tiros a puerta realizados |
| MEDIOCAMPISTA | Pases | Pases realizados |
| DEFENSA | Entradas_Oportunas | Intercepciones o recuperaciones |
| PORTERO | Porteria_Imbatida | Partidos con la portería en cero |

La especialización es **disjunta** (un jugador pertenece a una sola subclase) y **total** (todo jugador pertenece a alguna de las cuatro).

## Agregación PARTICIPACIÓN

La relación *Jugar* entre JUGADOR y PARTIDO (muchos a muchos) se trata como una unidad llamada PARTICIPACIÓN. Sobre esa agregación se registran directamente los goles y las tarjetas (*Ocurrir*, 1:N, identificadora), lo que expresa que un gol o una tarjeta solo existe si el jugador participó en ese partido.

## Del MER extendido al MER normal

| Elemento del MER extendido | Tratamiento en el MER normal |
|---|---|
| Especialización ES y sus 4 subclases | Se elimina; la posición queda como atributo de JUGADOR |
| Atributos propios de las subclases | No se incluyen; son estadísticas acumuladas |
| Agregación PARTICIPACIÓN | Se convierte en la entidad PARTICIPACION, conectada por *Realizar* e *Incluir* |
| *Ocurrir* sobre la agregación | Se reemplaza por *Ocurrir* entre PARTICIPACION y GOL o TARJETA |

Una relación no puede participar en otra relación; al volverla entidad, los goles y las tarjetas pueden asociarse a ella.

## ¿Qué aprendí?

- Cuándo conviene especializar: cuando un grupo de entidades tiene atributos que solo aplican a una parte de ellas.
- La diferencia entre una especialización disjunta y una total.
- Cómo una agregación permite relacionar una relación con otra entidad, y cómo se reemplaza por una entidad cuando el modelo no la admite.