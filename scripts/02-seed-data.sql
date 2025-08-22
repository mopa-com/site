-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Vêtements', 'Mode et vêtements tendance', '/placeholder.svg?height=200&width=200'),
('Accessoires', 'Bijoux, sacs et accessoires', '/placeholder.svg?height=200&width=200'),
('Chaussures', 'Chaussures pour tous les styles', '/placeholder.svg?height=200&width=200'),
('Beauté', 'Produits de beauté et cosmétiques', '/placeholder.svg?height=200&width=200')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_featured) VALUES
('Robe d''été florale', 'Robe légère parfaite pour l''été avec motifs floraux', 45.99, '/placeholder.svg?height=400&width=300', 'Vêtements', 25, true),
('Jean skinny noir', 'Jean skinny taille haute en denim stretch', 39.99, '/placeholder.svg?height=400&width=300', 'Vêtements', 30, true),
('Sac à main cuir', 'Sac à main élégant en cuir véritable', 89.99, '/placeholder.svg?height=400&width=300', 'Accessoires', 15, true),
('Baskets blanches', 'Baskets tendance blanches pour un look décontracté', 65.99, '/placeholder.svg?height=400&width=300', 'Chaussures', 20, true),
('Rouge à lèvres mat', 'Rouge à lèvres longue tenue effet mat', 19.99, '/placeholder.svg?height=400&width=300', 'Beauté', 50, false),
('T-shirt oversize', 'T-shirt coupe oversize 100% coton', 24.99, '/placeholder.svg?height=400&width=300', 'Vêtements', 40, false),
('Collier doré', 'Collier chaîne dorée avec pendentif', 29.99, '/placeholder.svg?height=400&width=300', 'Accessoires', 35, false),
('Bottines noires', 'Bottines à talon en cuir noir', 79.99, '/placeholder.svg?height=400&width=300', 'Chaussures', 18, false),
('Palette maquillage', 'Palette de fards à paupières 12 couleurs', 34.99, '/placeholder.svg?height=400&width=300', 'Beauté', 25, false),
('Veste en jean', 'Veste en jean délavé style vintage', 55.99, '/placeholder.svg?height=400&width=300', 'Vêtements', 22, true);
