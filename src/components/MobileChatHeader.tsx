type MobileChatHeaderProps = {
  title: string;
  onOpenMenu: () => void;
};

export function MobileChatHeader({ title, onOpenMenu }: MobileChatHeaderProps) {
  return (
    <header
      className="flex shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/95 px-2.5 py-2 backdrop-blur-sm"
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
        aria-label="Открыть меню чатов"
      >
        <span className="flex w-5 flex-col gap-1.5" aria-hidden>
          <span className="h-0.5 rounded-full bg-slate-700" />
          <span className="h-0.5 rounded-full bg-slate-700" />
          <span className="h-0.5 rounded-full bg-slate-700" />
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold leading-tight text-slate-900">{title}</p>
        <p className="truncate text-[11px] text-slate-500">NeuroPrep · ТБ</p>
      </div>
    </header>
  );
}
