interface Props {
    name: string;
    isRecent?: boolean;
}

export function CompanyBadge({ name, isRecent }: Props) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-bg-inset px-2 py-0.5 text-[10.5px] text-text-dim">
            {isRecent && (
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_4px_var(--color-accent)]" />
            )}
            {name}
        </span>
    );
}