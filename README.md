# Wiki de Seguridad en Microsoft Azure

**Estudiante:** Esteban Lillo Péndola
**Carrera:** Ingeniería en Informática
**Asignatura:** Gestión de Seguridad de la Información (TI3062)
**Profesor:** Rubén Schnettler
**Fecha:** 9 de noviembre de 2026

## Enlaces

- Sitio publicado: https://wikimicrosoftazure.vercel.app/
- Código fuente: https://github.com/ItsShpektr/Wiki_MicrosoftAzure

## Qué es este trabajo

Es una aplicación web hecha con React que funciona como wiki sobre seguridad en Microsoft Azure. Su contenido se construye a partir del laboratorio de la Unidad 2 y de mi informe de la Evaluación Sumativa N.º 2, desarrollado sobre el Caso B (Transportes Valle Azul). La idea es que quien la lea entienda por qué cada medida de seguridad se aplica, qué riesgo reduce y qué límites conserva, y no solo qué comandos se ejecutaron.

El sitio tiene un menú lateral por secciones, un buscador y artículos enlazables entre sí. Está desarrollado con React y Vite, y publicado en Vercel desde el repositorio de GitHub.

## Contenido

### Fundamentos

- **Responsabilidad compartida.** En la nube, el proveedor y el cliente se reparten la seguridad. El laboratorio lo muestra con el cifrado: en reposo ya viene activo y no se puede desactivar, pero el cifrado en tránsito hay que exigirlo al crear la cuenta de almacenamiento.
- **Marcos de referencia.** Cada decisión se sustenta en el pilar de Seguridad del Azure Well-Architected Framework y en controles de NIST SP 800-53 Rev. 5 (AC-2, AC-6, AU-2, AU-6, IA-2, IA-5, SC-7, SC-8, SI-4 y CP-9).
- **Cómo justificar una medida.** Cada medida se explica con la misma estructura: decisión, riesgo que resuelve, control que la respalda, evidencia y límite.

### Lo trabajado en el laboratorio

- **Almacenamiento seguro.** Se exige HTTPS, TLS 1.2 como mínimo y se bloquea el acceso público anónimo. Protege los documentos tributarios y los registros de temperatura mientras viajan. No impide que alguien con credenciales legítimas los saque o los borre.
- **Firewall de red.** Se autoriza una IP de confianza y se deja la denegación como regla por omisión. Si esa IP se compromete, el acceso sigue abierto para quien la use.
- **Segundo factor (Security Defaults).** Obliga a usar MFA en todas las cuentas del directorio, y apunta al problema de la contraseña compartida del caso. Como se aplica a todo el directorio, no permite excepciones para cuentas de servicio o sistemas antiguos.
- **Roles y mínimo privilegio.** Los permisos se asignan a grupos por función y con un ámbito acotado, no a personas. En mi implementación, el grupo de recepción tiene el rol Reader sobre el grupo de recursos. Este control opera sobre la administración de recursos, no sobre los archivos: una clave de acceso o un token SAS filtrado lo saltaría.
- **Usuarios y grupos.** Las cuentas son nominativas para que cada acción quede asociada a una persona. La matriz de accesos relaciona función, grupo, rol, ámbito y justificación.
- **Prueba negativa.** Se intentó reabrir el firewall con la usuaria de recepción y Azure respondió AuthorizationFailed, lo que demuestra que el mínimo privilegio funciona.
- **Auditoría.** El registro de actividad de Azure Monitor permite ver quién hizo qué y con qué resultado, y filtrar fallos o actuaciones de una identidad. No incluye los inicios de sesión (que están en Microsoft Entra ID) ni las lecturas y escrituras de datos dentro del almacenamiento.
- **Evaluación y recomendaciones.** Tres mejoras priorizadas: revisiones periódicas de accesos, gestión de claves con Azure Key Vault y monitoreo ampliado de eventos de seguridad.

### Temas complementarios

- **Acceso Condicional.** Se documenta como diseño, porque requiere licencia Entra ID P1 que la versión gratuita no incluye. Considera ubicaciones confiables (las tres sedes), estado del dispositivo y MFA en cada inicio de sesión.
- **Plano de control y plano de datos.** Explica por qué varias de las limitaciones encontradas en el laboratorio nacen de que la administración de recursos y el acceso al contenido son capas distintas.

### Caso Transportes Valle Azul

Incluye un resumen de la empresa, los incidentes del último año (el fraude por correo de $34 millones, la planilla de tarifas alterada, la caída de 14 horas del servidor y la oferta del competidor a un 4 % bajo la tarifa) y una tabla que relaciona las reglas R1 a R12 con el control del laboratorio que las mitiga.

En esa tabla, el estado de cada regla (mitigada, parcial, abierta o recomendada) es una valoración propia según lo que se alcanzó a ejecutar. No viene del enunciado del caso.

### Referencia

Un resumen de los comandos usados en el laboratorio y un glosario con los términos clave.

## Nota sobre las evidencias

La wiki no muestra contraseñas, claves de cuenta ni cadenas de conexión, en línea con la advertencia de la guía del laboratorio. Los datos de la empresa del caso son ficticios.