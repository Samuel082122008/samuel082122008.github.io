---
titulo: "Modelado 1: Librería en línea (MER y reducción a tablas)"
seccion: "modelado"
orden: 1
fecha: "2026-10-11"
resumen: "Partí del modelo entidad-relación de una librería en línea con varios almacenes y transformé sus relaciones N:M en entidades con relaciones 1:N."
---

**Contexto.** *Páginas del Altiplano* es una librería en línea ficticia que vende libros de distintas editoriales y los despacha desde varios almacenes. Un libro puede tener varios autores y varios editores, los clientes llenan cestas de la compra con varios libros, y cada almacén guarda cierta cantidad de ejemplares de cada título. El equipo de sistemas necesita llevar este diseño conceptual a un modelo que luego se pueda implementar en una base de datos relacional.

## ¿Qué hice?

**1. Modelo de partida.** Trabajé con un modelo entidad-relación en notación de Peter Chen con seis entidades: **AUTOR**, **EDITOR**, **LIBRO**, **CLIENTE**, **CESTA-DE-LA-COMPRA** y **ALMACÉN**. Todas sus relaciones eran N:M:

- **escrito-por** (autor – libro)
- **editado-por** (editor – libro)
- **cesta-de** (cliente – cesta de la compra)
- **contiene** (libro – cesta de la compra), con el atributo `número`
- **almacena** (libro – almacén), con el atributo `número`

![Modelo entidad-relación original](/img/modelado-1-ejer.png)

**2. Transformación.** Como el modelo transformado no admite relaciones N:M, convertí cada una en una entidad intermedia conectada con las dos entidades originales mediante relaciones 1:N. Las entidades nuevas fueron:

- **LIB-AUT**, con `nombre` y `direccion` del autor e `ISBN` del libro
- **LIB-EDI**, con `Nombre` del editor e `ISBN`
- **LIB-CEST**, con `ISBN`, `IDcesta` y el atributo `Número`
- **LIB-ALM**, con `Código` del almacén, `ISBN` y el atributo `Número`
- **CLI-CEST**, con `Dirección-correo-electrónico` del cliente e `IDcesta`

Cada entidad intermedia toma como clave las claves de las dos entidades que conecta. Los atributos propios de las relaciones (`número`) quedaron dentro de la entidad nueva. Todo el trabajo lo hice en draw.io.

![Modelo transformado](/img/modelado-1.png)

[Ver el modelo en draw.io](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&dark=auto#G1NFqSluQhovIdDPX3_hFUcKW1Y7-uYTzY)

## ¿Qué aprendí?

- Una relación **N:M no se puede implementar directamente**: se descompone en una entidad intermedia y dos relaciones 1:N. Por ejemplo, un libro puede tener varios autores y un autor puede escribir varios libros, así que hace falta LIB-AUT para registrar cada pareja.
- La **clave de la entidad intermedia** se forma combinando las claves de las entidades que une.
- Los **atributos de una relación** pertenecen a la entidad intermedia, no a ninguna de las dos entidades originales. Un ejemplo claro es el `número` de ejemplares de un libro en un almacén: no es del libro ni del almacén, sino de la combinación.
- Al principio me costó mantener bien las cardinalidades (qué lado queda en 1 y cuál en N). Lo resolví revisando cada relación original y leyéndola en ambos sentidos.
- Ver el modelo antes y después me ayudó a entender que la transformación no cambia lo que el modelo representa, solo lo deja en una forma que se puede pasar a tablas.