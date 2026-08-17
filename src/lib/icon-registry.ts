import {
  Beef,
  Bird,
  Cloud,
  Drumstick,
  Feather,
  Ham,
  Leaf,
  LeafyGreen,
  Mountain,
  PawPrint,
  PiggyBank,
  Rabbit,
  Shell,
  Tractor,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from 'lucide-react'

// Bounded registry for the icon names referenced by data-driven config
// (categories.config.ts, data/mock/images.ts) — kept separate from the many
// icons imported directly in individual components so those stay
// tree-shakeable.
export const iconRegistry: Record<string, LucideIcon> = {
  Beef,
  Bird,
  Cloud,
  Drumstick,
  Feather,
  Ham,
  Leaf,
  LeafyGreen,
  Mountain,
  PawPrint,
  PiggyBank,
  Rabbit,
  Shell,
  Tractor,
  UtensilsCrossed,
  Wheat,
}

export function resolveIcon(name: string): LucideIcon {
  return iconRegistry[name] ?? PawPrint
}
