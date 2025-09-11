-- Create a function to search users safely
-- Run this in your Supabase SQL Editor

-- Create function to search users
CREATE OR REPLACE FUNCTION search_users(search_query text)
RETURNS TABLE (
    id uuid,
    email text,
    first_name text,
    last_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.first_name,
        p.last_name
    FROM profiles p
    WHERE 
        p.email ILIKE '%' || search_query || '%'
        OR p.first_name ILIKE '%' || search_query || '%'
        OR p.last_name ILIKE '%' || search_query || '%'
    ORDER BY p.email
    LIMIT 10;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_users(text) TO authenticated;
