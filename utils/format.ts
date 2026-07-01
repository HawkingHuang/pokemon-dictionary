// Format a national dex id as #0006
export const formatDexNumber = (id: number) => '#' + String(id).padStart(4, '0')
