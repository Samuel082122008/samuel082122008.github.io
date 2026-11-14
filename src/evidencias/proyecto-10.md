---
titulo: "Proyecto 10: Gestión del proyecto"
seccion: "proyecto"
orden: 10
fecha: "2026-11-07"
resumen: "Acta de constitución, interesados, EDT, cronograma y presupuesto del proyecto Sistema de Gestión de Información para la Liga BetPlay."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Entregables transversales**  
**Equipo (Brazuquitas):** Samuel Cubillos (gerente de proyecto), Felipe Sierra y Antoine Blanco (desarrolladores)

[Acta de constitución (PDF)](/docs/Acta_de_Constitucion_BD1.pdf) · [Identificación de interesados (PDF)](/docs/Identificacion_de_Interesados_BD1.pdf) · [EDT (PDF)](/docs/EDT_BD1.pdf) · [Cronograma (PDF)](/docs/Cronograma_BD1.pdf) · [Presupuesto (PDF)](/docs/Presupuesto_BD1.pdf)

## ¿Qué hice?

Gestionamos el proyecto con documentos de dirección de proyectos. Yo asumí el rol de **gerente de proyecto**, con autoridad sobre el presupuesto y la mediación de conflictos; las decisiones técnicas las lidera Antoine, con apoyo del equipo.

## Acta de constitución

**Propósito.** Diseñar e implementar un sistema de base de datos relacional que permita a una única organización centralizar la información de la Liga BetPlay, hoy dispersa en medios, aplicaciones de terceros y portales de estadísticas.

**Objetivos e indicadores de éxito**

| Objetivo | Indicador |
|---|---|
| Implementar el 100 % de los requerimientos funcionales | 100 % implementados |
| Modelos Chen, Crow's Foot y relacional completos y coherentes | Modelos entregados |
| Esquema normalizado hasta 3FN | 100 % de las tablas en 3FN |
| Consultas en álgebra relacional | Mínimo 50 ejercicios |
| Base en RDBMS (no SQL Server) sobre VM Linux con aplicación conectada | Aplicación consultando datos reales |
| Repositorio en GitHub | Commits significativos de los 3 integrantes |
| Optimizar recursos | 90 % del presupuesto estimado |
| Cumplir las fechas de entrega | 100 % de entregables a tiempo |

**Riesgos identificados:** errores de modelado o normalización, dificultades con la VM y el RDBMS, migración del modelo lógico al físico, conexión de la aplicación, aportes desiguales en GitHub, poco tiempo para los 50 ejercicios y problemas al grabar el video. Mitigación: control de versiones estricto, reuniones de seguimiento, revisión cruzada de los modelos y pruebas progresivas.

## Interesados

El docente, Ing. Christian Felipe Duarte, es cliente y patrocinador. Tiene poder e interés altos: evalúa y aprueba los entregables y sigue el avance durante todo el semestre. Se gestiona de cerca, atendiendo sus observaciones en cada revisión y verificando cada producto contra el enunciado antes de entregarlo.

## EDT (estructura de desglose del trabajo)

La EDT está orientada a entregables y cumple la regla del 100 %. Tiene 6 componentes y 31 paquetes de trabajo.

| Componente | Paquetes |
|---|---|
| 1. Gestión del proyecto | Acta, interesados, EDT, cronograma, presupuesto, seguimiento y control, acta de cierre |
| 2. Fase 1: Diseño | Propuesta, supuestos, MER Chen, MER extendido, Crow's Foot, modelo relacional, diccionario de datos, álgebra relacional |
| 3. Fase 2: Infraestructura | Selección del SO, implementación de la VM, selección del RDBMS, implementación del RDBMS |
| 4. Fase 2: Base de datos física | Script de creación, script de inserción, scripts varios, README |
| 5. Fase 2: Aplicación web | Backend (Spring Boot + JDBC), seguridad y usuarios, frontend (Angular), integración y pruebas |
| 6. Entrega y cierre | Repositorio en GitHub, documento general, video de demostración, sustentación |

## Cronograma

El proyecto va del 22/09/2026 al 13/11/2026.

| Fecha | Hito |
|---|---|
| 22/09/2026 | Inicio del proyecto y entrega de la propuesta |
| 04/11/2026 | Aplicación web terminada (versión base) |
| 06/11/2026 | Video de demostración |
| 13/11/2026 | Sustentación del proyecto y acta de cierre |

## Presupuesto (COP)

| Descripción | Costos directos | Costos indirectos | Reserva | Total |
|---|---|---|---|---|
| Horas de desarrollo (×3 integrantes) | $ 4.800.000 | $ 480.000 | $ 480.000 | $ 5.760.000 |
| Gerente de proyecto | $ 1.200.000 | $ 120.000 | $ 120.000 | $ 1.440.000 |
| Internet y energía | $ 350.000 | $ 100.000 | $ 50.000 | $ 500.000 |
| Equipos y licencias (VM, RDBMS, GitHub) | $ 0 | $ 600.000 | $ 60.000 | $ 660.000 |
| Transporte | $ 300.000 | $ 0 | $ 50.000 | $ 350.000 |
| Otros gastos y material adicional | $ 150.000 | $ 0 | $ 30.000 | $ 180.000 |
| **Total** | **$ 6.800.000** | **$ 1.300.000** | **$ 790.000** | **$ 8.890.000** |

Meta de costo: 90 % del presupuesto estimado ($ 8.001.000).

## ¿Qué aprendí?

- A descomponer un proyecto en paquetes entregables y a conectar la EDT con el cronograma y el presupuesto.
- A manejar riesgos con estrategias de mitigación concretas, y a coordinar un equipo de tres.