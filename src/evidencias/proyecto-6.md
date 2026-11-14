---
titulo: "Proyecto 6: Álgebra relacional (50 ejercicios)"
seccion: "proyecto"
orden: 6
fecha: "2026-11-05"
resumen: "50 consultas sobre la base de la Liga BetPlay escritas en álgebra relacional, con su equivalente en SQL de Oracle y el resultado con datos reales."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 1, Documento de implementación de sentencias de álgebra relacional  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

[Descargar los 50 ejercicios completos (PDF)](/docs/Algebra_Relacional_BD1.pdf)

## ¿Qué hice?

Resolvimos **50 consultas** sobre el esquema LIGA. Cada ejercicio tiene el enunciado, el razonamiento, la expresión en álgebra relacional, su equivalente en SQL de Oracle y el resultado con los datos reales del proyecto.

## Contenido

| Operación | Ejercicios | Equivalente en SQL |
|---|---|---|
| Selección (σ) | 1 – 6 | WHERE |
| Proyección (π) | 7 – 13 | SELECT DISTINCT |
| Renombrar (ρ) y producto cartesiano (×) | 14 – 17 | AS y CROSS JOIN |
| Unión, intersección y diferencia | 18 – 25 | UNION, INTERSECT, MINUS |
| Join natural y join theta | 26 – 35 | JOIN … ON |
| Join externo izquierdo | 36 – 38 | LEFT OUTER JOIN |
| Agrupamiento | 39 – 46 | GROUP BY y HAVING |
| División (÷) | 47 – 49 | GROUP BY + HAVING COUNT |
| Operaciones combinadas | 50 | Subconsulta con MINUS |

## Tres ejemplos

**Ejercicio 1 (selección).** Estadios con capacidad mayor a 30.000 personas.

```text
σ capacidad > 30000 (ESTADIO)
```

```sql
SELECT *
FROM estadio
WHERE capacidad > 30000;
```

**Ejercicio 45 (agrupamiento).** Jugadores que han marcado 4 goles o más.

```text
GOLES = G id_jugador ℑ COUNT(id_gol) AS goles (PARTICIPACION ⋈ GOL)
π nombres, apellidos, goles ( σ goles ≥ 4 (JUGADOR ⋈ GOLES) )
```

```sql
SELECT j.nombres, j.apellidos, COUNT(g.id_gol) AS goles
FROM jugador j
JOIN participacion pa ON pa.id_jugador = j.id_jugador
JOIN gol g ON g.id_participacion = pa.id_participacion
GROUP BY j.id_jugador, j.nombres, j.apellidos
HAVING COUNT(g.id_gol) >= 4
ORDER BY goles DESC;
```

**Ejercicio 50 (combinada).** Equipos de Bogotá que no han ganado ningún partido como visitante.

```text
BOG = π id_equipo ( σ ciudad_equipo = 'Bogotá' (EQUIPO) )
GANARON = ρ G(id_equipo) ( π id_visitante ( σ goles_visitante > goles_local (PARTIDO ⋈ RESULTADO) ) )
π nombre_equipo ( EQUIPO ⋈ (BOG − GANARON) )
```

```sql
SELECT nombre_equipo
FROM equipo
WHERE id_equipo IN (SELECT id_equipo FROM equipo WHERE ciudad_equipo = 'Bogotá'
                    MINUS
                    SELECT p.id_visitante
                    FROM partido p JOIN resultado r ON r.id_partido = p.id_partido
                    WHERE r.goles_visitante > r.goles_local);
```

## ¿Qué aprendí?

- A leer las expresiones de adentro hacia afuera y a guardar resultados intermedios con asignación.
- Que las preguntas con "nunca" o "sin" se resuelven con el patrón de la diferencia: universo menos los que sí cumplen.
- Que la división responde preguntas de "todos los…" y en SQL se traduce a GROUP BY con HAVING.