'use client'

import { useWriteStore } from './stores/write-store'
import { usePreviewStore } from './stores/preview-store'
import { WriteEditor } from './components/editor'
import { WriteSidebar } from './components/sidebar'
import { WriteActions } from './components/actions'
import { WritePreview } from './components/preview'
import { useEffect, useState } from 'react'
import { useLoadBlog } from './hooks/use-load-blog'

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

            {isPreview ? (
                <WritePreview form={form} coverPreviewUrl={coverPreviewUrl} onClose={closePreview} slug={slug || undefined} />
            ) : (
                <div className='flex flex-col md:flex-row h-full justify-center gap-6 px-4 md:px-6 pt-4 md:pt-16 pb-12'>
                    <div className='flex flex-col w-full max-w-[800px] gap-4'>
                        {/* Mobile Actions: Only visible on small screens */}
                        <div className='block md:hidden'>
                            <WriteActions />
                        </div>
                        <WriteEditor />
                    </div>
                    <div className='relative flex flex-col w-full max-w-[320px]'>
                        {/* Desktop Actions: Absolute positioned above sidebar */}
                        <div className='hidden md:block absolute -top-12 right-0 w-full z-10'>
                            <WriteActions />
                        </div>
                        <WriteSidebar categories={categories} />
                    </div>
                </div>
            )}
        </>
    )
}
