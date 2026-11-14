---
titulo: "Proyecto 9: Implementación del RDBMS (Oracle 26ai Free)"
seccion: "proyecto"
orden: 9
fecha: "2026-11-05"
resumen: "Instalación y configuración de Oracle AI Database 26ai Free en Oracle Linux 9: pasos, errores encontrados, conexiones y estado final de la base de datos."
---

**Asignatura:** Bases de Datos 1, Universidad El Bosque  
**Fase:** 2, Infraestructura  
**Integrantes:** Felipe Sierra, Samuel Cubillos, Antoine Blanco

[Descargar el documento con capturas (PDF)](/docs/Implementacion_RDBMS_BD1.pdf)

## ¿Qué hice?

Instalamos y configuramos Oracle AI Database 26ai Free en la VM (28 y 29 de octubre de 2026), documentando también los errores que tuvimos.

## Entorno

| Elemento | Valor |
|---|---|
| Máquina virtual | BD1-OracleLinux en VirtualBox 7.2.8 (4 GB RAM, 2 procesadores, 40 GB) |
| Sistema operativo | Oracle Linux Server 9.8 |
| RDBMS | Oracle AI Database 26ai Free, versión 23.26.3 |
| Base contenedora y conectable | FREE y FREEPDB1 |
| Puerto del listener | 1521 (reenviado desde el anfitrión) |
| Dueño de las tablas | Usuario LIGA |
| Conexión del backend | `jdbc:oracle:thin:@//localhost:1521/FREEPDB1` |

## Paso a paso

1. **Descarga:** RPM de Oracle AI Database Free para Oracle Linux 9 (unos 1,5 GB).
2. **Activar SSH en la VM:**
   ```bash
   sudo systemctl enable --now sshd
   ```
3. **Copiar el instalador desde Windows:**
   ```bash
   scp -P 2222 oracle-ai-database-free-26ai-23.26.3-1.el9.x86_64.rpm bd1@localhost:/tmp/
   ```
4. **Paquete de preparación** (36 paquetes que Oracle necesita):
   ```bash
   sudo dnf install -y oracle-ai-database-preinstall-26ai
   ```
5. **Instalar la base de datos:**
   ```bash
   sudo dnf -y localinstall /tmp/oracle-ai-database-free-26ai-23.26.3-1.el9.x86_64.rpm
   ```
6. **Configurar** (pide la contraseña de SYS, SYSTEM y PDBADMIN, configura el listener y crea FREE y FREEPDB1):
   ```bash
   sudo /etc/init.d/oracle-free-26ai configure
   ```
7. **Arrancar la instancia** (`sqlplus / as sysdba` y luego `STARTUP;`).
8. **Abrir el puerto 1521 en el firewall:**
   ```bash
   sudo firewall-cmd --permanent --add-port=1521/tcp
   sudo firewall-cmd --reload
   ```
9. **SQL Developer:** conexión `Liga_System` (usuario SYSTEM) para crear el usuario LIGA, y conexión `Liga_Normal` (usuario LIGA) para crear tablas, cargar datos y consultar. El backend usa este mismo usuario.

## Problemas y soluciones

| Problema | Causa | Solución |
|---|---|---|
| `scp` dice que el archivo no existe | Copiamos el nombre con una "X" de ejemplo en vez de la versión | Escribir el nombre real: 23.26.3-1 |
| "-P no se reconoce como comando" | Faltó escribir `scp` al inicio | Repetir el comando completo |
| Connection refused en el puerto 2222 | SSH no estaba activo en la VM | `sudo systemctl enable --now sshd` |
| ORA-01034 al abrir FREEPDB1 | La instancia no estaba iniciada | `STARTUP;` como sysdba |
| SQL Developer no llegaba a la base | El puerto 1521 estaba cerrado en el firewall | `firewall-cmd --add-port=1521/tcp` y `--reload` |

## Estado final

La base quedó en FREEPDB1, esquema LIGA, con **22 tablas**. La aplicación web se conecta por JDBC con el usuario LIGA y ya lee y modifica los datos. La tabla de posiciones no es una tabla: se calcula con una consulta cada vez.

## ¿Qué aprendí?

- Cómo se conectan las piezas: sistema operativo, listener, base contenedora y base conectable.
- Que instalar el paquete no crea la base: eso lo hace el script de configuración.
- Que anotar los errores sirve para repetir la instalación en otro equipo.