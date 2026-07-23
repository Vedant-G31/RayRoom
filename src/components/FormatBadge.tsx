const FORMAT_STYLES: Record<string, string> = {
    '4K UHD': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Blu-Ray': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    'DVD': 'bg-neutral-500/20 text-neutral-300 border-neutral-500/40',
    'Steelbook': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
}

export default function FormatBadge({format}: {format: string}) {
    const style = FORMAT_STYLES[format] ?? 'bg-neutral-500/20 text-neutral-300 border-neutral-500/40'
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full border ${style}`}>
            {format}
        </span>
    )
}