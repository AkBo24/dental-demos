import { cn } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductSwatch({
  product,
  className,
  size = 'md',
}: {
  product: Pick<Product, 'name' | 'hue'>
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-20 w-20 text-xl',
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg font-display font-semibold text-white/95 shadow-inner',
        sizes[size],
        className,
      )}
      style={{
        background: `linear-gradient(145deg, hsl(${product.hue} 42% 42%), hsl(${product.hue} 48% 28%))`,
      }}
      aria-hidden
    >
      {product.name.slice(0, 1)}
    </div>
  )
}
