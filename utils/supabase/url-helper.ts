export const getStorageUrl = (path: string | null | undefined) => {
    if (!path) return '/placeholder.png'; // Default placeholder
    if (path.startsWith('http')) return path;

    // Remove leading slashes
    const cleanPath = path.replace(/^\/+/, '');

    // Construct full URL
    // Assumption: bucket is 'images' based on previous context. 
    // If path already contains 'storage/v1...', handles it gracefully? 
    // No, standard path stored is typically just the filename or folder/filename.
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${cleanPath}`;
};
