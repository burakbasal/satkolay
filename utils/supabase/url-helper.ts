export const getStorageUrl = (path: string | null) => {
    if (!path) return '/placeholder.png'; // Make sure this file exists in public/
    if (path.startsWith('http')) return path;

    // Remove any leading slashes to prevent double slashes in the URL
    const cleanPath = path.replace(/^\/+/, '');

    // Construct the full URL
    // Assuming 'images' is the bucket name based on the user request.
    // If the bucket might be 'items' or 'avatars', this might need adjustment or a parameter.
    // Using the path structure from the user request: /storage/v1/object/public/images/
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${cleanPath}`;
};
