type CollectionItem = {
    format:string 
    is_sealed: boolean
}

export default function StatsBar({items}: {items: CollectionItem[]}) {
    const total = items.length
    const sealed = items.filter((i) => i.is_sealed).length
    const byFormat = items.reduce<Record<string, number>>((acc, item) => {
        acc[item.format] = (acc[item.format] ?? 0) + 1
        return acc
    }, {})

    return (
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-neutral-300">
            <Stat label="Total" value={total}/>
            <Stat label="Sealed" value={sealed}/>
            {Object.entries(byFormat).map(([format, count]) => (
                <Stat key={format} label={format} value={count}/>
            ))}
        </div>
    )
}

function Stat({label, value}: {label: string; value: number}) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
            <span className="text-neutral-500">{label}:</span>
            <span className="font-semibold text-white">{value}</span>
        </div>
    )
}