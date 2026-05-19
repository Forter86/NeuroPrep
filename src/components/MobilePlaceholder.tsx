type MobilePlaceholderProps = {
  title: string;
  subtitle: string;
  placeholder: string;
};

export function MobilePlaceholder({ title, subtitle, placeholder }: MobilePlaceholderProps) {
  return (
    <div className="flex h-full min-h-0 w-full max-w-full flex-col overflow-x-clip px-4 pt-3 pb-1">
      <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>

      <div className="flex min-h-0 w-full min-w-0 flex-1 items-center justify-center py-4">
        <div className="box-border flex aspect-square w-full min-w-0 max-w-full items-center justify-center rounded-3xl border-2 border-dashed border-slate-300/90 bg-white/80 p-6 text-center shadow-sm shadow-slate-900/5 sm:max-w-[20rem]">
          <p className="break-words text-[15px] leading-relaxed text-slate-500">{placeholder}</p>
        </div>
      </div>
    </div>
  );
}
