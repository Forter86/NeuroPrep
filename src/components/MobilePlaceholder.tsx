type MobilePlaceholderProps = {
  title: string;
  subtitle: string;
  placeholder: string;
};

export function MobilePlaceholder({ title, subtitle, placeholder }: MobilePlaceholderProps) {
  return (
    <div className="flex h-full min-h-0 flex-col px-4 pt-3 pb-1">
      <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <div className="flex aspect-square w-full max-w-[min(100%,20rem)] items-center justify-center rounded-3xl border-2 border-dashed border-slate-300/90 bg-white/80 p-8 text-center shadow-sm shadow-slate-900/5">
          <p className="text-[15px] leading-relaxed text-slate-500">{placeholder}</p>
        </div>
      </div>
    </div>
  );
}
