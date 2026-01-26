import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

export default function GlobalToaster() {
    useEffect(() => {
        const handleGlobalToast = (e: any) => {
            const { type, message, options } = e.detail || {};
            if (!message) return;

            const toastFn = (toast as any)[type] || toast;
            toastFn(message, options);
        };

        window.addEventListener('app:toast', handleGlobalToast);

        return () => {
            window.removeEventListener('app:toast', handleGlobalToast);
        };
    }, []);

    return (
        <Toaster
            richColors
            position="top-right"
            closeButton
        />
    );
}

// 导出全局触发函数供其他环境使用，模拟 sonner 的 API
export const showToast = (message: string, options?: any) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'default', message, options } }));
    }
};

showToast.success = (message: string, options?: any) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'success', message, options } }));
    }
};

showToast.error = (message: string, options?: any) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'error', message, options } }));
    }
};

showToast.info = (message: string, options?: any) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'info', message, options } }));
    }
};

showToast.warning = (message: string, options?: any) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'warning', message, options } }));
    }
};

showToast.loading = (message: string, options?: any) => {
    const id = options?.id || Math.random().toString(36).substring(2, 9);
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'loading', message, options: { ...options, id } } }));
    }
    return id; // 返回 ID 以便后续更新
};
