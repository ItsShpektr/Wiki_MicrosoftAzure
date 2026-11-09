// Contenido de la wiki. Cada artículo es una lista de bloques:
// {t:"h", x}  subtítulo | {t:"p", x} párrafo | {t:"ul", items} lista
// {t:"code", x, note} comando | {t:"callout", kind:"info|warn|ok", title, x}
// {t:"table", head:[...], rows:[[...]]}

export const sections = [
  {
    group: "Fundamentos",
    articles: [
      {
        id: "modelo-responsabilidad",
        title: "Responsabilidad compartida",
        tags: ["iaas", "paas", "proveedor", "cliente", "cifrado"],
        summary: "Qué protege Azure y qué debe configurar el cliente.",
        blocks: [
          { t: "p", x: "En la nube, la seguridad se reparte entre el proveedor y el cliente. Azure protege la infraestructura física y la plataforma; el cliente decide identidades, permisos, configuración de red y qué datos almacena." },
          { t: "p", x: "El laboratorio lo muestra con un ejemplo concreto: el cifrado en reposo de una cuenta de almacenamiento ya viene activo y no se puede desactivar (lado del proveedor), pero el cifrado en tránsito (HTTPS, TLS 1.2 mínimo) hay que exigirlo al crear el recurso (lado del cliente)." },
          { t: "table", head: ["Aspecto", "Lo hace Azure", "Lo decide el cliente"], rows: [
            ["Cifrado en reposo", "Activo por defecto (SSE, claves de Microsoft)", "Usar claves administradas por Microsoft o claves propias (CMK)"],
            ["Cifrado en tránsito", "Ofrece HTTPS y TLS", "Exigir HTTPS y fijar TLS 1.2 como mínimo"],
            ["Acceso a datos", "Provee RBAC, firewall, claves", "Definir roles, ámbitos y reglas de red"],
            ["Identidades", "Provee Entra ID y MFA", "Habilitar MFA, crear cuentas nominativas"],
          ]},
          { t: "callout", kind: "info", title: "Control NIST relacionado", x: "SC-8 (confidencialidad e integridad en tránsito) y SC-28 (protección de información en reposo)." },
        ],
      },
      {
        id: "marcos",
        title: "Marcos de referencia",
        tags: ["nist", "well-architected", "waf", "iso 27017"],
        summary: "Azure Well-Architected Framework y NIST SP 800-53 Rev. 5.",
        blocks: [
          { t: "p", x: "Toda decisión de seguridad debe poder justificarse con un marco. En el laboratorio se usan dos: el pilar de Seguridad del Microsoft Azure Well-Architected Framework (WAF) y el catálogo de controles NIST SP 800-53 Rev. 5." },
          { t: "table", head: ["Control NIST", "Nombre", "Dónde aparece en el laboratorio"], rows: [
            ["AC-2", "Administración de cuentas", "Usuarios nominativos y grupos"],
            ["AC-6", "Mínimo privilegio", "Rol Reader con ámbito de grupo de recursos"],
            ["AU-2 / AU-6", "Eventos de auditoría / revisión de registros", "Consulta del registro de actividad"],
            ["IA-2", "Identificación y autenticación", "Security Defaults (MFA)"],
            ["IA-5", "Gestión de autenticadores", "Cambio de contraseña y registro de Authenticator"],
            ["SC-7", "Protección de frontera", "Firewall del almacenamiento (Deny por omisión)"],
            ["SC-8", "Protección en tránsito", "HTTPS + TLS 1.2"],
            ["SI-4", "Monitoreo del sistema", "Filtro de operaciones fallidas"],
            ["CP-9", "Respaldo del sistema", "Recomendado para el servidor de facturación"],
          ]},
          { t: "callout", kind: "ok", title: "Buena práctica", x: "Cada configuración debe citar el control o la recomendación que la justifica. Una medida sin fundamento normativo es una opinión." },
        ],
      },
      {
        id: "estructura-decision",
        title: "Cómo justificar una medida",
        tags: ["informe", "decisión", "riesgo", "límite"],
        summary: "Estructura Decisión → Riesgo → Control → Evidencia → Límite.",
        blocks: [
          { t: "p", x: "El informe del laboratorio evalúa más la justificación que la ejecución. Cada medida se documenta con cinco partes:" },
          { t: "ul", items: [
            "Decisión: qué se configuró.",
            "Riesgo: qué problema del caso resuelve.",
            "Control: qué control NIST o recomendación WAF la respalda.",
            "Evidencia: qué línea de la transcripción lo demuestra.",
            "Límite: qué riesgo sigue existiendo aunque la medida funcione.",
          ]},
          { t: "callout", kind: "warn", title: "Nunca expongas secretos", x: "Ninguna evidencia puede mostrar contraseñas, claves de cuenta ni cadenas de conexión. Reemplázalas por <omitido> antes de pegar." },
        ],
      },
    ],
  },
  {
    group: "Laboratorio paso a paso",
    articles: [
      {
        id: "almacenamiento",
        title: "Paso 1 · Almacenamiento seguro",
        tags: ["storage", "https", "tls", "cifrado", "blob", "az storage"],
        summary: "Cuenta de almacenamiento con HTTPS, TLS 1.2 y sin acceso público.",
        blocks: [
          { t: "p", x: "Un recurso creado con valores por omisión puede aceptar tráfico sin cifrar y versiones antiguas del protocolo. Fijar los parámetros al crear el recurso evita corregirlos cuando ya hay datos dentro." },
          { t: "code", note: "Crea el contenedor lógico de los recursos.", x: "az group create --name rg-valleazul --location eastus2" },
          { t: "code", note: "Cuenta ya asegurada: HTTPS obligatorio, TLS 1.2 mínimo, sin acceso anónimo.", x: "az storage account create --name stvalleazul01 \\\n  --resource-group rg-valleazul --location eastus2 \\\n  --sku Standard_LRS --kind StorageV2 --https-only true \\\n  --min-tls-version TLS1_2 --allow-blob-public-access false" },
          { t: "h", x: "Verificación" },
          { t: "code", note: "Debe devolver True, TLS1_2, False y True, en ese orden.", x: "az storage account show --name stvalleazul01 \\\n  --resource-group rg-valleazul --output table \\\n  --query \"{https:enableHttpsTrafficOnly, tls:minimumTlsVersion, publico:allowBlobPublicAccess, cifrado:encryption.services.blob.enabled}\"" },
          { t: "callout", kind: "info", title: "Nota", x: "El nombre de una cuenta de almacenamiento es único en todo Azure, solo minúsculas y dígitos, de 3 a 24 caracteres. Si ya está en uso, agrega dígitos." },
          { t: "h", x: "Límite" },
          { t: "p", x: "Cifrar en tránsito y negar el acceso anónimo no impide la exfiltración ni el borrado si alguien usa credenciales legítimas." },
          { t: "p", x: "Control: NIST SC-8 · Pilar de Seguridad del WAF." },
        ],
      },
      {
        id: "firewall",
        title: "Paso 1 · Firewall de red",
        tags: ["firewall", "network-rule", "deny", "ip", "sc-7"],
        summary: "Denegación por omisión y autorización de una IP de confianza.",
        blocks: [
          { t: "p", x: "HTTPS protege el canal, pero no limita quién puede intentar conectarse. La regla de red agrega una segunda capa independiente de la credencial." },
          { t: "code", note: "Obtiene tu IP pública.", x: "curl -s ifconfig.me" },
          { t: "code", note: "Autoriza tu IP. Va ANTES de denegar.", x: "az storage account network-rule add \\\n  --account-name stvalleazul01 --resource-group rg-valleazul \\\n  --ip-address <tu-ip-publica>" },
          { t: "code", note: "Invierte la regla por omisión.", x: "az storage account update --name stvalleazul01 \\\n  --resource-group rg-valleazul --default-action Deny" },
          { t: "code", note: "Evidencia de las reglas vigentes.", x: "az storage account network-rule list \\\n  --account-name stvalleazul01 --resource-group rg-valleazul --output table" },
          { t: "callout", kind: "warn", title: "Error frecuente", x: "Ejecutar --default-action Deny antes de autorizar tu propia IP deja la cuenta inaccesible para operaciones sobre datos. La configuración se sigue consultando porque va por otro plano, así que el error no se nota de inmediato." },
          { t: "h", x: "Límite" },
          { t: "p", x: "Una dirección autorizada que sea comprometida conserva el acceso. Control: NIST SC-7." },
        ],
      },
      {
        id: "mfa",
        title: "Paso 2 · MFA con Security Defaults",
        tags: ["mfa", "segundo factor", "security defaults", "entra", "graph", "ia-2"],
        summary: "Segundo factor obligatorio para todas las cuentas del directorio.",
        blocks: [
          { t: "p", x: "Una contraseña robada basta para entrar. El segundo factor la vuelve insuficiente por sí sola. Los Security Defaults exigen MFA a todas las cuentas y bloquean protocolos de autenticación heredados, y están disponibles en la versión gratuita de Entra ID." },
          { t: "code", x: "P=https://graph.microsoft.com/v1.0/policies\nP=$P/identitySecurityDefaultsEnforcementPolicy\naz rest --method get --url $P --query isEnabled\naz rest --method patch --url $P --body '{\"isEnabled\": true}'" },
          { t: "callout", kind: "ok", title: "Criterio de verificación", x: "isEnabled responde true, y el primer ingreso de una usuaria exige registrar Microsoft Authenticator." },
          { t: "h", x: "Límite" },
          { t: "p", x: "Security Defaults se aplican a todo el directorio: no permiten excepciones para cuentas de servicio ni sistemas heredados. Para eso se necesita Acceso Condicional (ver artículo dedicado). Control: NIST IA-2." },
        ],
      },
      {
        id: "rbac",
        title: "Paso 2 y 3 · RBAC y mínimo privilegio",
        tags: ["rbac", "reader", "roles", "ámbito", "scope", "ac-6"],
        summary: "Roles asignados a grupos, con ámbito acotado.",
        blocks: [
          { t: "p", x: "Otorgar Owner concentra en una cuenta la capacidad de crear, leer, modificar y eliminar todo, incluidos los registros que permitirían reconstruir lo ocurrido. El mínimo privilegio otorga solo lo que la función necesita." },
          { t: "code", note: "Línea base: quién tiene qué antes de intervenir.", x: "az role assignment list --resource-group rg-valleazul --output table" },
          { t: "code", note: "Alcance de los roles.", x: "RGID=$(az group show --name rg-valleazul --query id -o tsv)" },
          { t: "code", note: "Rol asignado al GRUPO, no a la persona.", x: "az role assignment create --assignee-object-id $GR \\\n  --assignee-principal-type Group --role \"Reader\" --scope $RGID" },
          { t: "callout", kind: "warn", title: "Rol ≠ ámbito", x: "«Lector» sobre la suscripción concede más que «Colaborador» sobre un grupo de recursos. Hay que justificar ambos." },
          { t: "h", x: "Límite" },
          { t: "p", x: "RBAC opera sobre el plano de administración (Azure Resource Manager). No evita leer o alterar archivos si se filtran claves de acceso o tokens SAS." },
        ],
      },
      {
        id: "identidades",
        title: "Paso 3 · Usuarios y grupos",
        tags: ["usuarios", "grupos", "entra", "ac-2", "nominativo", "az ad"],
        summary: "Cuentas nominativas agrupadas por función.",
        blocks: [
          { t: "p", x: "Con una cuenta compartida, el registro indica qué se hizo pero no quién lo hizo. La cuenta nominativa es la condición de posibilidad de la trazabilidad (caso Valle Azul, regla R1: usuario «operaciones» conocido por once personas)." },
          { t: "code", note: "La contraseña real nunca se transcribe.", x: "az ad user create --display-name \"Ana Torres\" \\\n  --user-principal-name ana.torres@<dominio>.onmicrosoft.com \\\n  --password '<omitido>' --force-change-password-next-sign-in true" },
          { t: "code", x: "az ad group create --display-name grp-recepcion --mail-nickname grprecepcion\nUA=$(az ad user show --id ana.torres@<dominio>.onmicrosoft.com --query id -o tsv)\naz ad group member add --group grp-recepcion --member-id $UA" },
          { t: "h", x: "Matriz de accesos" },
          { t: "table", head: ["Función", "Grupo", "Rol", "Ámbito", "Justificación"], rows: [
            ["Recepción", "grp-recepcion", "Reader", "Grupo de recursos", "Consulta, no modifica"],
            ["Administración", "grp-admin", "Storage Blob Data Contributor", "Cuenta de almacenamiento", "Carga documentos del proceso"],
            ["Auditoría", "grp-auditoria", "Monitoring Reader", "Suscripción", "Lee registros, no interviene recursos"],
          ]},
          { t: "callout", kind: "warn", title: "Un permiso, un origen", x: "Asignar el rol a la persona y además al grupo duplica el permiso: retirarlo del grupo no surte efecto y la matriz deja de reflejar la realidad." },
          { t: "h", x: "Verificación" },
          { t: "code", x: "az ad group member list --group grp-recepcion --output table\naz role assignment list --resource-group rg-valleazul --include-inherited --output table" },
        ],
      },
      {
        id: "prueba-negativa",
        title: "Prueba negativa de autorización",
        tags: ["authorizationfailed", "prueba", "login", "logout", "negativa"],
        summary: "Demostrar que el mínimo privilegio realmente bloquea.",
        blocks: [
          { t: "p", x: "Una prueba negativa intenta una acción que NO debería estar permitida y confirma que falla. Ingresas como la usuaria de prueba (lo que fuerza el cambio de contraseña y el registro del segundo factor) e intentas reabrir el firewall." },
          { t: "code", x: "az login -u ana.torres@<dominio>.onmicrosoft.com -p '<omitido>'\n# las variables de la sesión anterior no se conservan:\nRG=rg-valleazul\nSA=stvalleazul01\naz storage account update --name $SA --resource-group $RG --default-action Allow\naz logout" },
          { t: "callout", kind: "ok", title: "Resultado esperado", x: "AuthorizationFailed: el rol Reader no incluye Microsoft.Storage/storageAccounts/write." },
          { t: "callout", kind: "info", title: "Conserva los errores", x: "Los errores y su corrección forman parte de la evidencia. Un error corregido demuestra comprensión; una transcripción sin errores no es verosímil." },
        ],
      },
      {
        id: "auditoria",
        title: "Paso 4 · Auditoría y registros",
        tags: ["activity log", "monitor", "auditoría", "au-6", "si-4", "logs"],
        summary: "Consultar el registro de actividad e identificar eventos críticos.",
        blocks: [
          { t: "p", x: "Configurar controles sin revisar los registros deja a la organización sin saber si operaron. El registro de actividad conserva 90 días de operaciones sobre recursos y no requiere licencia adicional." },
          { t: "code", note: "Cuándo, quién, qué y resultado (últimos 7 días).", x: "az monitor activity-log list --offset 7d --resource-group rg-valleazul --output table \\\n  --query \"[].{hora:eventTimestamp, quien:caller, operacion:operationName.value, estado:status.value}\"" },
          { t: "code", note: "Solo operaciones fallidas.", x: "az monitor activity-log list --offset 30d --status Failed --output table" },
          { t: "code", note: "Todo lo hecho por una identidad.", x: "az monitor activity-log list --offset 30d --caller <usuario@dominio> --output table" },
          { t: "h", x: "Eventos críticos" },
          { t: "table", head: ["Evento", "Por qué es crítico", "NIST"], rows: [
            ["Asignación de rol con privilegio elevado", "Amplía lo que una identidad puede hacer sin aviso visible", "AC-6"],
            ["Cambio en la regla de red", "Puede reabrir el acceso que el paso 1 cerró", "SC-7"],
            ["Eliminación de un recurso", "Afecta disponibilidad y puede destruir evidencia", "CP-9"],
            ["Operación fallida repetida desde un origen", "Patrón de acceso no autorizado", "AU-6"],
          ]},
          { t: "callout", kind: "warn", title: "Dos registros distintos", x: "El registro de actividad NO incluye inicios de sesión. Esos viven en el registro de Microsoft Entra ID (7 días en la versión gratuita, consultables desde el portal). Tampoco cubre lecturas y escrituras de datos dentro del almacenamiento (plano de datos)." },
        ],
      },
      {
        id: "recomendaciones",
        title: "Paso 5 · Evaluación y recomendaciones",
        tags: ["recomendaciones", "access reviews", "key vault", "siem", "prioridad"],
        summary: "Efectividad de lo implementado y propuestas de mejora priorizadas.",
        blocks: [
          { t: "p", x: "Evaluar es juzgar si la medida funcionó y con qué límite, no repetir lo que se hizo." },
          { t: "table", head: ["Medida", "Riesgo que mitiga", "Evidencia", "Límite"], rows: [
            ["HTTPS + TLS 1.2", "Interceptación en tránsito", "az storage account show", "No protege el dato ya descifrado en destino"],
            ["Deny por omisión", "Acceso desde origen no autorizado", "network-rule list", "Una IP autorizada comprometida conserva el acceso"],
            ["Roles por grupo con ámbito", "Exceso de privilegio", "role assignment list", "No impide mal uso dentro del privilegio concedido"],
          ]},
          { t: "h", x: "Recomendaciones (cada una con hallazgo y prioridad)" },
          { t: "ul", items: [
            "Alta · Access Reviews trimestrales y desactivación automática de cuentas (hallazgo: bajas sin plazo, R9; NIST AC-2).",
            "Alta · Azure Key Vault con rotación de claves cada 90 días (hallazgo: credenciales estáticas compartidas; NIST IA-5).",
            "Media · Diagnósticos de Storage y logs de Entra ID en una plataforma SIEM con alertas (hallazgo: sin visibilidad del plano de datos; NIST AU-6, ISO/IEC 27017).",
          ]},
        ],
      },
    ],
  },
  {
    group: "Temas avanzados",
    articles: [
      {
        id: "acceso-condicional",
        title: "Acceso Condicional (Entra ID P1)",
        tags: ["acceso condicional", "p1", "licencia", "ubicación", "dispositivo"],
        summary: "Diseño de la política que reemplazaría a Security Defaults.",
        blocks: [
          { t: "p", x: "El Acceso Condicional requiere licencia Entra ID P1, que la versión gratuita no incluye. En el laboratorio se documenta como diseño sin aplicarla." },
          { t: "table", head: ["Elemento", "Diseño propuesto"], rows: [
            ["Asignación", "Grupo operativo y cuentas administrativas"],
            ["Ubicación", "Ubicaciones confiables: las tres sedes (Quilpué, San Antonio, Los Andes)"],
            ["Dispositivo", "Solo equipos gestionados o que cumplan políticas de cumplimiento"],
            ["Concesión", "MFA en cada inicio de sesión"],
            ["Riesgo", "Bloqueo o cambio forzoso de sesión ante anomalías o inicios imposibles"],
          ]},
          { t: "p", x: "Riesgo del caso que reduce: acceso desde redes públicas o teléfonos no regulados, de modo que una credencial filtrada no baste por sí sola." },
        ],
      },
      {
        id: "planos",
        title: "Plano de control vs plano de datos",
        tags: ["arm", "plano de datos", "sas", "access keys", "storage blob data"],
        summary: "Por qué RBAC y el registro de actividad no lo cubren todo.",
        blocks: [
          { t: "p", x: "Azure separa la administración de recursos (plano de control, vía Azure Resource Manager) del acceso al contenido (plano de datos). Muchas limitaciones del laboratorio nacen de esta diferencia." },
          { t: "table", head: ["", "Plano de control", "Plano de datos"], rows: [
            ["Qué es", "Crear, modificar, borrar recursos", "Leer o escribir blobs, archivos, colas"],
            ["Roles típicos", "Reader, Contributor, Owner", "Storage Blob Data Reader / Contributor"],
            ["Auditoría", "Registro de actividad", "Diagnósticos de Storage (hay que habilitarlos)"],
            ["Riesgo residual", "—", "Claves de cuenta o SAS filtradas saltan RBAC"],
          ]},
        ],
      },
    ],
  },
  {
    group: "Caso Valle Azul",
    articles: [
      {
        id: "caso-resumen",
        title: "El caso en resumen",
        tags: ["valle azul", "transporte", "refrigerada", "quilpué"],
        summary: "Empresa de carga refrigerada con 212 camiones y 38 clientes.",
        blocks: [
          { t: "p", x: "Transportes Valle Azul es una empresa de carga refrigerada con casa matriz en Quilpué y patios en San Antonio y Los Andes. Sus dos promesas son entregar a tiempo y a la temperatura pactada, y esto último se demuestra con registros de sensores que los exportadores auditan." },
          { t: "ul", items: [
            "410 trabajadores, 212 camiones con localizador y sensor, 38 clientes.",
            "Área de tecnología de 3 personas.",
            "Datos críticos: georreferenciación (~2 millones de registros al mes), tarifas de 38 contratos, ~9.000 documentos tributarios al mes y registros de temperatura.",
          ]},
          { t: "h", x: "Incidentes del último año" },
          { t: "table", head: ["Mes", "Qué ocurrió", "Lección"], rows: [
            ["Marzo", "Correo suplantando a la gerenta pidió cambiar una cuenta bancaria; se transfirieron $34 millones", "Verificación fuera de banda (R12)"],
            ["Mayo", "Planilla de tarifas alterada sin poder saber quién", "Historial y control de acceso (R3)"],
            ["Julio", "Servidor de rastreo caído 14 horas", "Disponibilidad y respaldo"],
            ["Septiembre", "Competidor ofreció exactamente 4 % bajo la tarifa vigente", "Confidencialidad de tarifas; no se investigó"],
          ]},
        ],
      },
      {
        id: "caso-mapeo",
        title: "Reglas R1–R12 y su mitigación",
        tags: ["r1", "r2", "r3", "r12", "reglas", "vulnerabilidades", "mapeo"],
        summary: "Qué regla resuelve cada control del laboratorio y cuáles quedan abiertas.",
        blocks: [
          { t: "table", head: ["Regla", "Problema", "Control del laboratorio", "Estado"], rows: [
            ["R1", "Usuario «operaciones» compartido por 11 personas", "Cuentas nominativas + Security Defaults", "Mitigada"],
            ["R2", "Contraseña cambiada una vez al año", "MFA + cambio forzoso en primer ingreso", "Parcial"],
            ["R3", "Planilla compartida por enlace sin control", "Roles por grupo en lugar de enlaces públicos", "Parcial"],
            ["R4", "Teléfonos sin bloqueo ni borrado remoto", "Requiere MDM / Acceso Condicional (P1)", "Abierta"],
            ["R5", "Respaldo en disco sobre el mismo escritorio", "Almacenamiento cloud + CP-9", "Recomendada"],
            ["R6", "Sin registro de acceso a georreferenciación", "Registro de actividad + diagnósticos de Storage", "Parcial"],
            ["R7", "Cámaras graban 7 días sin respaldo", "Fuera del alcance de la actividad", "Abierta"],
            ["R8", "Registros de temperatura según espacio disponible", "Retención definida en almacenamiento", "Recomendada"],
            ["R9", "Bajas informadas sin plazo", "Access Reviews (AC-2)", "Recomendada"],
            ["R10", "Una sola clave Wi-Fi para todos", "Fuera del alcance de la actividad", "Abierta"],
            ["R11", "Cuenta del contable creada en 2019", "Access Reviews + mínimo privilegio", "Recomendada"],
            ["R12", "Sin verificación de cambios bancarios", "Procedimiento (no técnico)", "Abierta"],
          ]},
          { t: "callout", kind: "info", title: "Supuesto declarado", x: "El estado «Parcial / Abierta / Recomendada» es una valoración de esta wiki según lo ejecutado en el laboratorio, no un dato del caso original." },
        ],
      },
    ],
  },
  {
    group: "Referencia",
    articles: [
      {
        id: "comandos",
        title: "Cheat sheet de comandos",
        tags: ["az", "cli", "comandos", "referencia"],
        summary: "Todos los comandos az usados en el laboratorio.",
        blocks: [
          { t: "code", note: "Suscripción", x: "az account show --output table\naz account show --query id --output tsv" },
          { t: "code", note: "Almacenamiento", x: "az group create --name <rg> --location eastus2\naz storage account create --name <sa> --resource-group <rg> --https-only true --min-tls-version TLS1_2 --allow-blob-public-access false" },
          { t: "code", note: "Red", x: "az storage account network-rule add --account-name <sa> --resource-group <rg> --ip-address <ip>\naz storage account update --name <sa> --resource-group <rg> --default-action Deny\naz storage account network-rule list --account-name <sa> --resource-group <rg> --output table" },
          { t: "code", note: "Identidades y roles", x: "az ad user create ...\naz ad group create --display-name <grp> --mail-nickname <nick>\naz ad group member add --group <grp> --member-id <id>\naz role assignment create --assignee-object-id <id> --assignee-principal-type Group --role <rol> --scope <scope>\naz role assignment list --resource-group <rg> --include-inherited --output table" },
          { t: "code", note: "Auditoría", x: "az monitor activity-log list --offset 7d --resource-group <rg>\naz monitor activity-log list --offset 30d --status Failed\naz monitor activity-log list --offset 30d --caller <usuario>" },
        ],
      },
      {
        id: "glosario",
        title: "Glosario",
        tags: ["definiciones", "rbac", "sse", "tls", "mfa", "sas"],
        summary: "Términos clave de seguridad en Azure.",
        blocks: [
          { t: "table", head: ["Término", "Definición"], rows: [
            ["RBAC", "Control de acceso basado en roles: permisos según función y ámbito."],
            ["Ámbito (scope)", "Nivel donde aplica un rol: suscripción, grupo de recursos o recurso."],
            ["MFA", "Autenticación multifactor: contraseña más un segundo factor."],
            ["Security Defaults", "Configuración básica gratuita de Entra ID que impone MFA."],
            ["Acceso Condicional", "Políticas por contexto (ubicación, dispositivo, riesgo). Requiere P1."],
            ["SSE", "Storage Service Encryption: cifrado en reposo automático."],
            ["SAS", "Firma de acceso compartido: token delegado a recursos de Storage."],
            ["Plano de control", "Gestión de recursos vía Azure Resource Manager."],
            ["Plano de datos", "Acceso al contenido dentro de los servicios."],
            ["Mínimo privilegio", "Dar exactamente los permisos que la función necesita."],
            ["Prueba negativa", "Intento deliberado de una acción prohibida para comprobar que falla."],
          ]},
        ],
      },
    ],
  },
];

export const allArticles = sections.flatMap((s) =>
  s.articles.map((a) => ({ ...a, group: s.group }))
);
