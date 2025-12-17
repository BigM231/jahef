-- Create a validation trigger to check blog post content for dangerous HTML patterns
CREATE OR REPLACE FUNCTION public.validate_blog_content()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for suspicious patterns that could be XSS attacks
  IF NEW.content ~* '<script' OR 
     NEW.content ~* 'javascript:' OR
     NEW.content ~* 'onerror\s*=' OR
     NEW.content ~* 'onload\s*=' OR
     NEW.content ~* 'onclick\s*=' OR
     NEW.content ~* 'onmouseover\s*=' OR
     NEW.content ~* 'onfocus\s*=' OR
     NEW.content ~* 'onblur\s*=' OR
     NEW.content ~* 'oninput\s*=' OR
     NEW.content ~* 'onchange\s*=' OR
     NEW.content ~* 'eval\s*\(' OR
     NEW.content ~* 'document\.cookie' OR
     NEW.content ~* 'document\.location' OR
     NEW.content ~* 'window\.location' THEN
    RAISE EXCEPTION 'Content contains potentially dangerous HTML patterns';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for blog_posts table
CREATE TRIGGER validate_blog_content_trigger
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.validate_blog_content();