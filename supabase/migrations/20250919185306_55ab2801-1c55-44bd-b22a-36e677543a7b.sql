-- Fix security issues with function search paths
ALTER FUNCTION public.user_has_feature(text, uuid) SET search_path = public;

-- Fix the user_has_feature function signature and logic
DROP FUNCTION IF EXISTS public.user_has_feature(text, uuid);
CREATE OR REPLACE FUNCTION public.user_has_feature(feature_name text, user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_features uf
        JOIN public.features f ON f.id = uf.feature_id
        WHERE uf.user_id = user_uuid 
        AND f.name = feature_name 
    ) OR EXISTS (
        SELECT 1 
        FROM public.features f
        WHERE f.name = feature_name 
        AND f.is_enabled = true
    );
END;
$$;