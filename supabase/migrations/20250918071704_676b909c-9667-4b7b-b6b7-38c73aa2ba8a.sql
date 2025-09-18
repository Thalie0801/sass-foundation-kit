-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'client', 'super_admin');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role user_role DEFAULT 'client';

-- Create features table for managing unlockable features
CREATE TABLE public.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    enabled_by_default BOOLEAN DEFAULT false,
    requires_subscription BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_features table for managing which features are enabled for each user
CREATE TABLE public.user_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT true,
    enabled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    enabled_by UUID REFERENCES profiles(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, feature_id)
);

-- Enable RLS on new tables
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_features ENABLE ROW LEVEL SECURITY;

-- RLS policies for features table
CREATE POLICY "Anyone can view features" ON public.features
    FOR SELECT USING (true);

CREATE POLICY "Only super_admin can manage features" ON public.features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- RLS policies for user_features table
CREATE POLICY "Users can view their own features" ON public.user_features
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user features" ON public.user_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage user features" ON public.user_features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Insert default features
INSERT INTO public.features (name, display_name, description, enabled_by_default, requires_subscription) VALUES
('fynk', 'Fynk Integration', 'Intégration avec la plateforme Fynk pour la gestion de facturation', false, true),
('advanced_analytics', 'Analytics Avancées', 'Accès aux analytics avancées et rapports détaillés', false, true),
('team_collaboration', 'Collaboration Équipe', 'Fonctionnalités de collaboration en équipe', false, true),
('api_access', 'Accès API', 'Accès à l\'API pour intégrations personnalisées', false, true),
('white_label', 'White Label', 'Personnalisation complète de la marque', false, true);

-- Function to check if user has a specific feature enabled
CREATE OR REPLACE FUNCTION public.user_has_feature(feature_name TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_features uf
        JOIN public.features f ON f.id = uf.feature_id
        WHERE uf.user_id = user_uuid 
        AND f.name = feature_name 
        AND uf.enabled = true
    ) OR EXISTS (
        SELECT 1 
        FROM public.features f
        WHERE f.name = feature_name 
        AND f.enabled_by_default = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;