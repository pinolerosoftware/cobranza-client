# Contexto del Proyecto: Sistema de cobros

## 🎯 Objetivo
Desarrollar un dashboar administrador para la gestion de cobradores, clientes y prestamos personales, manejo de rutas de cobros.
La app debe ser rápida, segura, fácil de mantener y con una experiencia de usuario (UX) optimizada para la entrada de datos.

## 🛠️ Stack Tecnológico (Frontend)
- **Framework:** React (Vite)
- **Lenguaje:** TypeScript (Tipado estricto)
- **Estilos:** Tailwind CSS
- **Componentes UI:** Mantine UI
- **Gestión de Estado:** TanStack Query (Server State) + Context API/Zustand (Global UI State)
- **Formularios:** React Hook Form + Zod (Validación de esquemas)
- **Tablas:** TanStack Table (Data Grid complejo)
- **Rutas:** TanStack Router
- **Iconografía:** Lucide React

## 🏗️ Arquitectura y Mejores Prácticas
1. **Estructura de Carpetas:** Folder-by-feature.
   - `src/features/[feature-name]`: Contiene componentes, hooks y servicios específicos de un módulo (ej. `inventory`, `billing`).
   - `src/components`: Componentes base reutilizables.
2. **Tipado:** No usar `any`. Definir interfaces y tipos en `src/types` o dentro de cada feature.
3. **Validación:** Toda entrada de datos en formularios de facturación debe pasar por un esquema de Zod.
4. **Rendimiento:** Implementar `React.memo` en filas de tablas grandes y utilizar `useDeferredValue` para búsquedas en tiempo real.
5. **Comunicación API:** Usar una instancia centralizada de Axios con interceptores para manejo de errores.

## 📋 Reglas de Desarrollo para el Agente
- **Modularidad:** Antes de escribir un componente, verifica si puede ser un átomo reutilizable.
- **Accesibilidad (a11y):** Asegurar que los formularios sean navegables por teclado (crucial para cajeros/vendedores).
- **Manejo de Errores:** Siempre implementar estados de carga (skeletons) y estados de error amigables.
- **Naming:** Seguir convenciones de PascalCase para componentes y camelCase para variables/funciones.

## 🚀 Módulos Clave a Desarrollar
1. **Dashboard:** Resumen de ventas diarias y alertas de stock bajo (Gráficas con Tremor/Recharts).
2. **Clientes:** CRUD completo de clientes asi como su manejo y carga masiva.
2. **Cobradores:** CRUD completo de usuarios cobradores y carga masiva.
<!-- 4. **Reportes:** Exportación de datos (PDF/CSV) y filtrado avanzado por fechas. -->

## ⚠️ Restricciones
- No utilizar librerías de UI pesadas (como Material UI o Ant Design) para mantener el bundle size ligero.
- Evitar el uso excesivo de `useEffect`; priorizar `TanStack Query` para efectos secundarios de datos.