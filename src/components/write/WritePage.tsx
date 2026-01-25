'use client'

import { useWriteStore } from './stores/write-store'
import { usePreviewStore } from './stores/preview-store'
import { WriteEditor } from './components/editor'
import { WriteSidebar } from './components/sidebar'
import { WriteActions } from './components/actions'
import { useEffect, useState, lazy, Suspense } from 'react'
import { Toaster } from 'sonner'
import { useLoadBlog } from './hooks/use-load-blog'

const WritePreview = lazy(() => import('./components/preview').then(module => ({ default: module.WritePreview })))

type WritePageProps = {
    categories?: string[]
}

export default function WritePage({ categories = [] }: WritePageProps) {
    const { form, cover, reset } = useWriteStore()
    const { isPreview, closePreview } = usePreviewStore()
    const [slug, setSlug] = useState<string | null>(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const s = params.get('slug')
        if (s) {
            setSlug(s)
        } else {
            reset()
        }
    }, [])

    useLoadBlog(slug || undefined)

    const coverPreviewUrl = cover ? (cover.type === 'url' ? cover.url : cover.previewUrl) : null

    return (
        <>
            <Toaster
                richColors
                position="top-center"
                toastOptions={{
                    className: 'shadow-2xl border-2 border-base-200',
                    style: {
                        fontSize: '1.1rem',
                        padding: '16px 24px',
                    },
                    classNames: {
                        title: 'text-lg font-bold',
                        description: 'text-base font-medium',
                        error: 'bg-error text-error-content border-error',
                        success: 'bg-success text-success-content border-success',
                        warning: 'bg-warning text-warning-content border-warning',
                        info: 'bg-info text-info-content border-info',
                    }
                }}
            />
            {isPreview ? (
                <Suspense fallback={
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-base-100/90 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="text-sm font-medium opacity-70">加载预览...</p>
                        </div>
                    </div>
                }>
                    <WritePreview form={form} coverPreviewUrl={coverPreviewUrl} onClose={closePreview} slug={slug || undefined} />
                </Suspense>
            ) : (
                <>
                    <div className='flex flex-col md:flex-row h-full justify-center gap-6 px-4 md:px-6 pt-24 pb-12'>
                        <WriteEditor />
                        <WriteSidebar categories={categories} />
                    </div>

                    <WriteActions />
                </>
            )}
        </>
    )
}
