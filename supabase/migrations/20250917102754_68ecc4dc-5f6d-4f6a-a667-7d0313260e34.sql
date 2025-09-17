-- Create tenants table for multi-tenancy
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#D4AF37',
  secondary_color TEXT DEFAULT '#1a1a1a',
  tone TEXT DEFAULT 'professional',
  subscription_plan TEXT DEFAULT 'starter',
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '14 days'),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brands table
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#D4AF37',
  secondary_color TEXT DEFAULT '#1a1a1a',
  tone TEXT DEFAULT 'professional',
  description TEXT,
  target_audience TEXT,
  brand_voice TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memberships table for user-tenant relationships
CREATE TABLE public.memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- Create events table for calendar editorial
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  event_type TEXT NOT NULL DEFAULT 'post',
  status TEXT NOT NULL DEFAULT 'backlog',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  platform TEXT,
  tags TEXT[],
  priority INTEGER DEFAULT 1,
  assigned_to UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Tenants policies
CREATE POLICY "Users can view tenants they belong to" 
ON public.tenants FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = tenants.id 
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
);

CREATE POLICY "Admins can update their tenant" 
ON public.tenants FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = tenants.id 
    AND memberships.user_id = auth.uid()
    AND memberships.role IN ('admin', 'owner')
    AND memberships.status = 'active'
  )
);

-- Brands policies
CREATE POLICY "Users can view brands from their tenants" 
ON public.brands FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = brands.tenant_id 
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
);

CREATE POLICY "Users can create brands in their tenants" 
ON public.brands FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = brands.tenant_id 
    AND memberships.user_id = auth.uid()
    AND memberships.role IN ('admin', 'owner', 'editor')
    AND memberships.status = 'active'
  )
);

CREATE POLICY "Users can update brands from their tenants" 
ON public.brands FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = brands.tenant_id 
    AND memberships.user_id = auth.uid()
    AND memberships.role IN ('admin', 'owner', 'editor')
    AND memberships.status = 'active'
  )
);

-- Memberships policies
CREATE POLICY "Users can view their own memberships" 
ON public.memberships FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all memberships in their tenant" 
ON public.memberships FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m2 
    WHERE m2.tenant_id = memberships.tenant_id 
    AND m2.user_id = auth.uid()
    AND m2.role IN ('admin', 'owner')
    AND m2.status = 'active'
  )
);

CREATE POLICY "Admins can create memberships in their tenant" 
ON public.memberships FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.memberships m2 
    WHERE m2.tenant_id = memberships.tenant_id 
    AND m2.user_id = auth.uid()
    AND m2.role IN ('admin', 'owner')
    AND m2.status = 'active'
  )
);

-- Events policies
CREATE POLICY "Users can view events from their tenants" 
ON public.events FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = events.tenant_id 
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
);

CREATE POLICY "Users can create events in their tenants" 
ON public.events FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = events.tenant_id 
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Users can update events from their tenants" 
ON public.events FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = events.tenant_id 
    AND memberships.user_id = auth.uid()
    AND memberships.role IN ('admin', 'owner', 'editor')
    AND memberships.status = 'active'
  )
);

CREATE POLICY "Users can delete events they created or if admin" 
ON public.events FOR DELETE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE memberships.tenant_id = events.tenant_id 
    AND memberships.user_id = auth.uid()
    AND memberships.role IN ('admin', 'owner')
    AND memberships.status = 'active'
  )
);

-- Update triggers
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();