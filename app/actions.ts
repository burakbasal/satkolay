'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteItemAction(formData: FormData) {
    const itemId = formData.get('itemId') as string
    const supabase = await createClient()

    const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)

    if (error) {
        console.error('Error deleting item:', error)
        return { error: 'İlan silinirken bir hata oluştu.' }
    }

    revalidatePath('/profile')
    revalidatePath('/')
    return { success: true }
}

export async function toggleFavoriteAction(itemId: string, isFavorite: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Giriş yapmalısınız.' }

    if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('item_id', itemId)

        if (error) return { error: error.message }
    } else {
        // Add to favorites
        const { error } = await supabase
            .from('favorites')
            .insert({ user_id: user.id, item_id: itemId })

        if (error) return { error: error.message }
    }

    revalidatePath('/profile')
    revalidatePath(`/item/${itemId}`)
    return { success: true }
}
