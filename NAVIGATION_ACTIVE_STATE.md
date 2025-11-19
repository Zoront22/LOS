# Sistema de Navegación Activa - Lords of Sun

## Descripción

Se ha implementado un sistema de navegación activa que detecta automáticamente la página actual y aplica estilos visuales al elemento de navegación correspondiente.

## Funcionalidad

### Detección Automática de Página Actual

El sistema detecta automáticamente la página actual basándose en:

1. **URL exacta**: Compara la URL del enlace con la URL actual
2. **Páginas de colección**: Detecta cuando estás en una colección específica
3. **Páginas estáticas**: Detecta páginas específicas
4. **Blogs**: Detecta cuando estás en un blog específico
5. **Productos**: Detecta cuando estás en un producto específico
6. **Página de inicio**: Detecta cuando estás en la página principal

### Clases CSS Aplicadas

Cuando un elemento de navegación está activo, se aplican las siguientes clases:

- `submenu__item--active`: Para el contenedor del elemento
- `submenu__link--active`: Para el enlace
- `submenu__list-control--active`: Para los controles de lista (mobile)

### Estilos Visuales

#### Desktop (≥1024px)
- Fondo de color accent
- Texto en color accent-foreground
- Sin línea inferior

#### Mobile/Drawer (<1024px)
- Fondo con color hover
- Línea inferior de 2px en color accent
- Texto en color accent con peso 700

## Archivos Modificados

### 1. `snippets/navigation.liquid`
- Agregada lógica de detección de página actual
- Aplicación de clases activas a elementos de navegación

### 2. `snippets/navigation-parent-item.liquid`
- Agregado parámetro `is_active`
- Aplicación de clases activas a elementos padre

### 3. `assets/navigation-active.css`
- Estilos CSS para estados activos
- Responsive design para desktop y mobile

### 4. `layout/theme.liquid`
- Incluido el archivo CSS de navegación activa

## Cómo Funciona

1. **Detección**: El sistema analiza la URL actual y el tipo de página
2. **Comparación**: Compara con las URLs de los enlaces de navegación
3. **Aplicación**: Aplica las clases CSS correspondientes
4. **Estilos**: Los estilos CSS hacen que el elemento activo sea visualmente distintivo

## Compatibilidad

- ✅ Shopify Liquid
- ✅ Responsive design
- ✅ Soporte para drawer y dropdown navigation
- ✅ Compatible con mega menus
- ✅ Funciona en todas las páginas de Shopify

## Personalización

Los estilos pueden ser personalizados modificando las variables CSS en `assets/navigation-active.css`:

- `--color-accent`: Color principal para elementos activos
- `--color-accent-foreground`: Color del texto en elementos activos
- `--color-hover`: Color de fondo para mobile/drawer

## Notas Técnicas

- El sistema funciona sin JavaScript adicional
- Utiliza Liquid para la detección de página actual
- Los estilos son responsivos y se adaptan a diferentes tamaños de pantalla
- Compatible con el tema Eclipse existente 