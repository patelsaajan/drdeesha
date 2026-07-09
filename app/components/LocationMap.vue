<template>
  <div ref="mapEl" class="h-full w-full" />
</template>

<script setup lang="ts">
import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl'
import { practice } from '../data/contact'

// Resize the map once it's actually visible — while collapsed to just its
// spine, the container has ~0 height, and MapLibre only measures it once at
// creation, so it needs telling explicitly once the card finishes expanding.
const props = defineProps<{
  active: boolean
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: MapLibreMap | null = null

// Muted slate-violet, not the saturated brand purple used elsewhere on the
// page — a map you glance at needs to recede, not compete for attention.
const PALETTE = {
  land: '#543571',
  water: '#331e48',
  park: '#654082',
  building: '#704f92',
  road: '#ffffff',
  boundary: 'rgba(255, 255, 255, 0.18)',
  labelText: '#ffffff',
  labelHalo: '#331e48',
}

// Loosely-typed on purpose — this is a fetched third-party style spec (a
// large discriminated union we only touch a handful of fields on), not a
// document this app constructs itself.
interface StyleLayerLike {
  type: string
  'source-layer'?: string
  paint?: Record<string, unknown>
  layout?: Record<string, unknown>
  [key: string]: unknown
}
interface StyleLike {
  layers: StyleLayerLike[]
  [key: string]: unknown
}

// Recolours OpenFreeMap's free "liberty" style toward the brand purple: land,
// water, parks and buildings each get their own purple tone, roads and
// labels go white so they read clearly against it. Drops the decorative
// world-relief raster layer, irrelevant at street zoom.
function purpleStyle(style: StyleLike) {
  const layers = style.layers
    .filter(l => l.type !== 'raster')
    .map((l) => {
      const sourceLayer = l['source-layer']
      const paint: Record<string, unknown> = { ...l.paint }

      if (l.type === 'background') {
        paint['background-color'] = PALETTE.land
      } else if (l.type === 'fill' || l.type === 'fill-extrusion') {
        const key = l.type === 'fill' ? 'fill-color' : 'fill-extrusion-color'
        if (sourceLayer === 'water') paint[key] = PALETTE.water
        else if (sourceLayer === 'building') paint[key] = PALETTE.building
        else if (['park', 'landcover', 'landuse'].includes(sourceLayer)) paint[key] = PALETTE.park
        else paint[key] = PALETTE.land
      } else if (l.type === 'line') {
        if (sourceLayer === 'waterway') paint['line-color'] = PALETTE.water
        else if (sourceLayer === 'boundary') paint['line-color'] = PALETTE.boundary
        else if (sourceLayer === 'park') paint['line-color'] = PALETTE.park
        else paint['line-color'] = PALETTE.road
      } else if (l.type === 'symbol' && l.layout?.['text-field']) {
        paint['text-color'] = PALETTE.labelText
        paint['text-halo-color'] = PALETTE.labelHalo
        paint['text-halo-width'] = 1.2
      }

      return { ...l, paint }
    })

  // Structurally close enough to the real spec, but not identical (see the
  // loose types above) — cast at the boundary rather than fighting the full
  // discriminated union just to recolour a handful of paint properties.
  return { ...style, layers } as unknown as StyleSpecification
}

onMounted(async () => {
  const el = mapEl.value
  if (!el) return

  // No default export — maplibre-gl is a named-exports-only module.
  const [maplibregl, , baseStyle] = await Promise.all([
    import('maplibre-gl'),
    import('maplibre-gl/dist/maplibre-gl.css'),
    fetch('https://tiles.openfreemap.org/styles/liberty').then(r => r.json()),
  ])

  map = new maplibregl.Map({
    container: el,
    style: purpleStyle(baseStyle),
    center: [practice.coordinates.lng, practice.coordinates.lat],
    zoom: 15.5,
    attributionControl: { compact: true, customAttribution: '© OpenStreetMap contributors' },
  })
  map.scrollZoom.disable()
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

  const pin = document.createElement('div')
  pin.className = 'location-map-pin'
  new maplibregl.Marker({ element: pin })
    .setLngLat([practice.coordinates.lng, practice.coordinates.lat])
    .addTo(map)

  if (props.active) requestAnimationFrame(() => map?.resize())
})

watch(() => props.active, (active) => {
  if (!active) return
  // Wait for the card's own flex-basis transition to finish growing before
  // asking MapLibre to re-measure its now-correctly-sized container.
  setTimeout(() => map?.resize(), 520)
})

onUnmounted(() => {
  map?.remove()
})
</script>

<style>
.location-map-pin {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: white;
  box-shadow: 0 0 0 5px rgb(255 255 255 / 0.25);
}
</style>
