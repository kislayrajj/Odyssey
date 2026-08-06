import { NavLink } from 'react-router-dom';
import { BookOpen, Database, LayoutTemplate, X, Home } from 'lucide-react';
import { useCategories } from '@/features/roadmap/hooks/useCategories';
import { useUIStore } from '@/store/uiStore';
import { clsx } from 'clsx';

// Map category IDs to specific icons dynamically
const getIconForCategory = (id: string) => {
    switch (id) {
        case 'dsa':
            return <BookOpen size={16} />;
        case 'database':
            return <Database size={16} />;
        default:
            return <LayoutTemplate size={16} />;
    }
};

export function Sidebar() {
    const {
        data: categories,
        isLoading,
    } = useCategories();

    const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore();

    const sidebarClasses = clsx(
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-line bg-bg-inset transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            <aside className={sidebarClasses}>
                <div className="flex h-14 items-center justify-between border-b border-line px-4 md:hidden">
                    <span className="font-sans font-bold text-text-main">Menu</span>
                    <button onClick={closeMobileSidebar} className="text-text-faint hover:text-text-main">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                    <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-text-faint font-sans">
                        Navigation
                    </div>

                    <NavLink
                        to="/"
                        onClick={closeMobileSidebar}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
                                isActive
                                    ? 'bg-bg-raised text-accent'
                                    : 'text-text-dim hover:bg-bg-raised hover:text-text-main'
                            )
                        }
                    >
                        <Home size={16} />
                        Home
                    </NavLink>

                    <div className="mt-6 mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-text-faint font-sans">
                        Roadmaps
                    </div>

                    {isLoading ? (
                        <div className="px-3 py-2 text-[13px] text-text-faint animate-pulse">
                            Loading categories...
                        </div>
                    ) : (
                        categories?.map((category) => (
                            <NavLink
                                key={category.id}
                                to={`/category/${category.id}`}
                                onClick={closeMobileSidebar}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
                                        isActive
                                            ? 'bg-bg-raised text-accent'
                                            : 'text-text-dim hover:bg-bg-raised hover:text-text-main'
                                    )
                                }
                            >
                                {getIconForCategory(category.id)}
                                {category.title}
                            </NavLink>
                        ))
                    )}
                </nav>
            </aside>
        </>
    );
}