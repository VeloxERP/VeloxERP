 # VeloxERP Modulsystem

Ein dynamisches Plugin-System für Nuxt 4, das es ermöglicht, ERP-Features zur Laufzeit zu aktivieren oder deaktivieren.

## Übersicht

Das Modulsystem ermöglicht es, einzelne Features (wie Buchhaltung, Warenwirtschaft, Zeiterfassung etc.) als separate Module zu entwickeln und zur Laufzeit zu aktivieren oder deaktivieren. Jedes Modul kann eigene Seiten, Stores, API-Handler und UI-Komponenten enthalten.

## Projektstruktur

```
modules/
├── accounting/                 # Buchhaltungs-Modul
│   ├── manifest.ts            # Modul-Konfiguration
│   ├── pages/                 # Modul-spezifische Seiten
│   │   ├── index.vue
│   │   ├── transactions.vue
│   │   └── chart-of-accounts.vue
│   ├── components/            # Modul-spezifische Komponenten
│   ├── stores/                # Modul-spezifische Stores
│   └── api/                   # Modul-spezifische API-Routen
├── inventory/                 # Warenwirtschafts-Modul
│   ├── manifest.ts
│   ├── pages/
│   └── components/
└── timetracking/              # Zeiterfassungs-Modul
    ├── manifest.ts
    ├── pages/
    └── components/

app/
├── composables/
│   └── useModuleLoader.ts     # Modul-Loader Composable
├── plugins/
│   ├── module-system.client.ts # Modul-System Initialisierung
│   └── navigation.client.ts   # Navigation Plugin
├── components/
│   └── ModuleNavigation.vue   # Dynamische Navigation
└── stores/
    └── navigation.ts          # Navigation Store

server/
├── api/
│   ├── modules/               # Modul-Management API
│   │   ├── index.get.ts
│   │   └── [id]/
│   │       └── manifest.get.ts
│   ├── accounting/            # Accounting-Modul API
│   │   ├── transactions.get.ts
│   │   └── accounts.get.ts
│   └── inventory/             # Inventory-Modul API
│       └── products.get.ts

types/
└── module.ts                  # TypeScript-Definitionen
```

## Modul-Manifest

Jedes Modul benötigt eine `manifest.ts` Datei, die die Modul-Konfiguration definiert:

```typescript
export default {
  id: 'accounting',                    // Eindeutige Modul-ID
  name: 'Accounting',                  // Anzeigename
  version: '1.0.0',                   // Modul-Version
  description: 'Financial accounting module',
  author: 'VeloxERP',
  
  // Routen, die das Modul registriert
  routes: [
    {
      path: '/accounting',
      component: 'accounting/index',
      name: 'accounting-dashboard'
    }
  ],
  
  // Navigation-Menüeinträge
  navigation: [
    {
      id: 'accounting-dashboard',
      label: 'Accounting',
      icon: 'Calculator',
      route: '/accounting',
      order: 10
    }
  ],
  
  // API-Routen
  apiRoutes: [
    {
      path: '/api/accounting/transactions',
      method: 'GET',
      handler: 'accounting/transactions'
    }
  ],
  
  // Stores
  stores: [
    {
      name: 'accounting',
      path: 'modules/accounting/stores/accounting'
    }
  ],
  
  // Komponenten
  components: [
    {
      name: 'TransactionForm',
      path: 'modules/accounting/components/TransactionForm',
      global: false
    }
  ],
  
  // Berechtigungen
  permissions: ['accounting.view', 'accounting.edit'],
  
  // Abhängigkeiten zu anderen Modulen
  dependencies: ['core']
};
```

## Modul-Loader

Der `useModuleLoader` Composable verwaltet das Laden und Entladen von Modulen:

```typescript
const { loadModule, unloadModule, getActiveModules, isModuleActive } = useModuleLoader();

// Modul laden
await loadModule('accounting');

// Modul entladen
await unloadModule('accounting');

// Aktive Module abrufen
const activeModules = getActiveModules();

// Prüfen ob Modul aktiv ist
const isActive = isModuleActive('accounting');
```

## Dynamische Navigation

Das Modulsystem erweitert automatisch die globale Navigation basierend auf den geladenen Modulen:

```vue
<template>
  <ModuleNavigation />
</template>
```

Die Navigation wird dynamisch aus den `navigation`-Einträgen der aktiven Module generiert.

## API-Integration

Module können eigene API-Routen registrieren:

```typescript
// server/api/accounting/transactions.get.ts
export default defineEventHandler(async (event) => {
  // API-Logik hier
  return {
    status: 200,
    message: 'Transactions retrieved successfully',
    body: transactions
  };
});
```

## Modul-Entwicklung

### Neues Modul erstellen

1. **Modul-Ordner erstellen:**
   ```bash
   mkdir modules/my-module
   ```

2. **Manifest erstellen:**
   ```typescript
   // modules/my-module/manifest.ts
   export default {
     id: 'my-module',
     name: 'My Module',
     version: '1.0.0',
     description: 'My custom module',
     author: 'Your Name',
     routes: [...],
     navigation: [...],
     apiRoutes: [...],
     permissions: [...]
   };
   ```

3. **Seiten erstellen:**
   ```vue
   <!-- modules/my-module/pages/index.vue -->
   <template>
     <div>My Module Dashboard</div>
   </template>
   ```

4. **API-Routen erstellen:**
   ```typescript
   // server/api/my-module/data.get.ts
   export default defineEventHandler(async (event) => {
     // API-Logik
   });
   ```

### Modul aktivieren

Module werden automatisch beim App-Start geladen, basierend auf der API-Antwort von `/api/modules`.

## Best Practices

### 1. Modul-Isolation
- Jedes Modul sollte unabhängig funktionieren
- Minimale Abhängigkeiten zu anderen Modulen
- Eigene Namespaces für API-Routen verwenden

### 2. Navigation
- Konsistente Icon-Verwendung (Lucide Icons)
- Logische Reihenfolge durch `order`-Property
- Hierarchische Struktur durch `children`

### 3. Berechtigungen
- Granulare Berechtigungen definieren
- Format: `module.action` (z.B. `accounting.view`)
- Berechtigungen in Navigation verwenden

### 4. API-Design
- RESTful Endpunkte
- Konsistente Response-Struktur
- Fehlerbehandlung implementieren

### 5. Komponenten
- Modul-spezifische Komponenten im Modul-Ordner
- Wiederverwendbare Komponenten global registrieren
- Props und Events dokumentieren

## Erweiterte Features

### Modul-Abhängigkeiten
Module können von anderen Modulen abhängen:

```typescript
export default {
  id: 'advanced-accounting',
  dependencies: ['accounting', 'inventory'],
  // ...
};
```

### Dynamische Routen
Module können Routen zur Laufzeit registrieren:

```typescript
// In der register-Funktion
if (module.manifest.routes) {
  for (const route of module.manifest.routes) {
    await registerModuleRoute(module.manifest.id, route);
  }
}
```

### Modul-Konfiguration
Module können konfigurierbar sein:

```typescript
// modules/accounting/config.ts
export default {
  currency: 'EUR',
  fiscalYearStart: '01-01',
  defaultTaxRate: 0.19
};
```

## Troubleshooting

### Modul wird nicht geladen
1. Prüfen Sie die `manifest.ts` auf Syntax-Fehler
2. Überprüfen Sie die API-Antwort von `/api/modules`
3. Schauen Sie in die Browser-Konsole für Fehler

### Navigation wird nicht angezeigt
1. Stellen Sie sicher, dass das Modul aktiv ist
2. Überprüfen Sie die `navigation`-Einträge im Manifest
3. Prüfen Sie die `ModuleNavigation`-Komponente

### API-Routen funktionieren nicht
1. Überprüfen Sie die Dateistruktur in `server/api/`
2. Stellen Sie sicher, dass die Handler-Dateien korrekt benannt sind
3. Prüfen Sie die Nitro-Logs

## Zukünftige Erweiterungen

- **Modul-Marketplace**: Zentrale Verwaltung von Modulen
- **Modul-Updates**: Automatische Updates von Modulen
- **Modul-Templates**: Vorlagen für neue Module
- **Modul-Tests**: Automatisierte Tests für Module
- **Modul-Dokumentation**: Automatische API-Dokumentation
- **Modul-Performance**: Monitoring und Optimierung

## Fazit

Das VeloxERP Modulsystem bietet eine flexible und erweiterbare Architektur für ERP-Anwendungen. Es ermöglicht die Entwicklung von modularen Features, die zur Laufzeit aktiviert oder deaktiviert werden können, ähnlich wie bei Odoo oder Shopware.