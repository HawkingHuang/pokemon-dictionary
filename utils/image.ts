export function markImageLoaded(event: Event): void {
  const target = event.target as HTMLImageElement | null
  if (target) target.classList.add('loaded')
}

export function markImagesIfComplete(selector = '.lazy-img'): void {
  const images = document.querySelectorAll(selector)
  images.forEach(img => {
    const el = img as HTMLImageElement
    if (el.complete) el.classList.add('loaded')
  })
}
