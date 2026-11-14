---
titulo: "Proyecto 5: Modelo relacional (reducción a tablas)"
seccion: "proyecto"
orden: 5
fecha: "2026-10-17"
resumen: "Reducción del MER extendido a 22 tablas normalizadas hasta la tercera forma normal, con llaves primarias, foráneas y decisiones de integridad."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 1, Modelo relacional  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

![Reducción a tablas del modelo relacional](/img/reduccion-a-tablas-betplay.png)

## ¿Qué hice?

Pasamos el MER extendido a un modelo relacional de **22 tablas en 3FN**, aplicando las reglas de paso de E-R a tablas (Silberschatz et al., 2020).

## Las 22 tablas

| Tabla | Llave primaria | Llaves foráneas |
|---|---|---|
| TECNICO | id_tecnico | |
| ESTADIO | id_estadio | |
| EQUIPO | id_equipo | id_tecnico (UNIQUE), id_sede → ESTADIO |
| EQUIPO_COLOR | (id_equipo, color) | id_equipo |
| TORNEO | id_torneo | |
| EQUIPO_TORNEO | (id_torneo, id_equipo) | id_torneo, id_equipo |
| JUGADOR | id_jugador | |
| ATACANTE, MEDIOCAMPISTA, DEFENSA, PORTERO | id_jugador | id_jugador → JUGADOR |
| INSCRIPCION | (id_equipo, id_torneo, id_jugador) | las tres |
| ARBITRO | cedula | |
| PARTIDO | id_partido | id_estadio, id_torneo, id_local, id_visitante |
| RESULTADO | (id_partido, id_resultado) | id_partido |
| ARBITRAJE | (cedula, id_partido) | cedula, id_partido |
| PARTICIPACION | id_participacion | id_jugador, id_partido |
| GOL | (id_participacion, id_gol) | id_participacion |
| TIPO_TARJETA | id_tipo | |
| TARJETA | (id_participacion, id_tarjeta) | id_participacion, id_tipo |
| ROL | id_rol | |
| USUARIO | id_usuario | id_rol, id_equipo_favorito (opcional) |

## Decisiones de la reducción

- **Atributos compuestos:** se descomponen en columnas simples (nombre en nombres y apellidos; ubicación en dirección, ciudad y barrio).
- **Multivaluado:** los colores del equipo pasan a la tabla EQUIPO_COLOR.
- **Derivados:** edad y duración en días no se almacenan.
- **Relaciones 1:N:** llave foránea en el lado N. La 1:1 *Dirigir* usa `id_tecnico` en EQUIPO con restricción UNIQUE.
- **Relaciones M:N y ternaria:** tablas intermedias (EQUIPO_TORNEO, ARBITRAJE e INSCRIPCION).
- **Entidades débiles:** heredan la llave de su dueño y usan `ON DELETE CASCADE`; si se borra un partido se borra su resultado, y si se borra una participación se borran sus goles y tarjetas.
- **Especialización:** una tabla por subclase, con llave primaria que también es foránea hacia JUGADOR.
- **3FN:** GOL y TARJETA no guardan `id_jugador`, porque ya se obtiene por la participación; guardarlo crearía una dependencia transitiva.
- **Validaciones:** los rangos y valores permitidos los valida el backend; en la base quedan llaves, UNIQUE y NOT NULL.

## ¿Qué aprendí?

- A aplicar 1FN, 2FN y 3FN sobre un modelo real y a detectar dependencias transitivas.
- Que la normalización a veces significa **no** agregar una columna que parece útil.
- Cuándo usar `ON DELETE CASCADE` y cuándo conviene bloquear el borrado.